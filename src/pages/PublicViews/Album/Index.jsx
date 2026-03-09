import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAlbums } from '../../../hooks/useAlbums';
import { useMedia } from '../../../hooks/useMedia';
import { useToast } from '../../../components/Toast';
import FAB from '../../../components/PublicGallery/FAB';
import Lightbox from '../../../components/PublicGallery/Lightbox';

const PublicEventView = () => {
  const { aid } = useParams();
  const { user } = useAuth();
  const { getById } = useAlbums();
  const toast = useToast();

  const [album, setAlbum] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  const mediaHook = useMedia(album?.id);

  // Cargar álbum
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const albumData = await getById(aid);
        setAlbum(albumData);
      } catch (err) {
        console.error('Error al cargar álbum:', err);
        toast.error('Error al cargar el álbum');
      } finally {
        setLoading(false);
      }
    };

    if (aid) {
      fetchAlbum();
    }
  }, [aid]);

  // Cargar media
  useEffect(() => {
    const fetchMedia = async () => {
      if (!album?.id) return;
      try {
        const media = await mediaHook.listByAlbum(album.id);
        setMediaItems(
          media?.map((item) => ({
            id: item.id,
            url: item.file_url,
            name: item.file_name,
            type: item.media_type,
            uploader: item.uploaded_by_name,
            uploading: false,
          })) || []
        );
      } catch (err) {
        console.error('Error al cargar media:', err);
        toast.error('Error al cargar las imágenes');
      }
    };

    if (album?.id) {
      fetchMedia();
    }
  }, [album?.id]);

  // Upload con feedback optimista
  const handleUpload = async (file, type) => {
    try {
      setUploading(true);

      // Crear preview optimista
      const reader = new FileReader();
      reader.onload = (e) => {
        const optimisticItem = {
          id: `temp-${Date.now()}`,
          url: e.target?.result,
          name: file.name,
          type: type === 'photo' ? 'image' : 'video',
          uploader: user?.user_metadata?.name || 'You',
          uploading: true,
        };

        setMediaItems((prev) => [optimisticItem, ...prev]);
      };
      reader.readAsDataURL(file);

      // Subir archivo real
      const formData = new FormData();
      formData.append('file', file);
      formData.append('albumId', album.id);
      formData.append('userId', user?.id);
      formData.append('mediaType', type === 'photo' ? 'image' : 'video');

      // TODO: Implementar endpoint de upload
      // await fetch('/api/upload', { method: 'POST', body: formData });

      // Por ahora, simular éxito
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Eliminar el uploading flag
      setMediaItems((prev) =>
        prev.map((item) =>
          item.id.startsWith('temp-') ? { ...item, uploading: false } : item
        )
      );

      toast.success(`${type === 'photo' ? 'Foto' : 'Video'} subido con éxito`);
      
      // Recargar media del servidor
      const media = await mediaHook.listByAlbum(album.id);
      setMediaItems(
        media?.map((item) => ({
          id: item.id,
          url: item.file_url,
          name: item.file_name,
          type: item.media_type,
          uploader: item.uploaded_by_name,
          uploading: false,
        })) || []
      );
    } catch (err) {
      console.error('Error al subir:', err);
      toast.error('Error al subir el archivo');
      setMediaItems((prev) => prev.filter((item) => !item.id.startsWith('temp-')));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-primary text-lg font-semibold mb-2">Evento no encontrado</p>
          <p className="text-text-secondary">El evento que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light pb-24">
      {/* Event Header */}
      <div className="bg-white border-b border-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-4xl font-bold text-text-primary mb-3">{album.name}</h2>
          <div className="flex flex-wrap gap-6 text-text-secondary text-sm">
            {album.created_at && (
              <div className="flex items-center gap-2">
                <span>📅</span>
                <p>{new Date(album.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            )}
            {album.owner_name && (
              <div className="flex items-center gap-2">
                <span>👤</span>
                <p>Organizado por {album.owner_name}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>📸</span>
              <p>{album.stats?.total_photos || 0} fotos</p>
            </div>
            <div className="flex items-center gap-2">
              <span>🎥</span>
              <p>{album.stats?.total_videos || 0} vídeos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Grid */}
        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                {/* Skeleton Loader */}
                {!loadedImages[item.url] && !item.uploading && (
                  <div className="absolute inset-0 bg-surface-dark animate-pulse rounded-xl" />
                )}

                {/* Image */}
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  onLoad={() => {
                    setLoadedImages((prev) => ({
                      ...prev,
                      [item.url]: true,
                    }));
                  }}
                  onError={() => {
                    console.error('Error loading image:', item.url);
                  }}
                  className={`w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:scale-105 ${
                    !loadedImages[item.url] ? 'opacity-50' : 'opacity-100'
                  }`}
                />

                {/* Upload Spinner */}
                {item.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-accent"></div>
                  </div>
                )}

                {/* Video Badge */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 rounded-xl transition-all">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}

                {/* Uploader Name */}
                {item.uploader && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-2 rounded-b-xl">
                    <p className="text-white text-xs truncate font-medium">By {item.uploader}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-text-secondary opacity-30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-text-primary font-semibold mb-1 text-lg">Sin contenido aún</p>
            <p className="text-text-secondary">Sé el primero en compartir una foto o video</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          items={mediaItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* FAB */}
      <FAB
        albumId={album?.id}
        uploading={uploading}
        onPhotoSelect={(file) => handleUpload(file, 'photo')}
        onVideoSelect={(file) => handleUpload(file, 'video')}
      />
    </div>
  );
};

export default PublicEventView;
