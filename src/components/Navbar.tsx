import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Trophy, User, ShieldAlert, Sparkles, LogIn, UserPlus, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
  onOpenDonateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSubscribeModal,
  onOpenLoginModal,
  onOpenDonateModal
}) => {
  const { role, setRole, currentUser, activePoolAmount, rolloverJackpot, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl sticky top-[37px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (role === 'admin') setCurrentTab('admin');
                else if (role === 'subscriber') setCurrentTab('dashboard');
                else setCurrentTab('home');
              }}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400/60 transition-colors">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1 font-mono">
                  digital<span className="text-emerald-400">.HEROES.</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase block font-sans">
                  Golf & Charity Platform
                </span>
              </div>
            </button>

            {/* Main Nav Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setCurrentTab('charities')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'charities'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Charities
              </button>

              <button
                onClick={() => setCurrentTab('draws')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'draws'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Monthly Draw
              </button>

              {role === 'subscriber' && (
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  My Dashboard
                </button>
              )}

              {role === 'admin' && (
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'admin'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  Admin Console
                </button>
              )}
            </div>
          </div>

          {/* Right Section: Prize ticker & Auth CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Pool Pill */}
            <div
              onClick={() => setCurrentTab('draws')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors cursor-pointer"
              title="Click to view full draw mechanics & rollover status"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <div className="text-[10px] text-amber-300/80 font-mono leading-none">
                  MARCH POOL {rolloverJackpot > 0 && '(+ROLLOVER)'}
                </div>
                <div className="text-xs font-bold text-amber-400 font-mono leading-tight">
                  ${activePoolAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Role specific Auth CTAs */}
            {role === 'visitor' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDonateModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                >
                  Give Direct
                </button>

                {/* Explicit Sign In Button */}
                <button
                  onClick={() => setCurrentTab('login')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'login'
                      ? 'bg-slate-800 text-white border border-emerald-500/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/80'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </button>

                {/* Explicit Sign Up Button */}
                <button
                  onClick={() => setCurrentTab('signup')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    currentTab === 'signup'
                      ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {role === 'subscriber' && (
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="font-medium truncate max-w-[100px]">{currentUser.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded font-mono">
                      {currentUser.subscription.status.toUpperCase()}
                    </span>
                  </button>
                )}

                {role === 'admin' && (
                  <button
                    onClick={() => setCurrentTab('admin')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono cursor-pointer hover:bg-cyan-900/40"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Admin Superuser</span>
                  </button>
                )}

                {/* Sign Out Button to test login/signup flows easily */}
                <button
                  onClick={() => {
                    logout();
                    setCurrentTab('login');
                  }}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg text-xs flex items-center gap-1 border border-slate-800 transition-colors cursor-pointer"
                  title="Sign out and return to Login page"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Overview
          </button>
          <button
            onClick={() => { setCurrentTab('charities'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-400" /> Charities
          </button>
          <button
            onClick={() => { setCurrentTab('draws'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Monthly Draw (${activePoolAmount.toLocaleString()})
          </button>
          {role === 'subscriber' && (
            <button
              onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-emerald-400 bg-emerald-500/10 flex items-center gap-2"
            >
              <User className="w-4 h-4" /> My Dashboard & Scores
            </button>
          )}
          {role === 'admin' && (
            <button
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-cyan-400 bg-cyan-500/10 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> Admin Console
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { setCurrentTab('login'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              Sign In (Existing Member)
            </button>
            <button
              onClick={() => { setCurrentTab('signup'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-center rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up (New Membership)
            </button>
            <button
              onClick={() => { onOpenDonateModal(); setMobileMenuOpen(false); }}
              className="w-full py-2 text-center rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Make Direct Charity Donation
            </button>
            {role !== 'visitor' && (
              <button
                onClick={() => { logout(); setCurrentTab('login'); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center rounded-lg text-xs text-rose-400 hover:bg-slate-800"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

