import React from 'react';
import {
  XCircle,
  CheckCircle2,
  FileSpreadsheet,
  Calculator,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Bot,
  AlertTriangle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

export const BeforeAfterSection: React.FC = () => {
  const { navigate } = useNavigation();

  const withoutItems = [
    {
      icon: FileSpreadsheet,
      title: 'Fragile Spreadsheets',
      desc: 'Clunky Excel sheets with broken formulas and manual VLOOKUP data entry.'
    },
    {
      icon: Calculator,
      title: 'Manual Unit Economics',
      desc: 'Spending 8+ hours every week hand-calculating shipping, returns, and ad CAC per SKU.'
    },
    {
      icon: Layers,
      title: 'Multiple Disconnected Dashboards',
      desc: 'Jumping between Shopify, Meta Ads, Google Analytics, and shipping carrier portals.'
    },
    {
      icon: HelpCircle,
      title: 'Guesswork Pricing & Ad Spend',
      desc: 'Scaling ad spend on items that look like winners on revenue, but actually lose cash on net margin.'
    },
    {
      icon: Clock,
      title: 'Time-Consuming Retrospectives',
      desc: 'Discovering margin bleeders weeks after thousands of dollars in ad budget have been wasted.'
    }
  ];

  const withItems = [
    {
      icon: Zap,
      title: 'Automatic Real-Time Insights',
      desc: 'Autonomous ingestion of orders, COGS, and ad spend with instant waterfall ledger calculations.'
    },
    {
      icon: Sparkles,
      title: 'SKU Profit Intelligence',
      desc: 'True product-level net contribution margins clearly separating Star SKUs from bleeders.'
    },
    {
      icon: Bot,
      title: 'Actionable AI Recommendations',
      desc: 'Specific daily decisions on price calibration, bundle formulation, and ad spend reallocations.'
    },
    {
      icon: AlertTriangle,
      title: 'Proactive Smart Alerts',
      desc: 'Instant notifications when shipping surcharges spike, return rates surge, or stockouts loom.'
    },
    {
      icon: Calendar,
      title: 'Daily Business Briefing',
      desc: 'A prioritized morning snapshot with 3 concrete actions to execute each day for maximum profit.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
          The Modern Operating Standard
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How ecommerce analysis changes with AI Business Copilot
        </p>
        <p className="text-slate-400 text-sm sm:text-base mt-4">
          Replace backward-looking spreadsheet guesswork with automated daily profit intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: WITHOUT AI BUSINESS COPILOT */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-rose-500/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/5 blur-[90px] rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                  The Old Manual Way
                </span>
                <h3 className="text-lg font-bold text-white">Without AI Business Copilot</h3>
              </div>
            </div>

            <div className="space-y-4">
              {withoutItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <span className="text-xs text-rose-400/80 font-medium">
              Result: Slow decisions, margin bleeders, and missed growth opportunities
            </span>
          </div>
        </div>

        {/* Right Column: WITH AI BUSINESS COPILOT */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#10172c] to-[#0d121f] border-2 border-indigo-500 shadow-2xl shadow-indigo-600/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-500/20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-md shadow-indigo-500/30">
                <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center text-indigo-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  The AI-Powered Standard
                </span>
                <h3 className="text-lg font-bold text-white">With AI Business Copilot</h3>
              </div>
            </div>

            <div className="space-y-4">
              {withItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        {item.title}
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-emerald-400 font-semibold">
              Result: Predictable unit economics and higher net take-home profit
            </span>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              Experience The Difference <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
