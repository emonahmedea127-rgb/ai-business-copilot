import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Download,
  Info,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  RefreshCw,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getSalesForecastData } from '../../lib/forecasting/forecastingService';
import { useNavigation } from '../../lib/navigation';

export const ForecastingView: React.FC = () => {
  const { navigate } = useNavigation();
  const forecastData = getSalesForecastData();

  // Interactive Scenario Simulator State
  const [adSpendLift, setAdSpendLift] = useState<number>(10); // +10%
  const [priceAdjustment, setPriceAdjustment] = useState<number>(5); // +$5
  const [cartThreshold, setCartThreshold] = useState<number>(95); // $95
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Dynamic simulation calculations
  const baselineRevenue = forecastData.projectedRevenueNext30Days;
  const simulatedLift = baselineRevenue * (adSpendLift * 0.005) + (priceAdjustment * 850) + (cartThreshold >= 90 ? 3600 : 0);
  const simulatedRevenue = Math.round(baselineRevenue + simulatedLift);
  const simulatedGrowth = ((simulatedRevenue - forecastData.current30DayRevenue) / forecastData.current30DayRevenue * 100).toFixed(1);

  const handleExportForecast = () => {
    const rows = [
      ['Date', 'Forecast Revenue ($)', 'Best Case ($)', 'Worst Case ($)', 'Est Orders'],
      ...forecastData.points.map(p => [
        p.date,
        p.forecastRevenue.toString(),
        p.bestCase.toString(),
        p.worstCase.toString(),
        p.ordersEstimated.toString()
      ])
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-forecast-30days-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {exportSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>✓ 30-Day Sales Forecast exported to CSV successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AI Sales & Revenue Forecasting
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Monte Carlo Model
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Predictive 30 to 90-day trajectory modeling based on order velocity, customer retention, and unit margins
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportForecast}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Forecast
          </button>
          <button
            onClick={() => navigate('/dashboard/ai-assistant')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" /> Ask AI About Next Month
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Projected Revenue */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Projected 30-Day Rev</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${forecastData.projectedRevenueNext30Days.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{forecastData.expectedGrowthPercent}% vs Current Period</span>
          </div>
        </div>

        {/* Metric 2: Confidence Range (Best/Worst) */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Confidence Range (P10 - P90)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-200 font-mono">
            $234k — $262k
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-emerald-400 font-semibold">{forecastData.confidenceScore}%</span> Model Certainty
          </div>
        </div>

        {/* Metric 3: Modeled Unit Orders */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Projected Orders</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            4,820
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+160 orders/day avg</span>
          </div>
        </div>

        {/* Metric 4: Projected Gross Margin */}
        <div className="p-4 rounded-xl bg-[#0c101d] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Projected Gross Margin</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">
            68.4%
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+$168,800 net contribution</span>
          </div>
        </div>
      </div>

      {/* AI Forecast Summary Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0d1222] to-[#0c101d] border border-indigo-500/30 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white">AI Forecast Executive Summary</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Positive Trajectory
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {forecastData.forecastNarrative}
            </p>
          </div>
        </div>
      </div>

      {/* Main Forecast Trajectory Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Historical Revenue & 30-Day Forward Forecast
            </h3>
            <p className="text-xs text-slate-400">
              Actual sales (solid line) transitioned into predictive confidence band (shaded area)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Projected Base
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Best Case (P90)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Conservative Floor
            </span>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={val => `$${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1424',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Area type="monotone" name="Best Case (P90)" dataKey="bestCase" stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5} fillOpacity={0} />
              <Area type="monotone" name="Base Case Forecast" dataKey="forecastRevenue" stroke="#6366f1" strokeWidth={3} fill="url(#forecastBand)" />
              <Area type="monotone" name="Conservative Floor (P10)" dataKey="worstCase" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} fillOpacity={0} />
              <Line type="monotone" name="Actual Ledger Revenue" dataKey="actualRevenue" stroke="#ffffff" strokeWidth={2.5} dot={{ r: 3, fill: '#ffffff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Growth Drivers & Interactive Scenario Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Drivers & Downside Risks */}
        <div className="space-y-6">
          {/* Key Drivers */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Key Growth Levers Identified by AI
            </h3>
            <div className="space-y-3">
              {forecastData.growthDrivers.map((driver, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between font-semibold text-xs text-white mb-1">
                    <span>{driver.title}</span>
                    <span className="text-emerald-400 font-bold">{driver.impact}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{driver.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Downside Risks */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" />
              Forecast Sensitivity & Operational Risks
            </h3>
            <div className="space-y-3">
              {forecastData.risksToWatch.map((risk, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between font-semibold text-xs text-white mb-1">
                    <span>{risk.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {risk.severity} risk
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Scenario Simulator */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  What-If Revenue Simulator
                </h3>
                <p className="text-[11px] text-slate-400">
                  Test marketing levers and pricing changes on projected 30-day outcome
                </p>
              </div>
              <button
                onClick={() => {
                  setAdSpendLift(10);
                  setPriceAdjustment(5);
                  setCartThreshold(95);
                }}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Slider 1: Ad Spend Increase */}
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                  <span>Paid Ad Budget Adjustment</span>
                  <span className="text-indigo-400 font-bold">+{adSpendLift}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={adSpendLift}
                  onChange={e => setAdSpendLift(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Current ($31.2k)</span>
                  <span>+50% ($46.8k)</span>
                </div>
              </div>

              {/* Slider 2: Star SKU Price Lift */}
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                  <span>Price Adjustment on Top 3 SKUs</span>
                  <span className="text-emerald-400 font-bold">+${priceAdjustment}.00</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={priceAdjustment}
                  onChange={e => setPriceAdjustment(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>+$0 (No change)</span>
                  <span>+$15.00 / unit</span>
                </div>
              </div>

              {/* Slider 3: Free Shipping Cart Threshold */}
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                  <span>Free Shipping Minimum Threshold</span>
                  <span className="text-purple-400 font-bold">${cartThreshold}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="120"
                  step="5"
                  value={cartThreshold}
                  onChange={e => setCartThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$50 (High shipping drag)</span>
                  <span>$120 (Max AOV lift)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Simulated 30-Day Revenue Outcome
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">
                ${simulatedRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                (+{simulatedGrowth}% growth)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Simulated settings add <strong className="text-emerald-400">+${Math.round(simulatedLift).toLocaleString()}</strong> in estimated incremental revenue and expand blended gross margin by ~1.4%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
