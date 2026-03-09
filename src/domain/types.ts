/**
 * Domain types for the multi-tenant photo album SaaS
 */

export type SubscriptionStatus = 'free' | 'active' | 'cancelled' | 'expired';
export type PlanType = 'starter' | 'professional' | 'enterprise';
export type FileType = 'photo' | 'video';

export interface User {
  id: string;
  email?: string;
  created_at: string;
  subscription_status: SubscriptionStatus;
  plan_type: PlanType;
  storage_limit_mb: number;
}

export interface EventAlbum {
  id: string;
  owner_id: string;
  name: string;
  public_code: string;
  is_active: boolean;
  expiration_date: string | null;
  max_files_per_user: number;
  max_file_size_mb: number;
  max_total_storage_mb: number;
  created_at: string;
  stats?: AlbumStats; // Optional stats included in response
}

export interface AlbumStats {
  album_id: string;
  total_photos: number;
  total_videos: number;
  total_uploads: number;
  total_storage_mb: number;
}

export interface MediaFile {
  id: string;
  album_id: string;
  owner_id: string; // album owner
  uploaded_by_id: string | null; // guest or registered user
  uploaded_by_name: string | null;
  file_url: string;
  file_type: FileType;
  file_size_mb: number;
  created_at: string;
}

export interface GuestIdentity {
  id: string;
  name?: string;
}

// Input types
export interface CreateAlbumInput {
  name: string;
  is_active?: boolean;
  expiration_date?: string | null;
  max_files_per_user?: number;
  max_file_size_mb?: number;
  max_total_storage_mb?: number;
}

export interface UpdateAlbumInput {
  name?: string;
  is_active?: boolean;
  expiration_date?: string | null;
  max_files_per_user?: number;
  max_file_size_mb?: number;
  max_total_storage_mb?: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UploadMediaInput {
  file: File;
  uploaded_by_name?: string;  // Guest or user name
}
