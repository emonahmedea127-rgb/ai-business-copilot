import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Package,
  RotateCcw,
  ArrowRight,
  X,
  Filter,
  Sparkles
} from 'lucide-react';
import { SmartAlertItem } from '../../types';
import { useNavigation } from '../../lib/navigation';

interface SmartAlertsProps {
  className?: string;
}

const DEFAULT_ALERTS: SmartAlertItem[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Profit margin dropped 6.2% on Heavyweight Oversized Hoodie',
    description: 'Ad spend increased $1,200 while return rate ticked up 2.4%, compressing gross margin to 31.8%.',
    metricLabel: 'Margin Compression',
    metricDelta: '-6.2%',
    timestamp: '25m ago',
    category: 'margin',
    actionLabel: 'Inspect SKU Margin',
    targetPath: '/dashboard/products'
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Refund rate increased 4.8% in Performance Footwear',
    description: 'Customer feedback notes sizing running 0.5 size smaller than standard. Recommend adding size advisory banner on PDP.',
    metricLabel: 'Return Rate',
    metricDelta: '+4.8%',
    timestamp: '2h ago',
    category: 'refunds',
    actionLabel: 'Review Customer Feedback',
    targetPath: '/dashboard/customers'
  },
  {
    id: 'alert-3',
    severity: 'positive',
    title: 'Monthly revenue target ($80,000) reached 4 days early',
    description: 'Driven by record conversion on Seamless Ribbed Legging and higher AOV ($59.46 vs $48.20 last month).',
    metricLabel: 'Monthly GMV',
    metricDelta: '$84,920',
    timestamp: '4h ago',
    category: 'sales',
    actionLabel: 'View Sales Breakdown',
    targetPath: '/dashboard/analytics'
  },
  {
    id: 'alert-4',
    severity: 'warning',
    title: 'Thermal Base Layer sales velocity declining (-14.2% DoD)',
    description: 'Inventory levels (320 units) are now projected to sit for 48 days. Consider bundling with Star SKUs.',
    metricLabel: 'Sales Velocity',
    metricDelta: '-14.2%',
    timestamp: '6h ago',
    category: 'inventory',
    actionLabel: 'Create Bundle Offer',
    targetPath: '/dashboard/products'
  }
];

export const SmartAlerts: React.FC<SmartAlertsProps> = ({ className = '' }) => {
  const { navigate } = useNavigation();
  const [alerts, setAlerts] = useState<SmartAlertItem[]>(DEFAULT_ALERTS);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'positive'>('all');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
  };

  const activeAlerts = alerts.filter(
    (a) => !dismissedIds.includes(a.id) && (filter === 'all' || a.severity === filter)
  );

  const getSeverityBadge = (severity: SmartAlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Critical Alert
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Warning
          </span>
        );
      case 'positive':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Milestone
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4 ${className}`}>
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Smart Margin & Inventory Alerts
          </h3>
          <p className="text-xs text-slate-400">Proactive autonomous anomaly detection across orders and catalog</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({alerts.length - dismissedIds.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical (1)
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Warnings (2)
          </button>
          <button
            onClick={() => setFilter('positive')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'positive' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Positive (1)
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No active anomalies in this filter view. All systems operating within normal parameters.
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => alert.targetPath && navigate(alert.targetPath)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/10 border-rose-500/30 hover:border-rose-500/60'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/10 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-[10px] text-slate-500 font-medium">{alert.timestamp}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {alert.description}
                  </p>
                </div>

                {/* Right Column: Metric delta & Action CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  {alert.metricDelta && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{alert.metricLabel}</span>
                      <span
                        className={`text-xs font-bold ${
                          alert.severity === 'critical'
                            ? 'text-rose-400'
                            : alert.severity === 'warning'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {alert.metricDelta}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {alert.actionLabel && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (alert.targetPath) navigate(alert.targetPath);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {alert.actionLabel}
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDismiss(alert.id, e)}
                      title="Dismiss alert"
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
