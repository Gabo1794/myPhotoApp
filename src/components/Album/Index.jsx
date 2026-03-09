import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';
import { useToast } from '../Toast';
import AlbumTable from './AlbumTable';
import AlbumForm from './AlbumForm';
import AlbumView from './AlbumView';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const { albums, loading, error, listForOwner, create, update, delete: deleteAlbum } = useAlbums(user?.id);
  
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      listForOwner(user.id);
    }
  }, [user?.id]);

  const handleEdit = (album) => {
    setCurrentAlbum(album);
    setFormVisible(true);
  };

  const handleView = (album) => {
    setViewingAlbum(album);
  };

  const handleSave = async (albumData) => {
    try {
      if (currentAlbum) {
        await update(currentAlbum.id, albumData);
        toast.success('Álbum actualizado con éxito');
      } else {
        await create(albumData);
        toast.success('Álbum creado con éxito');
      }
      setFormVisible(false);
      setCurrentAlbum(null);
    } catch (err) {
      toast.error(err.message || 'Error al guardar el álbum');
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
  };

  const handleBack = () => {
    setViewingAlbum(null);
  };

  const handleDelete = async (albumId) => {
    try {
      await deleteAlbum(albumId);
      toast.success('Álbum eliminado con éxito');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar el álbum');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 bg-surface-dark rounded-full w-48 mb-4"></div>
          <div className="h-4 bg-surface-dark rounded-full w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isFormVisible ? (
          <AlbumForm 
            currentAlbum={currentAlbum} 
            onSave={handleSave} 
            onCancel={handleCancel}
            loading={loading}
          />
        ) : viewingAlbum ? (
          <AlbumView album={viewingAlbum} onBack={handleBack} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-text-primary">
                  Mis Álbumes
                </h1>
                <p className="mt-2 text-text-secondary">
                  Gestiona y organiza tus eventos
                </p>
              </div>
              <button
                onClick={() => setFormVisible(true)}
                disabled={loading}
                className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nuevo Álbum
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-error-light border border-error rounded-2xl">
                <p className="text-error-dark text-sm">{error?.message || error}</p>
              </div>
            )}

            {/* Table or Loading */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-20 bg-surface-dark rounded-xl"></div>
                  <div className="h-20 bg-surface-dark rounded-xl"></div>
                  <div className="h-20 bg-surface-dark rounded-xl"></div>
                </div>
              </div>
            ) : (
              <AlbumTable 
                albums={albums}
                onEdit={handleEdit} 
                onView={handleView}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
