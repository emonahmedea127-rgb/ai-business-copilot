import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, AlertCircle, HelpCircle, Shield, ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../lib/navigation';

export const PricingPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentNoticeOpen, setPaymentNoticeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleSelectPlan = (planName: string, isFree: boolean) => {
    if (isFree) {
      navigate('/signup');
    } else {
      setSelectedPlan(planName);
      setPaymentNoticeOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07090e]/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-bold text-white tracking-tight">AI Business Copilot</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10 relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Plans scaled for profitable ecommerce brands
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto mb-8">
          Clear unit economics and AI Copilot recommendations. Switch plans anytime with zero cancellation penalties.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yearly Billing
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
              20% Discount
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch text-left mb-20">
          {/* FREE */}
          <div className="p-8 rounded-3xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">FREE</span>
              <div className="text-4xl font-black text-white mb-2">$0</div>
              <p className="text-xs text-slate-400 mb-6">For single store owners testing margin intelligence.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>1 Connected Store (Shopify/Woo/CSV)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>250 orders / month capacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>10 AI Copilot queries daily</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>CSV File validator & import</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>30-day historical data</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('Starter Free', true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* PRO */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111728] to-[#0d121f] border-2 border-indigo-500 shadow-xl shadow-indigo-600/10 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold uppercase tracking-wide">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">PRO</span>
              <div className="text-4xl font-black text-white mb-2">
                ${billingCycle === 'monthly' ? 49 : 39}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">For high-growth ecommerce brands scaling profitably.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Up to 5 Connected Stores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited monthly order tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited AI Copilot queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unit Economics waterfall breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Executive Reports & PDF generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Stockout & Low Margin Alerts</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('Pro', false)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Choose Pro
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="p-8 rounded-3xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">ENTERPRISE</span>
              <div className="text-4xl font-black text-white mb-2">
                ${billingCycle === 'monthly' ? 199 : 159}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">For multi-brand conglomerates & enterprise retail.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Unlimited Stores & Omnichannel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom ERP & Warehouse API sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Dedicated Margin Consultant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Custom SLA & SSO Security</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Multi-team RBAC permissions</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('Enterprise', false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Payment Notice Modal */}
      {paymentNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1424] border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {selectedPlan} Plan Selected
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Payment integration coming soon! In this current development release, all features are enabled in the live preview workspace.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setPaymentNoticeOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPaymentNoticeOpen(false);
                  navigate('/dashboard');
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
