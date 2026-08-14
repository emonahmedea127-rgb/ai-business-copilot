import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, AlertCircle, CheckCircle2, ArrowLeft, KeyRound, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api/client';
import { useNavigation } from '../../lib/navigation';

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useNavigation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewToken, setPreviewToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid work email address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.forgotPassword(email.trim());
      setSuccess(true);
      if (res.previewResetToken) {
        setPreviewToken(res.previewResetToken);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to process password reset request';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background subtle glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-bold text-white tracking-tight">AI Business Copilot</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#1E293B] hover:border-slate-700 bg-[#11151D] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8 z-10">
        <div className="p-8 rounded-2xl bg-[#11151D] border border-[#1E293B] shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Enter your work email address and we'll send you secure instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset Email Sent</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  If an account exists for <span className="font-semibold text-white">{email}</span>, you will receive an email containing a secure password reset link.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/80 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>The reset link is valid for 60 minutes</span>
                </div>
              </div>

              {/* Development helper link when simulated */}
              {previewToken && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-300 text-[11px]">Sandbox Test Link:</span>
                    <span className="text-[10px] text-slate-400">Dev Preview</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/reset-password?token=${encodeURIComponent(previewToken)}`)}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open Reset Password Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="pt-2 text-center space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setPreviewToken(null);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                >
                  Didn't receive the email? Try again
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="forgot-password-email-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="founder@yourstore.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E293B] text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                id="forgot-password-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs text-slate-400 hover:text-slate-300 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cryptographic single-use recovery token</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        AI Business Copilot • Secure Account Recovery
      </footer>
    </div>
  );
};
