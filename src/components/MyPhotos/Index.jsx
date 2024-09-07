import React, { useState, useEffect } from 'react';
import { Grid2 as Grid, Card, CardMedia, CardContent, Typography, IconButton, Button, Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../../config/firebase"; 
import { v4 as uuidv4 } from 'uuid';

const MAX_IMAGES = 20;

const Index = ({ albumId }) => {
  const [images, setImages] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);

  const guestInfo = JSON.parse(localStorage.getItem('guestInfo'));
  const guestId = guestInfo?.guestId || null;

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const imagesRef = ref(storage, `${albumId}/`);
      const imageList = await listAll(imagesRef);

      const urls = await Promise.all(
        imageList.items
          .filter(item => item.name.includes(guestId))
          .map(item => getDownloadURL(item))
      );
      setImages(urls);
      setLoading(false);
    };
    if(guestId) {
      fetchImages();
    }
  }, [albumId, guestId]);

  
  const handleImageUpload = async () => {
    if (imageUpload == null || images.length >= MAX_IMAGES) return;

    const imageRef = ref(storage, `${albumId}/${guestId}-${uuidv4()}`);
    await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(imageRef);

    setImages((prev) => [...prev, url]);
    setImageUpload(null);
  };

  
  const handleDeleteImage = async (imageUrl) => {
    const imageRef = ref(storage, `${albumId}/${imageUrl.split('/').pop().split('?')[0]}`);

    await deleteObject(imageRef);
    setImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Mis Fotos ({images.length}/{MAX_IMAGES})
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {images.map((url, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt={`image-${index}`}
                height="200"
                image={url}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Foto {index + 1}
                </Typography>
                <IconButton onClick={() => handleDeleteImage(url)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Mostrar un mensaje si el usuario ha alcanzado el límite de fotos */}
      {images.length >= MAX_IMAGES && (
        <Typography color="error" sx={{ mt: 2 }}>
          Has alcanzado el límite máximo de fotos (20).
        </Typography>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          disabled={images.length >= MAX_IMAGES}
        >
          Subir Foto
          <input
            type="file"
            hidden
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 2 }}
          onClick={handleImageUpload}
          disabled={!imageUpload || images.length >= MAX_IMAGES}
        >
          Cargar
        </Button>
      </Box>
    </Box>
  );
};

export default Index;
