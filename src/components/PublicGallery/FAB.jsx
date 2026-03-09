import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FAB = ({ uploading = false, albumId }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hidden Inputs */}
      <button
        onClick={() => {
          if (albumId) {
            navigate(`/camera/${albumId}`);
          }
        }}
        disabled={uploading}
        className={`fixed bottom-8 right-6 z-50 w-16 h-16 rounded-full bg-accent text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default FAB;
