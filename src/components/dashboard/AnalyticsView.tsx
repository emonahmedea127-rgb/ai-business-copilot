import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Layers,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart2,
  AlertTriangle,
  Sparkles,
  ArrowDownRight,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AnalyticsData, Product } from '../../types';
import { api } from '../../lib/api/client';
import { useNavigation } from '../../lib/navigation';

const COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'];

export const AnalyticsView: React.FC = () => {
  const { navigate } = useNavigation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'trends' | 'unit_economics' | 'categories'>('trends');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [a, p] = await Promise.all([api.getAnalytics(), api.getProducts()]);
        setAnalytics(a);
        setProducts(p);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const { metrics, timeSeries, salesByChannel, categoryBreakdown, unitEconomics } = analytics;
  const highMarginProducts = [...products].filter(p => p.margin >= 70);
  const lowMarginProducts = [...products].filter(p => p.margin < 55).sort((a, b) => a.margin - b.margin);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sales & Unit Economics Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep dive into revenue trends, product contribution margins, and sales channel allocation
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'trends' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trend Vectors
          </button>
          <button
            onClick={() => setActiveTab('unit_economics')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'unit_economics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unit Economics Waterfall
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Categories & Channels
          </button>
        </div>
      </div>

      {/* TAB 1: TRENDS */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* 4 Multi-Trend Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Profit Trend */}
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Revenue Trend vs COGS</h3>
                  <p className="text-[11px] text-slate-400">Total volume vs manufacturing cost</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">+{metrics.revenueChange}% MoM</span>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1424', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }} />
                    <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                    <Area type="monotone" name="Cost of Goods" dataKey="cost" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profit Margin % Trend */}
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Gross Margin % Stability</h3>
                  <p className="text-[11px] text-slate-400">Target baseline: &gt; 65.0%</p>
                </div>
                <span className="text-xs font-bold text-indigo-300">Avg {metrics.profitMargin}%</span>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} domain={[60, 75]} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1424', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }} />
                    <Line type="monotone" name="Gross Margin %" dataKey="margin" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quadrants: Star Products vs Low Margin Bleeders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Star SKUs */}
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-emerald-500/20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    High Margin Star SKUs (&gt; 70% Margin)
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Scale Ad Spend
                </span>
              </div>
              <div className="space-y-2.5">
                {highMarginProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div>
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.sku} • {p.unitsSold} units</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">{p.margin}% margin</div>
                      <div className="text-[10px] text-slate-400">${p.grossProfit.toFixed(2)} profit / unit</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Margin Bleeders */}
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-amber-500/20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Low Margin SKUs (&lt; 55% Margin)
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Reprice or Bundle
                </span>
              </div>
              <div className="space-y-2.5">
                {lowMarginProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div>
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.sku} • Cost: ${p.cost.toFixed(2)} / Price: ${p.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-400">{p.margin}% margin</div>
                      <div className="text-[10px] text-slate-400">Needs price calibration</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNIT ECONOMICS WATERFALL */}
      {activeTab === 'unit_economics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
            <div className="max-w-2xl mb-6">
              <h3 className="text-base font-bold text-white">Consolidated Unit Economics Waterfall</h3>
              <p className="text-xs text-slate-400 mt-1">
                Every dollar tracked from gross checkout basket to true net cash profit.
              </p>
            </div>

            {/* Waterfall Ledger Rows */}
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-200">1. Gross Order Sales (Pre-Discount)</span>
                <span className="text-sm font-bold text-white">${unitEconomics.grossSales.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-rose-400 text-xs">
                <span>(-) Promotional Discounts & Coupons</span>
                <span>-${unitEconomics.discounts.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-rose-400 text-xs">
                <span>(-) Customer Returns & Refund Allowances</span>
                <span>-${unitEconomics.returns.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs font-bold">
                <span>(=) Net Realized Sales Revenue</span>
                <span className="text-sm">${unitEconomics.netSales.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-amber-300 text-xs">
                <span>(-) Cost of Goods Sold (COGS Manufacturing & Packaging)</span>
                <span>-${unitEconomics.cogs.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-amber-300 text-xs">
                <span>(-) Outbound Shipping & Fulfillment Fees</span>
                <span>-${unitEconomics.shippingCosts.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-amber-300 text-xs">
                <span>(-) Paid Advertising Spend (Meta, Google, TikTok Ads)</span>
                <span>-${unitEconomics.adSpend.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-amber-300 text-xs">
                <span>(-) Payment Gateway Processing (Stripe / Shopify Pay ~2.9%)</span>
                <span>-${unitEconomics.paymentFees.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-extrabold">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>(=) True Net Bottom-Line Profit</span>
                </div>
                <span className="text-base">${unitEconomics.netProfit.toLocaleString()} ({unitEconomics.netMargin}% Net Margin)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES & CHANNELS */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Channel */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Sales Volume by Channel</h3>
            <p className="text-[11px] text-slate-400 mb-4">Omnichannel store attribution</p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByChannel}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    labelLine={false}
                  >
                    {salesByChannel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f1424', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Profit Breakdown */}
          <div className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Category Margin Contribution</h3>
            <p className="text-[11px] text-slate-400 mb-4">Gross profit by product line</p>
            <div className="space-y-3">
              {categoryBreakdown.map((cat, idx) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{cat.category}</span>
                    <span className="text-emerald-400">${cat.profit.toLocaleString()} ({cat.margin}% margin)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(cat.revenue / 90000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
