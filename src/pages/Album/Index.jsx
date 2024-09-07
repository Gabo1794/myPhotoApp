import React, { useState } from 'react';
import AlbumTable from '../../components/Album/AlbumTable';
import AlbumForm from '../../components/Album/AlbumForm';
import AlbumView from '../../components/Album/AlbumView';
import { Container, Typography, Button } from '@mui/material';

const Index = () => {
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const handleEdit = (album) => {
    setCurrentAlbum(album);
    setFormVisible(true);
  };

  const handleView = (album) => {
    console.log("===>", album)
    setViewingAlbum(album);
  };

  const handleSave = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
  };

  const handleCancel = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
  };

  const handleBack = () => {
    setViewingAlbum(null);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Gestor de Álbumes</Typography>
      {isFormVisible ? (
        <AlbumForm currentAlbum={currentAlbum} onSave={handleSave} onCancel={handleCancel} />
      ) : viewingAlbum ? (
        <AlbumView album={viewingAlbum} onBack={handleBack} />
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => setFormVisible(true)} sx={{ mb: 2 }}>
            Crear Nuevo Álbum
          </Button>
          <AlbumTable onEdit={handleEdit} onView={handleView} />
        </>
      )}
    </Container>
  );
};

//http://localhost:5173/album/event/qi2X6U8LCr6Gt3nBM4Qj

export default Index;
