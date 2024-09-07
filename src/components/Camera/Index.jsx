import React, { useRef, useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage, auth } from "../../config/firebase";
import { Button, Box, IconButton, Snackbar, Alert } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

const Index = ({ albumId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo"));
  const guestId = guestInfo?.guestId || null;

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
      }
    };

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [cameraActive, facingMode]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      // Ajusta el tamaño del canvas para que coincida con las proporciones del video
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.height = video.videoWidth / aspectRatio;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/png"));
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    // Convertir la foto en un blob y subir a Firebase
    const response = await fetch(photo);
    const blob = await response.blob();
    const storageRef = ref(storage, `${albumId}/${guestId}-${uuidv4()}.png`);
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);

    setPhoto(null);
    setSnackbarOpen(true);
  };

  const toggleCamera = () => {
    // Alternar entre la cámara frontal y trasera
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    setCameraActive(false);
    setTimeout(() => setCameraActive(true), 500); // Reiniciar la cámara para aplicar el cambio
  };

  const discardPhoto = () => {
    setPhoto(null); // Limpiar la foto si el usuario decide descartarla
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Cerrar el snackbar
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        p: 2,
      }}
    >
      {!cameraActive && (
        <Button
          variant="contained"
          onClick={() => setCameraActive(true)}
          sx={{ mb: 2 }}
        >
          Iniciar Cámara
        </Button>
      )}

      {cameraActive && (
        <>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "100%",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            ></video>
          </Box>

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <IconButton
              onClick={takePhoto}
              color="primary"
              sx={{ fontSize: "2rem" }}
            >
              <CameraAltIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={toggleCamera} color="secondary" sx={{ ml: 2 }}>
              <FlipCameraAndroidIcon fontSize="large" />
            </IconButton>
          </Box>
        </>
      )}

      {photo && (
        <>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img
              src={photo}
              alt="captured"
              style={{ width: "100%", maxWidth: "500px", height: "auto" }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" onClick={uploadPhoto} sx={{ mr: 2 }}>
                Subir Foto
              </Button>
              <Button
                variant="outlined"
                onClick={discardPhoto}
                startIcon={<DeleteIcon />}
                color="error"
              >
                Descartar
              </Button>
            </Box>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // 4 segundos
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Foto subida con éxito!
        </Alert>
      </Snackbar>      
    </Box>
  );
};

export default Index;
