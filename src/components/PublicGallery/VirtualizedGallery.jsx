import React, { useState, useEffect, useCallback, useRef } from 'react';

const VirtualizedGallery = ({ items = [], onItemClick, onLoadMore, hasMore = true }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const containerRef = useRef(null);

  // Lazy loading con Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.remove('opacity-50');
              setLoadedImages((prev) => ({
                ...prev,
                [src]: true,
              }));
              observer.unobserve(img);
            }
          }
        });

        // Load more cuando llegamos al final
        if (onLoadMore && entries.some((e) => e.isIntersecting && e.target.dataset.lastItem)) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    const images = document.querySelectorAll('[data-src]');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [items, onLoadMore]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Grid con Masonry layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            data-last-item={index === items.length - 1}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onItemClick?.(item, index)}
          >
            {/* Skeleton Loader */}
            {!loadedImages[item.url] && (
              <div className="absolute inset-0 bg-surface-dark animate-pulse rounded-lg" />
            )}

            {/* Imagen Lazy Loaded */}
            <img
              data-src={item.url}
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
              alt={item.name || 'Media'}
              className={`w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105 ${
                !loadedImages[item.url] ? 'opacity-50' : 'opacity-100'
              }`}
            />

            {/* Badge para Videos */}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all rounded-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            )}

            {/* Upload Indicator */}
            {item.uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-40">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-accent"></div>
              </div>
            )}

            {/* Uploader Name */}
            {item.uploader && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-2 rounded-b-lg">
                <p className="text-white text-xs truncate">By {item.uploader}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Indicator */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedGallery;
