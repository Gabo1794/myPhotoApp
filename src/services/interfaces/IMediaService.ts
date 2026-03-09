import type { MediaFile, AlbumStats, UploadMediaInput } from '../../domain/types';

export interface IMediaService {
  listByAlbum(albumId: string): Promise<MediaFile[]>;
  listByAlbumAndUser(albumId: string, userId: string): Promise<MediaFile[]>;
  getById(mediaId: string): Promise<MediaFile | null>;
  upload(albumId: string, input: UploadMediaInput, userId?: string): Promise<MediaFile>;
  delete(mediaId: string, userId?: string, isOwner?: boolean): Promise<void>;
  getAlbumStats(albumId: string): Promise<AlbumStats | null>;
  updateStats(albumId: string): Promise<void>;
}
