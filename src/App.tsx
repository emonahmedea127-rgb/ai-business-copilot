/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth/context';
import { NavigationProvider, useNavigation } from './lib/navigation';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';
import { PricingPage } from './components/pricing/PricingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { ProductsView } from './components/dashboard/ProductsView';
import { OrdersView } from './components/dashboard/OrdersView';
import { CustomersView } from './components/dashboard/CustomersView';
import { ForecastingView } from './components/dashboard/ForecastingView';
import { AIAssistantView } from './components/dashboard/AIAssistantView';
import { ReportsView } from './components/dashboard/ReportsView';
import { IntegrationsView } from './components/dashboard/IntegrationsView';
import { SettingsView } from './components/dashboard/SettingsView';
import { Sparkles, Loader2 } from 'lucide-react';

const AppRoutes: React.FC = () => {
  const { currentPath, navigate } = useNavigation();
  const { isAuthenticated, isLoading } = useAuth();

  const isDashboardRoute = currentPath.startsWith('/dashboard');

  // Handle protected route redirections
  useEffect(() => {
    if (!isLoading) {
      if (isDashboardRoute && !isAuthenticated) {
        navigate('/login');
      } else if ((currentPath === '/login' || currentPath === '/signup') && isAuthenticated) {
        navigate('/dashboard/overview');
      }
    }
  }, [isLoading, isAuthenticated, isDashboardRoute, currentPath, navigate]);

  // Loading state during initial session check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center text-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">AI Business Copilot</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>Verifying secure workspace session...</span>
        </div>
      </div>
    );
  }

  // Public Landing Page
  if (currentPath === '/' || currentPath === '') {
    return <LandingPage />;
  }

  // Pricing Page
  if (currentPath === '/pricing') {
    return <PricingPage />;
  }

  // Auth Pages
  if (currentPath === '/login') {
    return <LoginPage />;
  }
  if (currentPath === '/signup') {
    return <SignupPage />;
  }
  if (currentPath === '/forgot-password') {
    return <ForgotPasswordPage />;
  }
  if (currentPath === '/reset-password') {
    return <ResetPasswordPage />;
  }
  if (currentPath === '/verify-email') {
    return <VerifyEmailPage />;
  }

  // Unauthenticated fallback guard for dashboard routes
  if (isDashboardRoute && !isAuthenticated) {
    return <LoginPage />;
  }

  // Dashboard Routes
  const renderDashboardView = () => {
    switch (currentPath) {
      case '/dashboard':
      case '/dashboard/overview':
        return <OverviewView />;
      case '/dashboard/analytics':
        return <AnalyticsView />;
      case '/dashboard/forecasting':
        return <ForecastingView />;
      case '/dashboard/products':
        return <ProductsView />;
      case '/dashboard/orders':
        return <OrdersView />;
      case '/dashboard/customers':
        return <CustomersView />;
      case '/dashboard/ai-assistant':
        return <AIAssistantView />;
      case '/dashboard/reports':
        return <ReportsView />;
      case '/dashboard/integrations':
        return <IntegrationsView />;
      case '/dashboard/settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <DashboardLayout activePath={currentPath}>
      {renderDashboardView()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppRoutes />
      </NavigationProvider>
    </AuthProvider>
  );
}
