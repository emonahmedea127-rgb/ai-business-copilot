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

export const INITIAL_USER: User = {
  id: 'usr_live_01',
  name: 'Alex Vance',
  email: 'alex@aurastore.com',
  role: 'owner',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2025-01-15T08:00:00Z',
};

export const INITIAL_STORES: Store[] = [
  {
    id: 'store_01',
    name: 'Aura Athletics & Gear',
    platform: 'shopify',
    currency: 'USD',
    url: 'https://aura-athletics.myshopify.com',
    status: 'connected',
    lastSyncedAt: '2026-08-13T22:30:00Z',
    productCount: 48,
    orderCount: 1420,
  },
  {
    id: 'store_02',
    name: 'Nordic Minimal Living',
    platform: 'woocommerce',
    currency: 'USD',
    url: 'https://nordicminimal.com',
    status: 'connected',
    lastSyncedAt: '2026-08-13T21:15:00Z',
    productCount: 32,
    orderCount: 840,
  },
  {
    id: 'store_03',
    name: 'Urban Coffee Supply',
    platform: 'csv',
    currency: 'USD',
    url: 'offline-import.csv',
    status: 'connected',
    lastSyncedAt: '2026-08-12T19:00:00Z',
    productCount: 19,
    orderCount: 410,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_01',
    name: 'Pro Performance Compression Tights',
    sku: 'AURA-CMP-001',
    category: 'Activewear',
    price: 88.00,
    cost: 22.50,
    grossProfit: 65.50,
    margin: 74.4,
    unitsSold: 642,
    revenue: 56496.00,
    stock: 184,
    status: 'in_stock',
    trend: 'up',
    trendPercent: 18.4,
  },
  {
    id: 'prod_02',
    name: 'Seamless Cloud-Knit Sports Bra',
    sku: 'AURA-BR-004',
    category: 'Activewear',
    price: 54.00,
    cost: 11.20,
    grossProfit: 42.80,
    margin: 79.2,
    unitsSold: 512,
    revenue: 27648.00,
    stock: 92,
    status: 'in_stock',
    trend: 'up',
    trendPercent: 24.1,
  },
  {
    id: 'prod_03',
    name: 'Ultra-Lightweight Hydro Hydration Vest',
    sku: 'AURA-HYD-010',
    category: 'Accessories',
    price: 125.00,
    cost: 41.00,
    grossProfit: 84.00,
    margin: 67.2,
    unitsSold: 318,
    revenue: 39750.00,
    stock: 24,
    status: 'low_stock',
    trend: 'up',
    trendPercent: 9.6,
  },
  {
    id: 'prod_04',
    name: 'Carbon-Core Stability Running Belt',
    sku: 'AURA-BLT-002',
    category: 'Accessories',
    price: 38.00,
    cost: 16.50,
    grossProfit: 21.50,
    margin: 56.5,
    unitsSold: 420,
    revenue: 15960.00,
    stock: 310,
    status: 'in_stock',
    trend: 'neutral',
    trendPercent: 1.2,
  },
  {
    id: 'prod_05',
    name: 'Merino Wool Thermal Quarter-Zip',
    sku: 'AURA-MRN-008',
    category: 'Outerwear',
    price: 148.00,
    cost: 72.00,
    grossProfit: 76.00,
    margin: 51.3,
    unitsSold: 185,
    revenue: 27380.00,
    stock: 45,
    status: 'in_stock',
    trend: 'down',
    trendPercent: -8.3,
  },
  {
    id: 'prod_06',
    name: 'Anodized Titanium Electrolyte Flask 750ml',
    sku: 'AURA-FLK-003',
    category: 'Hardware',
    price: 46.00,
    cost: 28.90,
    grossProfit: 17.10,
    margin: 37.1,
    unitsSold: 280,
    revenue: 12880.00,
    stock: 12,
    status: 'low_stock',
    trend: 'down',
    trendPercent: -14.2,
  },
  {
    id: 'prod_07',
    name: 'Recycled Grip Trail Running Socks (3-Pack)',
    sku: 'AURA-SCK-012',
    category: 'Footwear',
    price: 32.00,
    cost: 6.80,
    grossProfit: 25.20,
    margin: 78.7,
    unitsSold: 740,
    revenue: 23680.00,
    stock: 420,
    status: 'in_stock',
    trend: 'up',
    trendPercent: 31.8,
  },
  {
    id: 'prod_08',
    name: 'Reflective Night-Runner Windbreaker',
    sku: 'AURA-WND-005',
    category: 'Outerwear',
    price: 165.00,
    cost: 98.00,
    grossProfit: 67.00,
    margin: 40.6,
    unitsSold: 98,
    revenue: 16170.00,
    stock: 0,
    status: 'out_of_stock',
    trend: 'down',
    trendPercent: -22.5,
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: '#AURA-9842',
    customerId: 'cust_01',
    customerName: 'Marcus Thorne',
    customerEmail: 'm.thorne@horizon.io',
    date: '2026-08-13T20:14:00Z',
    revenue: 216.00,
    cost: 56.20,
    profit: 159.80,
    margin: 73.9,
    status: 'completed',
    itemsCount: 3,
    channel: 'Shopify',
    items: [
      { id: 'item_1', productId: 'prod_01', productName: 'Pro Performance Compression Tights', quantity: 2, price: 88, cost: 22.5 },
      { id: 'item_2', productId: 'prod_04', productName: 'Carbon-Core Stability Running Belt', quantity: 1, price: 38, cost: 16.5 }
    ]
  },
  {
    id: 'ord_1002',
    orderNumber: '#AURA-9841',
    customerId: 'cust_02',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@cloudscale.net',
    date: '2026-08-13T18:42:00Z',
    revenue: 125.00,
    cost: 41.00,
    profit: 84.00,
    margin: 67.2,
    status: 'shipped',
    itemsCount: 1,
    channel: 'Shopify',
    items: [
      { id: 'item_3', productId: 'prod_03', productName: 'Ultra-Lightweight Hydro Hydration Vest', quantity: 1, price: 125, cost: 41 }
    ]
  },
  {
    id: 'ord_1003',
    orderNumber: '#AURA-9840',
    customerId: 'cust_03',
    customerName: 'David Chen',
    customerEmail: 'dchen.design@gmail.com',
    date: '2026-08-13T16:11:00Z',
    revenue: 86.00,
    cost: 18.00,
    profit: 68.00,
    margin: 79.0,
    status: 'completed',
    itemsCount: 2,
    channel: 'Direct',
    items: [
      { id: 'item_4', productId: 'prod_02', productName: 'Seamless Cloud-Knit Sports Bra', quantity: 1, price: 54, cost: 11.2 },
      { id: 'item_5', productId: 'prod_07', productName: 'Recycled Grip Trail Running Socks', quantity: 1, price: 32, cost: 6.8 }
    ]
  },
  {
    id: 'ord_1004',
    orderNumber: '#AURA-9839',
    customerId: 'cust_04',
    customerName: 'Sophia Lindqvist',
    customerEmail: 'sophia@lindqvist.se',
    date: '2026-08-13T14:30:00Z',
    revenue: 296.00,
    cost: 144.00,
    profit: 152.00,
    margin: 51.3,
    status: 'processing',
    itemsCount: 2,
    channel: 'WooCommerce',
    items: [
      { id: 'item_6', productId: 'prod_05', productName: 'Merino Wool Thermal Quarter-Zip', quantity: 2, price: 148, cost: 72 }
    ]
  },
  {
    id: 'ord_1005',
    orderNumber: '#AURA-9838',
    customerId: 'cust_05',
    customerName: 'Jordan Taylor',
    customerEmail: 'jtaylor.dev@outlook.com',
    date: '2026-08-13T11:05:00Z',
    revenue: 165.00,
    cost: 98.00,
    profit: 67.00,
    margin: 40.6,
    status: 'refunded',
    itemsCount: 1,
    channel: 'Shopify',
    items: [
      { id: 'item_7', productId: 'prod_08', productName: 'Reflective Night-Runner Windbreaker', quantity: 1, price: 165, cost: 98 }
    ]
  },
  {
    id: 'ord_1006',
    orderNumber: '#AURA-9837',
    customerId: 'cust_06',
    customerName: 'Liam O\'Connor',
    customerEmail: 'liam.oc@dublintech.ie',
    date: '2026-08-12T21:45:00Z',
    revenue: 176.00,
    cost: 45.00,
    profit: 131.00,
    margin: 74.4,
    status: 'completed',
    itemsCount: 2,
    channel: 'Shopify'
  },
  {
    id: 'ord_1007',
    orderNumber: '#AURA-9836',
    customerId: 'cust_07',
    customerName: 'Hannah Bennett',
    customerEmail: 'hannah.b@apexventures.co',
    date: '2026-08-12T19:20:00Z',
    revenue: 46.00,
    cost: 28.90,
    profit: 17.10,
    margin: 37.1,
    status: 'completed',
    itemsCount: 1,
    channel: 'Direct'
  },
  {
    id: 'ord_1008',
    orderNumber: '#AURA-9835',
    customerId: 'cust_08',
    customerName: 'Tariq Al-Mansoor',
    customerEmail: 'tariq@mansoorgroup.ae',
    date: '2026-08-12T15:00:00Z',
    revenue: 352.00,
    cost: 90.00,
    profit: 262.00,
    margin: 74.4,
    status: 'shipped',
    itemsCount: 4,
    channel: 'Shopify'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    name: 'Marcus Thorne',
    email: 'm.thorne@horizon.io',
    totalSpent: 1842.00,
    ordersCount: 9,
    averageOrderValue: 204.66,
    firstOrderDate: '2025-04-10T10:00:00Z',
    lastOrderDate: '2026-08-13T20:14:00Z',
    segment: 'VIP',
    status: 'active',
  },
  {
    id: 'cust_02',
    name: 'Elena Rostova',
    email: 'elena.rostova@cloudscale.net',
    totalSpent: 1240.00,
    ordersCount: 6,
    averageOrderValue: 206.66,
    firstOrderDate: '2025-07-22T14:00:00Z',
    lastOrderDate: '2026-08-13T18:42:00Z',
    segment: 'VIP',
    status: 'active',
  },
  {
    id: 'cust_03',
    name: 'David Chen',
    email: 'dchen.design@gmail.com',
    totalSpent: 680.00,
    ordersCount: 4,
    averageOrderValue: 170.00,
    firstOrderDate: '2025-11-05T09:00:00Z',
    lastOrderDate: '2026-08-13T16:11:00Z',
    segment: 'Regular',
    status: 'active',
  },
  {
    id: 'cust_04',
    name: 'Sophia Lindqvist',
    email: 'sophia@lindqvist.se',
    totalSpent: 592.00,
    ordersCount: 2,
    averageOrderValue: 296.00,
    firstOrderDate: '2026-03-12T11:00:00Z',
    lastOrderDate: '2026-08-13T14:30:00Z',
    segment: 'Regular',
    status: 'active',
  },
  {
    id: 'cust_05',
    name: 'Jordan Taylor',
    email: 'jtaylor.dev@outlook.com',
    totalSpent: 165.00,
    ordersCount: 1,
    averageOrderValue: 165.00,
    firstOrderDate: '2026-08-13T11:05:00Z',
    lastOrderDate: '2026-08-13T11:05:00Z',
    segment: 'At-Risk',
    status: 'active',
  },
  {
    id: 'cust_06',
    name: 'Liam O\'Connor',
    email: 'liam.oc@dublintech.ie',
    totalSpent: 890.00,
    ordersCount: 5,
    averageOrderValue: 178.00,
    firstOrderDate: '2025-09-18T13:00:00Z',
    lastOrderDate: '2026-08-12T21:45:00Z',
    segment: 'Regular',
    status: 'active',
  },
  {
    id: 'cust_07',
    name: 'Hannah Bennett',
    email: 'hannah.b@apexventures.co',
    totalSpent: 92.00,
    ordersCount: 2,
    averageOrderValue: 46.00,
    firstOrderDate: '2026-07-01T15:00:00Z',
    lastOrderDate: '2026-08-12T19:20:00Z',
    segment: 'New',
    status: 'active',
  },
  {
    id: 'cust_08',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@mansoorgroup.ae',
    totalSpent: 2150.00,
    ordersCount: 8,
    averageOrderValue: 268.75,
    firstOrderDate: '2025-05-14T08:00:00Z',
    lastOrderDate: '2026-08-12T15:00:00Z',
    segment: 'VIP',
    status: 'active',
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  timeframe: 'last_30_days',
  metrics: {
    revenue: 219964.00,
    revenueChange: 14.8,
    orders: 1420,
    ordersChange: 11.2,
    aov: 154.90,
    aovChange: 3.2,
    grossProfit: 147815.00,
    profitChange: 18.6,
    profitMargin: 67.2,
    marginChange: 2.4,
    customers: 984,
    customersChange: 8.9,
    healthScore: 88,
    healthScoreGrade: 'A (Strong Profitability)',
  },
  timeSeries: [
    { date: 'Jul 15', revenue: 6420, cost: 2140, profit: 4280, orders: 42, margin: 66.6 },
    { date: 'Jul 18', revenue: 7180, cost: 2350, profit: 4830, orders: 48, margin: 67.2 },
    { date: 'Jul 21', revenue: 6890, cost: 2210, profit: 4680, orders: 45, margin: 67.9 },
    { date: 'Jul 24', revenue: 8450, cost: 2720, profit: 5730, orders: 54, margin: 67.8 },
    { date: 'Jul 27', revenue: 7920, cost: 2580, profit: 5340, orders: 51, margin: 67.4 },
    { date: 'Jul 30', revenue: 9100, cost: 2920, profit: 6180, orders: 59, margin: 67.9 },
    { date: 'Aug 02', revenue: 8640, cost: 2790, profit: 5850, orders: 56, margin: 67.7 },
    { date: 'Aug 05', revenue: 10250, cost: 3280, profit: 6970, orders: 66, margin: 68.0 },
    { date: 'Aug 08', revenue: 9800, cost: 3150, profit: 6650, orders: 63, margin: 67.8 },
    { date: 'Aug 11', revenue: 11400, cost: 3620, profit: 7780, orders: 74, margin: 68.2 },
    { date: 'Aug 13', revenue: 12240, cost: 3880, profit: 8360, orders: 79, margin: 68.3 },
  ],
  salesByChannel: [
    { name: 'Shopify Storefront', value: 148500, percentage: 67.5 },
    { name: 'WooCommerce Store', value: 46200, percentage: 21.0 },
    { name: 'Direct Wholesale / CSV', value: 18400, percentage: 8.4 },
    { name: 'Social Commerce', value: 6864, percentage: 3.1 },
  ],
  categoryBreakdown: [
    { category: 'Activewear', revenue: 84144, profit: 62608, margin: 74.4 },
    { category: 'Accessories', revenue: 55710, profit: 36870, margin: 66.1 },
    { category: 'Footwear', revenue: 42680, profit: 32840, margin: 76.9 },
    { category: 'Outerwear', revenue: 43550, profit: 20110, margin: 46.1 },
    { category: 'Hardware', revenue: 12880, profit: 4787, margin: 37.1 },
  ],
  unitEconomics: {
    grossSales: 242800,
    discounts: 14600,
    returns: 8236,
    netSales: 219964,
    cogs: 72149,
    shippingCosts: 12400,
    adSpend: 31200,
    paymentFees: 6380,
    netProfit: 97835,
    netMargin: 44.4,
  }
};

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'assistant',
    content: "👋 Hello Alex! I am your **AI Business Copilot**.\n\nI've analyzed **Aura Athletics & Gear** across 1,420 orders and 48 products. Your business is operating with a strong **88/100 Ecommerce Health Score** and an overall gross margin of **67.2%**.\n\nHere are some strategic topics we can explore immediately:",
    timestamp: '2026-08-13T22:35:00Z',
    structuredData: {
      type: 'action_items',
      title: 'Top AI Recommended Action Items',
      items: [
        { label: 'Promote Star SKU', value: '+18.4% MoM', note: 'Compression Tights generates $56.5k with 74.4% margin. Double ad budget.' },
        { label: 'Fix Low Margin SKU', value: '37.1% margin', note: 'Titanium Electrolyte Flask COGS is too high ($28.90). Bundle or raise price by $6.' },
        { label: 'Restock Risk Alert', value: '24 units left', note: 'Hydro Hydration Vest will stock out in ~4 days at current velocity.' }
      ]
    },
    suggestedFollowups: [
      'What are my most profitable products?',
      'Why did my profit decrease?',
      'Which products should I promote?',
      'What should I do to increase my margin?',
      'Give me a summary of my business.'
    ]
  }
];

