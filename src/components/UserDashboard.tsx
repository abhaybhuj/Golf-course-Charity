import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Calendar,
  Heart,
  Trophy,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  UploadCloud,
  FileCheck,
  PauseCircle,
  PlayCircle,
  LogOut
} from 'lucide-react';
import { GolfScore, UserWinning } from '../types';

interface UserDashboardProps {
  onOpenScoreModal: (editingScore?: GolfScore | null) => void;
  onOpenProofModal: (winning: UserWinning) => void;
  onOpenDonateModal: (charityId?: string) => void;
  onGoToDirectory: () => void;
  onOpenSubscribe: () => void;
  onNavigateTab?: (tab: 'home' | 'login' | 'signup') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenScoreModal,
  onOpenProofModal,
  onOpenDonateModal,
  onGoToDirectory,
  onOpenSubscribe,
  onNavigateTab
}) => {
  const {
    currentUser,
    charities,
    deleteGolfScore,
    updateUserCharityChoice,
    cancelSubscription,
    resumeSubscription,
    activePoolAmount,
    activeDrawMonth,
    rolloverJackpot,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'scores' | 'charity' | 'winnings'>('overview');

  const selectedCharity = charities.find(c => c.id === currentUser.charityId) || charities[0];

  // Derived calculations
  const totalWon = currentUser.winnings.reduce((acc, w) => acc + w.amount, 0);
  const pendingWinnings = currentUser.winnings.filter(w => w.status === 'pending_verification' || w.status === 'approved');
  const paidWinnings = currentUser.winnings.filter(w => w.status === 'paid');

  // Active ticket numbers: all points from their 5 latest scores
  const activeTicketNumbers = currentUser.scores.map(s => s.points);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile & Subscription Header Bar (§10) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {currentUser.subscription.plan.toUpperCase()} HERO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {currentUser.email} · {currentUser.homeClub || 'Home Club Registered'} · Handicap: {currentUser.handicap || '14.2'}
              </p>
            </div>
          </div>

          {/* Subscription Status Card (§10 Checklist) */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Status & Renewal</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${currentUser.subscription.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white capitalize font-mono">
                  {currentUser.subscription.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (Renews: {currentUser.subscription.renewalDate})
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div>
              {currentUser.subscription.status === 'active' ? (
                <button
                  onClick={cancelSubscription}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-slate-900"
                  title="Pause recurring billing"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Cancel Auto-renew</span>
                </button>
              ) : (
                <button
                  onClick={resumeSubscription}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-slate-900"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Resume Membership</span>
                </button>
              )}
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div>
              <button
                onClick={() => {
                  logout();
                  if (onNavigateTab) onNavigateTab('home');
                }}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-slate-900 border border-slate-800/80"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Dashboard */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Overview & Draw Ticket
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scores'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Rolling 5 Scores ({currentUser.scores.length}/5)</span>
          </button>

          <button
            onClick={() => setActiveTab('charity')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'charity'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Charity Contribution ({currentUser.charityPercentage}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('winnings')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'winnings'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Winnings & Verification ({currentUser.winnings.length})</span>
          </button>
        </div>
      </div>

      {/* Inactive Subscription Warning Banner (§04) */}
      {currentUser.subscription.status !== 'active' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Inactive Subscription: </span>
              Your subscription is currently {currentUser.subscription.status}. You can inspect your past dashboard data, but score submissions and prize draw entries are locked until resumed.
            </div>
          </div>
          <button
            onClick={resumeSubscription}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Reactivate Membership
          </button>
        </div>
      )}

      {/* Hero Charity Feature Section (Part 2: Charity First prominence) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30" />
              <span>PRIMARY MISSION · CHARITABLE IMPACT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Giving Back Through Every Swing
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every month, <span className="text-white font-semibold">{currentUser.charityPercentage}%</span> of your subscription goes directly to <span className="text-rose-300 font-bold">{selectedCharity.name}</span>. You have powered <span className="text-white font-mono font-bold">${currentUser.totalDonated.toLocaleString()}</span> in impact so far.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenDonateModal(selectedCharity.id)}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Boost Donation</span>
            </button>
            <button
              onClick={() => setActiveTab('charity')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Cause ({currentUser.charityPercentage}%)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-500 uppercase font-mono block">Draws Entered</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {currentUser.drawsEnteredCount} Draws
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Eligible for March Draw</div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-amber-400 uppercase font-mono block">Active March Pool</span>
              <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
                ${activePoolAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Rollover: ${rolloverJackpot.toLocaleString()}</div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-rose-400 uppercase font-mono block">Your Charity Impact</span>
              <div className="text-2xl font-bold text-rose-300 font-mono mt-1">
                ${currentUser.totalDonated.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{selectedCharity.name}</div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-emerald-400 uppercase font-mono block">Total Prize Winnings</span>
              <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">
                ${totalWon.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {pendingWinnings.length > 0 ? `${pendingWinnings.length} Pending Verification` : 'All Verified & Paid'}
              </div>
            </div>
          </div>

          {/* Current 5-Score Active Ticket Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                  Official Entry Ticket
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Your {activeDrawMonth} 5-Number Draw Ticket
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Derived automatically from your strictly latest 5 Stableford scores.
                </p>
              </div>

              <button
                onClick={() => {
                  if (currentUser.subscription.status !== 'active') {
                    return;
                  }
                  onOpenScoreModal(null);
                }}
                disabled={currentUser.subscription.status !== 'active'}
                className={`self-start sm:self-auto px-4 py-2 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors ${
                  currentUser.subscription.status === 'active'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title={currentUser.subscription.status === 'active' ? 'Log a new round' : 'Reactivate subscription to log new rounds'}
              >
                <Plus className="w-4 h-4" />
                <span>{currentUser.subscription.status === 'active' ? 'Log New Round' : 'Inactive (Locked)'}</span>
              </button>
            </div>

            {/* Ticket Balls */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-around gap-4">
              {currentUser.scores.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No scores recorded yet. Log your first Stableford round to build your ticket!
                </div>
              ) : (
                currentUser.scores.map((sc, i) => (
                  <div key={sc.id} className="text-center space-y-1.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-emerald-500/40 flex items-center justify-center text-xl font-bold font-mono text-emerald-400 shadow-md shadow-emerald-500/10">
                      {sc.points}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{sc.date}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate max-w-[80px]">
                      {sc.courseName || `Round ${i + 1}`}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium">Draw Match Rules: </span>
                Match 5 numbers to win the 40% rollover jackpot. Match 4 numbers for 35% tier. Match 3 numbers for 25% tier. Winners must upload scorecard proof for admin verification prior to payout.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Score Management (§05) */}
      {activeTab === 'scores' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                PRD §05 Specification
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Rolling 5-Score Management Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Only the latest 5 scores are retained at any time. A new score replaces the oldest automatically. Only 1 score per date permitted.
              </p>
            </div>

            <button
              onClick={() => {
                if (currentUser.subscription.status !== 'active') return;
                onOpenScoreModal(null);
              }}
              disabled={currentUser.subscription.status !== 'active'}
              className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto ${
                currentUser.subscription.status === 'active'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
              title={currentUser.subscription.status === 'active' ? 'Log a new round' : 'Reactivate subscription to log new rounds'}
            >
              <Plus className="w-4 h-4" />
              <span>{currentUser.subscription.status === 'active' ? 'Log Stableford Round (1-45 pts)' : 'Score Entry Locked (Inactive)'}</span>
            </button>
          </div>

          {/* Scores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Round Date</th>
                  <th className="py-3 px-4">Stableford Points</th>
                  <th className="py-3 px-4">Course / Club</th>
                  <th className="py-3 px-4">Status & Buffer Position</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentUser.scores.map((sc, index) => (
                  <tr key={sc.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-white font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {sc.date}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                          {sc.points}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {sc.points >= 36 ? 'At or Better than Handicap' : 'Competitive Round'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{sc.courseName || 'Unspecified Club'}</div>
                      {sc.notes && <div className="text-[10px] text-slate-500 italic">{sc.notes}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        Slot {index + 1} of 5 {index === 0 ? '(Most Recent)' : index === 4 ? '(Oldest - Next to cycle)' : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenScoreModal(sc)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Edit score"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteGolfScore(sc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Delete score"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Reverse Chronological Sorting Enforced (Most recent round first).
            </span>
            <span className="font-mono text-slate-500">PRD §05 Verified</span>
          </div>
        </div>
      )}

      {/* Tab 3: Charity System (§08) */}
      {activeTab === 'charity' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block">
                PRD §08 Specification
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Your Charitable Impact Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct part of your subscription fee to a cause you care about. Minimum 10%, voluntarily increase anytime.
              </p>
            </div>

            <button
              onClick={() => onOpenDonateModal(selectedCharity.id)}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/30 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <DollarSign className="w-4 h-4" />
              <span>Make Independent Direct Donation</span>
            </button>
          </div>

          {/* Currently Selected Charity Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="relative h-44 md:h-full rounded-xl overflow-hidden">
              <img
                src={selectedCharity.coverImage}
                alt={selectedCharity.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 text-[10px] font-mono">
                {selectedCharity.category}
              </span>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white">{selectedCharity.name}</h4>
                <button
                  onClick={onGoToDirectory}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Change Cause</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-emerald-300 italic">"{selectedCharity.tagline}"</p>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedCharity.description}</p>

              {/* Slider for voluntary charity percentage */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Voluntary Subscription Allocation:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {currentUser.charityPercentage}% (${(currentUser.subscription.amount * (currentUser.charityPercentage / 100)).toFixed(2)} / period)
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={currentUser.charityPercentage}
                  onChange={(e) => updateUserCharityChoice(selectedCharity.id, Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10% (PRD Baseline)</span>
                  <span>25%</span>
                  <span>50% (Champion Giver)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Winnings Overview & Verification (§09 & §10) */}
      {activeTab === 'winnings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                PRD §09 Specification
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Winnings & Scorecard Verification
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verification process applies to winners only. Upload golf platform screenshots for admin approval and payout.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Total Career Prizes</div>
                <div className="text-base font-bold text-emerald-400 font-mono">${totalWon.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {currentUser.winnings.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">No winning tickets yet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Ensure your 5 latest Stableford scores are recorded for the upcoming {activeDrawMonth} draw!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentUser.winnings.map(w => (
                <div
                  key={w.id}
                  className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{w.drawMonth} Draw</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px]">
                          {w.matchTier.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Matched Numbers: [{w.matchedNumbers.join(', ')}]
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Prize Amount</div>
                        <div className="text-lg font-bold text-emerald-400 font-mono">
                          ${w.amount.toLocaleString()}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {w.status === 'pending_verification' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            Pending Admin Review
                          </span>
                        )}
                        {w.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved · Payout Queued
                          </span>
                        )}
                        {w.status === 'paid' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Paid ({w.transactionRef || 'DH-PAY'})
                          </span>
                        )}
                        {w.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Proof Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Proof and Action row */}
                  <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-400">
                      {w.proofScreenshotUrl ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                          <FileCheck className="w-4 h-4" /> Proof screenshot uploaded on {w.submittedAt || '2026-03-02'}
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" /> Action required: Upload scorecard screenshot to verify
                        </span>
                      )}
                      {w.reviewNotes && (
                        <div className="text-[11px] text-slate-500 mt-1 italic">
                          Admin note: "{w.reviewNotes}"
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenProofModal(w)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                      <span>{w.proofScreenshotUrl ? 'Replace Proof' : 'Upload Screenshot'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
