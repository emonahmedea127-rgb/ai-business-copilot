import React from 'react';
import {
  Database,
  Calculator,
  BrainCircuit,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Layers,
  Bot,
  Compass
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

export const BusinessIntelligenceSection: React.FC = () => {
  const { navigate } = useNavigation();

  const stages = [
    {
      step: '01',
      title: 'Connect',
      subtitle: 'Universal Data Ingestion',
      icon: Database,
      accent: 'from-blue-500 to-indigo-500',
      tagColor: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
      description:
        'Ingest raw orders, customer profiles, catalog variants, return webhooks, and ad campaign spend from your stack in seconds without custom API pipelines.',
      highlight: 'Zero engineering required'
    },
    {
      step: '02',
      title: 'Analyze',
      subtitle: 'True Unit Economics Engine',
      icon: Calculator,
      accent: 'from-indigo-500 to-purple-500',
      tagColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
      description:
        'Our financial modeling engine automatically computes net contribution margin waterfalls: Deducting COGS, freight shipping, payment fees, return losses, and blended CAC per SKU.',
      highlight: 'Real-time margin ledger'
    },
    {
      step: '03',
      title: 'Understand',
      subtitle: 'Autonomous Anomaly Detection',
      icon: BrainCircuit,
      accent: 'from-purple-500 to-pink-500',
      tagColor: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
      description:
        'AI isolates margin bleeders, hidden product winners, ad overspend, and stockout velocity risks, translating noisy telemetry into clear diagnostics.',
      highlight: '99% faster diagnosis'
    },
    {
      step: '04',
      title: 'Act',
      subtitle: 'Daily Executive Decisions',
      icon: Zap,
      accent: 'from-emerald-500 to-teal-500',
      tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
      description:
        'Receive a morning briefing with 3 high-impact prioritized actions: exact price calibrations, SKU bundle formulations, and ad spend reallocations for maximum profit.',
      highlight: 'High-ROI execution'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
          The Operating Architecture
        </h2>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          From raw data to clear decisions.
        </p>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
          How AI Business Copilot bridges the gap between chaotic multi-channel ecommerce data and confident daily profit actions.
        </p>
      </div>

      {/* 4 Stages Editorial Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#0c101d] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group overflow-hidden"
            >
              {/* Subtle top border accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stage.accent} opacity-40 group-hover:opacity-100 transition-opacity`}
              />

              <div>
                {/* Step number and Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-slate-700 group-hover:text-slate-500 transition-colors">
                    {stage.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${stage.tagColor} inline-block mb-3`}>
                  {stage.subtitle}
                </span>

                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  {stage.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              {/* Bottom highlight pill */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Key takeaway:</span>
                <span className="text-indigo-400 font-medium">{stage.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Prompt */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer shadow-md shadow-indigo-950/40"
        >
          <span>Explore how Aura Athletics operates with AI Copilot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
