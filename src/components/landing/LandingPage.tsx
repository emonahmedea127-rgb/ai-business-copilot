import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Bot,
  PieChart,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  FileSpreadsheet,
  ShoppingBag,
  Store,
  DollarSign,
  Cpu,
  Lock,
  ExternalLink,
  Award,
  AlertCircle,
  Percent,
  ShoppingCart,
  Menu,
  X,
  Check
} from 'lucide-react';
import { useNavigation } from '../../lib/navigation';
import { HeroDashboardPreview } from './HeroDashboardPreview';
import { BusinessHealthScore } from '../dashboard/BusinessHealthScore';
import { AICopilotShowcase } from './AICopilotShowcase';
import { BusinessIntelligenceSection } from './BusinessIntelligenceSection';
import { IntegrationsSection } from './IntegrationsSection';
import { ProductProfitabilityTable } from '../dashboard/ProductProfitabilityTable';
import { SmartAlerts } from '../dashboard/SmartAlerts';
import { DailyBriefingCard } from '../dashboard/DailyBriefingCard';
import { BeforeAfterSection } from './BeforeAfterSection';
import { FeaturesSection } from './FeaturesSection';

export const LandingPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [paymentNoticeOpen, setPaymentNoticeOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('');

  const handlePlanClick = (planName: string, isFree: boolean) => {
    if (isFree) {
      navigate('/signup');
    } else {
      setSelectedPlanName(planName);
      setPaymentNoticeOpen(true);
    }
  };

  const faqs = [
    {
      q: 'How does AI Business Copilot work with my store?',
      a: 'AI Business Copilot connects securely to your ecommerce platforms (Shopify, WooCommerce, or via CSV files) to automatically calculate true unit economics, product-level profit margins, customer lifetime value, and advertising efficiency in real time. Our specialized AI engine translates complex financial data into actionable daily decisions.'
    },
    {
      q: 'Is my store data and customer information secure?',
      a: 'Yes. We adhere to enterprise-grade SOC-2 security protocols and end-to-end encryption. We never sell your sales data, and your store metrics are never used to train generalized external public AI models.'
    },
    {
      q: 'Can I use AI Business Copilot if I don’t use Shopify or WooCommerce?',
      a: 'Absolutely. You can upload standard CSV or Excel exports from any platform (Amazon Seller Central, Square, custom ERPs, warehouse spreadsheets) using our integrated CSV validation tool, and get instant analytics.'
    },
    {
      q: 'How does the AI Assistant give recommendations?',
      a: 'The AI Copilot operates directly on top of your live order book, COGS (Cost of Goods Sold), and customer cohort matrices. It detects margin bleeders, calculates price elasticity, flags stockout risks, and identifies which products yield the highest return on ad spend.'
    },
    {
      q: 'Can I try AI Business Copilot for free before upgrading?',
      a: 'Yes, our Starter plan is 100% free forever with no credit card required. You get access to essential dashboards, CSV data validation, and daily AI Copilot queries.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F8FAFC] selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#11151D]/90 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            id="nav-logo"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#11151D] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight text-[#F8FAFC] flex items-center gap-2">
              AI Business Copilot
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SaaS
              </span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#94A3B8]">
            <a href="#features" className="hover:text-white transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#integrations" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-signin-btn"
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-[#94A3B8] hover:text-white px-3.5 py-2 rounded-lg hover:bg-[#161B25] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="nav-getstarted-btn"
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium bg-[#6366F1] hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#11151D] border border-[#1E293B] text-slate-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-[#11151D] border-b border-[#1E293B] space-y-3 animate-in slide-in-from-top-2 duration-200">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              Product & Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              How it works
            </a>
            <a
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              Solutions & Integrations
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              Pricing Plans
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-[#1E293B] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-300 bg-[#08090D] rounded-xl border border-[#1E293B]"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#6366F1] hover:bg-indigo-500 rounded-xl shadow-sm"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/30 border border-violet-500/30 text-[#8B5CF6] text-xs font-medium mb-8 backdrop-blur-sm shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Next-Gen Ecommerce Profitability Intelligence</span>
          <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
          <span className="text-violet-200">v2.4 Live</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] max-w-5xl mx-auto leading-[1.1] mb-6">
          AI that turns your store data into better decisions.
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Connect your ecommerce data, understand your margins, discover hidden opportunities, and get clear AI-powered recommendations in seconds.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
          <button
            id="hero-start-free-btn"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start analyzing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-see-how-btn"
            onClick={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#11151D] hover:bg-[#161B25] border border-[#1E293B] text-[#F8FAFC] font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>See how it works</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-10 text-xs sm:text-sm text-[#94A3B8] max-w-3xl mx-auto pb-12 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#34D399]" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#34D399]" />
            <span>Start in minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#34D399]" />
            <span>Secure data connection</span>
          </div>
        </div>

        {/* 3. HERO PRODUCT VISUAL: Realistic SaaS Dashboard Preview */}
        <div className="mt-14">
          <HeroDashboardPreview />
        </div>
      </section>

      {/* 4. BUSINESS HEALTH SCORE & DIAGNOSTIC SCORECARD */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <BusinessHealthScore onExploreMetrics={() => navigate('/dashboard')} />
      </section>

      {/* 5. AI COPILOT SHOWCASE: "Your business, explained by AI." */}
      <AICopilotShowcase />

      {/* 6. BUSINESS INTELLIGENCE SECTION: 01 Connect -> 02 Analyze -> 03 Understand -> 04 Act */}
      <BusinessIntelligenceSection />

      {/* 7. STORE INTEGRATIONS: Shopify, WooCommerce, CSV/Excel */}
      <IntegrationsSection />

      {/* 8. PRODUCT PROFITABILITY MATRIX */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
            SKU Unit Economics
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Product Profitability Intelligence
          </p>
          <p className="text-slate-400 text-sm mt-3">
            Rank your catalog by net contribution margins and identify bleeder SKUs consuming ad budget.
          </p>
        </div>
        <ProductProfitabilityTable onSelectProduct={() => navigate('/dashboard/products')} />
      </section>

      {/* 9. SMART MARGIN & INVENTORY ALERTS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <SmartAlerts />
      </section>

      {/* 10. TODAY'S BUSINESS BRIEFING */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <DailyBriefingCard />
      </section>

      {/* 11. BEFORE VS. AFTER SECTION */}
      <BeforeAfterSection />

      {/* 12. PLATFORM FEATURES (Varied Non-Repetitive Layout) */}
      <FeaturesSection />

      {/* 13. PRICING SECTION */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
            Transparent Pricing
          </h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Invest in clarity. Scale your profit margins.
          </p>
          <p className="text-slate-400 text-sm sm:text-base mt-4">
            Start with our generous free tier or upgrade for multi-store unit economics and unlimited AI Copilot analysis.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mt-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly Billing
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Plan 1: FREE */}
          <div className="p-8 rounded-3xl bg-[#11151D] border border-[#1E293B] flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider mb-2">FREE</div>
              <p className="text-xs text-[#94A3B8] mb-6">Essential analytics for solo store owners.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-[#F8FAFC]">$0</span>
                <span className="text-[#94A3B8] text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-[#F8FAFC]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>1 Connected Store</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Up to 250 orders / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>10 AI Copilot queries / day</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>CSV File Import & Validator</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Basic Sales & Margin charts</span>
                </li>
              </ul>
            </div>
            <button
              id="pricing-free-btn"
              onClick={() => handlePlanClick('Free', true)}
              className="w-full py-3 px-4 rounded-xl bg-[#161B25] hover:bg-[#1E293B] text-[#F8FAFC] font-semibold text-sm transition-colors cursor-pointer border border-[#1E293B]"
            >
              Get started
            </button>
          </div>

          {/* Plan 2: PRO (Most Popular) */}
          <div className="p-8 rounded-3xl bg-[#11151D] border-2 border-indigo-500 shadow-xl shadow-indigo-600/10 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6366F1] text-white text-[11px] font-bold uppercase tracking-wide shadow-md">
              Most Popular
            </div>
            <div>
              <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">PRO</div>
              <p className="text-xs text-[#94A3B8] mb-6">Complete profit intelligence for growing ecommerce brands.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-[#F8FAFC]">
                  ${billingCycle === 'monthly' ? 49 : 39}
                </span>
                <span className="text-[#94A3B8] text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-[#F8FAFC]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span className="font-semibold text-[#F8FAFC]">Up to 5 Connected Stores</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span>Unlimited monthly order tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span className="font-semibold text-[#F8FAFC]">Unlimited AI Copilot queries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Automated Unit Economics waterfall</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span>Executive Reports with PDF export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span>Stockout & Low Margin alerts</span>
                </li>
              </ul>
            </div>
            <button
              id="pricing-pro-btn"
              onClick={() => handlePlanClick('Pro', false)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Choose Pro
            </button>
          </div>

          {/* Plan 3: ENTERPRISE */}
          <div className="p-8 rounded-3xl bg-[#11151D] border border-[#1E293B] flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider mb-2">ENTERPRISE</div>
              <p className="text-xs text-[#94A3B8] mb-6">Multi-brand data lake & custom AI analyst consulting.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-[#F8FAFC]">
                  ${billingCycle === 'monthly' ? 199 : 159}
                </span>
                <span className="text-[#94A3B8] text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-[#F8FAFC]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Unlimited Stores & Omnichannel</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  <span>Custom ERP & Warehouse API sync</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Dedicated AI Business Strategist</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Custom SLA & SSO Security</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Custom formatted board decks</span>
                </li>
              </ul>
            </div>
            <button
              id="pricing-enterprise-btn"
              onClick={() => handlePlanClick('Enterprise', false)}
              className="w-full py-3 px-4 rounded-xl bg-[#161B25] hover:bg-[#1E293B] text-[#F8FAFC] font-semibold text-sm transition-colors cursor-pointer border border-[#1E293B]"
            >
              Contact sales
            </button>
          </div>
        </div>
      </section>

      {/* 14. SOCIAL PROOF & HONEST TRUST MESSAGING */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#11151D] border border-[#1E293B] text-center max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-3">
            Built for modern ecommerce teams.
          </h3>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto mb-8">
            Designed for founders, operators and growing brands who care about net profit margins, true unit economics, and operational efficiency.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1E293B] text-left">
            <div className="p-4 rounded-2xl bg-[#08090D] border border-[#1E293B]">
              <ShieldCheck className="w-5 h-5 text-[#34D399] mb-2" />
              <h4 className="text-xs font-bold text-[#F8FAFC] mb-1">SOC-2 Type II Standards</h4>
              <p className="text-[11px] text-[#94A3B8]">Bank-level 256-bit encryption for all connected store data and order logs.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08090D] border border-[#1E293B]">
              <Lock className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-xs font-bold text-[#F8FAFC] mb-1">Zero Data Reselling</h4>
              <p className="text-[11px] text-[#94A3B8]">Your store metrics are 100% private and never used to train public models.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#08090D] border border-[#1E293B]">
              <Zap className="w-5 h-5 text-[#8B5CF6] mb-2" />
              <h4 className="text-xs font-bold text-[#F8FAFC] mb-1">Instant Activation</h4>
              <p className="text-[11px] text-[#94A3B8]">Connect via official API or drag-and-drop CSV in under 2 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. FAQ SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#11151D] border border-[#1E293B] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-base text-[#F8FAFC] hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#94A3B8] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#94A3B8] leading-relaxed border-t border-[#1E293B] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 16. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative text-center">
        <div className="rounded-3xl p-10 sm:p-14 bg-[#11151D] border border-[#1E293B] shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
            Ready to understand your business in seconds?
          </h2>
          <p className="text-[#94A3B8] text-base max-w-xl mx-auto mb-8">
            Connect your data and let AI show you what matters.
          </p>
          <button
            id="final-cta-btn"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 rounded-xl bg-[#6366F1] hover:bg-indigo-500 text-white font-bold text-base shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start analyzing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 17. FOOTER */}
      <footer className="border-t border-[#1E293B] bg-[#08090D] py-14 px-4 sm:px-6 lg:px-8 text-[#94A3B8] text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 p-[1px]">
                <div className="w-full h-full bg-[#11151D] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-[#F8FAFC] text-base">AI Business Copilot</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Ecommerce intelligence platform translating store orders, costs, and returns into confident daily actions.
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">
                  Store Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/ai-assistant')} className="hover:text-white transition-colors">
                  AI Business Copilot
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/analytics')} className="hover:text-white transition-colors">
                  Sales Analytics
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/products')} className="hover:text-white transition-colors">
                  Product Profitability
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/dashboard/integrations')} className="hover:text-white transition-colors">
                  Shopify Sync
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/integrations')} className="hover:text-white transition-colors">
                  WooCommerce API
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/integrations')} className="hover:text-white transition-colors">
                  CSV / Excel Validator
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/reports')} className="hover:text-white transition-colors">
                  Executive Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                  Sign In
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">
                  Create Account
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
              <li>
                <span className="text-slate-500">SOC-2 Type II Certified</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} AI Business Copilot. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#94A3B8] transition-colors">Privacy Shield</span>
            <span className="hover:text-[#94A3B8] transition-colors">Terms of Service</span>
            <span className="hover:text-[#94A3B8] transition-colors">Security Overview</span>
          </div>
        </div>
      </footer>

      {/* Payment Coming Soon Modal */}
      {paymentNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1424] border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {selectedPlanName} Plan Selected
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Payment integration coming soon! In this development stage, all Pro and Enterprise features are fully unlocked for testing inside your Dashboard.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setPaymentNoticeOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPaymentNoticeOpen(false);
                  navigate('/dashboard');
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Explore Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
