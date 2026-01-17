
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError as FirebaseAuthError // Renaming to avoid naming conflicts
} from 'firebase/auth';
import { auth } from '../firebase';

// Define a clear and reusable error structure
export interface AuthError {
  code: string;
  message: string;
}

// The service now returns a consistent object shape for both success and failure
interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

class AuthService {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  // Updated signIn to return the AuthResult object
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      const authError = error as FirebaseAuthError;
      console.error('Error signing in:', authError);
      return { user: null, error: { code: authError.code, message: authError.message } };
    }
  }

  // Updated signUp to return the AuthResult object
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      const authError = error as FirebaseAuthError;
      console.error('Error signing up:', authError);
      return { user: null, error: { code: authError.code, message: authError.message } };
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}

export const authService = new AuthService(auth);
