import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

interface PresetQuestion {
  id: string;
  question: string;
  category: string;
  response: {
    text: string;
    metrics?: Array<{ label: string; value: string; color?: string }>;
    actionPlan: string[];
    riskFactor?: string;
  };
}

const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'q1',
    question: 'Why did my profit drop?',
    category: 'Margin Diagnostics',
    response: {
      text: 'Gross profit margin contracted by **3.2%** over the past 14 days ($31,420 vs $35,800 expected). The drop is driven by two primary factors:',
      metrics: [
        { label: 'Shipping Cost Spike', value: '+$1.80 / order (+12.4%)', color: 'text-amber-400' },
        { label: 'Fleece Hoodie Return Rate', value: '8.4% (up from 3.2%)', color: 'text-rose-400' },
        { label: 'Blended Net Margin', value: '37.0% (was 40.2%)', color: 'text-indigo-300' }
      ],
      actionPlan: [
        'Shift Midwest warehouse allocations to ground tier to save ~$3,100/mo in carrier surcharges.',
        'Update the Heavyweight Oversized Fleece product page with sizing clarification to reduce return velocity.'
      ],
      riskFactor: 'If unaddressed, projected monthly profit erosion will reach -$5,400 across Q3.'
    }
  },
  {
    id: 'q2',
    question: 'Which product makes me the most profit?',
    category: 'SKU Ranking',
    response: {
      text: 'Your #1 top profit contributor is the **Pro Performance Compression Tights (SKU: AUR-TGT-001)**. It generates **38.2%** of all realized store gross profit.',
      metrics: [
        { label: 'Realized Gross Profit', value: '$42,051.00', color: 'text-emerald-400' },
        { label: 'Gross Margin', value: '74.4%', color: 'text-indigo-300' },
        { label: 'Units Sold (30D)', value: '642 units', color: 'text-white' }
      ],
      actionPlan: [
        'Increase Meta / TikTok ad budget by $1,500 on this SKU (currently returning 4.8x ROAS).',
        'Bundle with the "Aero Mesh Singlet" to lift blended cart AOV from $59.46 to $82.00.'
      ]
    }
  },
  {
    id: 'q3',
    question: 'What should I focus on today?',
    category: 'Daily Executive Brief',
    response: {
      text: 'Here is your prioritized executive action plan for today based on live customer orders and inventory telemetry:',
      metrics: [
        { label: 'Daily GMV Pace', value: '$4,120 / day', color: 'text-emerald-400' },
        { label: 'Low Stock Alarms', value: '2 Star SKUs (<5 days)', color: 'text-amber-400' },
        { label: 'Pending Optimization', value: '+$8,400 Monthly Lift', color: 'text-indigo-300' }
      ],
      actionPlan: [
        'Issue a purchase order for 300 units of "Aero Mesh Singlet" before stockout in 72 hours.',
        'Approve the ad reallocation from low-margin accessories to high-margin compression gear.',
        'Send VIP re-engagement campaign to 142 repeat buyers who ordered >60 days ago.'
      ]
    }
  },
  {
    id: 'q4',
    question: 'Which products are losing money?',
    category: 'Bleeder SKUs',
    response: {
      text: 'AI margin audit flagged **1 loss-making SKU** and **1 margin bleeder** where ad acquisition cost exceeds gross contribution:',
      metrics: [
        { label: 'Recovery Foam Roller (Loss)', value: '18.1% Margin (-$4.20/unit after CAC)', color: 'text-rose-400' },
        { label: 'Endurance Trail Shoe (Watch)', value: '35.0% Margin ($56 profit vs $48 ad CAC)', color: 'text-amber-400' }
      ],
      actionPlan: [
        'Pause cold-traffic Meta ads on the Foam Roller set immediately to stop bleeding ~$1,400/week.',
        'Reposition the Foam Roller strictly as a post-checkout 1-click upsell where customer acquisition cost is $0.'
      ],
      riskFactor: 'Running cold traffic on <20% margin items generates negative net cash flow after ad spend.'
    }
  }
];

export const AICopilotInteractiveDemo: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedQuestion, setSelectedQuestion] = useState<PresetQuestion>(PRESET_QUESTIONS[0]);
  const [displayedText, setDisplayedText] = useState<string>(PRESET_QUESTIONS[0].response.text);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  const handleSelectQuestion = (q: PresetQuestion) => {
    if (isTyping && selectedQuestion.id === q.id) return;
    setSelectedQuestion(q);
    setIsTyping(true);
    setDisplayedText('');

    // Typing simulation
    let charIndex = 0;
    const fullText = q.response.text;
    const interval = setInterval(() => {
      charIndex += 4;
      if (charIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.substring(0, charIndex));
      }
    }, 15);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    // Match or fallback to relevant preset
    const match = PRESET_QUESTIONS.find(
      (p) =>
        customInput.toLowerCase().includes('profit') ||
        customInput.toLowerCase().includes('drop') ||
        customInput.toLowerCase().includes('why')
    ) || PRESET_QUESTIONS[2];

    handleSelectQuestion(match);
    setCustomInput('');
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-[#0c101d] border border-indigo-500/30 relative overflow-hidden shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive AI Intelligence Sandbox</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ask your store anything. Get instant profit diagnosis.
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          Click any strategic prompt below to see how AI Business Copilot translates complex ecommerce data into clear operational decisions.
        </p>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 relative z-10">
        {PRESET_QUESTIONS.map((q) => {
          const isActive = selectedQuestion.id === q.id;
          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span>"{q.question}"</span>
            </button>
          );
        })}
      </div>

      {/* Chat Terminal Simulation Canvas */}
      <div className="max-w-3xl mx-auto rounded-2xl bg-[#080b13] border border-slate-800 overflow-hidden shadow-2xl relative z-10">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] text-slate-400 ml-2 font-mono">
              AI Copilot Console • Aura Athletics
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Live Demo Engine
          </span>
        </div>

        {/* Conversation Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* User Query Message */}
          <div className="flex items-start justify-end gap-3">
            <div className="bg-indigo-600 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl rounded-tr-none shadow-md max-w-md">
              "{selectedQuestion.question}"
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 text-xs font-bold">
              You
            </div>
          </div>

          {/* AI Copilot Answer */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-xs sm:text-sm text-slate-200">
              {/* Text / Markdown Answer */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 leading-relaxed">
                <p className="font-normal text-slate-200">
                  {displayedText}
                  {isTyping && <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-1 animate-pulse" />}
                </p>

                {/* Key Metrics Callouts */}
                {!isTyping && selectedQuestion.response.metrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
                    {selectedQuestion.response.metrics.map((m, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#080b13] border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{m.label}</span>
                        <span className={`text-xs font-bold mt-0.5 block ${m.color || 'text-white'}`}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommended Action Checklist */}
                {!isTyping && selectedQuestion.response.actionPlan && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] uppercase font-bold text-indigo-400 block tracking-wider">
                      Recommended Strategic Actions:
                    </span>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {selectedQuestion.response.actionPlan.map((action, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Callout if any */}
                {!isTyping && selectedQuestion.response.riskFactor && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{selectedQuestion.response.riskFactor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCustomSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a store question or select a prompt above..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Ask <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Footer CTA to Dashboard */}
      <div className="text-center mt-6 relative z-10">
        <button
          onClick={() => navigate('/dashboard/ai-assistant')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          Open full interactive Copilot with your live store catalog <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
