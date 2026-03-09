import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { Edit, Delete, Visibility, ContentCopy } from "@mui/icons-material";

const AlbumTable = ({ albums, onEdit, onView, onDelete }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCopyLink = (albumId) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/album/event/${albumId}`;

    navigator.clipboard.writeText(link)
      .then(() => {
        setSnackbarMessage('Enlace copiado al portapapeles');
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Error al copiar el enlace:', err);
      });
  };

  const handleDeleteClick = (album) => {
    setDeleteConfirm(album);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirm) {
        await onDelete(deleteConfirm.id);
        setDeleteConfirm(null);
        setSnackbarMessage('Álbum eliminado correctamente');
        setOpenSnackbar(true);
      }
    } catch (err) {
      setSnackbarMessage('Error al eliminar el álbum');
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell align="center"><strong>Fotos</strong></TableCell>
              <TableCell align="center"><strong>Vídeos</strong></TableCell>
              <TableCell align="center"><strong>Almacenamiento</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {albums && albums.length > 0 ? (
              albums.map((album) => (
                <TableRow key={album.id} hover>
                  <TableCell>{album.name}</TableCell>
                  <TableCell align="center">{album.stats?.total_photos || 0}</TableCell>
                  <TableCell align="center">{album.stats?.total_videos || 0}</TableCell>
                  <TableCell align="center">
                    {album.stats ? `${(album.stats.total_storage_mb).toFixed(2)} MB` : '0 MB'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(album)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver álbum">
                      <IconButton 
                        size="small" 
                        onClick={() => onView(album)}
                        color="info"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copiar link público">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyLink(album.id)}
                        color="default"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(album)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No hay álbumes. ¡Crea uno para empezar!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el álbum "{deleteConfirm?.name}"? 
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default AlbumTable;
