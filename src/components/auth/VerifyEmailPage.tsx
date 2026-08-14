import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ArrowRight, Mail, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck, RefreshCw, Send, Loader2 } from 'lucide-react';
import { api } from '../../lib/api/client';
import { useNavigation } from '../../lib/navigation';

export const VerifyEmailPage: React.FC = () => {
  const { navigate, searchParams } = useNavigation();
  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  const [email, setEmail] = useState(emailParam);
  const [tokenInput, setTokenInput] = useState(tokenParam);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Auto-verify if token is provided in URL
  const handleVerifyWithToken = useCallback(async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) return;

    setVerifying(true);
    setError(null);
    try {
      const res = await api.verifyEmail(tokenToVerify.trim());
      setIsVerified(true);
      setSuccessMessage(res.message || 'Email verified successfully! You can now sign in.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired verification link';
      setError(msg);
    } finally {
      setVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (tokenParam && !isVerified) {
      handleVerifyWithToken(tokenParam);
    }
  }, [tokenParam, handleVerifyWithToken, isVerified]);

  // Cooldown countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Please provide your email address to resend verification');
      return;
    }

    setResending(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.resendVerificationEmail(email.trim());
      setSuccessMessage(res.message);
      setCooldown(30); // 30s cooldown
      if (res.verificationToken) {
        setTokenInput(res.verificationToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend verification link';
      setError(msg);
    } finally {
      setResending(false);
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
          {isVerified ? (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Email Verified</h1>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  {successMessage || 'Your email address has been successfully verified. You can now access your full workspace.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login?verified=true')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
                  <Mail className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Check Your Email</h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We've sent a verification link to
                </p>
                {email ? (
                  <p className="text-sm font-semibold text-indigo-300 mt-1 bg-indigo-950/40 py-1 px-3 rounded-lg inline-block border border-indigo-500/20">
                    {email}
                  </p>
                ) : (
                  <p className="text-xs text-slate-300 font-medium mt-1">your registered email address</p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && !isVerified && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {verifying ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-300">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  <span>Verifying your email token...</span>
                </div>
              ) : tokenInput ? (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-300">Ready to verify:</span>
                    <span className="text-[10px] text-slate-400">Security Token Attached</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyWithToken(tokenInput)}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Click Here to Complete Email Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              {/* Resend Action */}
              <div className="pt-2 border-t border-[#1E293B] space-y-3 text-center">
                <p className="text-xs text-slate-400">
                  Didn't receive the email? Check your spam folder or request a new verification message.
                </p>

                {!emailParam && (
                  <div className="text-left mb-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="founder@yourstore.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#08090D] border border-[#1E293B] text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#1E293B] hover:border-slate-700 bg-[#08090D] text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>Sending...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                      <span>Resend available in {cooldown}s</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>

                <div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>24-hour cryptographic token expiration</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        AI Business Copilot • Account Verification
      </footer>
    </div>
  );
};
