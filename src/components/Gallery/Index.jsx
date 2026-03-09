import React, { useState } from "react";

const Index = ({ images, handleDeleteImage }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleOpenMedia = (media) => {
    setSelectedMedia(media);
  };

  const handleCloseMedia = () => {
    setSelectedMedia(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-text-secondary opacity-20 mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
        </svg>
        <p className="text-text-secondary">No hay imágenes aún</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
        {images.map((media, index) => (
          <div
            key={media.id || index}
            className="break-inside-avoid mb-6 group relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-surface-dark">
              {media.file_type === "video" ? (
                <video
                  src={media.file_url}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => handleOpenMedia(media)}
                  preload="metadata"
                />
              ) : (
                <img
                  src={media.file_url}
                  alt={`Gallery item ${index + 1}`}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => handleOpenMedia(media)}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-end opacity-0 group-hover:opacity-100">
                <div className="w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
                  <p className="text-sm">Elemento {index + 1}</p>
                  {handleDeleteImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(media.id);
                      }}
                      className="mt-2 px-3 py-1 bg-error hover:bg-opacity-90 text-white text-xs rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={handleCloseMedia}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseMedia}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Media Content */}
          <div
            className="max-w-4xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.file_type === "video" ? (
              <video
                src={selectedMedia.file_url}
                controls
                autoPlay
                className="max-w-full max-h-[90vh]"
              />
            ) : (
              <img
                src={selectedMedia.file_url}
                alt="Selected"
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
