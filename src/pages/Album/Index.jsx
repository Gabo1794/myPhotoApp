import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';
import AlbumTable from '../../components/Album/AlbumTable';
import AlbumForm from '../../components/Album/AlbumForm';
import AlbumView from '../../components/Album/AlbumView';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { albums, loading, error, listForOwner, create, update, delete: deleteAlbum } = useAlbums(user?.id);
  
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      setSuccessMessage('');
      if (currentAlbum) {
        await update(currentAlbum.id, albumData);
        setSuccessMessage('Álbum actualizado con éxito');
      } else {
        await create(albumData);
        setSuccessMessage('Álbum creado con éxito');
      }
      setFormVisible(false);
      setCurrentAlbum(null);
      setSnackbarOpen(true);
    } catch (err) {
      setLocalError(err.message || 'Error al guardar el álbum');
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
    setLocalError('');
    setSuccessMessage('');
  };

  const handleBack = () => {
    setViewingAlbum(null);
  };

  const handleDelete = async (albumId) => {
    try {
      setLocalError('');
      setSuccessMessage('');
      await deleteAlbum(albumId);
      setSuccessMessage('Álbum eliminado con éxito');
      setSnackbarOpen(true);
    } catch (err) {
      setLocalError(err.message || 'Error al eliminar el álbum');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (authLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Gestor de Álbumes
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

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
          error={localError}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

//http://localhost:5173/album/event/qi2X6U8LCr6Gt3nBM4Qj

export default Index;
