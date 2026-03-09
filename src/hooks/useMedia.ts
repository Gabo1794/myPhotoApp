import { useContext, useState } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import type { MediaFile, UploadMediaInput } from '../domain/types';

export function useMedia(albumId?: string) {
  const services = useContext(ServiceContext);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listByAlbum = async (id: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await services.media.listByAlbum(id);
      setMedia(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch media'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const listByAlbumAndUser = async (id: string, userId: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await services.media.listByAlbumAndUser(id, userId);
      setMedia(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch media'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const upload = async (
    fileOrId: any,
    inputOrUploadedName?: any,
    userIdOrUnused?: any
  ) => {
    try {
      setError(null);
      setUploading(true);

      // Determinar los parámetros según cómo se llame la función
      let id: string;
      let input: UploadMediaInput;
      let userId: string | undefined;

      // Caso 1: upload(file, uploadedByName) - cuando albumId ya está definido
      if (albumId && fileOrId instanceof File) {
        id = albumId;
        input = {
          file: fileOrId,
          uploaded_by_name: inputOrUploadedName,
        };
        userId = undefined;
      }
      // Caso 2: upload(id, input, userId) - para compatibilidad
      else {
        id = fileOrId;
        input = inputOrUploadedName;
        userId = userIdOrUnused;
      }

      const mediaFile = await services.media.upload(id, input, userId);
      setMedia([mediaFile, ...media]);
      // Note: Stats are not fetched to avoid RLS issues
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
      // Note: Stats will be calculated on next render/fetch
      // Not calling getStats to avoid RLS policy issues with anonymous users
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete media'));
      throw err;
    }
  };

  return {
    media,
    loading,
    uploading,
    error,
    listByAlbum,
    listByAlbumAndUser,
    upload,
    deleteMedia,
  };
}
