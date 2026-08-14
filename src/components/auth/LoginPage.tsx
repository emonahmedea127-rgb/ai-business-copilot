import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/auth/context';
import { useNavigation } from '../../lib/navigation';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { navigate, searchParams } = useNavigation();

  const isResetSuccess = searchParams.get('reset') === 'success';
  const isVerifiedSuccess = searchParams.get('verified') === 'true';

  const [email, setEmail] = useState('alex@aurastore.com');
  const [password, setPassword] = useState('demopass123');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);
    setRequiresVerification(false);
    try {
      await login(email.trim(), password);
      navigate('/dashboard/overview');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
      if (message.toLowerCase().includes('verify your email')) {
        setRequiresVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/dashboard/overview');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to authenticate with Google';
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demopass123');
    setError(null);
    setRequiresVerification(false);
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
          onClick={() => navigate('/signup')}
          className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#1E293B] hover:border-slate-700 bg-[#11151D] transition-colors cursor-pointer"
        >
          Don't have an account? Sign Up
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8 z-10">
        <div className="p-8 rounded-2xl bg-[#11151D] border border-[#1E293B] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-xs text-slate-400">
              Sign in to your AI Business Copilot workspace
            </p>
          </div>

          {/* Success Banners */}
          {isResetSuccess && (
            <div className="p-3.5 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Password successfully reset! Please sign in with your new credentials.</span>
            </div>
          )}

          {isVerifiedSuccess && (
            <div className="p-3.5 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Email verified successfully! You can now access your workspace.</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
              {requiresVerification && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/verify-email?email=${encodeURIComponent(email)}`)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Click here to verify your email address →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google Firebase Authentication */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-2.5 px-4 mb-5 rounded-xl border border-[#1E293B] hover:border-slate-700 bg-[#08090D] hover:bg-[#141822] text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#1E293B] w-full" />
            <span className="bg-[#11151D] px-3 text-[11px] text-slate-500 uppercase tracking-wider">
              or continue with email
            </span>
            <div className="border-t border-[#1E293B] w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="founder@yourstore.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E293B] text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Create Account Option */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[#1E293B]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Development Quick Demo Logins:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('alex@aurastore.com')}
                className="p-2.5 rounded-lg bg-[#08090D] hover:bg-[#161B25] border border-[#1E293B] text-[11px] text-slate-300 text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-white">Store Owner</div>
                <div className="text-[10px] text-slate-400 truncate">alex@aurastore.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('analyst@nordic.com')}
                className="p-2.5 rounded-lg bg-[#08090D] hover:bg-[#161B25] border border-[#1E293B] text-[11px] text-slate-300 text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-white">Growth Analyst</div>
                <div className="text-[10px] text-slate-400 truncate">analyst@nordic.com</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10">
        AI Business Copilot • Production Authentication
      </footer>
    </div>
  );
};
