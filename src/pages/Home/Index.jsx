import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';
import { useMedia } from '../../hooks/useMedia';
import { formatBytes } from '../../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const { albums, loading: albumsLoading, listForOwner } = useAlbums(user?.id);
  const { stats: allStats } = useMedia();

  useEffect(() => {
    if (user?.id) {
      listForOwner(user.id);
    }
  }, [user?.id]);

  // Calcular estadísticas totales
  const totalStats = {
    total_photos: albums.reduce((sum, album) => sum + (album.stats?.total_photos || 0), 0),
    total_videos: albums.reduce((sum, album) => sum + (album.stats?.total_videos || 0), 0),
    total_uploads: albums.reduce((sum, album) => sum + (album.stats?.total_uploads || 0), 0),
    total_storage_mb: albums.reduce((sum, album) => sum + (album.stats?.total_storage_mb || 0), 0),
  };

  const expiringAlbums = albums.filter(
    (album) =>
      album.expiration_date &&
      new Date(album.expiration_date) > new Date() &&
      new Date(album.expiration_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  if (albumsLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Bienvenido, {user?.email}
      </Typography>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Álbumes
              </Typography>
              <Typography variant="h5">
                {albums.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fotos
              </Typography>
              <Typography variant="h5">
                {totalStats.total_photos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Videos
              </Typography>
              <Typography variant="h5">
                {totalStats.total_videos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Almacenamiento
              </Typography>
              <Typography variant="h5">
                {formatBytes(totalStats.total_storage_mb * 1024 * 1024)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Álbumes expirando pronto */}
      {expiringAlbums.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Tienes {expiringAlbums.length} álbum(es) que expirarán en los próximos 7 días
        </Alert>
      )}

      {/* Botón para crear álbum */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/album"
        >
          Crear Nuevo Álbum
        </Button>
      </Box>

      {/* Lista de álbumes */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Mis Álbumes
      </Typography>

      {albums.length === 0 ? (
        <Alert severity="info">
          No tienes álbumes aún. Crea uno para comenzar.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {albums.map((album) => (
            <Grid item xs={12} sm={6} md={4} key={album.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 6 },
                  transition: 'box-shadow 0.3s',
                }}
                component={RouterLink}
                to={`/album/event/${album.public_code}`}
              >
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {album.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Código: {album.public_code}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      {album.stats?.total_uploads || 0} archivos
                    </Typography>
                  </Box>
                  {album.expiration_date && (
                    <Typography
                      variant="caption"
                      color={
                        new Date(album.expiration_date) < new Date()
                          ? 'error'
                          : 'textSecondary'
                      }
                    >
                      Expira: {new Date(album.expiration_date).toLocaleDateString()}
                    </Typography>
                  )}
                  {!album.is_active && (
                    <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                      Inactivo
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;