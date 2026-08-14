import React, { useState } from 'react';
import {
  Store,
  Bot,
  RefreshCw,
  Check,
  Save,
  Key
} from 'lucide-react';
import { useAuth } from '../../lib/auth/context';
import { db } from '../../lib/db';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('Aura Athletics');
  const [currency, setCurrency] = useState('USD ($)');
  const [marginAlertThreshold, setMarginAlertThreshold] = useState('50');
  const [stockoutDaysThreshold, setStockoutDaysThreshold] = useState('7');
  const [aiReportCadence, setAiReportCadence] = useState('Weekly');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo metrics, orders, and products back to the clean seed state?')) {
      setResetting(true);
      await db.resetAllToDemo();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Workspace & Copilot Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure currency preferences, automated threshold alerts, and integration placeholders
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" /> Preferences Saved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store & General Profile */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Store className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Store Identity & Display Currency</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Store / Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Reporting Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                <option value="AUD ($)">AUD ($) - Australian Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: AI Copilot Alert Thresholds */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bot className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">AI Copilot Diagnostic Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Low Margin Alarm Threshold (%)
              </label>
              <input
                type="number"
                value={marginAlertThreshold}
                onChange={e => setMarginAlertThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Alert when SKU margin falls below this %</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Stockout Warning Velocity (Days)
              </label>
              <input
                type="number"
                value={stockoutDaysThreshold}
                onChange={e => setStockoutDaysThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Trigger reorder alert when inventory &lt; X days</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Automated Audit Cadence
              </label>
              <select
                value={aiReportCadence}
                onChange={e => setAiReportCadence(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Daily">Daily Snapshot</option>
                <option value="Weekly">Weekly Executive Brief</option>
                <option value="Monthly">Monthly Financial Audit</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Frequency of AI report generation</span>
            </div>
          </div>
        </div>

        {/* Section 3: Integration Credentials Placeholders */}
        <div className="p-6 rounded-2xl bg-[#0c101d] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Integration Configuration Placeholders</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Shopify Admin API Token (Placeholder)</label>
              <input
                type="password"
                value="shpat_demo_secret_token_1234567890abcdef"
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-emerald-400 mt-0.5 block flex items-center gap-1">
                <Check className="w-3 h-3" /> Live Demo Mock Hook Active
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">WooCommerce REST API Consumer Key (Placeholder)</label>
              <input
                type="text"
                placeholder="ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Not connected in demo</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleResetData}
            disabled={resetting}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            Reset Demo Database
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Workspace Settings
          </button>
        </div>
      </form>
    </div>
  );
};
