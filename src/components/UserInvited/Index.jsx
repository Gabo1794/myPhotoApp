import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../../config/firebase"; // Asegúrate de tener configurado Firebase

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
    if (!guestName) return;

    try {
      // Guardar el nombre en Firebase en la colección 'albumsInvited'
      const docRef = await addDoc(collection(db, 'albumsInvited'), {
        name: guestName,
        albumId: albumId,
        createdAt: new Date(),
      });

      // Crear un objeto con guestId y guestName
      const guestInfo = {
        guestId: docRef.id,
        guestName: guestName,
      };

      // Guardar el objeto en localStorage como una cadena JSON
      localStorage.setItem('guestInfo', JSON.stringify(guestInfo));

      // Cerrar el modal
      setOpenModal(false);
    } catch (error) {
      console.error("Error al guardar el invitado: ", error);
    }
  };

  return (
    <>
      {/* Modal para capturar el nombre */}
      <Modal
        open={openModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Bienvenido, Invitado
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Por favor, ingresa tu nombre:
          </Typography>
          <TextField
            fullWidth
            label="Tu nombre"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSaveGuest}
            disabled={!guestName}
          >
            Guardar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Index;