import React, { useState, useEffect, useRef } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Percent,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Calendar,
  ArrowUpRight,
  Bot,
  Zap,
  CheckCircle2,
  Layers,
  Database,
  Cpu,
  BrainCircuit,
  Compass
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

export const HeroDashboardPreview: React.FC = () => {
  const { navigate } = useNavigation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax / 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'30D' | '7D' | '90D'>('30D');

  // Animated KPI numbers counting up smoothly
  const [kpiValues, setKpiValues] = useState({
    revenue: 0,
    profit: 0,
    orders: 0,
    margin: 0
  });

  // Active hover point on chart
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    // Trigger entry transition
    const timer = setTimeout(() => {
      setHasAnimatedIn(true);
    }, 150);

    // Smooth count-up animation for KPIs
    const duration = 1400;
    const startTime = performance.now();
    const target = {
      revenue: 219564,
      profit: 47815,
      orders: 1420,
      margin: 21.8
    };

    let animationFrameId: number;

    const animateKPIs = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setKpiValues({
        revenue: Math.floor(target.revenue * ease),
        profit: Math.floor(target.profit * ease),
        orders: Math.floor(target.orders * ease),
        margin: Number((target.margin * ease).toFixed(1))
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateKPIs);
      }
    };

    animationFrameId = requestAnimationFrame(animateKPIs);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Desktop Mouse Parallax Handler (Smooth & Restrained)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Restrain max rotation to ±2.5 degrees for an ultra-subtle premium feel
    setTilt({
      x: -(y * 4), // RotateX
      y: x * 4     // RotateY
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setHoveredPoint(null);
  };

  // Chart data nodes
  const chartPoints = [
    { day: 'Day 1', revenue: '$4,200', profit: '$920', x: 0, y: 130, profitY: 145 },
    { day: 'Day 5', revenue: '$5,800', profit: '$1,250', x: 116, y: 110, profitY: 136 },
    { day: 'Day 10', revenue: '$6,400', profit: '$1,420', x: 233, y: 92, profitY: 128 },
    { day: 'Day 15', revenue: '$8,100', profit: '$1,780', x: 350, y: 72, profitY: 115 },
    { day: 'Day 20', revenue: '$7,600', profit: '$1,540', x: 466, y: 64, profitY: 104 },
    { day: 'Day 25', revenue: '$9,400', profit: '$2,150', x: 583, y: 38, profitY: 88 },
    { day: 'Day 30', revenue: '$11,200', profit: '$2,440', x: 700, y: 15, profitY: 76 }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-6xl mx-auto relative select-none"
      style={{
        perspective: '1200px'
      }}
    >
      {/* 1. VISUAL DATA FLOW: "Store Data → AI Analysis → Business Insights → Better Decisions" */}
      <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-[#11151D] border border-[#1E293B] shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs relative z-10">
          {/* Step 1: Store Data Sources */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#08090D] border border-[#1E293B] w-full md:w-auto justify-center sm:justify-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#22D3EE] shrink-0">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-[#F8FAFC] text-[11px]">Store Data Streams</div>
              <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                <span>Shopify</span>
                <span>•</span>
                <span>Woo</span>
                <span>•</span>
                <span>Stripe / CSV</span>
              </div>
            </div>
          </div>

          {/* Animated Connecting Arrow 1 */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-500 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
            <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-500/60 to-violet-500/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/70 w-2 h-full animate-[beamSweep_2s_infinite]" />
            </div>
            <ArrowRight className="w-3 h-3 text-[#8B5CF6]" />
          </div>

          {/* Step 2: AI Analysis Engine */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-violet-950/20 border border-violet-500/30 w-full md:w-auto justify-center sm:justify-start shadow-inner">
            <div className="w-6 h-6 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-[#8B5CF6] shrink-0">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-violet-200 text-[11px] flex items-center gap-1.5">
                AI Analysis Engine
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
              </div>
              <div className="text-[10px] text-violet-300/80">
                Unit COGS • Realized Margins • Churn
              </div>
            </div>
          </div>

          {/* Animated Connecting Arrow 2 */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-500 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            <div className="w-8 h-[2px] bg-gradient-to-r from-violet-500/60 to-cyan-500/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/70 w-2 h-full animate-[beamSweep_2s_infinite_0.7s]" />
            </div>
            <ArrowRight className="w-3 h-3 text-[#22D3EE]" />
          </div>

          {/* Step 3: Business Insights */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#08090D] border border-[#1E293B] w-full md:w-auto justify-center sm:justify-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#22D3EE] shrink-0">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-[#F8FAFC] text-[11px]">Business Insights</div>
              <div className="text-[10px] text-[#94A3B8]">
                Bleeder SKUs • Star Bundles
              </div>
            </div>
          </div>

          {/* Animated Connecting Arrow 3 */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-500 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
            <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-500/60 to-emerald-500/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/70 w-2 h-full animate-[beamSweep_2s_infinite_1.4s]" />
            </div>
            <ArrowRight className="w-3 h-3 text-[#34D399]" />
          </div>

          {/* Step 4: Better Decisions */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#08090D] border border-emerald-500/30 w-full md:w-auto justify-center sm:justify-start">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#34D399] shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-[#34D399] text-[11px]">Better Decisions</div>
              <div className="text-[10px] text-[#94A3B8]">
                +12.4% Profit Recovery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN 3D TILT DASHBOARD CONTAINER */}
      <div
        className="rounded-2xl sm:rounded-3xl bg-[#11151D] border border-[#1E293B] shadow-2xl overflow-hidden relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Ambient Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1E293B 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* 3. Top Browser / App Chrome Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#08090D] border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
            </div>
            <span className="font-bold text-[#F8FAFC]">Aura Athletics</span>
            <span className="text-slate-600">•</span>
            <span className="text-[#94A3B8] hidden sm:inline">Store Overview & Copilot Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#11151D] px-2.5 py-1 rounded-lg border border-[#1E293B] text-[11px] text-[#94A3B8]">
              <Calendar className="w-3 h-3 text-indigo-400" />
              <span>Last 30 Days</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[11px] font-semibold text-[#6366F1] hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Live App</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Main Dashboard Body */}
        <div className="p-5 sm:p-7 space-y-6 relative z-10">
          {/* KPI CARDS ROW (4 KPIs: Revenue, Profit, Orders, Margin) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* KPI 1: Revenue */}
            <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E293B] hover:border-slate-700 transition-all group/card relative overflow-hidden">
              <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
                <span className="text-xs font-medium">Revenue</span>
                <DollarSign className="w-3.5 h-3.5 text-[#22D3EE] group-hover/card:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-mono tracking-tight">
                ${kpiValues.revenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-[#34D399]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4%</span>
                <span className="text-[#94A3B8] font-normal ml-0.5">vs prior</span>
              </div>
            </div>

            {/* KPI 2: Net Profit */}
            <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E293B] hover:border-slate-700 transition-all group/card relative overflow-hidden">
              <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
                <span className="text-xs font-medium">Net Profit</span>
                <DollarSign className="w-3.5 h-3.5 text-[#34D399] group-hover/card:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#34D399] font-mono tracking-tight">
                ${kpiValues.profit.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-[#34D399]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.8%</span>
                <span className="text-[#94A3B8] font-normal ml-0.5">realized margin</span>
              </div>
            </div>

            {/* KPI 3: Orders */}
            <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E293B] hover:border-slate-700 transition-all group/card relative overflow-hidden">
              <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
                <span className="text-xs font-medium">Orders</span>
                <ShoppingCart className="w-3.5 h-3.5 text-[#22D3EE] group-hover/card:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-mono tracking-tight">
                {kpiValues.orders.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-[#34D399]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+9.2%</span>
                <span className="text-[#94A3B8] font-normal ml-0.5">volume</span>
              </div>
            </div>

            {/* KPI 4: Profit Margin */}
            <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E293B] hover:border-slate-700 transition-all group/card relative overflow-hidden">
              <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
                <span className="text-xs font-medium">Profit Margin</span>
                <Percent className="w-3.5 h-3.5 text-[#34D399] group-hover/card:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#34D399] font-mono tracking-tight">
                {kpiValues.margin.toFixed(1)}%
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-[#34D399]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+2.4%</span>
                <span className="text-[#94A3B8] font-normal ml-0.5">blended</span>
              </div>
            </div>
          </div>

          {/* 5. Middle Section: Revenue & Profit Chart Simulation with Smooth SVG Path */}
          <div className="p-5 rounded-2xl bg-[#08090D] border border-[#1E293B] relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-[#1E293B] gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                  Performance Trajectory
                </span>
                <h4 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                  Revenue vs Net Realized Contribution
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-[#34D399] border border-emerald-500/20">
                    Live Sync
                  </span>
                </h4>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                  <span className="text-[#94A3B8]">Gross Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                  <span className="text-[#94A3B8]">Net Profit</span>
                </div>
              </div>
            </div>

            {/* SVG Line & Area Chart with smooth draw animation */}
            <div className="relative h-44 sm:h-52 w-full pt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 160">
                <defs>
                  <linearGradient id="heroRevGradientAnim" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="heroProfitGradientAnim" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Grid Guidelines */}
                <line x1="0" y1="30" x2="700" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="700" y2="75" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="700" y2="120" stroke="#1E293B" strokeDasharray="3 3" />

                {/* Revenue Area & Smooth Stroke */}
                <path
                  d="M 0 130 C 100 110, 180 85, 270 95 C 360 105, 450 60, 540 50 C 620 40, 680 20, 700 15 L 700 155 L 0 155 Z"
                  fill="url(#heroRevGradientAnim)"
                />
                <path
                  d="M 0 130 C 100 110, 180 85, 270 95 C 360 105, 450 60, 540 50 C 620 40, 680 20, 700 15"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.5"
                  className="hero-chart-draw"
                />

                {/* Net Profit Area & Smooth Stroke */}
                <path
                  d="M 0 145 C 100 138, 180 130, 270 132 C 360 134, 450 110, 540 105 C 620 95, 680 82, 700 78 L 700 155 L 0 155 Z"
                  fill="url(#heroProfitGradientAnim)"
                />
                <path
                  d="M 0 145 C 100 138, 180 130, 270 132 C 360 134, 450 110, 540 105 C 620 95, 680 82, 700 78"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  className="hero-chart-draw"
                />

                {/* Interactive Data Points */}
                {chartPoints.map((pt, idx) => (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(idx)}
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === 6 || hoveredPoint === idx ? '5' : '3'}
                      fill="#22D3EE"
                      stroke="#ffffff"
                      strokeWidth={idx === 6 || hoveredPoint === idx ? '2' : '1'}
                      className="transition-all"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.profitY}
                      r={idx === 6 || hoveredPoint === idx ? '4' : '2.5'}
                      fill="#34D399"
                      stroke="#ffffff"
                      strokeWidth="1"
                      className="transition-all"
                    />
                  </g>
                ))}

                {/* Pulsing ring on current final node */}
                <circle cx="700" cy="15" r="8" fill="none" stroke="#22D3EE" strokeWidth="1" className="animate-ping" />
              </svg>

              {/* Tooltip on hovered point */}
              {hoveredPoint !== null && (
                <div
                  className="absolute pointer-events-none p-2 rounded-lg bg-[#11151D] border border-[#1E293B] text-[10px] text-white shadow-xl z-30 transition-all"
                  style={{
                    left: `${Math.min(Math.max(chartPoints[hoveredPoint].x - 40, 10), 600)}px`,
                    top: '10px'
                  }}
                >
                  <div className="font-bold text-[#22D3EE]">{chartPoints[hoveredPoint].day}</div>
                  <div>Rev: <span className="font-mono text-white">{chartPoints[hoveredPoint].revenue}</span></div>
                  <div>Profit: <span className="font-mono text-[#34D399]">{chartPoints[hoveredPoint].profit}</span></div>
                </div>
              )}

              {/* X-Axis labels */}
              <div className="flex justify-between text-[10px] text-[#94A3B8] pt-2 font-mono">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4 (Current)</span>
              </div>
            </div>
          </div>

          {/* 6. AI Insight Panel */}
          <div className="p-4 rounded-xl bg-[#11151D] border border-violet-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[#8B5CF6]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                    AI Business Insight
                  </span>
                  <span className="w-1 h-1 rounded-full bg-violet-400" />
                  <span className="text-[10px] text-[#94A3B8]">Autonomous Anomaly Detection</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5">
                  "Your profit margin increased <strong className="text-[#34D399]">12.4%</strong> this month, but shipping surcharges on low-margin outerwear caused $6.8k margin drag."
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard/ai-assistant')}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-indigo-500 text-white transition-colors shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer relative z-10"
            >
              <span>View Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 7. FLOATING PILL 1 (TOP RIGHT): "+18.6% Revenue" */}
      <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#11151D] border border-emerald-500/30 shadow-2xl backdrop-blur-md absolute -top-4 -right-2 z-20 animate-float-slow">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#34D399]">
          <ArrowUpRight className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-white flex items-center gap-1">
            <span className="text-[#34D399]">+18.6%</span>
            <span>Revenue</span>
          </div>
          <div className="text-[9px] text-[#94A3B8]">Accelerating Trajectory</div>
        </div>
      </div>

      {/* 8. FLOATING PILL 2 (BOTTOM LEFT): "AI Insight: Margin +12.4%" */}
      <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#11151D] border border-violet-500/30 shadow-2xl backdrop-blur-md absolute -bottom-5 -left-3 z-20 animate-float-delayed">
        <div className="w-7 h-7 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-[#8B5CF6]">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-white flex items-center gap-1">
            <span className="text-violet-300">AI Insight</span>
            <span className="w-1 h-1 rounded-full bg-[#34D399]" />
            <span className="text-[#34D399] font-mono">+12.4% Profit Margin</span>
          </div>
          <div className="text-[9px] text-[#94A3B8]">Identified 3 Star Product Bundles</div>
        </div>
      </div>
    </div>
  );
};
