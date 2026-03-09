import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';
import AlbumTable from '../../components/Album/AlbumTable';
import AlbumForm from '../../components/Album/AlbumForm';
import AlbumView from '../../components/Album/AlbumView';

const AlbumPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { albums, loading, error, listForOwner, create, update, delete: deleteAlbum } = useAlbums(user?.id);
  
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [localError, setLocalError] = useState('');

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
      setLocalError('');
      if (currentAlbum) {
        await update(currentAlbum.id, albumData);
      } else {
        await create(albumData);
      }
      setFormVisible(false);
      setCurrentAlbum(null);
    } catch (err) {
      setLocalError(err.message || 'Error al guardar el álbum');
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
    setLocalError('');
  };

  const handleBack = () => {
    setViewingAlbum(null);
  };

  const handleDelete = async (albumId) => {
    try {
      setLocalError('');
      await deleteAlbum(albumId);
    } catch (err) {
      setLocalError(err.message || 'Error al eliminar el álbum');
    }
  };

  if (authLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Debes iniciar sesión</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Gestor de Álbumes
      </Typography>

      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || localError}
        </Alert>
      )}

      {isFormVisible ? (
        <AlbumForm 
          currentAlbum={currentAlbum} 
          onSave={handleSave} 
          onCancel={handleCancel}
          loading={loading}
        />
      ) : viewingAlbum ? (
        <AlbumView 
          album={viewingAlbum} 
          onBack={handleBack}
          onDelete={() => handleDelete(viewingAlbum.id)}
          isOwner={true}
        />
      ) : (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setFormVisible(true)} 
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Crear Nuevo Álbum
          </Button>
          {loading && <CircularProgress />}
          {!loading && (
            <AlbumTable 
              albums={albums}
              onEdit={handleEdit} 
              onView={handleView}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default AlbumPage;
