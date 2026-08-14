import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_ANALYTICS,
  INITIAL_AI_MESSAGES,
  INITIAL_REPORTS,
  INITIAL_INTEGRATIONS,
  SUBSCRIPTION_PLANS
} from '../db/mockData';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'owner' | 'admin' | 'analyst' | 'viewer';
  avatarUrl?: string;
  isVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbPasswordResetToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbEmailVerificationToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbStore extends Store {
  userId: string;
}

export interface DbSubscription {
  id: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: string;
  currentPeriodEnd?: string;
  planId: string;
}

class ServerDatabase {
  private users: Map<string, DbUser> = new Map();
  private sessions: Map<string, DbSession> = new Map();
  private passwordResetTokens: Map<string, DbPasswordResetToken> = new Map();
  private emailVerificationTokens: Map<string, DbEmailVerificationToken> = new Map();
  private stores: Map<string, DbStore[]> = new Map();
  private activeStoreIds: Map<string, string> = new Map();
  private subscriptions: Map<string, DbSubscription> = new Map();
  private products: Map<string, Product[]> = new Map();
  private orders: Map<string, Order[]> = new Map();
  private customers: Map<string, Customer[]> = new Map();
  private analytics: Map<string, AnalyticsData> = new Map();
  private aiMessages: Map<string, AIMessage[]> = new Map();
  private reports: Map<string, BusinessReport[]> = new Map();
  private integrations: Map<string, IntegrationConfig[]> = new Map();

  private initialized = false;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    if (this.initialized) return;

    // Hash "demopass123" for demo accounts
    const demoPasswordHash = bcrypt.hashSync('demopass123', 10);

    // 1. Primary Demo User: Alex Vance (Store Owner)
    const alexUser: DbUser = {
      id: 'usr_alex_vance_01',
      name: 'Alex Vance',
      email: 'alex@aurastore.com',
      passwordHash: demoPasswordHash,
      role: 'owner',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: true,
      emailVerifiedAt: '2026-01-15T08:00:00Z',
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-08-14T00:00:00Z',
    };
    this.users.set(alexUser.id, alexUser);
    this.initUserData(alexUser.id, 'Aura Athletics', alexUser.name);

    // 2. Secondary Demo User: Elena Rostova (Growth Analyst)
    const analystUser: DbUser = {
      id: 'usr_analyst_02',
      name: 'Elena Rostova',
      email: 'analyst@nordic.com',
      passwordHash: demoPasswordHash,
      role: 'analyst',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      isVerified: true,
      emailVerifiedAt: '2026-02-10T10:00:00Z',
      createdAt: '2026-02-10T10:00:00Z',
      updatedAt: '2026-08-14T00:00:00Z',
    };
    this.users.set(analystUser.id, analystUser);
    this.initUserData(analystUser.id, 'Nordic Minimal', analystUser.name);

