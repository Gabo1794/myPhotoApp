import React, { useState } from "react";
import { useToast } from '../Toast';

const AlbumTable = ({ albums, onEdit, onView, onDelete }) => {
  const toast = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleCopyLink = (albumId) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/album/event/${albumId}`;

    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success('Enlace copiado al portapapeles');
      })
      .catch(err => {
        toast.error('Error al copiar el enlace');
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
      }
    } catch (err) {
      toast.error('Error al eliminar el álbum');
    }
  };

  return (
    <>
      {/* Table Container */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        {albums && albums.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-dark">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Fotos
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Videos
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Almacenamiento
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {albums.map((album) => (
                  <tr key={album.id} className="border-b border-surface-dark hover:bg-surface-lighter transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-text-primary font-medium">{album.name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-text-secondary">{album.stats?.total_photos || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-text-secondary">{album.stats?.total_videos || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-text-secondary">
                        {album.stats ? `${(album.stats.total_storage_mb).toFixed(2)} MB` : '0 MB'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(album)}
                          title="Editar"
                          className="p-2 text-accent hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => onView(album)}
                          title="Ver álbum"
                          className="p-2 text-accent hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(album.id)}
                          title="Copiar enlace"
                          className="p-2 text-accent hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a2 2 0 11-4 0 2 2 0 014 0zM15 16.5a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path d="M12.5 3h-8A1.5 1.5 0 003 4.5v.006A1.5 1.5 0 004.5 6h8A1.5 1.5 0 0014 4.5v-.006A1.5 1.5 0 0012.5 3z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(album)}
                          title="Eliminar"
                          className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-text-secondary opacity-20 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-text-secondary">No hay álbumes. ¡Crea uno para empezar!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full shadow-xl">
            <div className="px-6 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-text-primary">
                Confirmar eliminación
              </h3>
            </div>
            <div className="px-6 py-6">
              <p className="text-text-secondary text-base">
                ¿Estás seguro de que deseas eliminar el álbum <strong className="text-text-primary">"{deleteConfirm?.name}"</strong>?
                <br />
                <span className="text-sm">Esta acción no se puede deshacer.</span>
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 rounded-b-2xl">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-text-primary font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-error text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumTable;
