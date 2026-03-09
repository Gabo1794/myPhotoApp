import React, { useState, useEffect } from 'react';
import { useToast } from '../Toast';

const AlbumForm = ({ currentAlbum, onSave, onCancel, loading = false, error = '' }) => {
  const toast = useToast();
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
    if (!formData.name) {
      toast.error('El nombre del álbum es requerido');
      return;
    }
    
    let expirationDate = null;
    if (formData.expiration_date) {
      expirationDate = formData.expiration_date + 'T00:00:00+00:00';
    }
    
    try {
      await onSave({
        ...formData,
        expiration_date: expirationDate,
        max_files_per_user: parseInt(formData.max_files_per_user),
        max_file_size_mb: parseInt(formData.max_file_size_mb),
        max_total_storage_mb: parseInt(formData.max_total_storage_mb),
      });
      
      // Reset form if creating new album
      if (!currentAlbum) {
        setFormData({
          name: '',
          is_active: true,
          expiration_date: '',
          max_files_per_user: 100,
          max_file_size_mb: 25,
          max_total_storage_mb: 10240,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Error al guardar el álbum');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="px-6 py-6 border-b border-surface-dark">
          <h2 className="text-2xl font-bold text-text-primary">
            {currentAlbum ? 'Editar Álbum' : 'Crear Nuevo Álbum'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Album Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nombre del Álbum *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl border border-surface-dark bg-surface-lighter text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
              placeholder="Ej: Vacaciones 2026"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Fecha de Expiración
            </label>
            <input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl border border-surface-dark bg-surface-lighter text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Max Files Per User */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Máx. archivos por usuario
            </label>
            <input
              type="number"
              name="max_files_per_user"
              value={formData.max_files_per_user}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl border border-surface-dark bg-surface-lighter text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Max File Size */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tamaño máximo (MB)
            </label>
            <input
              type="number"
              name="max_file_size_mb"
              value={formData.max_file_size_mb}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl border border-surface-dark bg-surface-lighter text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Max Total Storage */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Almacenamiento máximo (MB)
            </label>
            <input
              type="number"
              name="max_total_storage_mb"
              value={formData.max_total_storage_mb}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 rounded-xl border border-surface-dark bg-surface-lighter text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Active Toggle */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={loading}
              className="w-5 h-5 rounded-lg border-surface-dark bg-surface-lighter accent-accent"
            />
            <span className="ml-3 text-sm text-text-secondary">
              Álbum activo
            </span>
          </label>

          {error && (
            <div className="p-3 bg-error-light border border-error rounded-xl">
              <p className="text-error-dark text-sm">{error}</p>
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="px-6 py-4 bg-surface-lighter border-t border-surface-dark flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl border border-surface-dark text-text-primary hover:bg-surface-dark transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !formData.name}
            className="flex-1 px-4 py-2 bg-accent text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumForm;