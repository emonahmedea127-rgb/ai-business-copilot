import express, { Request, Response, Router, NextFunction } from 'express';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { serverDb } from '../server/db';
import {
  isValidEmail,
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
  generateSessionToken,
  setSessionCookie,
  clearSessionCookie,
  sanitizeUser,
  authenticateRequest,
  extractSessionToken,
  SESSION_DURATION_MS
} from '../server/auth';
import { processAICopilotQuery } from '../ai/copilotEngine';
import { generateExecutiveReport } from '../reports/generator';
import { handleStripeWebhook } from '../stripe/webhookHandler';
import { User } from '../../types';

// Extended request interface with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: string;
  sessionToken?: string;
}

export function createApiRouter(): Router {
  const router = express.Router();

  // 1. Stripe Webhook endpoint - Raw body parser MUST be mounted before express.json()
  // for Stripe cryptographic signature verification
  router.post(
    '/stripe/webhook',
    express.raw({ type: ['application/json', 'application/octet-stream', '*/*'] }),
    handleStripeWebhook
  );

  // 2. Cookie parser middleware
  router.use(cookieParser());

  // 3. Standard JSON body parser for all other REST API endpoints
  router.use(express.json());

  // Safe handler wrapper to catch and log errors safely
  const safeHandler = (fn: (req: Request, res: Response) => Promise<unknown>) => {
    return async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        console.error('[API Error]:', message);
        res.status(500).json({ error: message, success: false });
      }
    };
  };

  // Authentication Middleware for Protected Routes
  const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auth = await authenticateRequest(req);
      if (!auth.authenticated || !auth.user || !auth.userId) {
        res.status(401).json({
          error: 'Authentication required. Please sign in.',
          authenticated: false,
        });
        return;
      }
      req.user = auth.user;
      req.userId = auth.userId;
      req.sessionToken = auth.sessionToken || undefined;
      next();
    } catch (err) {
      console.error('[Auth Middleware Error]:', err);
      res.status(401).json({
        error: 'Invalid or expired session. Please sign in again.',
        authenticated: false,
      });
    }
  };

  // Optional Auth helper (doesn't reject, but attaches user if present)
  const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const auth = await authenticateRequest(req);
      if (auth.authenticated && auth.user && auth.userId) {
        req.user = auth.user;
        req.userId = auth.userId;
        req.sessionToken = auth.sessionToken || undefined;
      }
    } catch {
      // ignore
    }
    next();
  };

  // ==========================================
  // 1. SYSTEM & HEALTH ENDPOINTS (PUBLIC)
  // ==========================================
  router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 0,
      auth: 'active',
      integrations: {
        shopify: 'ready',
        woocommerce: 'ready',
        stripe: 'ready',
      }
    });
  });

  // ==========================================
  // 2. AUTHENTICATION ENDPOINTS
  // ==========================================

  // GET /api/auth/me - Verify current session
  router.get('/auth/me', safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const auth = await authenticateRequest(req);
    if (!auth.authenticated || !auth.user) {
      res.status(401).json({ authenticated: false, user: null, error: 'No active session' });
      return;
    }

    res.json({
      authenticated: true,
      user: auth.user,
      token: auth.sessionToken,
    });
  }));

  // POST /api/auth/signup - Register new user account
  router.post('/auth/signup', safeHandler(async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, storeName } = req.body || {};

    // 1. Validate Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters)' });
      return;
    }

    // 2. Validate Email
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid work email address' });
      return;
    }

    // 3. Validate Password & Strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      res.status(400).json({ error: passwordValidation.message });
      return;
    }

    // 4. Validate Confirm Password if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match' });
      return;
    }

    // 5. Prevent Duplicate Accounts
    const existingUser = await serverDb.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email address already exists. Please sign in instead.' });
      return;
    }

    // 6. Securely Hash Password
    const passwordHash = await hashPassword(password);

    // 7. Create User with unverified initial state
    const newUser = await serverDb.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'owner',
      storeName: storeName ? storeName.trim() : undefined,
      isVerified: false,
    });

    // 8. Generate Email Verification Token (24 hour expiration)
    const verificationToken = await serverDb.createEmailVerificationToken(newUser.id, newUser.email);
    console.log(`[Email Verification] Verification token generated for ${newUser.email}: ${verificationToken}`);

    // 9. Return Response requiring email verification
    const sanitized = sanitizeUser(newUser);
    res.status(201).json({
      success: true,
      requiresVerification: true,
      user: sanitized,
      email: newUser.email,
      verificationToken, // Provided for direct verification / link preview in sandbox environment
      message: 'Account created successfully! Please check your email to verify your account.',
    });
  }));

  // POST /api/auth/login - Authenticate user credentials
  router.post('/auth/login', safeHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body || {};

    // 1. Validate Input Presence
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // 2. Find User
    const dbUser = await serverDb.findUserByEmail(email);
    if (!dbUser) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // 3. Verify Password Hash
    const isMatch = await verifyPassword(password, dbUser.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // 4. Check Email Verification Status
    if (!dbUser.isVerified) {
      const activeToken = await serverDb.getVerificationTokenByUserId(dbUser.id) ||
        await serverDb.createEmailVerificationToken(dbUser.id, dbUser.email);

      res.status(403).json({
        error: 'Please verify your email address before signing in. Check your inbox for the verification link.',
        requiresVerification: true,
        email: dbUser.email,
        verificationToken: activeToken,
      });
      return;
    }

    // 5. Create Authenticated Session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await serverDb.createSession(dbUser.id, sessionToken, expiresAt);

    // 6. Set HTTP-only Session Cookie
    setSessionCookie(res, sessionToken);

    // 7. Return Sanitized User
    const sanitized = sanitizeUser(dbUser);
    res.json({
      success: true,
      authenticated: true,
      user: sanitized,
      token: sessionToken,
    });
  }));

  // POST /api/auth/firebase - Authenticate or register using Firebase Auth (Google Sign-In)
  router.post('/auth/firebase', safeHandler(async (req: Request, res: Response) => {
    const { uid, email, displayName, photoURL } = req.body || {};

    if (!uid || !email) {
      res.status(400).json({ error: 'Firebase UID and email are required' });
      return;
    }

    // 1. Check if user already exists by email or create new
    let dbUser = await serverDb.findUserByEmail(email);

    if (!dbUser) {
      // Create user record in local backend database synced with Firebase Auth
      const randomPasswordHash = await hashPassword(crypto.randomBytes(24).toString('hex'));
      dbUser = await serverDb.createUser({
        name: displayName || email.split('@')[0] || 'Google User',
        email: email.trim().toLowerCase(),
        passwordHash: randomPasswordHash,
        role: 'owner',
        storeName: `${displayName || 'My'}'s Store`,
        isVerified: true,
      });

      if (photoURL) {
        await serverDb.updateUser(dbUser.id, { avatarUrl: photoURL });
      }
    } else {
      // User exists - update avatar/verification if needed
      await serverDb.updateUser(dbUser.id, {
        isVerified: true,
        avatarUrl: photoURL || dbUser.avatarUrl,
        name: displayName || dbUser.name,
      });
      const refreshed = await serverDb.getUserById(dbUser.id);
      if (refreshed) dbUser = refreshed;
    }

    // 2. Create authenticated session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await serverDb.createSession(dbUser.id, sessionToken, expiresAt);

    // 3. Set HTTP-only Cookie
    setSessionCookie(res, sessionToken);

    // 4. Return sanitized user
    const sanitized = sanitizeUser(dbUser);
    res.json({
      success: true,
      authenticated: true,
      user: sanitized,
      token: sessionToken,
    });
  }));

  // POST /api/auth/forgot-password - Request password recovery link
  router.post('/auth/forgot-password', safeHandler(async (req: Request, res: Response) => {
    const { email } = req.body || {};

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Please provide a valid email address' });
      return;
    }

    const resetResult = await serverDb.createPasswordResetToken(email);

    if (resetResult) {
      console.log(`[Password Reset] Generated reset token for ${email}: ${resetResult.token}`);
    }

    // Always return safe generic success message to prevent user enumeration
    res.json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been sent.',
      // In sandbox preview, include token for testing convenience
      previewResetToken: resetResult ? resetResult.token : undefined,
    });
  }));

  // POST /api/auth/verify-reset-token - Validate password reset token
  router.post('/api/auth/verify-reset-token', safeHandler(async (req: Request, res: Response) => {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string') {
      res.status(400).json({ valid: false, error: 'Reset token is required' });
      return;
    }

    const tokenData = await serverDb.getPasswordResetToken(token);
    if (!tokenData) {
      res.status(400).json({ valid: false, error: 'Password reset link is invalid or has expired. Please request a new one.' });
      return;
    }

    res.json({
      valid: true,
      email: tokenData.email,
    });
  }));

  // POST /api/auth/reset-password - Complete password reset with token
  router.post('/auth/reset-password', safeHandler(async (req: Request, res: Response) => {
    const { token, password, confirmPassword } = req.body || {};

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Password reset token is required' });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      res.status(400).json({ error: passwordValidation.message });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match' });
      return;
    }

    const tokenData = await serverDb.getPasswordResetToken(token);
    if (!tokenData) {
      res.status(400).json({ error: 'Password reset token is invalid or has expired. Please request a new link.' });
      return;
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    const success = await serverDb.updateUserPassword(tokenData.userId, passwordHash);
    if (!success) {
      res.status(400).json({ error: 'User account could not be found' });
      return;
    }

    // Delete used reset token
    await serverDb.deletePasswordResetToken(token);

    // Invalidate all existing sessions for this user for security
    await serverDb.deleteUserSessions(tokenData.userId);

    res.json({
      success: true,
      message: 'Your password has been successfully updated. Please sign in with your new password.',
    });
  }));

  // POST /api/auth/verify-email - Verify user email address with token
  router.post('/auth/verify-email', safeHandler(async (req: Request, res: Response) => {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Verification token is required' });
      return;
    }

    const result = await serverDb.verifyUserEmail(token);
    if (!result.success || !result.user) {
      res.status(400).json({ error: result.error || 'Invalid or expired verification link.' });
      return;
    }

    const sanitized = sanitizeUser(result.user);
    res.json({
      success: true,
      message: 'Your email address has been successfully verified! You can now sign in to your workspace.',
      user: sanitized,
    });
  }));

  // POST /api/auth/resend-verification - Resend verification email
  router.post('/auth/resend-verification', safeHandler(async (req: Request, res: Response) => {
    const { email } = req.body || {};

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Please provide a valid email address' });
      return;
    }

    const user = await serverDb.findUserByEmail(email);
    if (!user) {
      // Avoid revealing user existence
      res.json({
        success: true,
        message: 'If an account exists with this email, a new verification link has been sent.',
      });
      return;
    }

    if (user.isVerified) {
      res.json({
        success: true,
        alreadyVerified: true,
        message: 'This email is already verified. You can sign in immediately.',
      });
      return;
    }

    const newToken = await serverDb.createEmailVerificationToken(user.id, user.email);
    console.log(`[Email Verification] Resent verification token for ${email}: ${newToken}`);

    res.json({
      success: true,
      message: 'A new verification link has been sent to your email address.',
      verificationToken: newToken,
    });
  }));

  // POST /api/auth/logout - Invalidate Session
  router.post('/auth/logout', safeHandler(async (req: Request, res: Response) => {
    const token = extractSessionToken(req);
    if (token) {
      await serverDb.deleteSession(token);
    }

    clearSessionCookie(res);
    res.json({ success: true, message: 'Logged out successfully' });
  }));

  // ==========================================
  // 3. PROTECTED USER-ISOLATED DATA ENDPOINTS
  // ==========================================

  // 3.1 Stores (User-Isolated)
  router.get('/stores', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const stores = await serverDb.getStores(userId);
    const activeStoreId = await serverDb.getActiveStoreId(userId);
    res.json({ stores, activeStoreId });
  }));

  router.post('/stores/select', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const { storeId } = req.body || {};
    if (storeId) {
      await serverDb.setActiveStoreId(userId, storeId);
    }
    res.json({ success: true, activeStoreId: storeId });
  }));

  router.post('/stores', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const { name, platform, currency, url } = req.body || {};
    if (!name || !platform) {
      res.status(400).json({ error: 'Store name and platform are required' });
      return;
    }
    const newStore = await serverDb.addStore(userId, {
      name,
      platform,
      currency: currency || 'USD',
      url: url || `${name.toLowerCase().replace(/\s+/g, '')}.myshopify.com`,
      status: 'connected',
      lastSyncedAt: new Date().toISOString(),
      productCount: 0,
      orderCount: 0,
    });
    res.status(201).json({ success: true, store: newStore });
  }));

  // 3.2 Analytics (User-Isolated)
  router.get('/analytics', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const timeframe = (req.query.timeframe as string) || 'last_30_days';
    const data = await serverDb.getAnalytics(userId, timeframe);
    res.json(data);
  }));

  // 3.3 Products (User-Isolated)
  router.get('/products', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const products = await serverDb.getProducts(userId);
    res.json({ products, total: products.length });
  }));

  router.post('/products', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const productData = req.body || {};
    if (!productData.name || productData.price === undefined) {
      res.status(400).json({ error: 'Product name and price are required' });
      return;
    }
    const product = await serverDb.addProduct(userId, productData);
    res.status(201).json({ success: true, product });
  }));

  // 3.4 Orders (User-Isolated)
  router.get('/orders', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const orders = await serverDb.getOrders(userId);
    res.json({ orders, total: orders.length });
  }));

  router.post('/orders', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const orderData = req.body || {};
    if (!orderData.orderNumber || orderData.revenue === undefined) {
      res.status(400).json({ error: 'Order number and revenue are required' });
      return;
    }
    const order = await serverDb.addOrder(userId, orderData);
    res.status(201).json({ success: true, order });
  }));

  // 3.5 Customers (User-Isolated)
  router.get('/customers', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const customers = await serverDb.getCustomers(userId);
    res.json({ customers, total: customers.length });
  }));

  // 3.6 AI Chat & Copilot (User-Isolated)
  router.get('/ai/messages', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const messages = await serverDb.getAIMessages(userId);
    res.json({ messages });
  }));

  router.post('/ai/chat', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // 1. Record user message
    await serverDb.addAIMessage(userId, { sender: 'user', content: prompt });

    // 2. Process query with AI Engine
    const assistantMsg = await processAICopilotQuery(prompt);

    // 3. Save assistant response
    const savedAssistantMsg = await serverDb.addAIMessage(userId, {
      sender: 'assistant',
      content: assistantMsg.content,
      structuredData: assistantMsg.structuredData,
      structuredBreakdown: assistantMsg.structuredBreakdown,
      suggestedFollowups: assistantMsg.suggestedFollowups,
      actions: assistantMsg.actions,
    });

    res.json({ response: savedAssistantMsg });
  }));

  // 3.7 Executive Reports (User-Isolated)
  router.get('/reports', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const reports = await serverDb.getReports(userId);
    res.json({ reports });
  }));

  router.post('/reports', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const { title } = req.body || {};
    const reportData = await generateExecutiveReport(title);
    const savedReport = await serverDb.addReport(userId, reportData);
    res.status(201).json({ report: savedReport, success: true });
  }));

  // 3.8 Integrations (User-Isolated)
  router.get('/integrations/shopify', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const stores = await serverDb.getStores(userId);
    const shopifyStore = stores.find(s => s.platform === 'shopify') || stores[0];

    res.json({
      connected: shopifyStore ? shopifyStore.status === 'connected' : true,
      storeUrl: shopifyStore?.url || 'aura-athletics.myshopify.com',
      lastSyncedAt: shopifyStore?.lastSyncedAt || new Date().toISOString(),
      scope: ['read_products', 'read_orders', 'read_customers']
    });
  }));

  router.get('/integrations/woocommerce', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const stores = await serverDb.getStores(userId);
    const wooStore = stores.find(s => s.platform === 'woocommerce') || stores[1];

    res.json({
      connected: wooStore ? wooStore.status === 'connected' : true,
      storeUrl: wooStore?.url || 'nordicminimal.com',
      lastSyncedAt: wooStore?.lastSyncedAt || new Date().toISOString(),
      scope: ['read_products', 'read_orders']
    });
  }));

  router.get('/integrations', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const integrations = await serverDb.getIntegrations(userId);
    res.json({ integrations });
  }));

  // 3.9 Billing & Subscriptions (User-Isolated)
  router.get('/billing', requireAuth, safeHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId!;
    const plans = await serverDb.getPlans();
    const subscription = await serverDb.getSubscription(userId);
    const currentPlanId = subscription?.planId || 'pro';

    res.json({
      plans,
      currentPlanId,
      status: subscription?.status || 'active',
      renewsAt: subscription?.currentPeriodEnd || '2026-09-15T00:00:00Z',
      paymentMethod: 'Card on file via Stripe',
    });
  }));

  return router;
}
