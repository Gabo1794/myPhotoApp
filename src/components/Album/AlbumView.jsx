import React from 'react';

const AlbumView = ({ album, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">
            {album.name || album.title}
          </h1>
          <p className="mt-2 text-text-secondary">
            {album.stats?.total_photos || 0} fotos · {album.stats?.total_videos || 0} videos
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-surface-dark text-text-primary rounded-xl hover:bg-surface-lighter transition-colors"
        >
          ← Volver
        </button>
      </div>

      {/* Album Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <p className="text-sm text-text-secondary mb-2">Almacenamiento</p>
          <p className="text-3xl font-bold text-accent">
            {album.stats ? `${(album.stats.total_storage_mb).toFixed(2)} MB` : '0 MB'}
          </p>
          <p className="text-sm text-text-secondary mt-2">de 10,240 MB</p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-text-secondary mb-2">Fotos y Videos</p>
          <p className="text-3xl font-bold text-accent">
            {(album.stats?.total_photos || 0) + (album.stats?.total_videos || 0)}
          </p>
          <p className="text-sm text-text-secondary mt-2">
            {album.stats?.total_photos || 0} fotos, {album.stats?.total_videos || 0} videos
          </p>
        </div>
      </div>

      {/* Placeholder for Photo Grid */}
      <div className="card p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-text-secondary opacity-20 mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
        </svg>
        <p className="text-text-secondary">Las fotos del álbum aparecerán aquí</p>
      </div>
    </div>
  );
};

export default AlbumView;
