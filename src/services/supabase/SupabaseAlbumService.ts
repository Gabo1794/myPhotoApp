import type { IAlbumService } from '../interfaces/IAlbumService';
import type { EventAlbum, CreateAlbumInput, UpdateAlbumInput } from '../../domain/types';
import supabase from '../../config/supabase';
import { generatePublicCode } from '../../utils/codeGenerator';

export class SupabaseAlbumService implements IAlbumService {
  async listForOwner(userId: string): Promise<EventAlbum[]> {
    const { data, error } = await supabase
      .from('event_albums')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }

  async getByPublicCode(publicCode: string): Promise<EventAlbum | null> {
    const { data, error } = await supabase
      .from('event_albums')
      .select('*')
      .eq('public_code', publicCode)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  }

  async getById(albumId: string): Promise<EventAlbum | null> {
    try {
      const { data, error } = await supabase
        .from('event_albums')
        .select('*')
        .eq('id', albumId)
        .maybeSingle();

      if (error || !data) return null;
      return data;
    } catch (err) {
      console.error('Error fetching album by ID:', err);
      return null;
    }
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

    return data;
  }

  async update(albumId: string, userId: string, input: UpdateAlbumInput): Promise<void> {
    // Verify ownership
    const album = await this.getById(albumId);
    if (!album || album.owner_id !== userId) {
      throw new Error('Unauthorized');
    }

    const updateData: any = {};
    
    // Only add fields that were explicitly provided
    if (input.name !== undefined) updateData.name = input.name;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;
    if (input.expiration_date !== undefined) updateData.expiration_date = input.expiration_date || null;
    if (input.max_files_per_user !== undefined) updateData.max_files_per_user = input.max_files_per_user;
    if (input.max_file_size_mb !== undefined) updateData.max_file_size_mb = input.max_file_size_mb;
    if (input.max_total_storage_mb !== undefined) updateData.max_total_storage_mb = input.max_total_storage_mb;

    const { error } = await supabase
      .from('event_albums')
      .update(updateData)
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
