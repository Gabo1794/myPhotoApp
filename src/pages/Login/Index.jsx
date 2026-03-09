import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/Toast';

const Index = () => {
  const navigate = useNavigate();
  const { user, signIn, isAuthenticated } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      await signIn(email, password);
      toast.success('Sesión iniciada exitosamente');
      navigate("/");
    } catch (err) {
      const errMsg = err.message || 'Error al iniciar sesión';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-surface">
      {/* LEFT SIDE - Visual Context (50-60%) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-accent via-accent-light to-accent bg-cover bg-center items-center justify-center p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80")',
            opacity: 0.7,
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-accent-dark/60" />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Captura la magia.
          </h2>
          <p className="text-xl font-light leading-relaxed mb-6">
            Compartido, simple, hermoso.
          </p>
          <p className="text-lg text-white/90">
            Únete a miles capturando recuerdos.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form Panel (40-50%) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-surface">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Welcome to Snapshot
              </h1>
              <p className="text-text-secondary">
                Sign in to manage your events or<br />
                <span className="font-semibold">Create your free account</span>
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-surface-dark">
              <button className="pb-3 px-4 font-semibold text-accent border-b-2 border-accent">
                Sign In
              </button>
              <Link 
                to="/signup"
                className="pb-3 px-4 font-semibold text-text-secondary hover:text-text-primary transition"
              >
                Register
              </Link>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
                  placeholder="Email Address"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.414 1.414a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .8 0 1.596-.058 2.382-.172l1.789 1.789z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Iniciando...
                  </>
                ) : (
                  'Continue with Email'
                )}
              </button>
            </form>

            {/* Divider */}
            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-secondary">Or continue with</span>
              </div>
            </div> */}

            {/* Social Buttons */}
            {/* <div className="flex gap-4 mb-8">
              <button
                type="button"
                disabled={loading}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-text-primary hover:bg-gray-50 transition disabled:opacity-50"
              >
                <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                type="button"
                disabled={loading}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-text-primary hover:bg-gray-50 transition disabled:opacity-50"
              >
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.12-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.08 2.29.74 3.05.91.93-.72 2.54-1.14 3.98-.91 2.63.21 4.6 1.86 5.07 4.63-1.99 1.61-1.42 4.7.88 5.18-.84 1.44-2.04 1.88-3.24 1.24z"/>
                </svg>
              </button>
            </div> */}

            {/* Footer Links */}
            <div className="text-center space-y-3 text-sm">
              <p className="text-text-secondary">
                Forgot Password? or Need help?
              </p>
              <p className="text-text-secondary">
                Don't have an account?{' '}
                <Link 
                  to="/signup"
                  className="font-semibold text-accent hover:text-accent-dark transition"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
