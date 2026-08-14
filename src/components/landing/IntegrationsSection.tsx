import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  FileSpreadsheet,
  Check,
  Store,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

export const ShopifyLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 109 124" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M74.7 14.5c-.3-.2-.7-.2-1-.1l-7.3 2.3c-2.3-6.5-6.6-11.9-12.7-14.7-2.6-1.2-5.7-1.9-8.9-1.9-9.9 0-16.7 6.6-18.4 16.5l-13.8 4.3c-1.3.4-1.7 1.9-1.5 3.1l11.4 86.8c.2 1.5 1.5 2.6 3 2.6h47.7c1.5 0 2.8-1.1 3-2.6l11.4-86.8c.2-1.2-.2-2.5-1.5-2.9l-11.9-6.6z"
      fill="#95BF47"
    />
    <path
      d="M66.4 16.7l-7.3 2.3c-2.3-6.5-6.6-11.9-12.7-14.7l-1.5 120.9h32.1c1.5 0 2.8-1.1 3-2.6l11.4-86.8c.2-1.2-.2-2.5-1.5-2.9l-23.5-16.2z"
      fill="#5E8E3E"
    />
    <path
      d="M44.8 17.5c2.4-5.2 6.6-8.9 12.3-10.7 2.1 4.5 2.8 10.1 1.7 16.6l-14-5.9z"
      fill="#5E8E3E"
    />
    <path
      d="M52.3 48.7c-9.9.9-17.7 5.7-17.7 15.3 0 14.5 22.8 14.9 22.8 26.8 0 5.4-4.8 8.8-11.4 8.8-7.7 0-13.1-3.6-16.8-8.2l-3.3 8.3c4.7 5.4 12.3 8.9 20.4 8.9 12.6 0 20.3-6.9 20.3-17.2 0-16.2-22.9-16.8-22.9-27.1 0-4.3 3.6-7.3 9.4-7.3 5.4 0 10.3 2.4 13.9 6.2l3.4-8.1c-4.4-4.2-10.4-6.4-18.1-6.4z"
      fill="#FFFFFF"
    />
  </svg>
);

export const WooCommerceLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="60" rx="14" fill="#7F54B3" />
    <path
      d="M17.5 19.5c-4.5 0-7.8 3.5-7.8 8.2 0 7.2 8.4 17.8 13.8 22.1 1.2 1 3 1 4.2 0 5.4-4.3 13.8-14.9 13.8-22.1 0-4.7-3.3-8.2-7.8-8.2-3.8 0-6.8 2.5-8.1 6.1-1.3-3.6-4.3-6.1-8.1-6.1zm5.2 20.6c-2.8-2.6-6.1-8.5-6.1-12.4 0-2.3 1.5-3.8 3.5-3.8 1.8 0 3.3 1.3 3.7 3.3l1.8 8.5-2.9 4.4zm10.7-12.4c0 3.9-3.3 9.8-6.1 12.4l-2.9-4.4 1.8-8.5c.4-2 1.9-3.3 3.7-3.3 2 0 3.5 1.5 3.5 3.8zM58.5 19.5c-4.5 0-7.8 3.5-7.8 8.2 0 7.2 8.4 17.8 13.8 22.1 1.2 1 3 1 4.2 0 5.4-4.3 13.8-14.9 13.8-22.1 0-4.7-3.3-8.2-7.8-8.2-3.8 0-6.8 2.5-8.1 6.1-1.3-3.6-4.3-6.1-8.1-6.1zm5.2 20.6c-2.8-2.6-6.1-8.5-6.1-12.4 0-2.3 1.5-3.8 3.5-3.8 1.8 0 3.3 1.3 3.7 3.3l1.8 8.5-2.9 4.4zm10.7-12.4c0 3.9-3.3 9.8-6.1 12.4l-2.9-4.4 1.8-8.5c.4-2 1.9-3.3 3.7-3.3 2 0 3.5 1.5 3.5 3.8z"
      fill="#FFFFFF"
    />
  </svg>
);

export const CSVExcelLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="48" height="52" rx="8" fill="#0F766E" />
    <path d="M8 18h48v36a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V18z" fill="#134E4A" />
    <rect x="16" y="24" width="32" height="4" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
    <rect x="16" y="32" width="14" height="4" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
    <rect x="34" y="32" width="14" height="4" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
    <rect x="16" y="40" width="14" height="4" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
    <rect x="34" y="40" width="14" height="4" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
    <rect x="16" y="48" width="32" height="4" rx="2" fill="#5EEAD4" fillOpacity="0.8" />
    <circle cx="16" cy="12" r="2.5" fill="#5EEAD4" />
    <circle cx="24" cy="12" r="2.5" fill="#5EEAD4" />
    <circle cx="32" cy="12" r="2.5" fill="#5EEAD4" />
  </svg>
);

export const IntegrationsSection: React.FC = () => {
  const { navigate } = useNavigation();
  const [modalConnector, setModalConnector] = useState<string | null>(null);

  const integrations = [
    {
      id: 'shopify',
      name: 'Shopify',
      logo: <ShopifyLogo className="w-9 h-9" />,
      tagline: 'Direct store sync for orders, COGS, product variants, and real-time webhook ingestion.',
      badge: 'Official API Ready',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      actionText: 'Connect store →',
      accentBorder: 'hover:border-emerald-500/40',
      highlightColor: 'emerald'
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      logo: <WooCommerceLogo className="w-10 h-7" />,
      tagline: 'REST API integration for WordPress stores with multi-currency and custom tax rules.',
      badge: 'REST API Ready',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      actionText: 'Connect store →',
      accentBorder: 'hover:border-purple-500/40',
      highlightColor: 'purple'
    },
    {
      id: 'csv',
      name: 'CSV / Excel',
      logo: <CSVExcelLogo className="w-8 h-8" />,
      tagline: 'Upload offline spreadsheets, Amazon Seller Central, warehouse invoices, or ERP exports.',
      badge: 'Instant File Validator',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      actionText: 'Upload data →',
      accentBorder: 'hover:border-teal-500/40',
      highlightColor: 'teal'
    }
  ];

  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
          Seamless Data Ingestion
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Connect the tools your business already uses.
        </p>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
          Bring your store data into one intelligent business workspace. No complicated engineering setups or SQL pipelines required.
        </p>
      </div>

      {/* Integration Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {integrations.map((item) => (
          <div
            key={item.id}
            className={`p-6 sm:p-7 rounded-2xl bg-[#0c101d] border border-slate-800/90 ${item.accentBorder} transition-all flex flex-col justify-between group shadow-lg`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {item.logo}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {item.tagline}
              </p>
            </div>

            <button
              onClick={() => setModalConnector(item.name)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-indigo-600/90 hover:text-white border border-slate-800 hover:border-indigo-500/40 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group-hover:bg-indigo-600 group-hover:text-white"
            >
              <span>{item.actionText}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Trust Callout */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>SOC-2 Type II certified security • Read-only access • Safe demo environment</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/integrations')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 shrink-0 cursor-pointer flex items-center gap-1"
        >
          View Integration Hub <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Interactive Connector Modal */}
      {modalConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0e1424] border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalConnector(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Connect {modalConnector}
            </h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              In this preview workspace, your store analytics are pre-loaded with comprehensive demo telemetry (Aura Athletics). You can test live unit economics or launch the CSV validator immediately.
            </p>

            <div className="space-y-2 mb-6">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automatic SKU Margin & Unit Economics ledger</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Daily AI Business Briefings & alerts</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setModalConnector(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModalConnector(null);
                  navigate('/dashboard/integrations');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Open Integration Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
