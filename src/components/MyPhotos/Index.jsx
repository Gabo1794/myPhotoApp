import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  IconButton,
  Button,
  Box,
  Container,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import {
  CameraAltRounded,
  FlipCameraIosRounded,
  Close,
} from "@mui/icons-material";
import Webcam from "react-webcam";
import Gallery from "../Gallery/Index";
import { useMedia } from "../../hooks/useMedia";

const MAX_IMAGES = 100;

const Index = ({ albumId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [cameraType, setCameraType] = useState("environment");
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo"));
  const guestId = guestInfo?.guestId || null;
  const guestName = guestInfo?.guestName || 'Invitado';

  const { listByAlbum, upload } = useMedia(albumId);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError('');
        const mediaList = await listByAlbum();
        // Filtrar solo las imágenes subidas por este invitado
        const guestImages = mediaList.filter(m => m.uploaded_by_id === guestId);
        setImages(guestImages);
      } catch (err) {
        setError('Error al cargar las imágenes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (guestId && albumId) {
      fetchImages();
    }
  }, [guestId, albumId]);

  useEffect(() => {
    if (showWebcam) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showWebcam]);

  const handleFileUpload = async (file) => {
    if (!file || !guestId) return;
    if (images.length >= MAX_IMAGES) {
      setError(`Límite máximo de ${MAX_IMAGES} imágenes alcanzado`);
      return;
    }

    try {
      setError('');
      const uploadedMedia = await upload(file, guestId, guestName);
      setImages(prev => [...prev, uploadedMedia]);
    } catch (err) {
      setError('Error al subir la imagen: ' + (err.message || 'Intenta de nuevo'));
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const captureImage = async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], `captured-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    await handleFileUpload(file);
    setShowWebcam(false);
  };

  const toggleCamera = () => {
    setCameraType(prev => (prev === "environment" ? "user" : "environment"));
  };

  const handleDeleteImage = async (mediaId) => {
    try {
      const deleteMedia = useMedia(albumId).delete;
      await deleteMedia(mediaId);
      setImages(prev => prev.filter(img => img.id !== mediaId));
    } catch (err) {
      setError('Error al eliminar la imagen');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Fotos ({images.length}/{MAX_IMAGES})
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Subidas por: {guestName}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {images.length >= MAX_IMAGES && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Has alcanzado el límite máximo de fotos ({MAX_IMAGES}).
        </Alert>
      )}

      {/* Botones de acción */}
      <Paper sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            disabled={images.length >= MAX_IMAGES}
            onClick={() => fileInputRef.current?.click()}
          >
            Subir Foto
          </Button>

          <Button
            variant="contained"
            startIcon={<CameraAltRounded />}
            disabled={images.length >= MAX_IMAGES}
            onClick={() => setShowWebcam(true)}
            color="secondary"
          >
            Usar Cámara
          </Button>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={handleInputChange}
        />
      </Paper>

      {/* Modal de Webcam */}
      {showWebcam && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: cameraType }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Botones en la parte inferior */}
          <Box
            sx={{
              position: "absolute",
              bottom: 40,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              onClick={captureImage}
              sx={{
                width: 70,
                height: 70,
                backgroundColor: "white",
                border: "4px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  border: "3px solid rgba(0, 0, 0, 0.2)",
                }}
              />
            </IconButton>
          </Box>

          {/* Botón cambiar cámara */}
          <IconButton
            onClick={toggleCamera}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <FlipCameraIosRounded />
          </IconButton>

          {/* Botón cerrar */}
          <IconButton
            onClick={() => setShowWebcam(false)}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Galería de imágenes */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Gallery
          images={images}
          handleDeleteImage={handleDeleteImage}
        />
      )}
    </Container>
  );
};

export default Index;
