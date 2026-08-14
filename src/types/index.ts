export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  platform: 'shopify' | 'woocommerce' | 'csv' | 'custom';
  currency: string;
  url: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSyncedAt?: string;
  productCount: number;
  orderCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  grossProfit: number;
  margin: number; // percentage, e.g. 64.5
  unitsSold: number;
  revenue: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  trend: 'up' | 'down' | 'neutral';
  trendPercent: number;
}

export type OrderStatus = 'completed' | 'processing' | 'shipped' | 'refunded' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  cost: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  status: OrderStatus;
  itemsCount: number;
  items?: OrderItem[];
  channel: 'Shopify' | 'WooCommerce' | 'Direct' | 'Amazon' | 'Manual';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  averageOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  segment: 'VIP' | 'Loyal' | 'Regular' | 'At-Risk' | 'New' | 'Inactive';
  status: 'active' | 'inactive';
}

export interface ForecastPoint {
  date: string;
  actualRevenue?: number;
  forecastRevenue: number;
  bestCase: number;
  worstCase: number;
  confidence: number; // 0 - 100
  ordersEstimated: number;
}

export interface SalesForecast {
  expectedGrowthPercent: number;
  projectedRevenueNext30Days: number;
  current30DayRevenue: number;
  confidenceScore: number;
  forecastNarrative: string;
  growthDrivers: Array<{ title: string; impact: string; description: string }>;
  risksToWatch: Array<{ title: string; severity: 'high' | 'medium' | 'low'; description: string }>;
  points: ForecastPoint[];
}

export interface NotificationItem {
  id: string;
  type: 'milestone' | 'margin' | 'inventory' | 'forecast' | 'integration' | 'ai';
  title: string;
  description: string;
  time: string;
  read: boolean;
  severity: 'info' | 'positive' | 'warning' | 'critical';
  targetPath?: string;
}

export interface MetricSummary {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  aov: number;
  aovChange: number;
  grossProfit: number;
  profitChange: number;
  profitMargin: number;
  marginChange: number;
  customers: number;
  customersChange: number;
  healthScore: number;
  healthScoreGrade: string;
}

export interface TimeSeriesPoint {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
}

export interface AnalyticsData {
  timeframe: string;
  metrics: MetricSummary;
  timeSeries: TimeSeriesPoint[];
  salesByChannel: { name: string; value: number; percentage: number }[];
  categoryBreakdown: { category: string; revenue: number; profit: number; margin: number }[];
  unitEconomics: {
    grossSales: number;
    discounts: number;
    returns: number;
    netSales: number;
    cogs: number;
    shippingCosts: number;
    adSpend: number;
    paymentFees: number;
    netProfit: number;
    netMargin: number;
  };
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredBreakdown?: {
    insight: string;
    reason: string;
    recommendation: string;
    expectedImpact: string;
  };
  actions?: Array<{
    label: string;
    type: 'view_details' | 'apply' | 'generate_report';
    targetPath?: string;
  }>;
  structuredData?: {
    type: 'metric_callout' | 'product_list' | 'action_items' | 'risk_alert';
    title?: string;
    items?: Array<{ label: string; value: string; badge?: string; note?: string }>;
  };
  suggestedFollowups?: string[];
}

export interface BusinessReport {
  id: string;
  title: string;
  period: string;
  createdAt: string;
  author: string;
  status: 'generated' | 'draft' | 'archived';
  executiveSummary: string;
  revenueSummary: {
    totalRevenue: number;
    revenueGrowth: string;
    topDriver: string;
    underperformingChannel: string;
  };
  profitSummary: {
    grossProfit: number;
    blendedMargin: number;
    cogsRatio: string;
    adEfficiency: string;
  };
  productPerformance: {
    starSku: string;
    highestMarginSku: string;
    marginBleederSku: string;
    stockoutRiskCount: number;
  };
  customerSummary: {
    newCustomers: number;
    repeatRate: string;
    customerLtv: number;
    averageAov: number;
  };
  businessRisks: Array<{
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    mitigation: string;
  }>;
  aiRecommendations: Array<{
    priority: 'immediate' | 'short-term' | 'medium-term';
    category: 'pricing' | 'inventory' | 'marketing' | 'operations';
    title: string;
    impact: string;
    description: string;
  }>;
}

export interface IntegrationConfig {
  id: 'shopify' | 'woocommerce' | 'csv' | 'amazon' | 'stripe';
  name: string;
  logo: string;
  description: string;
  status: 'connected' | 'not_connected' | 'syncing' | 'error';
  lastSync?: string;
  storeUrl?: string;
  dataTypes: string[];
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  popular?: boolean;
  features: string[];
  limits: {
    stores: number;
    ordersPerMonth: string;
    aiQueriesPerDay: string;
    teamMembers: number;
    historicalData: string;
  };
}

export interface CSVRowValidation {
  rowNumber: number;
  raw: Record<string, string>;
  isValid: boolean;
  errors: string[];
  parsed?: Partial<Product | Order>;
}

export interface CSVParseResult {
  fileName: string;
  fileSize: number;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  headers: string[];
  previewRows: CSVRowValidation[];
}

export type AIProductStatus = 'Excellent' | 'Healthy' | 'Watch' | 'At Risk' | 'Loss';

export interface SmartAlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'positive' | 'info';
  title: string;
  description: string;
  metricLabel?: string;
  metricDelta?: string;
  timestamp: string;
  category: 'margin' | 'inventory' | 'sales' | 'refunds' | 'shipping';
  actionLabel?: string;
  targetPath?: string;
}

export interface BusinessHealthBreakdown {
  overall: number;
  grade: string;
  categories: {
    revenue: number;
    profitability: number;
    products: number;
    customers: number;
    growth: number;
  };
}

export interface DailyBriefingData {
  date: string;
  revenueSummary: string;
  profitSummary: string;
  importantChanges: string;
  topOpportunity: string;
  biggestRisk: string;
  recommendedActions: Array<{
    id: string;
    text: string;
    impact: string;
    category: string;
    completed: boolean;
  }>;
}

