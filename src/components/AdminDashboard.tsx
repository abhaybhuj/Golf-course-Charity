import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  Trophy,
  Heart,
  FileCheck,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  RefreshCw,
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { DrawLogicType, DrawSimulationResult, UserProfile, Charity } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    allSubscribers,
    charities,
    pastDraws,
    activePoolAmount,
    rolloverJackpot,
    activeDrawMonth,
    runDrawSimulation,
    publishOfficialDraw,
    adminReviewWinner,
    adminMarkPayoutComplete,
    updateSubscriptionStatus,
    adminUpdateUserScores,
    addCharity,
    updateCharity,
    deleteCharity,
    showToast
  } = useApp();

  const [activeSurface, setActiveSurface] = useState<'users' | 'draws' | 'charities' | 'winners' | 'analytics'>('draws');

  // Surface 01: User Management State
  const [userSearch, setUserSearch] = useState('');
  const [editingUserScores, setEditingUserScores] = useState<UserProfile | null>(null);

  // Surface 02: Draw Simulator State
  const [selectedLogic, setSelectedLogic] = useState<DrawLogicType>('algorithmic');
  const [simulation, setSimulation] = useState<DrawSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Surface 03: Charity Form State
  const [isAddingCharity, setIsAddingCharity] = useState(false);
  const [newCharityName, setNewCharityName] = useState('');
  const [newCharityTagline, setNewCharityTagline] = useState('');
  const [newCharityCategory, setNewCharityCategory] = useState<Charity['category']>('Health & Medical');
  const [newCharityDesc, setNewCharityDesc] = useState('');
  const [newCharityCover, setNewCharityCover] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80');

  // Surface 04: Winners Verification State
  const [selectedProofPreview, setSelectedProofPreview] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  // Run simulation
  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = runDrawSimulation(selectedLogic);
      setSimulation(result);
      setIsSimulating(false);
      showToast(`Simulation complete (${selectedLogic.toUpperCase()}). Found ${result.tier5Winners.length + result.tier4Winners.length + result.tier3Winners.length} winning tickets.`);
    }, 600);
  };

  const handlePublish = () => {
    if (!simulation) return;
    publishOfficialDraw(simulation);
    setSimulation(null);
  };

  // Filtered users
  const filteredUsers = allSubscribers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // All winners aggregated across users for Surface 04
  const allWinnerRecords: {
    userId: string;
    userName: string;
    userEmail: string;
    winning: UserProfile['winnings'][0];
  }[] = [];

  allSubscribers.forEach(u => {
    u.winnings.forEach(w => {
      allWinnerRecords.push({
        userId: u.id,
        userName: u.name,
        userEmail: u.email,
        winning: w
      });
    });
  });

  // Calculate analytics totals (§11 Surface 05)
  const totalUsersCount = allSubscribers.length + 420;
  const activeSubsCount = allSubscribers.filter(u => u.subscription.status === 'active').length + 420;
  const totalCharityRaisedSum = charities.reduce((sum, c) => sum + c.totalRaised, 0);
  const totalHistoricalPools = pastDraws.reduce((sum, d) => sum + d.totalPrizePool, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PRD §11 Administrator Command Console</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Full Platform Control
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Five control surfaces covering operational user management, draw simulation & publishing, charity directory, winner verification, and financial reporting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Live Session: <strong>Super Admin</strong>
            </span>
          </div>
        </div>

        {/* 5 Control Surface Tabs (§11) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSurface('draws')}
            className={`p-3 rounded-xl text-left font-medium transition-all cursor-pointer ${
              activeSurface === 'draws'
                ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase">Surface 02</div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Draw Engine</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSurface('winners')}
            className={`p-3 rounded-xl text-left font-medium transition-all cursor-pointer relative ${
              activeSurface === 'winners'
                ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <div className="text-[10px] font-mono text-slate-500 uppercase">Surface 04</div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Winner Review</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSurface('users')}
            className={`p-3 rounded-xl text-left font-medium transition-all cursor-pointer ${
              activeSurface === 'users'
                ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase">Surface 01</div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Users & Scores</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSurface('charities')}
            className={`p-3 rounded-xl text-left font-medium transition-all cursor-pointer ${
              activeSurface === 'charities'
                ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase">Surface 03</div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>Charities</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSurface('analytics')}
            className={`p-3 rounded-xl text-left font-medium transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              activeSurface === 'analytics'
                ? 'bg-purple-500/10 border border-purple-500/40 text-purple-300 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-500 uppercase">Surface 05</div>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Reports & Stats</span>
            </div>
          </button>
        </div>
      </div>

      {/* Surface 02: Draw Management & Simulator */}
      {activeSurface === 'draws' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  Surface 02 · Draw Management
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Monthly Cadence, Simulation & Publishing
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure logic type (random vs weighted frequency), run simulations against active tickets, verify payouts, and publish official results.
                </p>
              </div>

              {/* Pool & Rollover badges */}
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Pool</span>
                  <span className="text-amber-400 font-bold text-sm">${activePoolAmount.toLocaleString()}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Rollover Carried</span>
                  <span className="text-emerald-400 font-bold text-sm">${rolloverJackpot.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Config & Simulation Trigger Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Select Draw Logic (PRD §06)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="drawLogic"
                      value="algorithmic"
                      checked={selectedLogic === 'algorithmic'}
                      onChange={() => setSelectedLogic('algorithmic')}
                      className="accent-amber-400"
                    />
                    <div className="text-xs">
                      <div className="text-white font-medium">Algorithmic Weighted</div>
                      <div className="text-[10px] text-slate-500">Weighted by score frequency</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="drawLogic"
                      value="random"
                      checked={selectedLogic === 'random'}
                      onChange={() => setSelectedLogic('random')}
                      className="accent-amber-400"
                    />
                    <div className="text-xs">
                      <div className="text-white font-medium">Random Lottery-Style</div>
                      <div className="text-[10px] text-slate-500">Uniform 1-45 standard draw</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 p-5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Pre-Publication Sandbox</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Test the draw execution safely. The simulator parses all active subscribers’ 5-score tickets, calculates 5-match, 4-match, and 3-match payouts, and flags whether the 40% jackpot will roll over.
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? 'Computing Simulation...' : 'Run Simulation Before Publishing'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation Results Preview */}
            {simulation && (
              <div className="p-6 bg-slate-950 rounded-2xl border-2 border-amber-500/40 space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Simulation Complete · Ready for Review
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      Drawn Numbers: [{simulation.winningNumbers.join(', ')}]
                    </h4>
                  </div>

                  <button
                    onClick={handlePublish}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Official Results</span>
                  </button>
                </div>

                {/* Numbers Visualization */}
                <div className="flex items-center gap-2.5">
                  {simulation.winningNumbers.map(n => (
                    <span
                      key={n}
                      className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 font-mono font-bold flex items-center justify-center text-lg shadow-sm"
                    >
                      {n}
                    </span>
                  ))}
                </div>

                {/* Tier Breakdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-mono uppercase">5-Number Match (40%)</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">
                      {simulation.tier5Winners.length} Winners
                    </div>
                    <div className="text-xs text-amber-400 mt-1">
                      {simulation.tier5Winners.length === 0
                        ? `Rollover: $${simulation.summary.tier5RolloverOut.toLocaleString()} carries forward`
                        : `$${simulation.summary.tier5PerWinner.toLocaleString()} each`}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-mono uppercase">4-Number Match (35%)</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">
                      {simulation.tier4Winners.length} Winners
                    </div>
                    <div className="text-xs text-slate-300 font-mono mt-1">
                      ${simulation.summary.tier4PerWinner.toLocaleString()} payout each
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px] font-mono uppercase">3-Number Match (25%)</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">
                      {simulation.tier3Winners.length} Winners
                    </div>
                    <div className="text-xs text-slate-300 font-mono mt-1">
                      ${simulation.summary.tier3PerWinner.toLocaleString()} payout each
                    </div>
                  </div>
                </div>

                {/* Matched Subscribers List */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-2">
                  <span className="font-semibold text-slate-300 block">Matched Active Subscriber Tickets:</span>
                  <div className="space-y-1.5">
                    {simulation.tier4Winners.map(w => (
                      <div key={w.userId} className="flex justify-between items-center text-slate-300 bg-slate-950 p-2 rounded">
                        <span>{w.name} (4 Matches)</span>
                        <span className="font-mono text-emerald-400">Matched [{w.matches.join(', ')}]</span>
                      </div>
                    ))}
                    {simulation.tier3Winners.map(w => (
                      <div key={w.userId} className="flex justify-between items-center text-slate-300 bg-slate-950 p-2 rounded">
                        <span>{w.name} (3 Matches)</span>
                        <span className="font-mono text-emerald-400">Matched [{w.matches.join(', ')}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Surface 04: Winners & Verification Management */}
      {activeSurface === 'winners' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                Surface 04 · Winners Verification & Payouts
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Scorecard Auditing & Payout Settlement
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Audit golf platform screenshots submitted by winning subscribers. Approve or reject before releasing prize wires.
              </p>
            </div>
          </div>

          {allWinnerRecords.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500">
              No winning records to verify yet. Run and publish a draw to generate winners.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Subscriber</th>
                    <th className="py-3 px-4">Draw & Match Tier</th>
                    <th className="py-3 px-4">Prize Amount</th>
                    <th className="py-3 px-4">Scorecard Proof</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allWinnerRecords.map(({ userId, userName, userEmail, winning }) => (
                    <tr key={winning.id} className="hover:bg-slate-950/40">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{userEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{winning.drawMonth}</div>
                        <div className="text-[10px] text-amber-400 font-mono uppercase">
                          {winning.matchTier} [{winning.matchedNumbers.join(', ')}]
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ${winning.amount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {winning.proofScreenshotUrl ? (
                          <button
                            onClick={() => setSelectedProofPreview(winning.proofScreenshotUrl || null)}
                            className="flex items-center gap-1.5 text-cyan-400 hover:underline cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Screenshot</span>
                          </button>
                        ) : (
                          <span className="text-amber-400/80 text-[11px] italic">Not uploaded yet</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          winning.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : winning.status === 'approved'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : winning.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}>
                          {winning.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {winning.status === 'pending_verification' && (
                            <>
                              <button
                                onClick={() => adminReviewWinner(userId, winning.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold rounded border border-emerald-500/40 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => adminReviewWinner(userId, winning.id, 'rejected', 'Scorecard does not match official handicap records')}
                                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold rounded border border-rose-500/40 cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {winning.status === 'approved' && (
                            <button
                              onClick={() => adminMarkPayoutComplete(userId, winning.id)}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold rounded cursor-pointer"
                            >
                              Release Payout
                            </button>
                          )}

                          {winning.status === 'paid' && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              Settled ({winning.transactionRef || 'DH-PAY'})
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Screenshot Modal Viewer */}
          {selectedProofPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Scorecard Verification Document</h4>
                  <button onClick={() => setSelectedProofPreview(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <img
                  src={selectedProofPreview}
                  alt="Proof Document"
                  className="w-full h-64 object-cover rounded-xl border border-slate-800"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedProofPreview(null)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Surface 01: User Management */}
      {activeSurface === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                Surface 01 · User Management
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Subscribers, Golf Scores & Subscriptions
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Edit profiles, audit golf scores, and update subscription lifecycle states (active / lapsed / cancelled).
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">5-Score Ticket</th>
                  <th className="py-3 px-4">Charity Cut</th>
                  <th className="py-3 px-4 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-950/40">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono uppercase text-[11px] text-slate-300">
                      {user.subscription.plan} (${user.subscription.amount})
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        user.subscription.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {user.subscription.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {user.scores.map(s => (
                          <span
                            key={s.id}
                            className="w-6 h-6 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[10px] flex items-center justify-center font-bold"
                          >
                            {s.points}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-rose-300">
                      {user.charityPercentage}%
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.subscription.status === 'active' ? (
                          <button
                            onClick={() => updateSubscriptionStatus(user.id, 'lapsed')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-mono rounded cursor-pointer"
                          >
                            Set Lapsed
                          </button>
                        ) : (
                          <button
                            onClick={() => updateSubscriptionStatus(user.id, 'active')}
                            className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono rounded cursor-pointer"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Surface 03: Charity Management */}
      {activeSurface === 'charities' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block">
                Surface 03 · Charity Management
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Non-Profit Partners & Golf Fixtures
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Add, edit, or remove charities, manage promotional descriptions, and audit cumulative raised totals.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCharity(!isAddingCharity)}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingCharity ? 'Close Form' : 'Add New Charity'}</span>
            </button>
          </div>

          {/* Add Charity Form */}
          {isAddingCharity && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Create New Charity Listing</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Charity Organization Name"
                  value={newCharityName}
                  onChange={(e) => setNewCharityName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <select
                  value={newCharityCategory}
                  onChange={(e) => setNewCharityCategory(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Health & Medical">Health & Medical</option>
                  <option value="Youth & Sport">Youth & Sport</option>
                  <option value="Veterans & First Responders">Veterans & First Responders</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Environment & Community">Environment & Community</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Inspiring Tagline"
                value={newCharityTagline}
                onChange={(e) => setNewCharityTagline(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />

              <textarea
                placeholder="Full Description & Mission..."
                value={newCharityDesc}
                onChange={(e) => setNewCharityDesc(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />

              <button
                onClick={() => {
                  if (!newCharityName) return;
                  addCharity({
                    name: newCharityName,
                    tagline: newCharityTagline || 'Empowering through sport',
                    category: newCharityCategory,
                    description: newCharityDesc || 'Dedicated non-profit partner.',
                    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80',
                    coverImage: newCharityCover,
                    websiteUrl: 'https://digitalheroes.co.in',
                    upcomingEvents: [
                      {
                        title: 'Annual Invitational Charity Classic',
                        date: '2026-05-30',
                        venue: 'Bayside Links',
                        description: '18-hole charity scramble.'
                      }
                    ]
                  });
                  setNewCharityName('');
                  setNewCharityTagline('');
                  setNewCharityDesc('');
                  setIsAddingCharity(false);
                }}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg"
              >
                Save to Platform
              </button>
            </div>
          )}

          {/* Charity List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charities.map(charity => (
              <div
                key={charity.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={charity.coverImage}
                    alt={charity.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-white">{charity.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{charity.category}</span>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5">
                      Raised: ${charity.totalRaised.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteCharity(charity.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900 cursor-pointer"
                    title="Delete charity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Surface 05: Reports & Analytics */}
      {activeSurface === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">
              Surface 05 · Reports & Analytics
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Financial, Engagement & Draw Statistics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Total Users & Subscribers</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{totalUsersCount}</div>
              <div className="text-[11px] text-emerald-400 mt-1">{activeSubsCount} Active Subscriptions</div>
            </div>

            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Total Prize Pools Disbursed</span>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
                ${totalHistoricalPools.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{pastDraws.length} Official Draws Executed</div>
            </div>

            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Total Charity Contributions</span>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
                ${totalCharityRaisedSum.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">5 Verified Partner Organizations</div>
            </div>

            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Active Jackpot Carryover</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                ${rolloverJackpot.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">March 5-Match Pool</div>
            </div>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Charity Disbursement Breakdown</h4>
            <div className="space-y-2">
              {charities.map(c => {
                const pct = Math.round((c.totalRaised / (totalCharityRaisedSum || 1)) * 100);
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{c.name}</span>
                      <span className="font-mono text-emerald-400">${c.totalRaised.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
