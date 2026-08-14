import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Package,
  DollarSign,
  ChevronRight,
  Send
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

interface ShowcaseQuestion {
  id: string;
  query: string;
  label: string;
  response: {
    summary: string;
    reasons: Array<{ title: string; change: string; isNegative: boolean }>;
    recommendedActions: string[];
    riskFactor?: string;
  };
}

const SHOWCASE_QUESTIONS: ShowcaseQuestion[] = [
  {
    id: 'q1',
    query: 'Why did my profit drop this month?',
    label: 'Why did my profit drop?',
    response: {
      summary: 'Your revenue increased 12.4%, but net profit decreased 4.8%.',
      reasons: [
        { title: 'Shipping costs', change: '+14%', isNegative: true },
        { title: 'Product A margin', change: '-8%', isNegative: true },
        { title: 'Refunds', change: '+6%', isNegative: true }
      ],
      recommendedActions: [
        'Review Product A pricing and unit margin structure',
        'Reduce shipping costs by switching Midwest fulfillment hub',
        'Investigate refund reasons on fleece outerwear sizing'
      ],
      riskFactor: 'Without price calibration, margin erosion is projected to widen by an additional 2.1% next cycle.'
    }
  },
  {
    id: 'q2',
    query: 'Which product makes me the most profit?',
    label: 'Which product makes me the most profit?',
    response: {
      summary: 'Pro Performance Compression Tights is your #1 profit engine, generating 38.2% of total store net profit.',
      reasons: [
        { title: 'Gross margin', change: '74.4%', isNegative: false },
        { title: '30-Day Net Profit', change: '+$42,051', isNegative: false },
        { title: 'Ad ROAS efficiency', change: '4.8x', isNegative: false }
      ],
      recommendedActions: [
        'Increase Meta / TikTok ad budget by $1,500 on this winner SKU',
        'Formulate a 1-click upsell bundle with Aero Mesh Singlet',
        'Lock in bulk inventory reorder to prevent stockouts'
      ]
    }
  },
  {
    id: 'q3',
    query: 'Which products are losing money?',
    label: 'Which products are losing money?',
    response: {
      summary: '2 SKUs are currently operating at negative or unviable contribution margins after paid advertising CAC.',
      reasons: [
        { title: 'Recovery Foam Roller', change: '-$4.20/unit after CAC', isNegative: true },
        { title: 'Trail Running Shoe', change: '35% margin (high CAC)', isNegative: true },
        { title: 'Accessory CAC bleed', change: '+$1,400/wk', isNegative: true }
      ],
      recommendedActions: [
        'Pause cold-traffic ad campaigns on the Foam Roller immediately',
        'Reposition low-margin accessories strictly as post-checkout upsells',
        'Renegotiate wholesale factory tier on footwear variants'
      ],
      riskFactor: 'Continuing paid ads on sub-20% margin items destroys cash flow velocity.'
    }
  },
  {
    id: 'q4',
    query: 'What should I focus on today?',
    label: 'What should I focus on today?',
    response: {
      summary: 'Here is your synthesized priority executive briefing for today based on real-time order volume and stock telemetry.',
      reasons: [
        { title: 'Daily GMV Pace', change: '$4,120/day', isNegative: false },
        { title: 'Reserve Stock Alert', change: '2 Star SKUs (<5 days)', isNegative: true },
        { title: 'Margin Optimization', change: '+$8,400 Monthly Lift', isNegative: false }
      ],
      recommendedActions: [
        'Issue purchase reorder for 300 units of Aero Mesh Singlet',
        'Approve ad spend reallocation to 74% margin compression line',
        'Send VIP re-engagement broadcast to 142 repeat purchasers'
      ]
    }
  },
  {
    id: 'q5',
    query: 'What is my biggest growth opportunity?',
    label: 'What is my biggest growth opportunity?',
    response: {
      summary: 'Your highest ROI growth vector is expanding VIP repeat customer lifetime value and cross-selling high-margin bundles.',
      reasons: [
        { title: 'VIP Repeat AOV', change: '$82.40 vs $59.46 avg', isNegative: false },
        { title: 'Customer retention lift', change: '+34.2%', isNegative: false },
        { title: 'Projected upside', change: '+$12,600/mo', isNegative: false }
      ],
      recommendedActions: [
        'Launch automated 45-day replenishment email cadence',
        'Introduce bundled starter kits to lift initial cart AOV',
        'Incentivize annual subscriptions for consumable fitness items'
      ]
    }
  }
];

