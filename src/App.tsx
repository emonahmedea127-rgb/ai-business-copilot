/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './lib/auth/context';
import { NavigationProvider, useNavigation } from './lib/navigation';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
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

const AppRoutes: React.FC = () => {
  const { currentPath } = useNavigation();

  // Public Landing Page
  if (currentPath === '/' || currentPath === '') {
    return <LandingPage />;
  }

  // Auth & Pricing Pages
  if (currentPath === '/login') {
    return <LoginPage />;
  }
  if (currentPath === '/signup') {
    return <SignupPage />;
  }
  if (currentPath === '/pricing') {
    return <PricingPage />;
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
