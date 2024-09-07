import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AlbumForm = ({ currentAlbum, onSave, onCancel }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (currentAlbum) {
      setTitle(currentAlbum.title);
    }
  }, [currentAlbum]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentAlbum) {
      // Editar álbum existente
      await updateDoc(doc(db, 'albums', currentAlbum.id), { title });
    } else {
      // Crear nuevo álbum
      await addDoc(collection(db, 'albums'), { title });
    }
    onSave();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Título del Álbum"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" type="submit">
          Guardar
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default AlbumForm;
