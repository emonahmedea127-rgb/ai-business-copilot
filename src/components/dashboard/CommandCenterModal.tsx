import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bot,
  TrendingUp,
  Package,
  FileText,
  Users,
  Layers,
  Settings,
  ArrowRight,
  Sparkles,
  DollarSign,
  AlertTriangle,
  X,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'AI Prompts';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandCenterModal: React.FC<CommandCenterModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-overview',
      category: 'Navigation',
      title: 'Executive Dashboard Overview',
      subtitle: 'KPIs, real-time margin alerts, and revenue trends',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      action: () => { navigate('/dashboard/overview'); onClose(); }
    },
    {
      id: 'nav-forecasting',
      category: 'Navigation',
      title: 'Sales & Revenue Forecasting',
      subtitle: 'Monte Carlo 30-90 day forward trajectory modeling',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      action: () => { navigate('/dashboard/forecasting'); onClose(); }
    },
    {
      id: 'nav-products',
      category: 'Navigation',
      title: 'Product Profitability & Margins',
      subtitle: 'SKU unit economics, COGS, and velocity',
      icon: <Package className="w-4 h-4 text-purple-400" />,
      action: () => { navigate('/dashboard/products'); onClose(); }
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      title: 'Deep Channel Analytics',
      subtitle: 'Traffic, acquisition CAC, conversion funnels',
      icon: <DollarSign className="w-4 h-4 text-blue-400" />,
      action: () => { navigate('/dashboard/analytics'); onClose(); }
    },
    {
      id: 'nav-customers',
      category: 'Navigation',
      title: 'Customer Cohorts & LTV',
      subtitle: 'VIP buyers, repeat purchase rates, churn risks',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      action: () => { navigate('/dashboard/customers'); onClose(); }
    },
    {
      id: 'nav-reports',
      category: 'Navigation',
      title: 'Executive Audits & Reports',
      subtitle: 'Printable executive briefs and CSV/JSON export',
      icon: <FileText className="w-4 h-4 text-indigo-300" />,
      action: () => { navigate('/dashboard/reports'); onClose(); }
    },
    {
      id: 'nav-integrations',
      category: 'Navigation',
      title: 'Store Integrations & CSV Sync',
      subtitle: 'Shopify, WooCommerce, Stripe, and manual upload',
      icon: <ShoppingCart className="w-4 h-4 text-emerald-300" />,
      action: () => { navigate('/dashboard/integrations'); onClose(); }
    },
    // AI Prompts
    {
      id: 'ai-profit-decrease',
      category: 'AI Prompts',
      title: 'Ask AI: Why did my profit decrease this month?',
      subtitle: 'Diagnose gross margin contraction and shipping drag',
      icon: <Bot className="w-4 h-4 text-rose-400" />,
      action: () => { navigate('/dashboard/ai-assistant'); onClose(); }
    },
    {
      id: 'ai-top-products',
      category: 'AI Prompts',
      title: 'Ask AI: Which products generate the highest profit?',
      subtitle: 'Identify star SKUs with high unit contribution',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      action: () => { navigate('/dashboard/ai-assistant'); onClose(); }
    },
    {
      id: 'ai-forecast-revenue',
      category: 'AI Prompts',
      title: 'Ask AI: What will my revenue look like next month?',
      subtitle: 'Predict next 30 days based on repeat cohorts',
      icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
      action: () => { navigate('/dashboard/ai-assistant'); onClose(); }
    },
    {
      id: 'ai-where-losing',
      category: 'AI Prompts',
      title: 'Ask AI: Where am I losing money?',
      subtitle: 'Detect profit leakage, unprofitably subsidized shipping, and returns',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      action: () => { navigate('/dashboard/ai-assistant'); onClose(); }
    },
    // Quick Actions
    {
      id: 'action-export-report',
      category: 'Actions',
      title: 'Generate Instant Executive Audit',
      subtitle: 'Compile comprehensive margin narrative & KPIs',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      action: () => { navigate('/dashboard/reports'); onClose(); }
    },
    {
      id: 'action-sync-shopify',
      category: 'Actions',
      title: 'Sync Live Shopify Store Webhooks',
      subtitle: 'Pull latest order stream and SKU inventory',
      icon: <ShoppingCart className="w-4 h-4 text-emerald-400" />,
      action: () => { navigate('/dashboard/integrations'); onClose(); }
    }
  ];

  const filteredItems = items.filter(item => {
    const query = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search views, or ask Copilot (e.g. margin, forecast, report)..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-800/50">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-950/60 border border-indigo-500/40 text-white' : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        {item.title}
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands or pages found. Try searching "forecast", "margin", or "shopify".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">↵</kbd> to select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">esc</kbd> to close</span>
          </div>
          <span className="text-indigo-400 font-semibold">AI Business Copilot</span>
        </div>
      </div>
    </div>
  );
};
