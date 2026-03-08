import { useEffect, useState } from 'react';
import supabase from '../config/supabase';
import type { User } from '../domain/types';

export function useAnonymousAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAnonymousSession = async () => {
      try {
        setLoading(true);
        
        // Check if there's already a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Session already exists
          setUser({
            id: session.user.id,
            email: session.user.email || 'anonymous',
          });
          setLoading(false);
          return;
        }

        // No session, try to sign in anonymously
        const { data, error } = await supabase.auth.signInAnonymously();
        
        if (error) {
          console.error('Error signing in anonymously:', error);
          // Try one more time after a brief delay
          setTimeout(async () => {
            try {
              const { data: retryData, error: retryError } = await supabase.auth.signInAnonymously();
              if (retryError) {
                console.error('Retry failed:', retryError);
                setUser(null);
              } else if (retryData.user) {
                setUser({
                  id: retryData.user.id,
                  email: retryData.user.email || 'anonymous',
                });
              }
            } catch (e) {
              console.error('Retry exception:', e);
              setUser(null);
            } finally {
              setLoading(false);
            }
          }, 1000);
        } else if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || 'anonymous',
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing anonymous auth:', err);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAnonymousSession();
  }, []);

  return { user, loading };
}

