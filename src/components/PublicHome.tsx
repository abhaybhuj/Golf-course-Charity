import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Trophy,
  ArrowRight,
  Shield,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Users,
  Compass,
  DollarSign
} from 'lucide-react';
import { Charity } from '../types';

interface PublicHomeProps {
  onOpenSubscribe: () => void;
  onOpenDonate: () => void;
  onSelectCharity: (charity: Charity) => void;
  onGoToDirectory: () => void;
  onGoToDraws: () => void;
  onGoToSignup?: () => void;
  onGoToLogin?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onOpenSubscribe,
  onOpenDonate,
  onSelectCharity,
  onGoToDirectory,
  onGoToDraws,
  onGoToSignup,
  onGoToLogin
}) => {
  const { charities, activePoolAmount, rolloverJackpot, activeDrawMonth } = useApp();

  const [simulatedMembers, setSimulatedMembers] = useState(650);

  const totalCharityRaised = charities.reduce((acc, c) => acc + c.totalRaised, 0);
  const featuredCharities = charities.filter(c => c.isFeatured).slice(0, 3);

  // Dynamic interactive prize calculator
  const calcPool = Math.round(simulatedMembers * 18.5 + rolloverJackpot);
  const calcCharity = Math.round(simulatedMembers * 29 * 0.15); // avg 15% charity allocation

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient atmospheric glows - deliberate dark emotional lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-950/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-amber-950/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Edition 2026 · A New Paradigm for Sport & Philanthropy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Play with purpose. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Give back with every round.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Digital Heroes connects everyday golfers to grassroots charities and a monthly draw-based reward engine. Turn your 5 latest Stableford scores into life-changing community impact.
          </p>

          {/* Real-time Hero Ticker Card */}
          <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-400/90 font-mono uppercase tracking-wider">
                  {activeDrawMonth} Prize Pool
                </span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono mt-1">
                ${activePoolAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Rollover: ${rolloverJackpot.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-rose-400 font-mono uppercase tracking-wider">
                  Community Impact
                </span>
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1">
                ${totalCharityRaised.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                100% verified grassroots disbursements
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-cyan-400 font-mono uppercase tracking-wider">
                  Active Draw Format
                </span>
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white font-mono mt-1">
                5 · 4 · 3 Match Tiers
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                40% / 35% / 25% pool split
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => (onGoToSignup ? onGoToSignup() : onOpenSubscribe())}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Sign Up & Enter Draw ($29/mo)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onGoToDirectory}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Explore Charities</span>
            </button>

            <button
              onClick={onGoToDraws}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Draw Mechanics & Odds</span>
            </button>
          </div>

          {/* Quick Sign In Helper Under Hero */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Already a registered subscriber?</span>
            <button
              onClick={() => (onGoToLogin ? onGoToLogin() : onOpenSubscribe())}
              className="text-emerald-400 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Sign In to Member Portal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* How it Works - Emotional & Clean Section (§01, §02, §12) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
            The Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How Digital Heroes Operates
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            A frictionless cycle connecting your favorite sport with tangible social impact and high-stakes monthly community draws.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-sm font-bold font-mono mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Play Your Golf</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tee off at your home course, twilight league, or weekend competition. Calculate your round in standard Stableford points (1–45).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-sm font-bold font-mono mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Log Latest 5 Scores</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your points and date. Digital Heroes automatically maintains your rolling 5-score sequence, which forms your official monthly draw ticket.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-sm font-bold font-mono mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Direct Charity Impact</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              At least 10% (and up to 50% voluntarily) of your membership fee directly sponsors adaptive golf for veterans, pediatric heart surgery, or youth mentorship.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 relative group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-sm font-bold font-mono mb-4">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Monthly Draw Pools</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              At month-end, 5 numbers are drawn. Match 5, 4, or 3 numbers to claim your cash share. Unclaimed 5-match jackpots roll over indefinitely!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Charity Spotlight (§08.2: "Featured charity section on the homepage") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Section §08.2 · Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Causes Supported by Subscribers
            </h2>
          </div>

          <button
            onClick={onGoToDirectory}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Partner Charities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCharities.map(charity => (
            <div
              key={charity.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={charity.coverImage}
                    alt={charity.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-mono border border-slate-800">
                    {charity.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {charity.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {charity.description}
                  </p>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Raised to Date:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${charity.totalRaised.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => onSelectCharity(charity)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  View Profile & Events
                </button>
                <button
                  onClick={onOpenSubscribe}
                  className="px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  Support
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Prize & Impact Scaler (§07 Prize Pool Logic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Section §07 · Transparent Pool Economics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How Subscriber Volume Fuels Prizes & Philanthropy
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Every subscriber contributes $18.50/mo to the active prize pool and at least 10% directly to their designated charity. Drag the slider to see projected monthly scale:
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Active Subscriber Community:
                </span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {simulatedMembers.toLocaleString()} Members
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={simulatedMembers}
                onChange={(e) => setSimulatedMembers(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-amber-400 uppercase font-mono">5-Match Jackpot (40% + Rollover)</div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                  ${Math.round(calcPool * 0.40).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Carries forward if unclaimed</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-mono">4-Match & 3-Match Pools (60%)</div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                  ${Math.round(calcPool * 0.60).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Split equally among match tiers</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-rose-400 uppercase font-mono">Monthly Charity Grants</div>
                <div className="text-xl sm:text-2xl font-bold text-rose-300 font-mono mt-1">
                  ${calcCharity.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Direct wire to partner organizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Plans (§04) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
            Section §04 · Membership
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Simple, Transparent Membership Plans
          </h2>
          <p className="text-slate-400 text-xs mt-2">
            Gain immediate entry to all monthly draws, log unlimited Stableford scores, and direct monthly funding to your charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly */}
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Monthly Pass</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white font-mono">$29</span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Flexible commitment. Billed monthly with full access to rolling score tracker and monthly prize draw.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Entry into all monthly prize pools (5, 4 & 3 matches)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rolling 5-score Stableford ticket engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>At least 10% directed to charity of your choice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cancel or pause auto-renewal anytime</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (onGoToSignup ? onGoToSignup() : onOpenSubscribe())}
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Sign Up for Monthly Plan ($29)
            </button>
          </div>

          {/* Yearly */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-slate-900 to-emerald-950/20 border-2 border-emerald-500/40 relative flex flex-col justify-between shadow-xl">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider">
              2 Months Free ($58 Saving)
            </span>

            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Annual Hero Pass</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white font-mono">$290</span>
                <span className="text-slate-400 text-sm">/ year</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Our most popular tier. Guaranteed entry in 12 consecutive draws and amplified year-round philanthropic giving.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>12 monthly draws + guaranteed rollover jackpot eligibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Continuous 5-round rolling score updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Select and swap your supported charity anytime</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Invitations to partner Charity Golf Days</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (onGoToSignup ? onGoToSignup() : onOpenSubscribe())}
              className="mt-8 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Sign Up for Annual Hero Pass ($290)
            </button>
          </div>
        </div>

        {/* Bottom Auth Link Helper */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <button
            onClick={() => (onGoToLogin ? onGoToLogin() : onOpenSubscribe())}
            className="text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            Sign In to your existing account
          </button>
        </div>
      </section>
    </div>
  );
};
