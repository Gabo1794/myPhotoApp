import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
} from "@mui/material";
import {
  ref,
  getDownloadURL,
  listAll
} from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../../../config/firebase";
import { useParams } from "react-router-dom";
import Gallery from "../../../components/Gallery/Index";


const Index = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState("");

  const { aid } = useParams();

  useEffect(() => {
    const fetchAlbum = async () => {
        try {
            const albumRef = doc(db, 'albums', aid);
        
            const albumSnap = await getDoc(albumRef);
        
            if (albumSnap.exists()) {
              const albumData = albumSnap.data();
              setEventName(albumData.title);
              
            } else {
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

      <Gallery 
        images={images} 
        handleDeleteImage={null}
      />

    </Box>
  );
};

export default Index;
