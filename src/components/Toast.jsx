import React, { useEffect, useState } from 'react';

/**
 * Toast Notification Context and Hook
 * Provides global toast notification system
 */

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  
  return {
    ...context,
    success: (message, duration = 4000) => context.addToast(message, 'success', duration),
    error: (message, duration = 4000) => context.addToast(message, 'error', duration),
    warning: (message, duration = 4000) => context.addToast(message, 'warning', duration),
    info: (message, duration = 4000) => context.addToast(message, 'info', duration),
  };
};

const Toast = ({ id, message, type, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  };

  const typeConfig = {
    success: {
      bg: 'bg-emerald-500',
      icon: '✓',
      text: 'text-white',
    },
    error: {
      bg: 'bg-red-500',
      icon: '✕',
      text: 'text-white',
    },
    info: {
      bg: 'bg-blue-500',
      icon: 'ℹ',
      text: 'text-white',
    },
    warning: {
      bg: 'bg-amber-500',
      icon: '⚠',
      text: 'text-white',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`toast ${config.bg} text-white px-6 py-3 rounded-lg shadow-lg
        flex items-center gap-3 animate-fade-in
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
    >
      <span className="text-xl">{config.icon}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 left-6 right-6 md:right-8 md:left-auto flex flex-col gap-3 z-50 pointer-events-none md:max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
