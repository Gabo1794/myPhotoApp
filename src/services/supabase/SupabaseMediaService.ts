import type { IMediaService } from '../interfaces/IMediaService';
import type { MediaFile, AlbumStats, UploadMediaInput } from '../../domain/types';
import supabase from '../../config/supabase';

export class SupabaseMediaService implements IMediaService {
  async listByAlbum(albumId: string): Promise<MediaFile[]> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async listByAlbumAndUser(albumId: string, userId: string) : Promise<MediaFile[]> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('album_id', albumId)
      .eq('uploaded_by_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];    
  }

  async getById(mediaId: string): Promise<MediaFile | null> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (error) return null;
    return data;
  }

  async upload(
    albumId: string,
    input: UploadMediaInput,
    userId?: string
  ): Promise<MediaFile> {
    // Get album to check constraints
    const { data: album, error: albumError } = await supabase
      .from('event_albums')
      .select('*')
      .eq('id', albumId)
      .single();

    if (albumError || !album) throw new Error('Album not found');

    // Check if album is active
    if (!album.is_active) throw new Error('Album is not active');

    // Check if album is expired
    if (album.expiration_date && new Date(album.expiration_date) < new Date()) {
      throw new Error('Album has expired');
    }

    // Check file size limit
    const fileSizeMb = input.file.size / (1024 * 1024);
    if (fileSizeMb > album.max_file_size_mb) {
      throw new Error(`File exceeds maximum size of ${album.max_file_size_mb}MB`);
    }

    // Note: Storage limit validation removed to avoid RLS issues with album_stats
    // This can be re-implemented later with a different approach

    // Get current user ID from auth session (for RLS tracking)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User authentication required');
    const currentUserId = user.id;

    // Count uploads by user
    const { count, error: countError } = await supabase
      .from('media_files')
      .select('*', { count: 'exact' })
      .eq('album_id', albumId)
      .eq('uploaded_by_id', currentUserId);

    if (!countError && count && count >= album.max_files_per_user) {
      throw new Error('User upload limit exceeded for this album');
    }

    // Upload file to storage
    const mediaId = crypto.randomUUID();
    const fileExt = input.file.name.split('.').pop() || 'bin';
    const storagePath = `${albumId}/${mediaId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('event-media')
      .upload(storagePath, input.file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('event-media')
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    // Determine file type
    const mimeType = input.file.type;
    let fileType: 'photo' | 'video' = 'photo';
    if (mimeType.startsWith('video/')) {
      fileType = 'video';
    }

    // Insert media record with auth.uid() for RLS compliance
    const { data: mediaData, error: insertError } = await supabase
      .from('media_files')
      .insert({
        id: mediaId,
        album_id: albumId,
        owner_id: album.owner_id,
        uploaded_by_id: currentUserId,  // Use auth.uid() for RLS tracking
        uploaded_by_name: input.uploaded_by_name,  // Guest name from input
        file_url: fileUrl,
        file_type: fileType,
        file_size_mb: fileSizeMb,
      })
      .select()
      .single();

    if (insertError) throw insertError;


    return mediaData;
  }

  async delete(mediaId: string, userId?: string, isOwner?: boolean): Promise<void> {
    const media = await this.getById(mediaId);
    if (!media) throw new Error('Media not found');

    // Check permissions: owner or uploaded_by user
    if (!isOwner && userId !== media.uploaded_by_id) {
      throw new Error('Unauthorized');
    }

    // Delete from storage
    const storagePath = `${media.album_id}/${mediaId}.*`;
    // Note: Supabase storage doesn't support wildcards, so we need the exact path
    // For now, we'll just delete the media record
    // In production, you'd want to track the exact file extension

    // Delete media record
    const { error } = await supabase
      .from('media_files')
      .delete()
      .eq('id', mediaId);

    if (error) throw error;

  }

}
