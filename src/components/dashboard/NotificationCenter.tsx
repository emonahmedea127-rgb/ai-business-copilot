import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Package,
  Sparkles,
  Check,
  ExternalLink,
  X
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { useNavigation } from '../../lib/navigation';

export const NotificationCenter: React.FC = () => {
  const { navigate } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'margin',
      title: 'Margin Compression Alert',
      description: 'Blended gross margin dropped 2.4% this week due to rising carrier shipping surcharges.',
      time: '12m ago',
      read: false,
      severity: 'warning',
      targetPath: '/dashboard/overview'
    },
    {
      id: 'notif-2',
      type: 'forecast',
      title: 'Forecast Updated: +12.4% Growth',
      description: 'Sales model projects $246,800 in 30-day revenue based on strong VIP retention velocity.',
      time: '45m ago',
      read: false,
      severity: 'positive',
      targetPath: '/dashboard/forecasting'
    },
    {
      id: 'notif-3',
      type: 'inventory',
      title: 'Low Stock Risk: Hydro Vest',
      description: '24 units left in inventory (~4 days supply). Modeled risk of $6,200 in forfeited sales.',
      time: '2h ago',
      read: false,
      severity: 'critical',
      targetPath: '/dashboard/products'
    },
    {
      id: 'notif-4',
      type: 'ai',
      title: 'AI Copilot Diagnostic Ready',
      description: 'Identified 3 low-margin products where adjusting price by +$6 restores $14.2k margin.',
      time: '4h ago',
      read: true,
      severity: 'info',
      targetPath: '/dashboard/ai-assistant'
    },
    {
      id: 'notif-5',
      type: 'milestone',
      title: 'Revenue Milestone Achieved',
      description: 'Aura Athletics surpassed $215,000 in trailing 30-day gross ledger revenue.',
      time: '1d ago',
      read: true,
      severity: 'positive',
      targetPath: '/dashboard/analytics'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.targetPath) {
      navigate(notif.targetPath);
    }
    setIsOpen(false);
  };

  const getIcon = (type: NotificationItem['type'], severity: NotificationItem['severity']) => {
    switch (type) {
      case 'margin':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'forecast':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-rose-400" />;
      case 'milestone':
        return <DollarSign className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e1424] border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Dropdown Header */}
          <div className="p-3.5 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">Notifications & Alerts</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/60 p-1">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                  notif.read ? 'hover:bg-slate-900/40 text-slate-400' : 'bg-indigo-950/25 hover:bg-indigo-950/40 text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type, notif.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className={`text-xs font-semibold truncate ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {notif.description}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-950 text-center border-t border-slate-800">
            <button
              onClick={() => {
                navigate('/dashboard/overview');
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 w-full"
            >
              <span>View All Business Insights</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
