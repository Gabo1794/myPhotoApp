import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const AlbumView = ({ album, onBack }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>{album.title}</Typography>
      {/* Aquí se pueden listar las fotos del álbum */}
      <Button variant="contained" color="primary" onClick={onBack}>Volver</Button>
    </Box>
  );
};

export default AlbumView;
