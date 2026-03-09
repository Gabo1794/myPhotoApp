import React, { useState, useEffect, useRef } from 'react';

const Lightbox = ({ items = [], initialIndex = 0, onClose, onUpload }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [startDistance, setStartDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const touchRef = useRef(null);

  const currentItem = items[currentIndex];

  // Gestos de touch: pinch-zoom y swipe
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setStartDistance(distance);
    } else if (e.touches.length === 1) {
      // Swipe
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(Math.max(scale * (distance / startDistance), 1), 3);
      setScale(newScale);
      setStartDistance(distance);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      // Swipe end
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setScale(1);
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setScale(1);
        }
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setScale(1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setScale(1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black bg-opacity-50 border-b border-gray-700">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{currentItem?.name || 'Media'}</h3>
          {currentItem?.uploader && (
            <p className="text-gray-400 text-sm">By {currentItem.uploader}</p>
          )}
        </div>
        <div className="text-gray-400 text-sm mx-4">
          {currentIndex + 1} / {items.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Media Container */}
      <div
        ref={touchRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {currentItem?.type === 'video' ? (
          <video
            src={currentItem.url}
            controls
            className="max-w-full max-h-full rounded-lg"
            style={{ transform: `scale(${scale})` }}
          />
        ) : (
          <img
            src={currentItem?.url}
            alt={currentItem?.name || 'Media'}
            className="max-w-full max-h-full rounded-lg select-none"
            style={{ transform: `scale(${scale})` }}
            draggable={false}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between px-4 py-4 bg-black bg-opacity-50 border-t border-gray-700">
        {/* Previous Button */}
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setScale(1);
            }
          }}
          disabled={currentIndex === 0}
          className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onUpload && (
            <button
              onClick={() => onUpload(currentItem)}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Guardar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            Cerrar
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={() => {
            if (currentIndex < items.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setScale(1);
            }
          }}
          disabled={currentIndex === items.length - 1}
          className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Hints */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="text-center text-white">
          <p className="text-sm mb-2">Pellizca para zoom | Desliza para navegar | Flecha o ESC para salir</p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
