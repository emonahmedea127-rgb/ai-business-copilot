import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | '/'
  | '/login'
  | '/signup'
  | '/forgot-password'
  | '/reset-password'
  | '/verify-email'
  | '/pricing'
  | '/dashboard'
  | '/dashboard/overview'
  | '/dashboard/analytics'
  | '/dashboard/products'
  | '/dashboard/orders'
  | '/dashboard/customers'
  | '/dashboard/integrations'
  | '/dashboard/ai-assistant'
  | '/dashboard/reports'
  | '/dashboard/settings';

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  searchParams: URLSearchParams;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      const url = new URL(window.location.href);
      setCurrentPath(url.pathname);
      setSearchParams(url.searchParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPath, navigate, searchParams }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
