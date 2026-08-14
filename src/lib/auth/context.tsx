import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../api/client';
import { db } from '../db';

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
    async function loadUser() {
      try {
        const u = await api.getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error('[Auth] Failed to load session:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
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
