import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Gallery from "../../../components/Gallery/Index";
import ModalUserInvited from "../../../components/UserInvited/Index";
import { useAlbums } from "../../../hooks/useAlbums";
import { useMedia } from "../../../hooks/useMedia";

const Index = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");

  const { aid } = useParams();
  const navigate = useNavigate();
  const { getById } = useAlbums();
  
  // Solo inicializar useMedia cuando aid está disponible
  const mediaHook = useMedia(aid && album?.id ? album.id : null);

  // Obtener álbum por ID
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError("");
        const albumData = await getById(aid);
        
        if (albumData) {
          setAlbum(albumData);
        } else {
          setError("Álbum no encontrado");
          setAlbum(null);
        }
      } catch (err) {
        console.error("Error al obtener el álbum:", err);
        setError("Error al cargar el álbum");
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    };

    if (aid) {
      fetchAlbum();
    }
  }, [aid]);

  // Obtener imágenes del álbum
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError("");
        
        if (album?.id) {
          const mediaList = await mediaHook.listByAlbum(album.id);
          setImages(mediaList || []);
        }
      } catch (err) {
        console.error("Error al obtener las imágenes:", err);
        setError("Error al cargar las imágenes");
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (album?.id) {
      fetchImages();
    }
  }, [album?.id]);

  if (loading && !album) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!album) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Álbum no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ModalUserInvited albumId={aid} />
      
      <Typography variant="h4" gutterBottom>
        {album.name}
      </Typography>

      {album.stats && (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {album.stats.total_photos} fotos • {album.stats.total_videos} vídeos
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/camera/${aid}`)}
          sx={{ mr: 2 }}
        >
          Tomar Foto
        </Button>
      </Box>

      {loading && <CircularProgress />}

      {!loading && (
        <Gallery images={images} handleDeleteImage={null} />
      )}
    </Container>
  );
};

export default Index;
