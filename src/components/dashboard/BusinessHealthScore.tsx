import React, { useState } from 'react';
import { Award, TrendingUp, Info, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BusinessHealthBreakdown } from '../../types';

interface BusinessHealthScoreProps {
  data?: BusinessHealthBreakdown;
  className?: string;
  onExploreMetrics?: () => void;
}

const DEFAULT_HEALTH: BusinessHealthBreakdown = {
  overall: 87,
  grade: 'A',
  categories: {
    revenue: 92,
    profitability: 81,
    products: 88,
    customers: 86,
    growth: 91
  }
};

export const BusinessHealthScore: React.FC<BusinessHealthScoreProps> = ({
  data = DEFAULT_HEALTH,
  className = '',
  onExploreMetrics
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // SVG circular gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.overall / 100) * circumference;

  const categories = [
    {
      key: 'revenue',
      label: 'Revenue',
      score: data.categories.revenue,
      description: 'Consistent top-line velocity and daily GMV stability across sales channels',
      color: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-500'
    },
    {
      key: 'profitability',
      label: 'Profitability',
      score: data.categories.profitability,
      description: 'Healthy 37% blended gross margin, slightly dampened by shipping surcharges',
      color: 'from-indigo-500 to-cyan-400',
      bgColor: 'bg-indigo-500'
    },
    {
      key: 'products',
      label: 'Products',
      score: data.categories.products,
      description: 'Strong catalog concentration with 74% margin star SKU leadership',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500'
    },
    {
      key: 'customers',
      label: 'Customers',
      score: data.categories.customers,
      description: 'High repeat purchase rate (34.2%) and steady VIP cohort expansion',
      color: 'from-amber-500 to-orange-400',
      bgColor: 'bg-amber-500'
    },
    {
      key: 'growth',
      label: 'Growth',
      score: data.categories.growth,
      description: '+18.4% month-over-month expansion outpacing category benchmarks',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500'
    }
  ];

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800 relative overflow-hidden ${className}`}>
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Business Health Score
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Grade {data.grade} • Optimal
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Holistic index evaluating core financial & operational vectors</p>
          </div>
        </div>

        {onExploreMetrics && (
          <button
            onClick={onExploreMetrics}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            Detailed Audit <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Grid: Circular Ring on Left, 5-Pillar Breakdown on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Ring & Overall Summary */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="relative w-28 h-28 flex items-center justify-center mb-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Foreground Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#healthScoreGradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="healthScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white tracking-tight leading-none">
                {data.overall}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-200">Store Health Index</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 14% of apparel stores
          </div>
        </div>

        {/* 5 Pillar Breakdown Bars */}
        <div className="md:col-span-8 space-y-2.5">
          {categories.map((cat) => {
            const isHovered = activeCategory === cat.key;
            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveCategory(cat.key)}
                onMouseLeave={() => setActiveCategory(null)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${cat.bgColor}`} />
                    {cat.label}
                  </span>
                  <span className="font-bold text-white font-mono">{cat.score} <span className="text-slate-500 font-normal text-[10px]">/ 100</span></span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-700`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                {isHovered && (
                  <p className="text-[10px] text-slate-400 mt-1.5 animate-in fade-in duration-200">
                    {cat.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
