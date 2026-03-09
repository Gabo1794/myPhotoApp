import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../Toast';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (err) {
      toast.error('Error al cerrar sesión');
      console.error('Error al cerrar sesión:', err);
    } finally {
      setLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-surface-light border-b border-surface-dark bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">📷</span>
            </div>
            <span className="font-bold text-lg text-text-primary hidden sm:inline">
              PhotoAlbum
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-text-secondary hover:text-accent transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              to="/album" 
              className="text-text-secondary hover:text-accent transition-colors font-medium"
            >
              Álbumes
            </Link>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-text-secondary hidden sm:inline">
                {user.email}
              </span>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-dark transition-colors"
            >
              <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saliendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Salir
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-surface-dark bg-surface-light">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-dark hover:text-accent transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              to="/album" 
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-dark hover:text-accent transition-colors font-medium"
            >
              Álbumes
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saliendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Cerrar Sesión
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Index;