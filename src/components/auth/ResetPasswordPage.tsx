import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Lock, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { api } from '../../lib/api/client';
import { useNavigation } from '../../lib/navigation';

export const ResetPasswordPage: React.FC = () => {
  const { navigate, searchParams } = useNavigation();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [targetEmail, setTargetEmail] = useState<string | null>(null);
  const [verifyingToken, setVerifyingToken] = useState(!!tokenFromUrl);
  const [tokenValid, setTokenValid] = useState<boolean | null>(tokenFromUrl ? null : true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate token on load if provided
  useEffect(() => {
    if (!tokenFromUrl) {
      setVerifyingToken(false);
      return;
    }

    async function checkToken() {
      setVerifyingToken(true);
      setTokenError(null);
      try {
        const res = await api.verifyResetToken(tokenFromUrl);
        if (res.valid) {
          setTokenValid(true);
          setTargetEmail(res.email || null);
        } else {
          setTokenValid(false);
          setTokenError('The password reset link is invalid or has expired.');
        }
      } catch (err: unknown) {
        setTokenValid(false);
        const msg = err instanceof Error ? err.message : 'Invalid or expired reset link';
        setTokenError(msg);
      } finally {
        setVerifyingToken(false);
      }
    }

    checkToken();
  }, [tokenFromUrl]);

  // Password criteria checks
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const activeToken = token.trim();
    if (!activeToken) {
      setError('Password reset token is required');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!hasNumberOrSymbol) {
      setError('Password must contain at least one number or special character');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({
        token: activeToken,
        password,
        confirmPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset password. Please try requesting a new link.';
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
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create New Password</h1>
            <p className="text-xs text-slate-400">
              {targetEmail ? (
                <>Setting a new password for <span className="font-semibold text-slate-200">{targetEmail}</span></>
              ) : (
                'Choose a strong and secure password for your workspace'
              )}
            </p>
          </div>

          {verifyingToken ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <span>Verifying reset token security...</span>
            </div>
          ) : tokenValid === false ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Invalid or Expired Link</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tokenError || 'This password reset link has either expired after 60 minutes or has already been used.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request New Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Password Reset Complete</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your password has been successfully updated and all existing active sessions have been securely invalidated.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login?reset=success')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In with New Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {!tokenFromUrl && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="Enter reset token from email"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E293B] text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="new-password-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="confirm-new-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password strength checklist */}
              <div className="p-3 rounded-xl bg-[#08090D] border border-[#1E293B] space-y-1.5 text-[11px]">
                <div className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Minimum 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 transition-colors ${hasNumberOrSymbol ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Contains number or symbol</span>
                </div>
                <div className={`flex items-center gap-1.5 transition-colors ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Passwords match</span>
                </div>
              </div>

              <button
                id="reset-password-submit-btn"
                type="submit"
                disabled={loading || !hasMinLength || !hasNumberOrSymbol || !passwordsMatch}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bcrypt key stretching • Zero plaintext exposure</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        AI Business Copilot • Secure Password Reset
      </footer>
    </div>
  );
};
