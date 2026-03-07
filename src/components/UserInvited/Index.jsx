import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

// Estilos para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const Index = ({ albumId }) => {
  const [guestName, setGuestName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener el objeto completo del localStorage
    const guestInfo = JSON.parse(localStorage.getItem('guestInfo'));

    // Si no existe el objeto de invitado, mostramos el modal
    if (!guestInfo || !guestInfo.guestId || !guestInfo.guestName) {
      setOpenModal(true);
    }
  }, []);

  // Función para manejar la captura del nombre
  const handleSaveGuest = async () => {
    if (!guestName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    try {
      setError('');
      
      // Generar un ID único para el invitado
      const guestId = uuidv4();

      // Crear un objeto con guestId y guestName
      const guestInfo = {
        guestId: guestId,
        guestName: guestName,
        createdAt: new Date().toISOString(),
      };

      // Guardar el objeto en localStorage como una cadena JSON
      localStorage.setItem('guestInfo', JSON.stringify(guestInfo));

      // Cerrar el modal después de guardar
      setOpenModal(false);
    } catch (err) {
      setError('Error al guardar tu información. Intenta de nuevo.');
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveGuest();
    }
  };

  return (
    <Modal open={openModal} onClose={() => {}}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Bienvenido al Álbum
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Por favor, ingresa tu nombre para continuar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Tu nombre"
          variant="outlined"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ej: Juan García"
          sx={{ mb: 2 }}
          autoFocus
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSaveGuest}
        >
          Continuar
        </Button>
      </Box>
    </Modal>
  );
};

export default Index;