export const INITIAL_REPORTS: BusinessReport[] = [
  {
    id: 'rep_2026_q2',
    title: 'Q2 2026 Executive Profitability & Unit Economics Audit',
    period: 'Q2 2026 (Apr - Jun)',
    createdAt: '2026-07-02T10:00:00Z',
    author: 'AI Business Copilot Engine',
    status: 'generated',
    executiveSummary: 'Total store revenue reached $612,400 with a blended gross profit margin of 66.8%. Strong performance in the Activewear category offset rising freight and customer acquisition costs in Outerwear.',
    revenueSummary: {
      totalRevenue: 612400,
      revenueGrowth: '+22.4% vs Q1',
      topDriver: 'Pro Performance Compression Tights (31% of revenue)',
      underperformingChannel: 'Social Commerce (-4.1% MoM)',
    },
    profitSummary: {
      grossProfit: 409083,
      blendedMargin: 66.8,
      cogsRatio: '33.2% of Net Revenue',
      adEfficiency: '3.8x Blended ROAS ($64,200 ad spend)',
    },
    productPerformance: {
      starSku: 'AURA-CMP-001 (Compression Tights)',
      highestMarginSku: 'AURA-BR-004 (Sports Bra - 79.2%)',
      marginBleederSku: 'AURA-FLK-003 (Titanium Flask - 37.1%)',
      stockoutRiskCount: 2,
    },
    customerSummary: {
      newCustomers: 2410,
      repeatRate: '28.4%',
      customerLtv: 218.50,
      averageAov: 152.80,
    },
    businessRisks: [
      {
        severity: 'high',
        title: 'Supplier Lead Time Inflation on Waterproof Zippers',
        description: 'Outerwear production cycle has stretched from 21 days to 38 days, creating potential stockout vulnerability in Autumn.',
        mitigation: 'Pre-order 60-day buffer stock and negotiate split-shipment air freight.'
      },
      {
        severity: 'medium',
        title: 'High Return Rate on Reflective Windbreaker',
        description: 'Return rate stands at 14.8% due to sizing complaints in shoulder dimensions.',
        mitigation: 'Update product page sizing calculator and add real-model fit video.'
      }
    ],
    aiRecommendations: [
      {
        priority: 'immediate',
        category: 'pricing',
        title: 'Reprice Low-Margin Hardware Line',
        impact: '+$14,200 Annual Gross Profit',
        description: 'Increase Anodized Titanium Flask price from $46 to $52. Demand elasticity testing predicts <3% conversion drop with +15% margin expansion.'
      },
      {
        priority: 'short-term',
        category: 'marketing',
        title: 'Automated Post-Purchase High-Margin Cross-Sells',
        impact: '+$8.20 AOV Increase',
        description: 'Trigger 1-click upsell for Recycled Trail Running Socks (78.7% margin) on all compression tights purchases.'
      },
      {
        priority: 'medium-term',
        category: 'inventory',
        title: 'Safety Stock Adjustment for Hydration Line',
        impact: 'Zero Lost Sales in Peak Season',
        description: 'Set automated reorder trigger at 45 units instead of 15 units based on 30-day velocity.'
      }
    ]
  }
];

