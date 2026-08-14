import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../../lib/auth/context';
import { useNavigation } from '../../lib/navigation';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const [email, setEmail] = useState('alex@aurastore.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demopass123');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-bold text-white tracking-tight">AI Business Copilot</span>
        </div>
        <button
          onClick={() => navigate('/signup')}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
        >
          Don't have an account? Sign Up
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8 z-10">
        <div className="p-8 rounded-2xl bg-[#0c101d] border border-slate-800 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-xs text-slate-400">
              Sign in to your AI Business Copilot workspace
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In to Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Development Safe Quick Demo Logins:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('alex@aurastore.com')}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-[11px] text-slate-300 text-left transition-colors"
              >
                <div className="font-semibold text-white">Store Owner</div>
                <div className="text-[10px] text-slate-400 truncate">alex@aurastore.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('analyst@nordic.com')}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-[11px] text-slate-300 text-left transition-colors"
              >
                <div className="font-semibold text-white">Growth Analyst</div>
                <div className="text-[10px] text-slate-400 truncate">analyst@nordic.com</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-400 z-10">
        AI Business Copilot • Mock Auth System v1.0
      </footer>
    </div>
  );
};
