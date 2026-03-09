import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PublicNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extraer el ID del evento de la URL
  const eventId = location.pathname.includes('/event/') 
    ? location.pathname.split('/event/')[1] 
    : null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-text-primary">Evento</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {eventId && (
              <>
                <a
                  href={`/album/event/${eventId}`}
                  className="text-text-primary hover:text-accent transition-colors font-medium"
                >
                  Álbum
                </a>
                <a
                  href={`/my-photos/event/${eventId}`}
                  className="text-text-primary hover:text-accent transition-colors font-medium"
                >
                  Mis Fotos
                </a>
              </>
            )}

            {/* Sign In Button */}
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
