import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, Key, UserCheck, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscribe: () => void;
  onNavigateToFullPage?: (tab: 'login' | 'signup') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenSubscribe,
  onNavigateToFullPage
}) => {
  const { loginAs } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(email || 'subscriber@digitalheroes.com');
    onClose();
  };

  const handleQuickSubscriber = () => {
    setEmail('subscriber@digitalheroes.com');
    setPassword('hero2026');
    loginAs('subscriber@digitalheroes.com');
    onClose();
  };

  const handleQuickAdmin = () => {
    setEmail('admin@digitalheroes.com');
    setPassword('admin2026');
    loginAs('admin@digitalheroes.com');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Sign In to Digital Heroes</h2>
          <p className="text-slate-400 text-xs mt-1">
            Access your subscriber scorecard, draw tickets, or admin console.
          </p>
        </div>

        {/* Quick Test Credentials Helper (§15 PRD Mandate) */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-5 space-y-2">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Reviewer 1-Click Test Accounts</span>
            <span className="text-[10px] text-emerald-400 font-mono">Instant Fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickSubscriber}
              className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" />
                Subscriber
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                subscriber@digitalheroes.com
              </div>
              <div className="text-[9px] text-slate-500">pw: hero2026</div>
            </button>

            <button
              type="button"
              onClick={handleQuickAdmin}
              className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/20 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                admin@digitalheroes.com
              </div>
              <div className="text-[9px] text-slate-500">pw: admin2026</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer text-xs"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-center text-xs text-slate-400">
          <div>
            <span>Don't have a membership yet? </span>
            <button
              onClick={() => {
                onClose();
                if (onNavigateToFullPage) onNavigateToFullPage('signup');
                else onOpenSubscribe();
              }}
              className="text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Sign Up / Register Here
            </button>
          </div>

          {onNavigateToFullPage && (
            <div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFullPage('login');
                }}
                className="text-slate-500 hover:text-slate-300 underline text-[11px] cursor-pointer"
              >
                Switch to Full-Screen Login Page →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
