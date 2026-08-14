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
  private async safeFetch<T>(url: string, options?: RequestInit, fallback?: () => Promise<T>): Promise<T> {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data as T;
    } catch {
      if (fallback) {
        return await fallback();
      }
      throw new Error(`Failed to fetch from ${url}`);
    }
  }

  // Health
  async getHealth() {
    return this.safeFetch<{ status: string; version: string }>('/api/health', undefined, async () => ({
      status: 'healthy (local mode)',
      version: '1.0.0'
    }));
  }

  // Auth
  async getCurrentUser(): Promise<User> {
    return this.safeFetch<{ user: User }>('/api/auth/me', undefined, async () => ({
      user: await db.getUser()
    })).then(r => r.user);
  }

  async login(email: string, password?: string): Promise<User> {
    return this.safeFetch<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, async () => {
      const user = await db.getUser();
      if (email) {
        user.email = email;
        await db.updateUser({ email });
      }
      return { user };
    }).then(r => r.user);
  }

  async signup(name: string, email: string): Promise<User> {
    return this.safeFetch<{ user: User }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email })
    }, async () => {
      const user = await db.updateUser({ name, email });
      return { user };
    }).then(r => r.user);
  }

  async logout(): Promise<void> {
    await this.safeFetch<{ success: boolean }>('/api/auth/logout', {
      method: 'POST'
    }, async () => ({ success: true }));
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

  // AI
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
    return await db.getIntegrations();
  }

  // Billing
  async getBilling(): Promise<{ plans: SubscriptionPlan[]; currentPlanId: string }> {
    return this.safeFetch<{ plans: SubscriptionPlan[]; currentPlanId: string }>('/api/billing', undefined, async () => ({
      plans: await db.getPlans(),
      currentPlanId: await db.getCurrentPlanId()
    }));
  }
}

export const api = new ApiClient();
