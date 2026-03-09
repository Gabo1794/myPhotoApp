import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';

const AlbumForm = ({ currentAlbum, onSave, onCancel, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
    expiration_date: '',
    max_files_per_user: 100,
    max_file_size_mb: 25,
    max_total_storage_mb: 10240,
  });

  useEffect(() => {
    if (currentAlbum) {
      setFormData({
        name: currentAlbum.name,
        is_active: currentAlbum.is_active,
        expiration_date: currentAlbum.expiration_date
          ? new Date(currentAlbum.expiration_date).toISOString().split('T')[0]
          : '',
        max_files_per_user: currentAlbum.max_files_per_user,
        max_file_size_mb: currentAlbum.max_file_size_mb,
        max_total_storage_mb: currentAlbum.max_total_storage_mb,
      });
    }
  }, [currentAlbum]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    // Convertir la fecha al formato que Supabase espera (ISO 8601 con timezone)
    let expirationDate = null;
    if (formData.expiration_date) {
      expirationDate = formData.expiration_date + 'T00:00:00+00:00';
    }
    
    await onSave({
      ...formData,
      expiration_date: expirationDate,
      max_files_per_user: parseInt(formData.max_files_per_user),
      max_file_size_mb: parseInt(formData.max_file_size_mb),
      max_total_storage_mb: parseInt(formData.max_total_storage_mb),
    });
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {currentAlbum ? 'Editar Álbum' : 'Crear Nuevo Álbum'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del Álbum"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Fecha de Expiración"
              name="expiration_date"
              type="date"
              value={formData.expiration_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Máx. archivos por usuario"
              name="max_files_per_user"
              type="number"
              value={formData.max_files_per_user}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Tamaño máximo de archivo (MB)"
              name="max_file_size_mb"
              type="number"
              value={formData.max_file_size_mb}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Almacenamiento máximo (MB)"
              name="max_total_storage_mb"
              type="number"
              value={formData.max_total_storage_mb}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
    </Dialog>
  );
};

export default AlbumForm;