import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OptimizedGallery, NativeUploader } from "../../components/index";
import FAB from "../PublicGallery/FAB";
import ModalUserInvited from "../UserInvited/Index";
import { useMedia } from "../../hooks/useMedia";
import { useToast } from "../../components/Toast";
import supabase from "../../config/supabase";

const MAX_IMAGES = 100;

const Index = ({ albumId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const toast = useToast();

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo"));
  const guestName = guestInfo?.guestName || 'Invitado';

  const { listByAlbumAndUser, upload, deleteMedia } = useMedia(albumId);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError('');
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError('Error al obtener información del usuario');
          setImages([]);
          return;
        }
        
        setCurrentUserId(user.id);
        const mediaList = await listByAlbumAndUser(albumId, user.id);        
        setImages(mediaList);
      } catch (err) {
        setError('Error al cargar las imágenes');
        console.error(err);
        toast.error('Error al cargar las imágenes');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchImages();
    }
  }, [albumId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDeleteImage = async (mediaId) => {
    try {
      await deleteMedia(mediaId, currentUserId);
      setImages(prev => prev.filter(img => img.id !== mediaId));
      toast.success('Foto eliminada');
    } catch (err) {
      toast.error('Error al eliminar la imagen');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-surface-light pb-24">
      <ModalUserInvited albumId={albumId} />
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface-light border-b border-surface-dark bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Mis Fotos ({images.length}/{MAX_IMAGES})
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Subidas por: {guestName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {images.length >= MAX_IMAGES && (
          <div className="mb-4 p-4 bg-warning-light rounded-2xl border border-warning text-warning-dark text-sm">
            Has alcanzado el límite máximo de fotos ({MAX_IMAGES}).
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse">
              <div className="h-12 bg-surface-dark rounded-full mb-4"></div>
              <div className="h-4 bg-surface-dark rounded-full w-48"></div>
            </div>
          </div>
        ) : (
          <OptimizedGallery 
            images={images} 
            onDeleteImage={handleDeleteImage}
            showDeleteButton={true}
          />
        )}
      </div>

      {/* FAB Camera Button */}
      <FAB albumId={albumId} />
    </div>
  );
};

export default Index;
