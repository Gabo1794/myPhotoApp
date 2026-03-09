import React, { useState, useCallback, useEffect } from 'react';

/**
 * OptimizedGallery Component
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Masonry grid layout
 * - Skeleton loading
 * - Lightbox modal
 * - Mobile-optimized
 */

const LazyImage = ({ src, alt, onClick }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <div
      ref={imgRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-surface-dark cursor-pointer transition-all duration-300 hover:shadow-lg group ${
        isLoading ? 'animate-pulse' : ''
      }`}
      onClick={onClick}
    >
      {!imageSrc ? (
        <div className="w-full h-40 bg-surface-dark" />
      ) : (
        <>
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => setIsLoading(false)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </>
      )}
    </div>
  );
};

const LightboxModal = ({ media, isOpen, onClose, onNext, onPrev, canNext, canPrev }) => {
  if (!isOpen || !media) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-2 transition-all"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center justify-center w-full h-full gap-4" onClick={(e) => e.stopPropagation()}>
        {canPrev && (
          <button
            onClick={onPrev}
            className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {media.file_type === 'video' ? (
          <video
            src={media.file_url}
            className="max-w-full max-h-full rounded-2xl"
            controls
            autoPlay
          />
        ) : (
          <img
            src={media.file_url}
            alt="Preview"
            className="max-w-full max-h-full rounded-2xl object-contain"
          />
        )}

        {canNext && (
          <button
            onClick={onNext}
            className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Image metadata */}
      <div className="absolute bottom-4 left-4 right-4 text-white text-sm">
        <p>{media.file_name}</p>
        <p className="text-white text-opacity-70">
          {new Date(media.created_at).toLocaleDateString()} by {media.uploaded_by}
        </p>
      </div>
    </div>
  );
};

const OptimizedGallery = ({ images, onDeleteImage, showDeleteButton }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenLightbox = useCallback((index) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  }, []);

  const handleNextImage = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, images.length]);

  const handlePrevImage = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleDelete = useCallback((id) => {
    if (onDeleteImage) {
      onDeleteImage(id);
      if (selectedIndex !== null && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else {
        handleCloseLightbox();
      }
    }
  }, [selectedIndex, onDeleteImage, handleCloseLightbox]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-3xl mb-4">📷</p>
          <p className="text-text-secondary">No photos yet. Start uploading to create memories!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 mb-8">
        {images.map((media, index) => (
          <div key={media.id} className="break-inside-avoid mb-4 relative group">
            <div className="relative">
              <LazyImage
                src={media.file_url}
                alt={`Gallery item ${index + 1}`}
                onClick={() => handleOpenLightbox(index)}
              />
              
              {/* Delete Button Overlay */}
              {showDeleteButton && (
                <button
                  onClick={() => handleDelete(media.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 bg-opacity-0 group-hover:bg-opacity-80 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Delete image"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}

              {/* Upload info */}
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="truncate">{media.uploaded_by}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        media={selectedIndex !== null ? images[selectedIndex] : null}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        canNext={selectedIndex !== null && selectedIndex < images.length - 1}
        canPrev={selectedIndex !== null && selectedIndex > 0}
      />
    </>
  );
};

export default OptimizedGallery;
