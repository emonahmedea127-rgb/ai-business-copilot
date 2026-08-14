import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Percent,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Sparkles,
  ChevronRight,
  Package,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { AnalyticsData, Product, Order } from '../../types';
import { api } from '../../lib/api/client';
import { useNavigation } from '../../lib/navigation';
import { BusinessHealthScore } from './BusinessHealthScore';
import { DailyBriefingCard } from './DailyBriefingCard';
import { SmartAlerts } from './SmartAlerts';


export const OverviewView: React.FC = () => {
  const { navigate } = useNavigation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'profit' | 'orders'>('revenue');

  useEffect(() => {
    async function loadData() {
      try {
        const [a, p, o] = await Promise.all([
          api.getAnalytics(),
          api.getProducts(),
          api.getOrders()
        ]);
        setAnalytics(a);
        setProducts(p);
        setOrders(o);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Loading store analytics...</span>
        </div>
      </div>
    );
  }

  const { metrics, timeSeries, unitEconomics } = analytics;
  const topProducts = [...products].sort((a, b) => b.grossProfit - a.grossProfit).slice(0, 4);
  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Today's Business Briefing Card */}
      <DailyBriefingCard />

      {/* 2. Business Health Score Index */}
      <BusinessHealthScore onExploreMetrics={() => navigate('/dashboard/analytics')} />

      {/* 3. Smart Margin & Inventory Alerts */}
      <SmartAlerts />

      {/* 4. 6 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Revenue */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Revenue</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            $84,920.00
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% Revenue Growth</span>
          </div>
        </div>

        {/* Metric 2: Net Profit */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Net Profit</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            $31,420.00
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.6% Profit Growth</span>
          </div>
        </div>

        {/* Metric 3: Total Orders */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            1,428
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+15.2% Orders Growth</span>
          </div>
        </div>

        {/* Metric 4: AOV */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Avg. Order Value</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            $59.46
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.8% MoM</span>
          </div>
        </div>

        {/* Metric 5: Profit Margin */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Profit Margin</span>
            <Percent className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-indigo-300 font-mono">
            37.0%
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-rose-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-3.2% Shipping Cost</span>
          </div>
        </div>

        {/* Metric 6: Active Customers */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Customers</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            1,842
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+9.4% Growth</span>
          </div>
        </div>
      </div>

      {/* Main Chart Section: Revenue & Profit Trends */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Financial Trajectory & Margin Velocity</h3>
            <p className="text-xs text-slate-400">Gross revenue compared with production costs and net gross profit</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                chartMetric === 'revenue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue & Profit
            </button>
            <button
              onClick={() => setChartMetric('profit')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                chartMetric === 'profit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Profit Only
            </button>
            <button
              onClick={() => setChartMetric('orders')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                chartMetric === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Order Count
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={val => chartMetric === 'orders' ? `${val}` : `$${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1424',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [
                  chartMetric === 'orders' ? `${value} orders` : `$${Number(value).toLocaleString()}`,
                  ''
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {chartMetric === 'revenue' && (
                <>
                  <Area type="monotone" name="Gross Revenue" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" name="Gross Profit" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                </>
              )}
              {chartMetric === 'profit' && (
                <Area type="monotone" name="Gross Profit" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
              )}
              {chartMetric === 'orders' && (
                <Area type="monotone" name="Orders Placed" dataKey="orders" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrders)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing SKUs */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                Top Profit Contributors
              </h3>
              <p className="text-[11px] text-slate-400">Ranked by gross dollar contribution</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/products')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              All Products <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map(p => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {p.sku} • {p.unitsSold} units • Price: ${p.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-emerald-400">
                    +${p.grossProfit.toFixed(2)}/unit
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    {p.margin}% margin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Stream */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-400" />
                Live Order Ledger
              </h3>
              <p className="text-[11px] text-slate-400">Recent completed transactions & profit</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentOrders.map(order => (
              <div
                key={order.id}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-200">{order.customerName}</div>
                  <div className="text-[10px] text-slate-400">
                    {order.orderNumber} • {order.itemsCount} item(s) • {order.channel}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">${order.revenue.toFixed(2)}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    +${order.profit.toFixed(2)} ({order.margin}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
