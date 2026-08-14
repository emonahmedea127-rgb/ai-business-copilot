import {
  User,
  Store,
  Product,
  Order,
  Customer,
  AnalyticsData,
  AIMessage,
  BusinessReport,
  IntegrationConfig,
  SubscriptionPlan
} from '../../types';
import { db } from '../db';
import { processAICopilotQuery } from '../ai/copilotEngine';
import { generateExecutiveReport } from '../reports/generator';

class ApiClient {
  private tokenKey = 'biz_copilot_token';

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string | null) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private async safeFetch<T>(
    url: string,
    options?: RequestInit,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}`, 'x-session-id': token } : {}),
      ...((options?.headers as Record<string, string>) || {}),
    };

    // Create an abort controller with a 4-second timeout to prevent indefinite hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        credentials: 'include',
        signal: options?.signal || controller.signal,
        ...options,
        headers,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMessage = `HTTP error ${res.status}`;
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errorMessage = errData.error;
          }
        } catch {
          // ignore
        }

        // If 401 unauthenticated, clear token if expired
        if (res.status === 401) {
          this.setToken(null);
        }

        const error = new Error(errorMessage) as Error & { status?: number };
        error.status = res.status;
        throw error;
      }

      const data = await res.json();
      return data as T;
    } catch (err) {
      clearTimeout(timeoutId);
      if (fallback) {
        return await fallback();
      }
      throw err;
    }
  }

  // Health
  async getHealth() {
    return this.safeFetch<{ status: string; version: string }>('/api/health', undefined, async () => ({
      status: 'healthy (local mode)',
      version: '2.0.0'
    }));
  }

  // Auth
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await this.safeFetch<{ authenticated: boolean; user: User; token?: string }>(
        '/api/auth/me'
      );
      if (res && res.authenticated && res.user) {
        if (res.token) this.setToken(res.token);
        return res.user;
      }
      return null;
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const res = await this.safeFetch<{ success: boolean; user: User; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
    );
    if (res.token) {
      this.setToken(res.token);
    }
    return res.user;
  }

  async loginWithFirebase(firebaseUser: {
    uid: string;
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
  }): Promise<User> {
    const res = await this.safeFetch<{ success: boolean; user: User; token: string }>(
      '/api/auth/firebase',
      {
        method: 'POST',
        body: JSON.stringify(firebaseUser)
      }
    );
    if (res.token) {
      this.setToken(res.token);
    }
    return res.user;
  }

  async signup(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    storeName?: string;
  }): Promise<{ user: User; requiresVerification?: boolean; verificationToken?: string }> {
    const res = await this.safeFetch<{
      success: boolean;
      user: User;
      token?: string;
      requiresVerification?: boolean;
      verificationToken?: string;
    }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
    if (res.token) {
      this.setToken(res.token);
    }
    return {
      user: res.user,
      requiresVerification: res.requiresVerification,
      verificationToken: res.verificationToken,
    };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; previewResetToken?: string }> {
    return this.safeFetch<{ success: boolean; message: string; previewResetToken?: string }>(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email })
      }
    );
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    return this.safeFetch<{ valid: boolean; email?: string }>(
      '/api/auth/verify-reset-token',
      {
        method: 'POST',
        body: JSON.stringify({ token })
      }
    );
  }

  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.safeFetch<{ success: boolean; message: string }>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string; user?: User }> {
    return this.safeFetch<{ success: boolean; message: string; user?: User }>(
      '/api/auth/verify-email',
      {
        method: 'POST',
        body: JSON.stringify({ token })
      }
    );
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string; verificationToken?: string }> {
    return this.safeFetch<{ success: boolean; message: string; verificationToken?: string }>(
      '/api/auth/resend-verification',
      {
        method: 'POST',
        body: JSON.stringify({ email })
      }
    );
  }

  async logout(): Promise<void> {
    try {
      await this.safeFetch<{ success: boolean }>('/api/auth/logout', {
        method: 'POST'
      });
    } finally {
      this.setToken(null);
    }
  }

  // Stores
  async getStores(): Promise<{ stores: Store[]; activeStoreId: string }> {
    return this.safeFetch<{ stores: Store[]; activeStoreId: string }>('/api/stores', undefined, async () => {
      const stores = await db.getStores();
      const activeStoreId = await db.getActiveStoreId();
      return { stores, activeStoreId };
    });
  }

  async selectStore(storeId: string): Promise<void> {
    await this.safeFetch('/api/stores/select', {
      method: 'POST',
      body: JSON.stringify({ storeId })
    }, async () => {
      await db.setActiveStoreId(storeId);
      return { success: true };
    });
  }

  async createStore(data: { name: string; platform: string; currency?: string; url?: string }): Promise<Store> {
    const res = await this.safeFetch<{ success: boolean; store: Store }>('/api/stores', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.store;
  }

  // Analytics
  async getAnalytics(timeframe = 'last_30_days'): Promise<AnalyticsData> {
    return this.safeFetch<AnalyticsData>(`/api/analytics?timeframe=${timeframe}`, undefined, async () => {
      return await db.getAnalytics(timeframe);
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.safeFetch<{ products: Product[] }>('/api/products', undefined, async () => ({
      products: await db.getProducts()
    })).then(r => r.products);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.safeFetch<{ orders: Order[] }>('/api/orders', undefined, async () => ({
      orders: await db.getOrders()
    })).then(r => r.orders);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return this.safeFetch<{ customers: Customer[] }>('/api/customers', undefined, async () => ({
      customers: await db.getCustomers()
    })).then(r => r.customers);
  }

  // AI Chat & Copilot
  async getAIMessages(): Promise<AIMessage[]> {
    return this.safeFetch<{ messages: AIMessage[] }>('/api/ai/messages', undefined, async () => ({
      messages: await db.getAIMessages()
    })).then(r => r.messages);
  }

  async sendAIChat(prompt: string): Promise<AIMessage> {
    return this.safeFetch<{ response: AIMessage }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    }, async () => {
      await db.addAIMessage({ sender: 'user', content: prompt });
      const assistantMsg = await processAICopilotQuery(prompt);
      await db.addAIMessage({
        sender: 'assistant',
        content: assistantMsg.content,
        structuredData: assistantMsg.structuredData,
        suggestedFollowups: assistantMsg.suggestedFollowups
      });
      return { response: assistantMsg };
    }).then(r => r.response);
  }

  // Reports
  async getReports(): Promise<BusinessReport[]> {
    return this.safeFetch<{ reports: BusinessReport[] }>('/api/reports', undefined, async () => ({
      reports: await db.getReports()
    })).then(r => r.reports);
  }

  async generateReport(title?: string): Promise<BusinessReport> {
    return this.safeFetch<{ report: BusinessReport }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify({ title })
    }, async () => ({
      report: await generateExecutiveReport(title)
    })).then(r => r.report);
  }

  // Integrations
  async getIntegrations(): Promise<IntegrationConfig[]> {
    return this.safeFetch<{ integrations: IntegrationConfig[] }>('/api/integrations', undefined, async () => ({
      integrations: await db.getIntegrations()
    })).then(r => r.integrations);
  }

  // Billing
  async getBilling(): Promise<{ plans: SubscriptionPlan[]; currentPlanId: string; status: string; renewsAt: string }> {
    return this.safeFetch<{ plans: SubscriptionPlan[]; currentPlanId: string; status: string; renewsAt: string }>(
      '/api/billing',
      undefined,
      async () => ({
        plans: await db.getPlans(),
        currentPlanId: await db.getCurrentPlanId(),
        status: 'active',
        renewsAt: '2026-09-15T00:00:00Z',
      })
    );
  }
}

export const api = new ApiClient();
