import React, { useRef, useState, useCallback } from 'react';
import FloatingActionButton from './FloatingActionButton';

/**
 * NativeUploader Component
 * - Native file picker (mobile-optimized)
 * - Photo library or camera access
 * - Progress feedback
 * - Drag & drop support (desktop)
 */

const NativeUploader = ({ onFileSelect, isLoading = false, maxFiles = 100, acceptedTypes = 'image/*,video/*' }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    
    // Filter files by accepted types
    const filteredFiles = fileArray.filter((file) => {
      const [type] = file.type.split('/');
      return acceptedTypes.includes(type) || acceptedTypes === '*';
    });

    if (filteredFiles.length > 0) {
      // Handle multiple files
      filteredFiles.forEach((file) => {
        onFileSelect(file);
      });

      // Reset progress
      setUploadProgress(0);
    }
  }, [onFileSelect, acceptedTypes]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <>
      {/* Hidden file input - triggers native mobile file picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleChange}
        className="hidden"
        capture="environment"
      />

      {/* Desktop Drag & Drop Area */}
      <div
        className="hidden md:block mb-6 p-8 border-2 border-dashed border-accent rounded-2xl
          transition-all duration-300 cursor-pointer
          hover:bg-surface-light hover:border-accent-dark
          focus:outline-none focus:ring-2 focus:ring-accent
          bg-surface
          aria-label='Drag files here to upload'
        "
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <div className="text-center">
          <p className="text-4xl mb-3">📸</p>
          <h3 className="text-xl font-bold mb-2">Drag & drop your files here</h3>
          <p className="text-text-secondary mb-4">or click to browse from your computer</p>
          <p className="text-sm text-text-tertiary">Supports JPG, PNG, MP4, MOV and more</p>
        </div>
      </div>

      {/* Floating Action Button - Mobile optimized */}
      <FloatingActionButton
        onClick={handleClick}
        icon="📤"
        label="Upload Photos"
        variant="primary"
      />

      {/* Upload Progress */}
      {isLoading && uploadProgress > 0 && (
        <div className="fixed top-20 left-4 right-4 md:right-auto md:w-80 bg-white rounded-lg shadow-lg p-4 z-40">
          <p className="text-sm font-semibold mb-2 text-text-primary">Uploading...</p>
          <div className="w-full bg-surface-dark rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-2">{uploadProgress}% complete</p>
        </div>
      )}
    </>
  );
};

export default NativeUploader;
