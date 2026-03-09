import type { EventAlbum, CreateAlbumInput, UpdateAlbumInput } from '../../domain/types';

export interface IAlbumService {
  listForOwner(userId: string): Promise<EventAlbum[]>;
  getByPublicCode(publicCode: string): Promise<EventAlbum | null>;
  getById(albumId: string): Promise<EventAlbum | null>;
  create(userId: string, input: CreateAlbumInput): Promise<EventAlbum>;
  update(albumId: string, userId: string, input: UpdateAlbumInput): Promise<void>;
  delete(albumId: string, userId: string): Promise<void>;
  generatePublicCode(): string;
}
