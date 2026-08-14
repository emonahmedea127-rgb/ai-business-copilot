import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Circle,
  ArrowRight,
  ShieldAlert,
  DollarSign
} from 'lucide-react';
import { DailyBriefingData } from '../../types';
import { useNavigation } from '../../lib/navigation';

interface DailyBriefingCardProps {
  className?: string;
}

const DEFAULT_BRIEFING: DailyBriefingData = {
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  revenueSummary: '$84,920.00 (↑ +18.4% vs last week)',
  profitSummary: '$31,420.00 (↑ +12.6% Net Profit, 37.0% margin)',
  importantChanges: 'Revenue is up 18.4%, but profit margin decreased 3.2% due to higher expedited carrier shipping costs.',
  topOpportunity: 'Reallocating $2,500 ad budget toward "Pro Performance Compression Tights" (+74.4% margin) projected to unlock +$8,400 in net profit.',
  biggestRisk: '2 top-selling SKUs (Aero Mesh Singlet & Ribbed Legging) are under 5 days of reserve inventory velocity.',
  recommendedActions: [
    {
      id: 'act-1',
      text: 'Review Product A (Heavyweight Oversized Hoodie) margin & supplier cost basis',
      impact: '+$4,200/mo',
      category: 'Margin',
      completed: false
    },
    {
      id: 'act-2',
      text: 'Reduce shipping cost by rerouting Midwest orders to Regional fulfillment hub',
      impact: '+$3,100/mo',
      category: 'Operations',
      completed: false
    },
    {
      id: 'act-3',
      text: 'Promote Product C (Seamless High-Rise Ribbed Legging) with VIP email segment',
      impact: '+$5,800/mo',
      category: 'Revenue',
      completed: false
    }
  ]
};

export const DailyBriefingCard: React.FC<DailyBriefingCardProps> = ({ className = '' }) => {
  const { navigate } = useNavigation();
  const [briefing, setBriefing] = useState<DailyBriefingData>(DEFAULT_BRIEFING);
  const [actions, setActions] = useState(DEFAULT_BRIEFING.recommendedActions);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-indigo-500/30 relative overflow-hidden shadow-xl ${className}`}>
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Today's Business Briefing
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {briefing.date}
              </span>
            </h3>
            <p className="text-xs text-slate-400">AI-synthesized morning financial diagnosis & priorities</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">
            Progress: <strong className="text-emerald-400">{completedCount}/{actions.length}</strong> Completed
          </span>
        </div>
      </div>

      {/* Grid: Financial Snapshot & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5 relative z-10">
        {/* Revenue & Profit Pulse */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Financial Summary
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Revenue Trajectory</span>
              <span className="font-bold text-white text-sm">{briefing.revenueSummary}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Net Profit Realized</span>
              <span className="font-bold text-emerald-400 text-sm">{briefing.profitSummary}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Important Change:</strong> {briefing.importantChanges}
            </span>
          </div>
        </div>

        {/* Strategic Opportunity & Risk */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Diagnostic Vectors
          </span>

          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-slate-300 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 text-[11px] block">Top Opportunity:</strong>
              <span className="text-[11px] text-slate-300">{briefing.topOpportunity}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-slate-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 text-[11px] block">Biggest Operational Risk:</strong>
              <span className="text-[11px] text-slate-300">{briefing.biggestRisk}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items Checklist */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            Today's Priority Actions ({actions.length})
          </span>
          <span className="text-[11px] text-slate-500">Click circle to mark completed</span>
        </div>

        <div className="space-y-2">
          {actions.map((act, index) => {
            return (
              <div
                key={act.id}
                onClick={() => toggleAction(act.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  act.completed
                    ? 'bg-emerald-950/10 border-emerald-500/30 text-slate-400 line-through'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 text-indigo-400">
                    {act.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                  <div className="text-xs min-w-0">
                    <span className="font-semibold text-white mr-2">#{index + 1}</span>
                    <span className={act.completed ? 'line-through text-slate-400' : 'text-slate-200'}>
                      {act.text}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {act.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {act.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Updated in real-time from active store order feeds
          </span>
          <button
            onClick={() => navigate('/dashboard/ai-assistant')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            Ask AI to execute optimizations <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
