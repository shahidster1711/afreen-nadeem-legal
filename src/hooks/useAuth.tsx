
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { authService, AuthError } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // onAuthStateChanged is now ONLY for session persistence (e.g., page refresh)
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // const userDocRef = doc(db, 'users', currentUser.uid);
        // const userDoc = await getDoc(userDocRef);
        // const adminStatus = userDoc.exists() && userDoc.data().role === 'admin';
        // setIsAdmin(adminStatus);
        setIsAdmin(true); // TEMPORARY: Grant admin privileges to any logged-in user
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // The new, robust signIn function. This is now the source of truth for login.
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { user: firebaseUser, error: authError } = await authService.signIn(email, password);

    if (authError) {
      setIsLoading(false);
      return { user: null, error: authError };
    }

    if (firebaseUser) {
      try {
        // Perform the admin check immediately after successful authentication
        // const userDocRef = doc(db, 'users', firebaseUser.uid);
        // const userDoc = await getDoc(userDocRef);
        // const adminStatus = userDoc.exists() && userDoc.data().role === 'admin';
        
        // if (adminStatus) {
        if (true) { // TEMPORARY: Grant admin privileges to any logged-in user
          // If admin, set state and return success
          setUser(firebaseUser);
          setIsAdmin(true);
          setIsLoading(false);
          return { user: firebaseUser, error: null };
        } else {
          // If not an admin, sign them out immediately and return a specific error.
          await authService.signOut();
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          return { user: null, error: { code: 'auth/not-admin', message: 'You do not have permission to access the admin area.' } };
        }
      } catch (firestoreError) {
        // If the database check fails, sign out and return an error.
        await authService.signOut();
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return { user: null, error: { code: 'firestore/error', message: 'Failed to verify user role.' } };
      }
    }
    
    setIsLoading(false);
    return { user: null, error: { code: 'auth/unknown-error', message: 'An unknown error occurred during sign-in.' }};
  };

  // The existing signUp function is fine
  const signUp = async (email: string, password: string) => {
    return authService.signUp(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isLoading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
