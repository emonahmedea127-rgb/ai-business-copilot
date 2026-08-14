import express, { Request, Response, Router } from 'express';
import { db } from '../db';
import { processAICopilotQuery } from '../ai/copilotEngine';
import { generateExecutiveReport } from '../reports/generator';

export function createApiRouter(): Router {
  const router = express.Router();
  router.use(express.json());

  // Safe wrapper helper
  const safeHandler = (fn: (req: Request, res: Response) => Promise<unknown>) => {
    return async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        console.error('API Handler Error:', err);
        res.status(500).json({ error: message, success: false });
      }
    };
  };

  // 1. Health check
  router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 0,
      integrations: {
        shopify: 'standby',
        woocommerce: 'standby',
        stripe: 'standby',
      }
    });
  });

  // 2. Auth routes
  router.get('/auth/me', safeHandler(async (req, res) => {
    const user = await db.getUser();
    res.json({ user, authenticated: true });
  }));

  router.post('/auth/login', safeHandler(async (req, res) => {
    const { email } = req.body || {};
    const user = await db.getUser();
    if (email) {
      user.email = email;
      await db.updateUser({ email });
    }
    res.json({ success: true, user, token: 'mock_jwt_session_token_' + Date.now() });
  }));

  router.post('/auth/signup', safeHandler(async (req, res) => {
    const { name, email } = req.body || {};
    const updated = await db.updateUser({
      name: name || 'Demo Founder',
      email: email || 'founder@demo.com'
    });
    res.json({ success: true, user: updated, token: 'mock_jwt_session_token_' + Date.now() });
  }));

  router.post('/auth/logout', safeHandler(async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  }));

  // 3. Stores
  router.get('/stores', safeHandler(async (req, res) => {
    const stores = await db.getStores();
    const activeId = await db.getActiveStoreId();
    res.json({ stores, activeStoreId: activeId });
  }));

  router.post('/stores/select', safeHandler(async (req, res) => {
    const { storeId } = req.body || {};
    if (storeId) {
      await db.setActiveStoreId(storeId);
    }
    res.json({ success: true, activeStoreId: storeId });
  }));

  // 4. Analytics
  router.get('/analytics', safeHandler(async (req, res) => {
    const timeframe = (req.query.timeframe as string) || 'last_30_days';
    const data = await db.getAnalytics(timeframe);
    res.json(data);
  }));

  // 5. Products
  router.get('/products', safeHandler(async (req, res) => {
    const products = await db.getProducts();
    res.json({ products, total: products.length });
  }));

  // 6. Orders
  router.get('/orders', safeHandler(async (req, res) => {
    const orders = await db.getOrders();
    res.json({ orders, total: orders.length });
  }));

  // 7. Customers
  router.get('/customers', safeHandler(async (req, res) => {
    const customers = await db.getCustomers();
    res.json({ customers, total: customers.length });
  }));

  // 8. AI Chat
  router.get('/ai/messages', safeHandler(async (req, res) => {
    const messages = await db.getAIMessages();
    res.json({ messages });
  }));

  router.post('/ai/chat', safeHandler(async (req, res) => {
    const { prompt } = req.body || {};
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }
    // Save user message
    await db.addAIMessage({ sender: 'user', content: prompt });
    // Generate AI response
    const assistantMsg = await processAICopilotQuery(prompt);
    await db.addAIMessage({
      sender: 'assistant',
      content: assistantMsg.content,
      structuredData: assistantMsg.structuredData,
      suggestedFollowups: assistantMsg.suggestedFollowups
    });
    res.json({ response: assistantMsg });
  }));

  // 9. Reports
  router.get('/reports', safeHandler(async (req, res) => {
    const reports = await db.getReports();
    res.json({ reports });
  }));

  router.post('/reports', safeHandler(async (req, res) => {
    const { title } = req.body || {};
    const report = await generateExecutiveReport(title);
    res.json({ report, success: true });
  }));

  // 10. Integrations
  router.get('/integrations/shopify', safeHandler(async (req, res) => {
    res.json({
      connected: true,
      storeUrl: 'aura-athletics.myshopify.com',
      lastSyncedAt: new Date().toISOString(),
      scope: ['read_products', 'read_orders', 'read_customers']
    });
  }));

  router.get('/integrations/woocommerce', safeHandler(async (req, res) => {
    res.json({
      connected: true,
      storeUrl: 'nordicminimal.com',
      lastSyncedAt: new Date().toISOString(),
      scope: ['read_products', 'read_orders']
    });
  }));

  // 11. Billing
  router.get('/billing', safeHandler(async (req, res) => {
    const plans = await db.getPlans();
    const currentPlanId = await db.getCurrentPlanId();
    res.json({
      plans,
      currentPlanId,
      status: 'active',
      renewsAt: '2026-09-15T00:00:00Z',
      paymentMethod: 'Visa ending in 4242 (Simulated)'
    });
  }));

  return router;
}
