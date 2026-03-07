import type { IAlbumService } from '../interfaces/IAlbumService';
import type { EventAlbum, CreateAlbumInput, UpdateAlbumInput } from '../../domain/types';
import supabase from '../../config/supabase';
import { generatePublicCode } from '../../utils/codeGenerator';

export class SupabaseAlbumService implements IAlbumService {
  async listForOwner(userId: string): Promise<EventAlbum[]> {
    const { data, error } = await supabase
      .from('event_albums')
      .select('*, album_stats(*)')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((album: any) => ({
      ...album,
      stats: album.album_stats?.[0] || undefined
    }));
  }

  async getByPublicCode(publicCode: string): Promise<EventAlbum | null> {
    const { data, error } = await supabase
      .from('event_albums')
      .select('*, album_stats(*)')
      .eq('public_code', publicCode)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return {
      ...data,
      stats: data.album_stats?.[0] || undefined
    };
  }

  async getById(albumId: string): Promise<EventAlbum | null> {
    const { data, error } = await supabase
      .from('event_albums')
      .select('*, album_stats(*)')
      .eq('id', albumId)
      .single();

    if (error) return null;
    return {
      ...data,
      stats: data.album_stats?.[0] || undefined
    };
  }

  async create(userId: string, input: CreateAlbumInput): Promise<EventAlbum> {
    const publicCode = this.generatePublicCode();

    const { data, error } = await supabase
      .from('event_albums')
      .insert({
        owner_id: userId,
        name: input.name,
        public_code: publicCode,
        is_active: input.is_active ?? true,
        expiration_date: input.expiration_date || null,
        max_files_per_user: input.max_files_per_user ?? 100,
        max_file_size_mb: input.max_file_size_mb ?? 25,
        max_total_storage_mb: input.max_total_storage_mb ?? 10240,
      })
      .select()
      .single();

    if (error) throw error;

    // Initialize album_stats
    await supabase.from('album_stats').insert({
      album_id: data.id,
      total_photos: 0,
      total_videos: 0,
      total_uploads: 0,
      total_storage_mb: 0,
    });

    return data;
  }

  async update(albumId: string, userId: string, input: UpdateAlbumInput): Promise<void> {
    // Verify ownership
    const album = await this.getById(albumId);
    if (!album || album.owner_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('event_albums')
      .update({
        ...(input.name && { name: input.name }),
        ...(input.is_active !== undefined && { is_active: input.is_active }),
        ...(input.expiration_date !== undefined && { expiration_date: input.expiration_date }),
        ...(input.max_files_per_user && { max_files_per_user: input.max_files_per_user }),
        ...(input.max_file_size_mb && { max_file_size_mb: input.max_file_size_mb }),
        ...(input.max_total_storage_mb && { max_total_storage_mb: input.max_total_storage_mb }),
      })
      .eq('id', albumId);

    if (error) throw error;
  }

  async delete(albumId: string, userId: string): Promise<void> {
    // Verify ownership
    const album = await this.getById(albumId);
    if (!album || album.owner_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Delete cascade handled by DB constraints
    const { error } = await supabase
      .from('event_albums')
      .delete()
      .eq('id', albumId);

    if (error) throw error;
  }

  generatePublicCode(): string {
    return generatePublicCode();
  }
}
