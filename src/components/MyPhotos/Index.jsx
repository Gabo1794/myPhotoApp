import React, { useState, useEffect, useRef } from "react";
import {
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  CameraAltRounded,
  FlipCameraIosRounded,
  Close,
} from "@mui/icons-material";
import Webcam from "react-webcam";
import Gallery from "../Gallery/Index";

const MAX_IMAGES = 20;

const Index = ({ albumId }) => {
  const [images, setImages] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [cameraType, setCameraType] = useState("environment");
  const webcamRef = useRef(null);

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo"));
  const guestId = guestInfo?.guestId || null;

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const imagesRef = ref(storage, `${albumId}/`);
      const imageList = await listAll(imagesRef);

      const urls = await Promise.all(
        imageList.items
          .filter((item) => item.name.includes(guestId))
          .map((item) => getDownloadURL(item))
      );
      setImages(urls);
      setLoading(false);
    };
    if (guestId) {
      fetchImages();
    }
  }, [albumId, guestId]);

  useEffect(() => {
    if (imageUpload) {
      handleImageUpload();
    }
  }, [imageUpload]);

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

  const handleImageUpload = async () => {
    if (imageUpload == null || images.length >= MAX_IMAGES) return;

    const imageRef = ref(storage, `${albumId}/${guestId}-${uuidv4()}`);
    await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(imageRef);

    setImages((prev) => [...prev, url]);
    setImageUpload(null);
  };

  const handleDeleteImage = async (imageUrl) => {
    const decodeUrl = decodeURIComponent(
      imageUrl.split("/").pop().split("?")[0]
    );
    const imageRef = ref(storage, `${decodeUrl}`);

    await deleteObject(imageRef);
    setImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageUpload(dataURLtoFile(imageSrc, "captured.jpg"));
    setShowWebcam(false);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const toggleCamera = () => {
    setCameraType((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Mis Fotos ({images.length}/{MAX_IMAGES})
      </Typography>

      {images.length >= MAX_IMAGES && (
        <Typography color="error" sx={{ mt: 2 }}>
          Has alcanzado el límite máximo de fotos (20).
        </Typography>
      )}

      <Box sx={{ mt: 4, textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          disabled={images.length >= MAX_IMAGES}
          size="small"
          style={{ marginRight: 10 }}
        >
          Subir Foto
          <input
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
        </Button>

        <Button
          variant="contained"
          startIcon={<CameraAltRounded />}
          disabled={images.length >= MAX_IMAGES}
          size="small"
          onClick={() => setShowWebcam(true)}
          style={{ marginLeft: 10 }}
        >
          Usar cámara
        </Button>

        {showWebcam && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
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
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    border: "3px solid rgba(0, 0, 0, 0.1)",
                  }}
                />
              </IconButton>
            </Box>

            <IconButton
              onClick={toggleCamera}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              <FlipCameraIosRounded />
            </IconButton>

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
      </Box>

      <Gallery 
        images={images} 
        handleDeleteImage={handleDeleteImage} 
      />

    </Box>
  );
};

export default Index;
