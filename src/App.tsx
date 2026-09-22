import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { CharityDirectory } from './components/CharityDirectory';
import { DrawExplainerView } from './components/DrawExplainerView';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthView } from './components/AuthView';
import { SubscribeModal } from './components/SubscribeModal';
import { ScoreModal } from './components/ScoreModal';
import { DonateModal } from './components/DonateModal';
import { ProofUploadModal } from './components/ProofUploadModal';
import { LoginModal } from './components/LoginModal';
import { CharityDetailModal } from './components/CharityDetailModal';
import { Charity, GolfScore, UserWinning, NavigationTab } from './types';
import { Sparkles, Heart, Shield, Trophy, LogIn, UserPlus } from 'lucide-react';

function AppContent() {
  const { role, toastMessage } = useApp();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  // Modal States
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscribeCharityId, setSubscribeCharityId] = useState<string | undefined>(undefined);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateCharityId, setDonateCharityId] = useState<string | undefined>(undefined);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);
  const [selectedCharityForDetail, setSelectedCharityForDetail] = useState<Charity | null>(null);
  const [proofWinning, setProofWinning] = useState<UserWinning | null>(null);

  // Hash and Path Routing support for direct links (#login, #signup, #abhaybhuj.assignment.golfncharity, etc.)
  React.useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (hash.includes('login') || hash.includes('signin') || pathname.endsWith('/login')) {
        setCurrentTab('login');
      } else if (hash.includes('signup') || hash.includes('register') || hash.includes('join') || pathname.endsWith('/signup')) {
        setCurrentTab('signup');
      } else if (hash.includes('charities') || pathname.endsWith('/charities')) {
        setCurrentTab('charities');
      } else if (hash.includes('draws') || pathname.endsWith('/draws')) {
        setCurrentTab('draws');
      } else if (hash.includes('dashboard') || pathname.endsWith('/dashboard')) {
        setCurrentTab('dashboard');
      } else if (hash.includes('admin') || pathname.endsWith('/admin')) {
        setCurrentTab('admin');
      }
    };

    handleLocation();
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  // Sync tab with role changes
  React.useEffect(() => {
    if (role === 'admin') {
      setCurrentTab('admin');
    } else if (role === 'subscriber' && (currentTab === 'admin' || currentTab === 'login' || currentTab === 'signup')) {
      setCurrentTab('dashboard');
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col selection:bg-[#C1FF72]/30 selection:text-[#C1FF72]">
      {/* 1. Evaluator Quick Switcher Bar */}
      <RoleSwitcherBar currentTab={currentTab} onNavigateTab={setCurrentTab} />

      {/* 2. Platform Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSubscribeModal={() => {
          setSubscribeCharityId(undefined);
          setIsSubscribeOpen(true);
        }}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenDonateModal={() => {
          setDonateCharityId(undefined);
          setIsDonateOpen(true);
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <PublicHome
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
            onSelectCharity={(charity) => setSelectedCharityForDetail(charity)}
            onGoToDirectory={() => setCurrentTab('charities')}
            onGoToDraws={() => setCurrentTab('draws')}
            onGoToSignup={() => setCurrentTab('signup')}
            onGoToLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'login' && (
          <AuthView
            initialMode="login"
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'signup' && (
          <AuthView
            initialMode="signup"
            onNavigateTab={setCurrentTab}
            preselectedCharityId={subscribeCharityId}
          />
        )}

        {currentTab === 'charities' && (
          <CharityDirectory
            onSelectCharity={(charity) => setSelectedCharityForDetail(charity)}
            onOpenDonate={(charityId) => {
              setDonateCharityId(charityId);
              setIsDonateOpen(true);
            }}
            onOpenSubscribe={(charityId) => {
              setSubscribeCharityId(charityId);
              setIsSubscribeOpen(true);
            }}
          />
        )}

        {currentTab === 'draws' && (
          <DrawExplainerView onOpenSubscribe={() => setIsSubscribeOpen(true)} />
        )}

        {currentTab === 'dashboard' && (
          <UserDashboard
            onOpenScoreModal={(score) => {
              setEditingScore(score || null);
              setIsScoreOpen(true);
            }}
            onOpenProofModal={(winning) => setProofWinning(winning)}
            onOpenDonateModal={(charityId) => {
              setDonateCharityId(charityId);
              setIsDonateOpen(true);
            }}
            onGoToDirectory={() => setCurrentTab('charities')}
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        preselectedCharityId={subscribeCharityId}
      />

      <ScoreModal
        isOpen={isScoreOpen}
        onClose={() => {
          setIsScoreOpen(false);
          setEditingScore(null);
        }}
        editingScore={editingScore}
      />

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => {
          setIsDonateOpen(false);
          setDonateCharityId(undefined);
        }}
        preselectedCharityId={donateCharityId}
      />

      <ProofUploadModal
        isOpen={!!proofWinning}
        onClose={() => setProofWinning(null)}
        winning={proofWinning}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onNavigateToFullPage={(tab) => setCurrentTab(tab)}
      />

      <CharityDetailModal
        charity={selectedCharityForDetail}
        onClose={() => setSelectedCharityForDetail(null)}
        onSelectForSubscription={(charityId) => {
          setSubscribeCharityId(charityId);
          setIsSubscribeOpen(true);
        }}
        onDirectDonate={(charityId) => {
          setDonateCharityId(charityId);
          setIsDonateOpen(true);
        }}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <div className="font-mono font-bold text-white tracking-wider text-base flex items-center justify-center md:justify-start gap-2">
                <span>digital.HEROES.</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Edition 2026
                </span>
              </div>
              <p className="text-slate-500 text-xs max-w-md">
                A modern golf performance tracking and charity draw platform. Designed for charitable emotion, not fairway clichés.
              </p>
            </div>

            {/* Prominent Quick Navigation Links including Sign In and Sign Up */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <button
                onClick={() => setCurrentTab('home')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Overview
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('charities')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Charities
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('draws')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Monthly Draw
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('login')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('signup')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up / Register
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span>PRD §01–§16 Compliant · Submission ID:</span>
              <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                abhaybhuj.assignment.golfncharity
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentTab('login')}
                className="hover:text-slate-300 text-left cursor-pointer"
              >
                Subscriber: subscriber@digitalheroes.com
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('login')}
                className="hover:text-slate-300 text-left cursor-pointer"
              >
                Admin: admin@digitalheroes.com
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
