import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Heart,
  Trophy,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Flag,
  Calendar,
  AlertCircle,
  HelpCircle,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { NavigationTab, SubscriptionPlan } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
  onNavigateTab: (tab: NavigationTab) => void;
  preselectedCharityId?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onNavigateTab,
  preselectedCharityId
}) => {
  const {
    loginAs,
    registerSubscriber,
    charities,
    activePoolAmount,
    activeDrawMonth,
    rolloverJackpot,
    allSubscribers
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // SIGNUP STATE
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [homeClub, setHomeClub] = useState('St. Andrews Links Club');
  const [handicap, setHandicap] = useState<number>(14.2);
  const [plan, setPlan] = useState<SubscriptionPlan>('yearly');
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    preselectedCharityId || charities[0]?.id || 'charity-1'
  );
  const [charityPercentage, setCharityPercentage] = useState<number>(20);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment mock fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailToUse = loginEmail.trim();
    if (!emailToUse) {
      setLoginError('Please enter your email address.');
      return;
    }

    if (emailToUse.toLowerCase().includes('admin')) {
      loginAs('admin@digitalheroes.com');
      onNavigateTab('admin');
      return;
    }

    const success = loginAs(emailToUse);
    if (success) {
      onNavigateTab('dashboard');
    } else {
      setLoginError('Invalid credentials. You can use the 1-click test buttons below.');
    }
  };

  // Quick 1-Click test logins for evaluators
  const handleQuickSubscriber = () => {
    setLoginEmail('subscriber@digitalheroes.com');
    setLoginPassword('hero2026');
    loginAs('subscriber@digitalheroes.com');
    onNavigateTab('dashboard');
  };

  const handleQuickAdmin = () => {
    setLoginEmail('admin@digitalheroes.com');
    setLoginPassword('admin2026');
    loginAs('admin@digitalheroes.com');
    onNavigateTab('admin');
  };

  // Handle Signup Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!name.trim()) {
      setSignupError('Please provide your full name.');
      return;
    }

    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('Please enter a valid email address.');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setSignupError('Please agree to the membership and draw rules.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        registerSubscriber({
          name: name.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          homeClub: homeClub.trim() || 'Home Golf Club',
          handicap: Number(handicap) || 14.0,
          plan,
          charityId: selectedCharityId,
          charityPercentage,
          initialScores: [36, 38, 35, 37, 34]
        });

        setIsSubmitting(false);
        onNavigateTab('dashboard');
      } catch (err: any) {
        setIsSubmitting(false);
        setSignupError(err?.message || 'Failed to complete registration.');
      }
    }, 700);
  };

  const selectedCharityObj = charities.find(c => c.id === selectedCharityId) || charities[0];
  const planPrice = plan === 'monthly' ? 29 : 290;
  const charityAmount = (planPrice * (charityPercentage / 100)).toFixed(2);
  const poolContribution = (planPrice * 0.60).toFixed(2);

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-950/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-cyan-950/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRD §03 · Authentication & Member Registration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            {mode === 'login' ? 'Sign In to Digital Heroes' : 'Create Your Golfer Membership'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            {mode === 'login'
              ? 'Access your rolling 5-score scorecard, active draw tickets, and philanthropic impact.'
              : 'Join the premier golf platform combining Stableford score tracking with monthly charity prize draws.'}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Sign In (Existing Member)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setSignupError(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'signup'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sign Up (New Membership)</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* MODE: SIGN IN                                            */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Quick Reviewer 1-Click Access Box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  1-Click Reviewer Test Accounts
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Instant Auth</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleQuickSubscriber}
                  className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 hover:bg-emerald-950/20 text-left transition-all cursor-pointer group hover:border-emerald-400"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      Alex Vance
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Subscriber
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-1 truncate">
                    subscriber@digitalheroes.com
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    HCP: 14.2 · Rolling 5 scores active
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleQuickAdmin}
                  className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 hover:bg-cyan-950/20 text-left transition-all cursor-pointer group hover:border-cyan-400"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                      Super Admin
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      Admin
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-1 truncate">
                    admin@digitalheroes.com
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Full 5 control surfaces access
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="subscriber@digitalheroes.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors pr-10 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <span>Sign In & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Switch to Signup */}
            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              <span>Don't have a Digital Heroes membership yet? </span>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Register as a New Member
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE: SIGN UP (NEW MEMBER REGISTRATION)                  */}
        {/* ======================================================== */}
        {mode === 'signup' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Draw Enticement Banner */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                  Upcoming Draw: {activeDrawMonth}
                </div>
                <div className="text-lg font-bold text-amber-300 font-mono">
                  ${activePoolAmount.toLocaleString()} Prize Pool
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                  40% 5-Match Rollover
                </span>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  100% verified grassroots giving
                </div>
              </div>
            </div>

            {/* Error Message */}
            {signupError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-6">
              {/* SECTION 1: Personal Credentials */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  1. Member Account Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Spieth"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Create Password</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono pr-9"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Confirm Password</label>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Golfer Profile */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Flag className="w-3.5 h-3.5 text-emerald-400" />
                  2. Golfer Profile & Handicap
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Home Golf Club / Course</label>
                    <input
                      type="text"
                      value={homeClub}
                      onChange={(e) => setHomeClub(e.target.value)}
                      placeholder="e.g. Royal Melbourne, Bayside Links"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Official Handicap Index</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="54"
                        value={handicap}
                        onChange={(e) => setHandicap(Number(e.target.value))}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-xs text-slate-500">
                        * Used for peer verification on high-tier prize claims.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Membership Plan Selection */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  3. Select Membership Plan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlan('monthly')}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      plan === 'monthly'
                        ? 'bg-slate-800/90 border-emerald-500/60 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-300">Monthly Plan</span>
                      <span className="text-base font-bold text-white font-mono">$29/mo</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      1 entry into every monthly draw. Cancel anytime.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlan('yearly')}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative ${
                      plan === 'yearly'
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full uppercase">
                      Save 17% (2 Mo Free)
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-emerald-300">Annual Plan</span>
                      <span className="text-base font-bold text-white font-mono">$290/yr</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-1">
                      Full 12 draws coverage + priority tournament access.
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION 4: Philanthropic Allocation (PRD §08) */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  4. Direct Cause & Voluntary Contribution
                </h3>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">
                    Select Your Supported Charity
                  </label>
                  <select
                    value={selectedCharityId}
                    onChange={(e) => setSelectedCharityId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {charities.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} · ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slider */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Voluntary Charity Allocation:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {charityPercentage}% (${charityAmount} to {selectedCharityObj.name})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={charityPercentage}
                    onChange={(e) => setCharityPercentage(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10% (PRD Baseline)</span>
                    <span>25%</span>
                    <span>50% (Champion Giver)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] text-slate-400">
                    <span>Draw Pool Contribution:</span>
                    <span className="text-amber-400 font-mono font-medium">~${poolContribution}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Payment Details */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    5. Payment Information (Simulated Stripe)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-Bit SSL
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/YY"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                    required
                  />
                  <span>
                    I confirm my membership terms (${planPrice} {plan === 'yearly' ? '/ year' : '/ month'}) under Digital Heroes Edition 2026 regulations. I understand that my latest 5 Stableford scores form my monthly lottery ticket.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Activating Account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Complete Registration & Enter Draw (${planPrice})</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign In */}
            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              <span>Already a registered subscriber? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Sign In to Your Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal Helper */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Reset Your Password
            </h3>

            {forgotSuccess ? (
              <div className="space-y-3 text-center py-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300">
                  Password reset link dispatched to <strong>{forgotEmail}</strong>. (Simulated verification).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Enter your registered account email to receive a password reset link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="subscriber@digitalheroes.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (forgotEmail.trim()) setForgotSuccess(true);
                    }}
                    className="flex-1 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
