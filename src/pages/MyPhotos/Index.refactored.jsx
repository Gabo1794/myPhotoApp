import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardActions, 
  Button, 
  CircularProgress, 
  Alert,
  Typography,
  Box
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAlbums } from '../../hooks/useAlbums';
import { useMedia } from '../../hooks/useMedia';

const GalleryPage = () => {
  const { aid: publicCode } = useParams();
  const { getByPublicCode } = useAlbums();
  const { media, stats, loading, uploading, listByAlbum, upload, deleteMedia } = useMedia();
  
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const [guestId] = useState(() => {
    let id = localStorage.getItem('guestId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guestId', id);
    }
    return id;
  });

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setError('');
        const foundAlbum = await getByPublicCode(publicCode);
        if (!foundAlbum) {
          setError('Álbum no encontrado');
          return;
        }
        setAlbum(foundAlbum);
        await listByAlbum(foundAlbum.id);
      } catch (err) {
        setError(err.message || 'Error cargando el álbum');
      }
    };

    if (publicCode) {
      loadAlbum();
    }
  }, [publicCode]);

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (!files || !album) return;

    for (const file of files) {
      try {
        await upload(
          album.id,
          { file, guestId, guestName: 'Guest' },
          guestId
        );
      } catch (err) {
        setError(err.message || 'Error subiendo archivo');
      }
    }
  };

  const handleDelete = async (mediaId) => {
    try {
      await deleteMedia(mediaId, guestId, false);
    } catch (err) {
      setError(err.message || 'Error eliminando archivo');
    }
  };

  if (!album) {
    return (
      <Container>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && <Typography>Cargando álbum...</Typography>}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          {album.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {stats && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Fotos
                </Typography>
                <Typography variant="h6">
                  {stats.total_photos}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Videos
                </Typography>
                <Typography variant="h6">
                  {stats.total_videos}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Almacenamiento
                </Typography>
                <Typography variant="h6">
                  {stats.total_storage_mb.toFixed(2)} MB
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">
                  Total
                </Typography>
                <Typography variant="h6">
                  {stats.total_uploads}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <input
            accept="image/*,video/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              component="span"
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir Archivos'}
            </Button>
          </label>
        </Box>

        <Grid container spacing={2}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component={item.file_type === 'video' ? 'video' : 'img'}
                  height="240"
                  image={item.file_url}
                  title={item.id}
                  controls={item.file_type === 'video'}
                />
                <CardActions>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {media.length === 0 && !loading && (
          <Alert severity="info">
            No hay archivos aún. Sé el primero en subir una foto o video.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default GalleryPage;
