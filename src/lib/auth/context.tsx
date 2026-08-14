import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../api/client';
import { db } from '../db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUserRole: (role: UserRole) => Promise<void>;
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
        console.error('Failed to load user auth:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const u = await api.login(email, password);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const u = await api.signup(name, email);
      setUser(u);
    } finally {
      setIsLoading(false);
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
