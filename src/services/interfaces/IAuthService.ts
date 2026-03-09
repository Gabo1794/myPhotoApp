import type { User, CreateUserInput } from '../../domain/types';

export interface IAuthService {
  signUp(input: CreateUserInput): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getUser(): Promise<User | null>;
  getSession(): Promise<any>; // Supabase session
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
