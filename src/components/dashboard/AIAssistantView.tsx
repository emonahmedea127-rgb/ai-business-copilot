import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  User,
  Zap,
  HelpCircle,
  FileText,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { AIMessage } from '../../types';
import { api } from '../../lib/api/client';
import { db } from '../../lib/db';
import { useNavigation } from '../../lib/navigation';

export const AIAssistantView: React.FC = () => {
  const { navigate } = useNavigation();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Exact 5 suggested prompts from specification
  const suggestedPrompts = [
    'Why did my profit margin decrease this month?',
    'Which products generate the highest profit?',
    'What should I do to increase revenue next month?',
    'Which products should I stop promoting?',
    'Show me my biggest expenses.'
  ];

  useEffect(() => {
    async function loadChat() {
      try {
        const msgs = await api.getAIMessages();
        setMessages(msgs);
      } finally {
        setLoading(false);
      }
    }
    loadChat();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (promptToSend?: string) => {
    const text = (promptToSend || inputText).trim();
    if (!text || isTyping) return;

    setInputText('');

    // Optimistically add user message
    const userMsg: AIMessage = {
      id: `temp_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await api.sendAIChat(text);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error('Failed to send AI message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { label: string; type: 'view_details' | 'apply' | 'generate_report'; targetPath?: string }) => {
    if (action.type === 'apply') {
      setAppliedToast(`✓ Strategy applied to store catalog & campaign rules!`);
      setTimeout(() => setAppliedToast(null), 4000);
    } else if (action.type === 'generate_report') {
      navigate('/dashboard/reports');
    } else if (action.targetPath) {
      navigate(action.targetPath);
    }
  };

  const handleClearHistory = async () => {
    await db.clearAIMessages();
    const fresh = await db.getAIMessages();
    setMessages(fresh);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Toast Notice for Applied Recommendations */}
      {appliedToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-md shadow-indigo-600/20">
            <div className="w-full h-full bg-[#0e1424] rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Business Copilot
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Aura Athletics Live
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Autonomous margin diagnostics, SKU contribution waterfalls & growth sequencing
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Suggested Prompts:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {suggestedPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-full bg-[#0c101d] hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-[#0c101d] border border-slate-800 p-4 sm:p-6 min-h-[500px] max-h-[620px] overflow-y-auto space-y-6 shadow-inner">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20'
                    : 'bg-[#090d18] border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                {/* Formatted Content */}
                <div className="whitespace-pre-line space-y-2 text-slate-200">
                  {msg.content}
                </div>

                {/* Structured Breakdown: Insight, Reason, Recommendation, Expected Impact */}
                {msg.structuredBreakdown && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2.5">
                    {/* Insight */}
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
                        Insight
                      </span>
                      <p className="text-slate-200 text-xs leading-snug">
                        {msg.structuredBreakdown.insight}
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                        Reason
                      </span>
                      <p className="text-slate-200 text-xs leading-snug">
                        {msg.structuredBreakdown.reason}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                        Recommendation
                      </span>
                      <p className="text-slate-200 text-xs leading-snug font-medium">
                        {msg.structuredBreakdown.recommendation}
                      </p>
                    </div>

                    {/* Expected Impact */}
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                        Expected Impact
                      </span>
                      <p className="text-purple-200 text-xs leading-snug font-semibold">
                        {msg.structuredBreakdown.expectedImpact}
                      </p>
                    </div>
                  </div>
                )}

                {/* Structured Callout Items */}
                {msg.structuredData && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    {msg.structuredData.title && (
                      <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        {msg.structuredData.title}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {msg.structuredData.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                        >
                          <div>
                            <div className="font-semibold text-slate-100">{item.label}</div>
                            {item.note && (
                              <div className="text-[10px] text-slate-400 mt-0.5">{item.note}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-emerald-400 font-mono">{item.value}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA Buttons */}
                {!isUser && msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          act.type === 'apply'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30'
                            : act.type === 'generate_report'
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-600/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                        }`}
                      >
                        {act.type === 'apply' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {act.type === 'generate_report' && <FileText className="w-3.5 h-3.5" />}
                        {act.type === 'view_details' && <ArrowUpRight className="w-3.5 h-3.5" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested Followups */}
                {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-400 mr-1">Followup:</span>
                    {msg.suggestedFollowups.map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(f)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-[11px] text-indigo-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[9px] text-slate-500 mt-2 text-right font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-200" />
              <span className="ml-1 text-[11px] text-indigo-300">Auditing SKU margin contributions & ad ROAS...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-2 rounded-2xl bg-[#0c101d] border border-slate-800 flex items-center gap-2 shadow-lg">
        <input
          id="ai-assistant-input"
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Copilot about profit decrease, product margins, expenses, or growth recommendations..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          id="ai-assistant-send-btn"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
