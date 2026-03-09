import { useContext, useEffect, useState } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import type { User } from '../domain/types';

export function useAuth() {
  const services = useContext(ServiceContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = services.auth.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [services.auth]);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      await services.auth.signUp({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign up failed'));
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const user = await services.auth.signIn(email, password);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign in failed'));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await services.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'));
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
