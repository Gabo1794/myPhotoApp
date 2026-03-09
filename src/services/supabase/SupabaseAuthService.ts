import type { IAuthService } from '../interfaces/IAuthService';
import type { User, CreateUserInput } from '../../domain/types';
import supabase from '../../config/supabase';

export class SupabaseAuthService implements IAuthService {
  async signUp(input: CreateUserInput): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    // Create user profile in public.users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        subscription_status: 'free',
        plan_type: 'starter',
        storage_limit_mb: 1024,
      });

    if (profileError) throw profileError;

    return {
      id: data.user.id,
      email: data.user.email,
      created_at: new Date().toISOString(),
      subscription_status: 'free',
      plan_type: 'starter',
      storage_limit_mb: 1024,
    };
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to sign in');

    const user = await this.getUser();
    if (!user) throw new Error('Failed to fetch user profile');

    return user;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (error) return null;

    return {
      id: profile.id,
      email: data.user.email,
      created_at: profile.created_at,
      subscription_status: profile.subscription_status,
      plan_type: profile.plan_type,
      storage_limit_mb: profile.storage_limit_mb,
    };
  }

  async getSession(): Promise<any> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const user = await this.getUser();
        callback(user);
      } else {
        callback(null);
      }
    });

    return () => data.subscription.unsubscribe();
  }
}
