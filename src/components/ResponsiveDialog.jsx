import React, { useEffect } from 'react';

/**
 * ResponsiveDialog Component
 * - Mobile: Bottom Sheet
 * - Desktop: Centered Modal
 * - Automatic device detection
 */

const ResponsiveDialog = ({
  isOpen,
  onClose,
  title,
  children,
  actions = null,
  size = 'md', // sm, md, lg
}) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity"
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40
            transition-all duration-300 ease-out
            max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-surface-dark rounded-full" />
          </div>

          {/* Header */}
          {title && (
            <div className="px-6 py-4 border-b border-surface-dark">
              <h3 className="text-xl font-bold text-text-primary">{title}</h3>
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
  }

  // Desktop: Centered Modal
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-30 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]}
            max-h-screen overflow-y-auto transition-all duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
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
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="px-6 py-4 border-t border-surface-dark flex gap-3 justify-end">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsiveDialog;
