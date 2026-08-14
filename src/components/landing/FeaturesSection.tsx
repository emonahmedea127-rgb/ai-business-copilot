import React from 'react';
import {
  Award,
  DollarSign,
  Bot,
  BarChart3,
  PieChart,
  FileText,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Percent,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

export const FeaturesSection: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
          Platform Architecture
        </h2>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Engineered for ecommerce profitability.
        </p>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
          Six specialized intelligence engines working in unison to eliminate spreadsheet guesswork and protect your net margins.
        </p>
      </div>

      {/* Varied Asymmetrical Layout */}
      <div className="space-y-6">
        {/* Top Split: Two Hero Feature Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feature 1: Ecommerce Health Score (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e1424] to-[#090d18] border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ecommerce Health Score</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                  A holistic 0–100 index evaluating margin resilience, inventory turnover, repeat purchase retention, and refund velocity in real time.
                </p>
              </div>

              {/* Visual Health Gauge Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center shrink-0 w-28 text-center">
                <span className="text-2xl font-black text-emerald-400 font-mono">87</span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Grade A • Optimal</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Benchmark: Top 14% of apparel stores</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 2: Profit Intelligence & Waterfall (5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Profit Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Automated waterfall deduction showing Gross Sales → Returns → COGS → Shipping → Ad CAC → Net Take-Home Profit.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-mono font-semibold">+18.4% Realized Margin</span>
              <button
                onClick={() => navigate('/dashboard/analytics')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Split: 4 Dense Capability Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 3: AI Business Assistant */}
          <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">AI Business Assistant</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Conversational strategist that understands catalog SKU unit economics and answers margin questions on demand.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/ai-assistant')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
            >
              <span>Learn more</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 4: Sales Analytics */}
          <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Sales Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Multi-timeframe sales trends, order frequency curves, and cohort lifetime value tracking across customer segments.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
            >
              <span>Learn more</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 5: Product Profitability */}
          <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <PieChart className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Product Profitability</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                SKU matrix ranking Star Products, Cash Cows, and bleeder items where advertising CAC consumes all profit.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/products')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
            >
              <span>Learn more</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 6: Executive Reports */}
          <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Executive Reports</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                One-click boardroom briefs and shareable financial summaries for stakeholders, lenders, and leadership meetings.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/reports')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer pt-3 border-t border-slate-800/80"
            >
              <span>Learn more</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
