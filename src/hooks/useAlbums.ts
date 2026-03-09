import { useContext, useState } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import type { EventAlbum, CreateAlbumInput } from '../domain/types';

export function useAlbums(userId?: string) {
  const services = useContext(ServiceContext);
  const [albums, setAlbums] = useState<EventAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listForOwner = async (ownerId: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await services.album.listForOwner(ownerId);
      setAlbums(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch albums'));
    } finally {
      setLoading(false);
    }
  };

  const getByPublicCode = async (code: string) => {
    try {
      setError(null);
      return await services.album.getByPublicCode(code);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch album'));
      return null;
    }
  };

  const getById = async (albumId: string) => {
    try {
      setError(null);
      // Para rutas públicas, no requiere autenticación
      return await services.album.getById(albumId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch album'));
      return null;
    }
  };

  const create = async (input: CreateAlbumInput) => {
    try {
      setError(null);
      setLoading(true);
      if (!userId) throw new Error('User ID required');
      const album = await services.album.create(userId, input);
      // Refrescar la lista completa para asegurar sincronización
      await listForOwner(userId);
      return album;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create album'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (albumId: string, input: CreateAlbumInput) => {
    try {
      setError(null);
      setLoading(true);
      if (!userId) throw new Error('User ID required');
      
      // Llamar al servicio para actualizar
      await services.album.update(albumId, userId, input);
      
      // Refrescar la lista completa desde la BD para asegurar sincronización
      await listForOwner(userId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update album'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbum = async (albumId: string) => {
    try {
      setError(null);
      if (!userId) throw new Error('User ID required');
      await services.album.delete(albumId, userId);
      setAlbums(albums.filter((a) => a.id !== albumId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete album'));
      throw err;
    }
  };

  return {
    albums,
    loading,
    error,
    listForOwner,
    getByPublicCode,
    getById,
    create,
    update,
    delete: deleteAlbum,
  };
}
