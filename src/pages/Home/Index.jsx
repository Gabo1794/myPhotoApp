import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';
import { useMedia } from '../../hooks/useMedia';
import { formatBytes } from '../../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const { albums, loading: albumsLoading, listForOwner } = useAlbums(user?.id);
  const { stats: allStats } = useMedia();
  const [storagePercent, setStoragePercent] = useState(0);

  useEffect(() => {
    if (user?.id) {
      listForOwner(user.id);
    }
  }, [user?.id]);

  // Calculate storage percentage (assuming 100GB limit per plan)
  useEffect(() => {
    const totalStorageGB = albums.reduce((sum, album) => sum + (album.stats?.total_storage_mb || 0), 0) / 1024;
    const planLimit = 100; // 100GB for pro plan
    setStoragePercent(Math.min((totalStorageGB / planLimit) * 100, 100));
  }, [albums]);

  // Calculate total statistics
  const totalStats = {
    total_photos: albums.reduce((sum, album) => sum + (album.stats?.total_photos || 0), 0),
    total_videos: albums.reduce((sum, album) => sum + (album.stats?.total_videos || 0), 0),
    total_uploads: albums.reduce((sum, album) => sum + (album.stats?.total_uploads || 0), 0),
    total_storage_mb: albums.reduce((sum, album) => sum + (album.stats?.total_storage_mb || 0), 0),
  };

  const expiringAlbums = albums.filter(
    (album) =>
      album.expiration_date &&
      new Date(album.expiration_date) > new Date() &&
      new Date(album.expiration_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  if (albumsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-secondary">Loading your albums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
            <p className="text-text-secondary">Manage your events and collaborative albums</p>
          </div>
          <RouterLink
            to="/album"
            className="btn-primary px-6 py-3"
          >
            + Create New Event
          </RouterLink>
        </div>

        {/* Alerts */}
        {expiringAlbums.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-900">
              ⚠️ You have <strong>{expiringAlbums.length}</strong> album(s) expiring in the next 7 days
            </p>
          </div>
        )}

        {/* Stats Cards - Grid of 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Events Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-text-secondary text-sm font-medium mb-2">Total Events</p>
                <h3 className="text-4xl font-bold text-text-primary">{albums.length}</h3>
              </div>
              <span className="text-3xl ml-2">📅</span>
            </div>
            <p className="text-xs text-text-tertiary font-medium">Active events</p>
          </div>

          {/* Photos Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-text-secondary text-sm font-medium mb-2">Photos</p>
                <h3 className="text-4xl font-bold text-text-primary">{totalStats.total_photos}</h3>
              </div>
              <span className="text-3xl ml-2">📸</span>
            </div>
            <p className="text-xs text-text-tertiary font-medium">Collected so far</p>
          </div>

          {/* Videos Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <p className="text-text-secondary text-sm font-medium mb-2">Videos</p>
                <h3 className="text-4xl font-bold text-text-primary">{totalStats.total_videos}</h3>
              </div>
              <span className="text-3xl ml-2">🎬</span>
            </div>
            <p className="text-xs text-text-tertiary font-medium">Video uploads</p>
          </div>

          {/* Storage Card */}
          <div className="card p-6">
            <div className="mb-6">
              <p className="text-text-secondary text-sm font-medium mb-2">Storage Used</p>
              <h3 className="text-4xl font-bold text-text-primary">{Math.round(storagePercent)}%</h3>
            </div>
            <div className="w-full bg-surface-dark rounded-full h-2.5 mb-3">
              <div
                className="bg-accent h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <p className="text-xs text-text-tertiary font-medium">
              {formatBytes(totalStats.total_storage_mb * 1024 * 1024)} of 100 GB
            </p>
          </div>
        </div>
        {/* Recent Activity Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Active Events</h2>

          {albums.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <p className="text-blue-900 mb-4">No events yet. Create one to get started!</p>
              <RouterLink
                to="/album"
                className="inline-block btn-primary px-6 py-2"
              >
                Create Your First Event
              </RouterLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <RouterLink
                  key={album.id}
                  to={`/album/event/${album.public_code}`}
                  className="card group cursor-pointer hover:shadow-lg"
                >
                  {/* Event Cover Image Placeholder */}
                  <div className="w-full h-40 bg-gradient-to-br from-accent-light to-accent rounded-xl mb-4 flex items-center justify-center group-hover:shadow-md transition-all">
                    <span className="text-5xl">📷</span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 truncate group-hover:text-accent transition-colors text-text-primary">
                    {album.name}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Code: <span className="font-mono font-semibold text-accent">{album.public_code}</span>
                  </p>

                  {/* Stats Row */}
                  <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-text-tertiary font-medium">Uploads</p>
                      <p className="text-lg font-bold text-text-primary">{album.stats?.total_uploads || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary font-medium">Photos</p>
                      <p className="text-lg font-bold text-text-primary">{album.stats?.total_photos || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary font-medium">Videos</p>
                      <p className="text-lg font-bold text-text-primary">{album.stats?.total_videos || 0}</p>
                    </div>
                  </div>

                  {/* Expiration Status */}
                  {album.expiration_date && (
                    <div className={`text-xs p-3 rounded-lg font-medium transition-all ${
                      new Date(album.expiration_date) < new Date()
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-green-50 text-green-900 border border-green-200'
                    }`}>
                      {new Date(album.expiration_date) < new Date()
                        ? '❌ Expired'
                        : `✓ Expires ${new Date(album.expiration_date).toLocaleDateString()}`}
                    </div>
                  )}

                  {!album.is_active && (
                    <div className="text-xs p-3 rounded-lg bg-gray-100 text-gray-900 mt-2 font-medium border border-gray-200">
                      Inactive
                    </div>
                  )}
                </RouterLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;