    this.initialized = true;
  }

  public initUserData(userId: string, storeName: string, userName: string) {
    // 1. Stores
    const userStores: DbStore[] = [
      {
        ...INITIAL_STORES[0],
        id: `store_${userId}_1`,
        userId,
        name: storeName || 'My Ecommerce Store',
      },
      {
        ...INITIAL_STORES[1],
        id: `store_${userId}_2`,
        userId,
      }
    ];
    this.stores.set(userId, userStores);
    this.activeStoreIds.set(userId, userStores[0].id);

    // 2. Subscription
    this.subscriptions.set(userId, {
      id: `sub_${userId}`,
      userId,
      status: 'active',
      planId: 'pro',
      currentPeriodEnd: '2026-09-15T00:00:00Z',
    });

    // 3. Products
    this.products.set(userId, JSON.parse(JSON.stringify(INITIAL_PRODUCTS)));

    // 4. Orders
    this.orders.set(userId, JSON.parse(JSON.stringify(INITIAL_ORDERS)));

    // 5. Customers
    this.customers.set(userId, JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)));

    // 6. Analytics
    this.analytics.set(userId, JSON.parse(JSON.stringify(INITIAL_ANALYTICS)));

    // 7. AI Messages
    this.aiMessages.set(userId, [
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        content: `Welcome to AI Business Copilot, ${userName}! I have loaded your workspace analytics and margin metrics. You can ask me to diagnose low-margin SKUs, audit return rates, or forecast next month's cash flow.`,
        timestamp: new Date().toISOString(),
        suggestedFollowups: [
          'Which products have negative margins?',
          'Forecast sales for next 30 days',
          'Audit ad spend efficiency on Shopify'
        ]
      }
    ]);

    // 8. Reports
    this.reports.set(userId, JSON.parse(JSON.stringify(INITIAL_REPORTS)));

    // 9. Integrations
    this.integrations.set(userId, JSON.parse(JSON.stringify(INITIAL_INTEGRATIONS)));
  }

  // --- USER OPERATIONS ---

  async findUserByEmail(email: string): Promise<DbUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return user;
      }
    }
    return null;
  }

  async getUserById(id: string): Promise<DbUser | null> {
    return this.users.get(id) || null;
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'owner' | 'admin' | 'analyst' | 'viewer';
    storeName?: string;
    isVerified?: boolean;
  }): Promise<DbUser> {
    const id = `usr_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const isVerified = data.isVerified ?? false;
    const newUser: DbUser = {
      id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role || 'owner',
      isVerified,
      emailVerifiedAt: isVerified ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(newUser.id, newUser);
    this.initUserData(newUser.id, data.storeName || `${data.name}'s Store`, data.name);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<Omit<DbUser, 'id' | 'passwordHash'>>): Promise<DbUser | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updated: DbUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date().toISOString();
    this.users.set(userId, user);
    return true;
  }

  // --- PASSWORD RESET TOKEN OPERATIONS ---

  async createPasswordResetToken(email: string): Promise<{ token: string; user: DbUser } | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    // Delete any existing reset tokens for this user
    for (const [token, data] of this.passwordResetTokens.entries()) {
      if (data.userId === user.id) {
        this.passwordResetTokens.delete(token);
      }
    }

    // 1 hour expiration for password reset
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const resetData: DbPasswordResetToken = {
      token,
      userId: user.id,
      email: user.email,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    this.passwordResetTokens.set(token, resetData);
    return { token, user };
  }

  async getPasswordResetToken(token: string): Promise<DbPasswordResetToken | null> {
    const resetData = this.passwordResetTokens.get(token);
    if (!resetData) return null;

    // Check expiry
    if (new Date(resetData.expiresAt) < new Date()) {
      this.passwordResetTokens.delete(token);
      return null;
    }

    return resetData;
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    this.passwordResetTokens.delete(token);
  }

  // --- EMAIL VERIFICATION TOKEN OPERATIONS ---

  async createEmailVerificationToken(userId: string, email: string): Promise<string> {
    // Delete existing verification tokens for this user
    for (const [tok, data] of this.emailVerificationTokens.entries()) {
      if (data.userId === userId) {
        this.emailVerificationTokens.delete(tok);
      }
    }

    // 24 hour expiration for email verification
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const verificationData: DbEmailVerificationToken = {
      token,
      userId,
      email,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    this.emailVerificationTokens.set(token, verificationData);
    return token;
  }

  async getEmailVerificationToken(token: string): Promise<DbEmailVerificationToken | null> {
    const data = this.emailVerificationTokens.get(token);
    if (!data) return null;

    if (new Date(data.expiresAt) < new Date()) {
      this.emailVerificationTokens.delete(token);
      return null;
    }

    return data;
  }

  async deleteEmailVerificationToken(token: string): Promise<void> {
    this.emailVerificationTokens.delete(token);
  }

  async verifyUserEmail(token: string): Promise<{ success: boolean; user?: DbUser; error?: string }> {
    const tokenData = await this.getEmailVerificationToken(token);
    if (!tokenData) {
      return { success: false, error: 'Invalid or expired verification link. Please request a new one.' };
    }

    const user = this.users.get(tokenData.userId);
    if (!user) {
      this.emailVerificationTokens.delete(token);
      return { success: false, error: 'User account not found.' };
    }

    user.isVerified = true;
    user.emailVerifiedAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    this.users.set(user.id, user);

    this.emailVerificationTokens.delete(token);
    return { success: true, user };
  }

  async getVerificationTokenByUserId(userId: string): Promise<string | null> {
    for (const [token, data] of this.emailVerificationTokens.entries()) {
      if (data.userId === userId && new Date(data.expiresAt) >= new Date()) {
        return token;
      }
    }
    return null;
  }

  // --- SESSION OPERATIONS ---

  async createSession(userId: string, token: string, expiresAt: Date): Promise<DbSession> {
    const session: DbSession = {
      id: `sess_${crypto.randomUUID()}`,
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(token, session);
    return session;
  }

  async getSession(token: string): Promise<DbSession | null> {
    return this.sessions.get(token) || null;
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(token);
      }
    }
  }

  // --- STORES (USER ISOLATED) ---

  async getStores(userId: string): Promise<DbStore[]> {
    return this.stores.get(userId) || [];
  }

  async getActiveStoreId(userId: string): Promise<string> {
    const stores = await this.getStores(userId);
    return this.activeStoreIds.get(userId) || (stores[0] ? stores[0].id : '');
  }

  async setActiveStoreId(userId: string, storeId: string): Promise<void> {
    this.activeStoreIds.set(userId, storeId);
  }

  async addStore(userId: string, store: Omit<Store, 'id'>): Promise<DbStore> {
    const stores = await this.getStores(userId);
    const newStore: DbStore = {
      ...store,
      id: `store_${userId}_${Date.now()}`,
      userId,
    };
    stores.push(newStore);
    this.stores.set(userId, stores);
    return newStore;
  }

  // --- SUBSCRIPTIONS (STRIPE COMPATIBLE) ---

  async getSubscription(userId: string): Promise<DbSubscription | null> {
    return this.subscriptions.get(userId) || null;
  }

  async updateSubscription(userId: string, updates: Partial<DbSubscription>): Promise<DbSubscription> {
    const current = this.subscriptions.get(userId) || {
      id: `sub_${userId}`,
      userId,
      status: 'active',
      planId: 'free',
    };
    const updated: DbSubscription = {
      ...current,
      ...updates,
    };
    this.subscriptions.set(userId, updated);
    return updated;
  }

  async updateSubscriptionByCustomerId(stripeCustomerId: string, updates: Partial<DbSubscription>): Promise<boolean> {
    for (const [userId, sub] of this.subscriptions.entries()) {
      if (sub.stripeCustomerId === stripeCustomerId) {
        this.subscriptions.set(userId, { ...sub, ...updates });
        return true;
      }
    }
    return false;
  }

  // --- ANALYTICS (USER ISOLATED) ---

  async getAnalytics(userId: string, timeframe = 'last_30_days'): Promise<AnalyticsData> {
    const data = this.analytics.get(userId) || INITIAL_ANALYTICS;
    return { ...data, timeframe };
  }

  // --- PRODUCTS (USER ISOLATED) ---

  async getProducts(userId: string): Promise<Product[]> {
    return this.products.get(userId) || [];
  }

  async addProduct(userId: string, product: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getProducts(userId);
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    this.products.set(userId, updated);
    return newProduct;
  }

  // --- ORDERS (USER ISOLATED) ---

  async getOrders(userId: string): Promise<Order[]> {
    return this.orders.get(userId) || [];
  }

  async addOrder(userId: string, order: Omit<Order, 'id'>): Promise<Order> {
    const orders = await this.getOrders(userId);
    const newOrder: Order = {
      ...order,
      id: `ord_${Date.now()}`,
    };
    const updated = [newOrder, ...orders];
    this.orders.set(userId, updated);
    return newOrder;
  }

  // --- CUSTOMERS (USER ISOLATED) ---

  async getCustomers(userId: string): Promise<Customer[]> {
    return this.customers.get(userId) || [];
  }

  // --- AI MESSAGES (USER ISOLATED) ---

  async getAIMessages(userId: string): Promise<AIMessage[]> {
    return this.aiMessages.get(userId) || [];
  }

  async addAIMessage(userId: string, message: Omit<AIMessage, 'id' | 'timestamp'>): Promise<AIMessage> {
    const messages = await this.getAIMessages(userId);
    const newMsg: AIMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMsg);
    this.aiMessages.set(userId, messages);
    return newMsg;
  }

  async clearAIMessages(userId: string): Promise<void> {
    this.aiMessages.set(userId, []);
  }

  // --- REPORTS (USER ISOLATED) ---

  async getReports(userId: string): Promise<BusinessReport[]> {
    return this.reports.get(userId) || [];
  }

  async addReport(userId: string, report: Omit<BusinessReport, 'id' | 'createdAt'>): Promise<BusinessReport> {
    const reports = await this.getReports(userId);
    const newReport: BusinessReport = {
      ...report,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    this.reports.set(userId, updated);
    return newReport;
  }

  // --- INTEGRATIONS (USER ISOLATED) ---

  async getIntegrations(userId: string): Promise<IntegrationConfig[]> {
    return this.integrations.get(userId) || INITIAL_INTEGRATIONS;
  }

  async updateIntegration(userId: string, id: string, updates: Partial<IntegrationConfig>): Promise<IntegrationConfig | null> {
    const integrations = await this.getIntegrations(userId);
    const index = integrations.findIndex(i => i.id === id);
    if (index === -1) return null;
    integrations[index] = { ...integrations[index], ...updates };
    this.integrations.set(userId, integrations);
    return integrations[index];
  }

  // --- SUBSCRIPTION PLANS ---

  async getPlans(): Promise<SubscriptionPlan[]> {
    return SUBSCRIPTION_PLANS;
  }
}

export const serverDb = new ServerDatabase();
