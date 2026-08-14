import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BarChart2,
  Package,
  ShoppingCart,
  Users,
  Bot,
  FileText,
  Plug,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Calendar,
  Store as StoreIcon,
  Search,
  Check,
  Award,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../lib/auth/context';
import { useNavigation } from '../../lib/navigation';
import { Store } from '../../types';
import { api } from '../../lib/api/client';
import { db } from '../../lib/db';
import { NotificationCenter } from './NotificationCenter';
import { CommandCenterModal } from './CommandCenterModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePath }) => {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();

  const [stores, setStores] = useState<Store[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string>('store_01');
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Global shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandCenterOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function loadStores() {
      try {
        const data = await api.getStores();
        setStores(data.stores);
        setActiveStoreId(data.activeStoreId);
      } catch {
        const s = await db.getStores();
        setStores(s);
      }
    }
    loadStores();
  }, []);

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0];

  const handleStoreSelect = async (storeId: string) => {
    setActiveStoreId(storeId);
    setStoreDropdownOpen(false);
    await api.selectStore(storeId);
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Sales Forecasting', path: '/dashboard/forecasting', icon: TrendingUp, badge: 'AI' },
    { name: 'Products & Margins', path: '/dashboard/products', icon: Package },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Customers & LTV', path: '/dashboard/customers', icon: Users },
    { name: 'AI Copilot', path: '/dashboard/ai-assistant', icon: Bot, badge: 'Smart' },
    { name: 'Executive Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Integrations & CSV', path: '/dashboard/integrations', icon: Plug },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Global Command Center (Cmd+K) Modal */}
      <CommandCenterModal
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
      />

      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#11151D] border-b border-[#1E293B] h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161B25]"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigate('/dashboard/overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#11151D] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-sm text-[#F8FAFC] tracking-tight leading-none flex items-center gap-1.5">
                AI Business Copilot
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Pro
                </span>
              </div>
              <span className="text-[10px] text-[#94A3B8]">Ecommerce Intelligence</span>
            </div>
          </div>

          {/* Store Switcher Dropdown */}
          <div className="relative ml-1 sm:ml-3">
            <button
              id="store-switcher-btn"
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#11151D] border border-[#1E293B] hover:border-slate-700 text-xs font-semibold text-[#F8FAFC] transition-colors cursor-pointer"
            >
              <StoreIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="max-w-[120px] sm:max-w-[150px] truncate">{activeStore?.name || 'Aura Athletics'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {storeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#11151D] border border-[#1E293B] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  Connected Stores
                </div>
                {stores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store.id)}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between hover:bg-[#161B25] transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{store.name}</div>
                      <div className="text-[10px] text-[#94A3B8] capitalize flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {store.platform} • {store.productCount} SKUs
                      </div>
                    </div>
                    {store.id === activeStoreId && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
                <div className="border-t border-[#1E293B] my-1" />
                <button
                  onClick={() => {
                    setStoreDropdownOpen(false);
                    navigate('/dashboard/integrations');
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs font-semibold text-indigo-400 hover:bg-indigo-950/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plug className="w-3.5 h-3.5" />
                  Connect New Store / CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Search & Command Center Button (Cmd+K) */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
          <button
            onClick={() => setCommandCenterOpen(true)}
            className="w-full px-3 py-1.5 rounded-xl bg-[#08090D] border border-[#1E293B] hover:border-slate-700 text-xs text-[#94A3B8] hover:text-slate-200 flex items-center justify-between transition-colors shadow-inner cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Search views, metrics, or ask Copilot...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#161B25] border border-[#1E293B] text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search on Mobile */}
          <button
            onClick={() => setCommandCenterOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-[#11151D] border border-[#1E293B] text-slate-400 hover:text-white"
            aria-label="Command search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Timeframe Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#11151D] border border-[#1E293B] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeframe}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {timeframeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#11151D] border border-[#1E293B] shadow-2xl p-1.5 z-50 text-xs">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setTimeframeDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      timeframe === tf ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-[#161B25]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSyncData}
            title="Sync latest store orders and margins"
            className={`p-2 rounded-xl bg-[#11151D] border border-[#1E293B] text-slate-300 hover:text-white transition-colors cursor-pointer ${
              isSyncing ? 'animate-spin text-indigo-400' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Notifications Center Component */}
          <NotificationCenter />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-[#11151D] border border-[#1E293B] hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white uppercase">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#11151D] border border-[#1E293B] shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#1E293B]">
                  <div className="font-bold text-[#F8FAFC]">{user?.name || 'Alex Vance'}</div>
                  <div className="text-[11px] text-[#94A3B8] truncate">{user?.email || 'alex@aurastore.com'}</div>
                  <div className="mt-1 text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                    Role: {user?.role || 'Owner'}
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/dashboard/settings');
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-slate-300 hover:bg-[#161B25] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" /> Workspace Settings
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/pricing');
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-slate-300 hover:bg-[#161B25] flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-indigo-400" /> Subscription & Plan
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-slate-300 hover:bg-[#161B25] flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Public Landing
                  </button>
                </div>
                <div className="border-t border-[#1E293B] pt-1">
                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await logout();
                      navigate('/login');
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-red-400 hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Unverified Email Warning Banner */}
      {user && user.isVerified === false && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Your account email is unverified. Please verify your email to unlock all features.</span>
          </div>
          <button
            onClick={() => navigate(`/verify-email?email=${encodeURIComponent(user.email)}`)}
            className="text-amber-200 underline font-semibold hover:text-white shrink-0 ml-4 cursor-pointer"
          >
            Verify Email →
          </button>
        </div>
      )}

      {/* Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-[#08090D] border-r border-[#1E293B] p-4 shrink-0 justify-between">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider mb-1">
              Analytics & Operations
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isCurrent = activePath === item.path || (item.path === '/dashboard/overview' && activePath === '/dashboard');
              const isAiItem = item.name.includes('AI') || item.name.includes('Forecasting');
              return (
                <button
                  key={item.path}
                  id={`nav-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => navigate(item.path)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B25]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : isAiItem ? 'text-violet-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isCurrent
                        ? 'bg-indigo-900/60 text-indigo-200'
                        : isAiItem
                        ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Box: AI Quick Prompt */}
          <div className="p-3.5 rounded-2xl bg-[#11151D] border border-[#1E293B] shadow-inner">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#F8FAFC]">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Ask AI Copilot</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mb-3 leading-tight">
              Get instant answers to "Why did profit decrease?" or "Which SKUs to promote?"
            </p>
            <button
              onClick={() => navigate('/dashboard/ai-assistant')}
              className="w-full py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600 border border-violet-500/30 text-violet-200 hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" /> Launch Copilot
            </button>
          </div>
        </aside>

        {/* Mobile Slide-in Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative w-64 bg-[#11151D] border-r border-[#1E293B] p-4 flex flex-col justify-between h-full z-10">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E293B]">
                  <span className="font-bold text-[#F8FAFC] text-sm">Navigation Menu</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isCurrent = activePath === item.path || (item.path === '/dashboard/overview' && activePath === '/dashboard');
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                          isCurrent ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#161B25]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E293B]">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-xs text-slate-400 hover:text-white py-2 text-left"
                >
                  ← Back to Public Website
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#08090D] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
