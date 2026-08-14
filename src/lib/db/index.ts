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
import {
  INITIAL_USER,
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_ANALYTICS,
  INITIAL_AI_MESSAGES,
  INITIAL_REPORTS,
  INITIAL_INTEGRATIONS,
  SUBSCRIPTION_PLANS
} from './mockData';

class MockDatabase {
  private readonly STORAGE_PREFIX = 'ai_biz_copilot_';

  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const data = localStorage.getItem(this.STORAGE_PREFIX + key);
      return data ? (JSON.parse(data) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // User
  async getUser(): Promise<User> {
    return this.getItem<User>('user', INITIAL_USER);
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    const current = await this.getUser();
    const updated = { ...current, ...updates };
    this.setItem('user', updated);
    return updated;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return this.getItem<Store[]>('stores', INITIAL_STORES);
  }

  async getActiveStoreId(): Promise<string> {
    return this.getItem<string>('active_store_id', INITIAL_STORES[0].id);
  }

  async setActiveStoreId(storeId: string): Promise<void> {
    this.setItem('active_store_id', storeId);
  }

  async addStore(store: Omit<Store, 'id'>): Promise<Store> {
    const stores = await this.getStores();
    const newStore: Store = {
      ...store,
      id: `store_${Date.now()}`
    };
    const updated = [...stores, newStore];
    this.setItem('stores', updated);
    return newStore;
  }

  // Analytics
  async getAnalytics(timeframe = 'last_30_days'): Promise<AnalyticsData> {
    const data = this.getItem<AnalyticsData>('analytics', INITIAL_ANALYTICS);
    return { ...data, timeframe };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.getItem<Product[]>('products', INITIAL_PRODUCTS);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`
    };
    const updated = [newProduct, ...products];
    this.setItem('products', updated);
    this.recomputeAnalytics();
    return newProduct;
  }

  async addBatchProducts(newProds: Omit<Product, 'id'>[]): Promise<Product[]> {
    const products = await this.getProducts();
    const created: Product[] = newProds.map((p, idx) => ({
      ...p,
      id: `prod_${Date.now()}_${idx}`
    }));
    const updated = [...created, ...products];
    this.setItem('products', updated);
    this.recomputeAnalytics();
    return created;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    this.setItem('products', products);
    this.recomputeAnalytics();
    return products[index];
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.getItem<Order[]>('orders', INITIAL_ORDERS);
  }

  async addOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const orders = await this.getOrders();
    const newOrder: Order = {
      ...order,
      id: `ord_${Date.now()}`
    };
    const updated = [newOrder, ...orders];
    this.setItem('orders', updated);
    this.recomputeAnalytics();
    return newOrder;
  }

  async addBatchOrders(newOrds: Omit<Order, 'id'>[]): Promise<Order[]> {
    const orders = await this.getOrders();
    const created: Order[] = newOrds.map((o, idx) => ({
      ...o,
      id: `ord_${Date.now()}_${idx}`
    }));
    const updated = [...created, ...orders];
    this.setItem('orders', updated);
    this.recomputeAnalytics();
    return created;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return this.getItem<Customer[]>('customers', INITIAL_CUSTOMERS);
  }

  // AI Messages
  async getAIMessages(): Promise<AIMessage[]> {
    return this.getItem<AIMessage[]>('ai_messages', INITIAL_AI_MESSAGES);
  }

  async addAIMessage(message: Omit<AIMessage, 'id' | 'timestamp'>): Promise<AIMessage> {
    const messages = await this.getAIMessages();
    const newMsg: AIMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [...messages, newMsg];
    this.setItem('ai_messages', updated);
    return newMsg;
  }

  async clearAIMessages(): Promise<void> {
    this.setItem('ai_messages', INITIAL_AI_MESSAGES);
  }

  // Reports
  async getReports(): Promise<BusinessReport[]> {
    return this.getItem<BusinessReport[]>('reports', INITIAL_REPORTS);
  }

  async addReport(report: Omit<BusinessReport, 'id' | 'createdAt'>): Promise<BusinessReport> {
    const reports = await this.getReports();
    const newReport: BusinessReport = {
      ...report,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    this.setItem('reports', updated);
    return newReport;
  }

  // Integrations
  async getIntegrations(): Promise<IntegrationConfig[]> {
    return this.getItem<IntegrationConfig[]>('integrations', INITIAL_INTEGRATIONS);
  }

  async updateIntegration(id: string, updates: Partial<IntegrationConfig>): Promise<IntegrationConfig | null> {
    const integrations = await this.getIntegrations();
    const index = integrations.findIndex(i => i.id === id);
    if (index === -1) return null;
    integrations[index] = { ...integrations[index], ...updates };
    this.setItem('integrations', integrations);
    return integrations[index];
  }

  // Subscription Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    return SUBSCRIPTION_PLANS;
  }

  async getCurrentPlanId(): Promise<string> {
    return this.getItem<string>('current_plan_id', 'pro');
  }

  async setCurrentPlanId(planId: string): Promise<void> {
    this.setItem('current_plan_id', planId);
  }

  // Helper to recompute metrics when new items or CSV imported
  private async recomputeAnalytics(): Promise<void> {
    try {
      const products = await this.getProducts();
      const orders = await this.getOrders();
      const totalRevenue = products.reduce((acc, p) => acc + p.revenue, 0);
      const totalCost = products.reduce((acc, p) => acc + (p.cost * p.unitsSold), 0);
      const grossProfit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;
      const aov = orders.length > 0 ? Number((totalRevenue / orders.length).toFixed(2)) : 0;

      const current = await this.getAnalytics();
      const updated: AnalyticsData = {
        ...current,
        metrics: {
          ...current.metrics,
          revenue: totalRevenue || current.metrics.revenue,
          orders: orders.length || current.metrics.orders,
          grossProfit: grossProfit || current.metrics.grossProfit,
          profitMargin: profitMargin || current.metrics.profitMargin,
          aov: aov || current.metrics.aov,
        }
      };
      this.setItem('analytics', updated);
    } catch {
      // safe fallback
    }
  }

  // Reset to initial demo state
  async resetAllToDemo(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + 'user');
      localStorage.removeItem(this.STORAGE_PREFIX + 'stores');
      localStorage.removeItem(this.STORAGE_PREFIX + 'products');
      localStorage.removeItem(this.STORAGE_PREFIX + 'orders');
      localStorage.removeItem(this.STORAGE_PREFIX + 'customers');
      localStorage.removeItem(this.STORAGE_PREFIX + 'analytics');
      localStorage.removeItem(this.STORAGE_PREFIX + 'ai_messages');
      localStorage.removeItem(this.STORAGE_PREFIX + 'reports');
      localStorage.removeItem(this.STORAGE_PREFIX + 'integrations');
      localStorage.removeItem(this.STORAGE_PREFIX + 'current_plan_id');
      localStorage.removeItem(this.STORAGE_PREFIX + 'active_store_id');
    } catch (e) {
      console.warn(e);
    }
  }
}

export const db = new MockDatabase();