export const AICopilotShowcase: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedQuestion, setSelectedQuestion] = useState<ShowcaseQuestion>(SHOWCASE_QUESTIONS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  const handleSelectQuestion = (q: ShowcaseQuestion) => {
    if (selectedQuestion.id === q.id) return;
    setIsAnalyzing(true);
    setSelectedQuestion(q);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 450);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setIsAnalyzing(true);
    const matched =
      SHOWCASE_QUESTIONS.find((item) =>
        customInput.toLowerCase().includes(item.id === 'q1' ? 'profit' : 'product')
      ) || SHOWCASE_QUESTIONS[0];
    setSelectedQuestion(matched);
    setCustomInput('');
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 450);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
          AI Copilot Intelligence
        </h2>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Your business, explained by AI.
        </p>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
          Ask plain-English questions about your revenues, margins, or catalog risks and receive immediate, data-backed operational diagnosis.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Interactive AI Conversation Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#090d19] border border-indigo-500/30 shadow-2xl shadow-indigo-950/40 flex flex-col justify-between relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div>
            {/* Conversation Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-md shadow-indigo-500/20">
                  <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Business Copilot</h3>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Data Connected
                  </span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Interactive Console
              </span>
            </div>

            {/* Conversation Stream */}
            <div className="space-y-6">
              {/* User Prompt */}
              <div className="flex items-start justify-end gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-none bg-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md max-w-lg">
                  "{selectedQuestion.query}"
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                  You
                </div>
              </div>

              {/* AI Response Card */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-4">
                  {isAnalyzing ? (
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-3 animate-pulse">
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      <span>AI analyzing store order ledger & COGS waterfall...</span>
                    </div>
                  ) : (
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 animate-in fade-in duration-300">
                      {/* Summary */}
                      <p className="text-sm font-semibold text-white leading-relaxed">
                        "{selectedQuestion.response.summary}"
                      </p>

                      {/* 3 Reasons Identified */}
                      <div className="space-y-2.5 pt-3 border-t border-slate-800">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          3 reasons identified
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {selectedQuestion.response.reasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#080b13] border border-slate-800/90 flex flex-col justify-between"
                            >
                              <span className="text-xs text-slate-400 font-medium">{reason.title}</span>
                              <span
                                className={`text-sm font-bold mt-1 font-mono ${
                                  reason.isNegative ? 'text-rose-400' : 'text-emerald-400'
                                }`}
                              >
                                {reason.change}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="space-y-2.5 pt-3 border-t border-slate-800">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                          Recommended actions
                        </span>
                        <div className="space-y-2">
                          {selectedQuestion.response.recommendedActions.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risk factor callout if present */}
                      {selectedQuestion.response.riskFactor && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{selectedQuestion.response.riskFactor}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Input Bar */}
          <form
            onSubmit={handleCustomSubmit}
            className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot a question about your business..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Interactive Clickable Question Bank */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0c101d] border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Clickable Question Bank
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Select any question below to test how AI Business Copilot conducts automated diagnostics on live store orders.
            </p>

            <div className="space-y-2.5">
              {SHOWCASE_QUESTIONS.map((q) => {
                const isSelected = selectedQuestion.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        ?
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">{q.label}</span>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <button
                onClick={() => navigate('/dashboard/ai-assistant')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Launch full conversational copilot in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
