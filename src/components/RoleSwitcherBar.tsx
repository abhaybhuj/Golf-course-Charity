import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Globe, RotateCcw, Sparkles, LogIn, UserPlus, Copy, Check } from 'lucide-react';
import { UserRole, NavigationTab } from '../types';

interface RoleSwitcherBarProps {
  currentTab?: NavigationTab;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ currentTab, onNavigateTab }) => {
  const { role, setRole, resetToDefaultData, currentUser, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const handleCopyAssignmentUrl = () => {
    const url = `${window.location.origin}/#abhaybhuj.assignment.golfncharity`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    showToast('Copied live submission URL');
    setTimeout(() => setCopied(false), 2000);
  };

  const roles: { id: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; badge: string }[] = [
    { id: 'visitor', label: 'Public Visitor', icon: Globe, badge: 'Role 01' },
    { id: 'subscriber', label: 'Subscriber Portal', icon: User, badge: 'Role 02 (Alex Vance)' },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck, badge: 'Role 03' }
  ];

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md text-xs py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Evaluation Sandbox
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="text-slate-500">ID:</span>
            <span className="text-emerald-400 font-semibold">abhaybhuj.assignment.golfncharity</span>
          </div>
          <button
            onClick={handleCopyAssignmentUrl}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2 py-0.5 rounded hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition-colors"
            title="Copy abhaybhuj.assignment.golfncharity submission URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline font-mono">{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Role Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-500 font-medium px-2 py-0.5 text-[11px]">View Mode:</span>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  if (onNavigateTab) {
                    if (r.id === 'admin') onNavigateTab('admin');
                    else if (r.id === 'subscriber') onNavigateTab('dashboard');
                    else onNavigateTab('home');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch view to ${r.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Auth Page shortcuts for Evaluator */}
        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/80">
              <button
                onClick={() => onNavigateTab('login')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'login'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Open dedicated Login Page (§03)"
              >
                <LogIn className="w-3 h-3 text-emerald-400" />
                <span>Login Page</span>
              </button>

              <button
                onClick={() => onNavigateTab('signup')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'signup'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Open dedicated Signup / Registration Page (§03)"
              >
                <UserPlus className="w-3 h-3 text-emerald-400" />
                <span>Sign Up Page</span>
              </button>
            </div>
          )}

          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors px-2 py-1 rounded hover:bg-slate-900 cursor-pointer text-[11px]"
            title="Reset to fresh PRD baseline test data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Baseline Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

