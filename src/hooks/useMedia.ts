import { useContext, useState } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import type { MediaFile, UploadMediaInput, AlbumStats } from '../domain/types';

export function useMedia(albumId?: string) {
  const services = useContext(ServiceContext);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [stats, setStats] = useState<AlbumStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listByAlbum = async (id: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await services.media.listByAlbum(id);
      setMedia(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch media'));
    } finally {
      setLoading(false);
    }
  };

  const getStats = async (id: string) => {
    try {
      setError(null);
      const data = await services.media.getAlbumStats(id);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    }
  };

  const upload = async (
    fileOrId: any,
    inputOrUserId?: any,
    userIdOrGuestName?: any
  ) => {
    try {
      setError(null);
      setUploading(true);

      // Determinar los parámetros según cómo se llame la función
      let id: string;
      let input: UploadMediaInput;
      let userId: string | undefined;

      // Caso 1: upload(file, guestId, guestName) - cuando albumId ya está definido
      if (albumId && fileOrId instanceof File) {
        id = albumId;
        input = {
          file: fileOrId,
          uploaded_by_id: inputOrUserId,
          uploaded_by_name: userIdOrGuestName,
        };
        userId = undefined;
      }
      // Caso 2: upload(id, input, userId) - para compatibilidad
      else {
        id = fileOrId;
        input = inputOrUserId;
        userId = userIdOrGuestName;
      }

      const mediaFile = await services.media.upload(id, input, userId);
      setMedia([mediaFile, ...media]);
      await getStats(id);
      return mediaFile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Upload failed'));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (mediaId: string, userId?: string, isOwner?: boolean) => {
    try {
      setError(null);
      await services.media.delete(mediaId, userId, isOwner);
      setMedia(media.filter((m) => m.id !== mediaId));
      if (albumId) {
        await getStats(albumId);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete media'));
      throw err;
    }
  };

  return {
    media,
    stats,
    loading,
    uploading,
    error,
    listByAlbum,
    getStats,
    upload,
    deleteMedia,
  };
}
