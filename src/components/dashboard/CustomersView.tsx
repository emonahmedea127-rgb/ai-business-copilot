import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Award,
  DollarSign,
  TrendingUp,
  Mail,
  Calendar,
  AlertTriangle,
  UserCheck,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Customer } from '../../types';
import { api } from '../../lib/api/client';
import { useNavigation } from '../../lib/navigation';

export const CustomersView: React.FC = () => {
  const { navigate } = useNavigation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const list = await api.getCustomers();
        setCustomers(list);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSegment = selectedSegment === 'all' || c.segment === selectedSegment;
      return matchSearch && matchSegment;
    });
  }, [customers, searchQuery, selectedSegment]);

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgLtv = customers.length > 0 ? totalSpentAll / customers.length : 0;
  const totalOrders = customers.reduce((acc, c) => acc + c.ordersCount, 0);
  const avgAov = totalOrders > 0 ? totalSpentAll / totalOrders : 0;

  const vipCount = customers.filter(c => c.segment === 'VIP').length;
  const regularCount = customers.filter(c => c.segment === 'Regular').length;
  const atRiskCount = customers.filter(c => c.segment === 'At-Risk').length;
  const newCount = customers.filter(c => c.segment === 'New').length;
  const repeatCount = customers.filter(c => c.ordersCount > 1).length;
  const repeatRate = customers.length > 0 ? ((repeatCount / customers.length) * 100).toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Customer Intelligence & Lifetime Value
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify high-value repeat buyers, track customer LTV, and prevent churn
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/ai-assistant')}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5" /> Ask AI About Customer Retention
        </button>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Total Customers */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Total Customers</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{customers.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">
            +8.9% this month
          </span>
        </div>

        {/* New Customers */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">New Customers</span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{newCount + 24}</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">
            First purchase &lt;30d
          </span>
        </div>

        {/* Repeat Purchase Rate */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Repeat Rate</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono">{repeatRate}%</div>
          <span className="text-[10px] text-purple-300 font-semibold mt-0.5 inline-block">
            {repeatCount} multi-buyers
          </span>
        </div>

        {/* Customer Lifetime Value (LTV) */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Customer LTV</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">${avgLtv.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 inline-block">
            Across all cohorts
          </span>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">Average Order Value</span>
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">${avgAov.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">
            +$8.40 vs benchmark
          </span>
        </div>

        {/* VIP Buyers */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-medium">VIP Buyers ($500+)</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">{vipCount}</div>
          <span className="text-[10px] text-amber-300 font-semibold mt-0.5 inline-block">
            44% total revenue
          </span>
        </div>
      </div>

      {/* AI Cohort Intelligence Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#0d1222] to-[#0c101d] border border-indigo-500/30 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white">AI Cohort Strategy & LTV Diagnostics</h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              High VIP Loyalty
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your VIP segment (<strong className="text-white">Marcus Thorne, Elena Rostova, Tariq Al-Mansoor</strong>) orders 3.8x more frequently with an average LTV of <strong className="text-emerald-400">$1,744</strong>. Re-engaging the <strong className="text-amber-400">{atRiskCount} at-risk customers</strong> with a personalized win-back discount could recover ~$2,400 in lost gross margin.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, email, or domain..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedSegment}
            onChange={e => setSelectedSegment(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Customer Segments ({customers.length})</option>
            <option value="VIP">VIP High Spenders ({vipCount})</option>
            <option value="Regular">Regular Active Buyers ({regularCount})</option>
            <option value="At-Risk">At-Risk / Dormant ({atRiskCount})</option>
            <option value="New">New First-Time Customers ({newCount})</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-2xl bg-[#0c101d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Segment</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Value (LTV)</th>
                <th className="py-3.5 px-4">Avg. Order Value</th>
                <th className="py-3.5 px-4">Last Purchase Date</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCustomers.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{cust.name}</div>
                    <div className="text-[10px] text-slate-400">{cust.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      cust.segment === 'VIP'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : cust.segment === 'At-Risk'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : cust.segment === 'New'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {cust.segment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {cust.ordersCount} order{cust.ordersCount > 1 ? 's' : ''}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                    ${cust.totalSpent.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    ${cust.averageOrderValue.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(cust.lastOrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] font-medium text-emerald-400 inline-flex items-center justify-end gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
