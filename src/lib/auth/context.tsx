import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../api/client';
import { db } from '../db';
import { auth as firebaseAuth, signInWithGoogle, logOutUser, onAuthStateChanged, syncUserProfile } from '../firebase/config';
import { FirestoreSyncService } from '../firebase/firestoreService';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  storeName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (input: SignupInput) => Promise<{ user: User; requiresVerification?: boolean; verificationToken?: string }>;
  logout: () => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: Ensure isLoading is never stuck true for more than 1.8 seconds
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 1800);

    async function loadUser() {
      try {
        const u = await api.getCurrentUser();
        if (mounted && u) {
          setUser(u);
        }
      } catch (err) {
        console.error('[Auth] Failed to load session:', err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    }

    loadUser();

    // Listen to Firebase Auth state for automatic session sync
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser && fbUser.email && mounted) {
        try {
          const syncedUser = await api.loginWithFirebase({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          });
          if (mounted && syncedUser) {
            setUser(syncedUser);
          }
        } catch (err) {
          console.warn('[Firebase Auth Auto-Sync]', err);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const u = await api.login(email, password);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser && fbUser.email) {
        // Sync profile into Firestore
        await syncUserProfile(fbUser);

        // Authenticate with server API
        const authenticatedUser = await api.loginWithFirebase({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        });

        setUser(authenticatedUser);

        // Log initial activity in Firestore
        await FirestoreSyncService.logActivity(fbUser.uid, 'user_login', 'Signed in with Google Firebase Auth');
      }
    } catch (err) {
      console.error('[Firebase Auth Error]:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (input: SignupInput) => {
    setIsLoading(true);
    try {
      const result = await api.signup(input);
      if (!result.requiresVerification) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const u = await api.getCurrentUser();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      try {
        await logOutUser();
      } catch {
        // ignore
      }
      await api.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserRole = async (role: UserRole) => {
    if (!user) return;
    const updated = await db.updateUser({ role });
    setUser(updated);
    if (user.id) {
      await FirestoreSyncService.updateUserProfile(user.id, { role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle: loginWithGoogleAuth,
        signup,
        logout,
        switchUserRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
