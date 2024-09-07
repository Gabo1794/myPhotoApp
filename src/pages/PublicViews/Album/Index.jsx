import React, { useState, useEffect } from "react";
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
  getDownloadURL,
  listAll
} from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../../../config/firebase"; // Asegúrate de tener configurado Firebase
import { v4 as uuidv4 } from "uuid"; // Para generar nombres únicos
import { useParams } from "react-router-dom";


const Index = () => {
  const [images, setImages] = useState([]);
//   const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState("");

  const { aid } = useParams();

  useEffect(() => {
    const fetchAlbum = async () => {
        try {
            // Referenciar el documento en la colección 'albums'
            const albumRef = doc(db, 'albums', aid);
        
            // Obtener el documento
            const albumSnap = await getDoc(albumRef);
        
            if (albumSnap.exists()) {
              // El documento fue encontrado, puedes acceder a sus datos
              const albumData = albumSnap.data();
              setEventName(albumData.title);
              
            } else {
              // El documento no existe
              console.log('No existe un álbum con ese ID');
              setEventName(null)
            }
          } catch (error) {
            console.error('Error al obtener el álbum:', error);
            setEventName(null);
          }
    };
    fetchAlbum();
  }, []);  


  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const imagesRef = ref(storage, `${aid}/`);
      const imageList = await listAll(imagesRef);
      const urls = await Promise.all(
        imageList.items.map((item) => getDownloadURL(item))
      );
      setImages(urls);
      setLoading(false);
    };

    fetchImages();
  }, [aid]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {`${eventName}`} 
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Index;