export const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    logo: 'shopify',
    description: 'Sync real-time orders, products, inventory, customer profiles, and refund data automatically.',
    status: 'connected',
    lastSync: '10 minutes ago',
    storeUrl: 'aura-athletics.myshopify.com',
    dataTypes: ['Orders', 'Products', 'Customers', 'Inventory', 'Refunds']
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    logo: 'woocommerce',
    description: 'Connect WordPress WooCommerce via REST API for sales tracking, fees, and margin calculation.',
    status: 'connected',
    lastSync: '45 minutes ago',
    storeUrl: 'nordicminimal.com',
    dataTypes: ['Orders', 'Products', 'Customers']
  },
  {
    id: 'csv',
    name: 'CSV / Excel Spreadsheet',
    logo: 'csv',
    description: 'Upload custom sales files, warehouse costs, offline distributor invoices, and manual catalog exports.',
    status: 'connected',
    lastSync: 'Yesterday',
    storeUrl: 'catalog-v3-export.csv',
    dataTypes: ['Offline Orders', 'COGS Overrides', 'Supplier Invoices']
  },
  {
    id: 'amazon',
    name: 'Amazon Seller Central',
    logo: 'amazon',
    description: 'FBA & FBM inventory synchronization, advertising spend attribution, and FBA fee deductions.',
    status: 'not_connected',
    dataTypes: ['FBA Orders', 'Seller Fees', 'Ad Spend']
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    logo: 'stripe',
    description: 'Direct payment gateway transaction reconciliation, dispute metrics, and net payout tracking.',
    status: 'not_connected',
    dataTypes: ['Processing Fees', 'Disputes', 'Net Payouts']
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Essential analytics and AI business metrics for single-store creators and new launches.',
    features: [
      '1 Connected Store (Shopify, Woo, or CSV)',
      'Up to 250 orders / month analysis',
      '10 AI Copilot queries per day',
      'Basic Sales & Margin Dashboard',
      'CSV Data Import & Validation',
      '30-day historical data retention'
    ],
    limits: {
      stores: 1,
      ordersPerMonth: '250 orders',
      aiQueriesPerDay: '10 / day',
      teamMembers: 1,
      historicalData: '30 days'
    }
  },
  {
    id: 'pro',
    name: 'Pro Growth',
    priceMonthly: 49,
    priceYearly: 39,
    popular: true,
    description: 'Advanced profitability engine, automated unit economics, and unlimited AI Copilot insights for scaling brands.',
    features: [
      'Up to 5 Connected Stores',
      'Unlimited monthly order analysis',
      'Unlimited AI Copilot queries & custom prompts',
      'Automated Unit Economics & COGS Waterfall',
      'Executive Report Generator with PDF Export',
      'Real-time Stockout & Margin Bleed alerts',
      'Advanced Customer Cohort & LTV tracking',
      'Priority email and Slack support'
    ],
    limits: {
      stores: 5,
      ordersPerMonth: 'Unlimited',
      aiQueriesPerDay: 'Unlimited',
      teamMembers: 5,
      historicalData: '2 Years'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 199,
    priceYearly: 159,
    description: 'Custom multi-brand omnichannel data lake, custom AI models, and dedicated business analyst consultation.',
    features: [
      'Unlimited Stores & Multi-brand aggregation',
      'Custom ERP & Warehouse API integrations',
      'Custom fine-tuned AI prompts & rules',
      'Real-time automated webhook triggers',
      'Dedicated Customer Success & Margin Strategist',
      'Custom SLA (99.9% uptime guaranteed)',
      'Enterprise SSO & RBAC permissions',
      'Custom financial reporting formatting'
    ],
    limits: {
      stores: 999,
      ordersPerMonth: 'Unlimited (Multi-Million)',
      aiQueriesPerDay: 'Dedicated AI Cluster',
      teamMembers: 50,
      historicalData: 'Unlimited Lifetime'
    }
  }
];
