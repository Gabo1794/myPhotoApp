import React, { useEffect } from 'react';

/**
 * BottomSheet Component
 * - Mobile-first modal that slides up from bottom
 * - Perfect for forms and simple interactions
 * - Touch-friendly with drag handle
 * - Responsive design
 */

const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = '80vh',
  actions = null,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40
          transition-all duration-300 ease-out
          max-h-[${maxHeight}] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-surface-dark rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-surface-dark flex justify-between items-center">
            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 pb-8">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-surface-dark flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </>
  );
};

export default BottomSheet;
