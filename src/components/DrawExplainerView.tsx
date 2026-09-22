import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, RefreshCw, Shield, Sparkles, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { DrawLogicType } from '../types';

export const DrawExplainerView: React.FC<{ onOpenSubscribe: () => void }> = ({ onOpenSubscribe }) => {
  const { pastDraws, activePoolAmount, rolloverJackpot, activeDrawMonth, runDrawSimulation } = useApp();

  const [testSimLogic, setTestSimLogic] = useState<DrawLogicType>('algorithmic');
  const [testResult, setTestResult] = useState<any>(null);
  const [userSampleTicket, setUserSampleTicket] = useState<number[]>([36, 38, 34, 41, 29]);

  const handleRunPublicSim = () => {
    const sim = runDrawSimulation(testSimLogic);
    const matches = userSampleTicket.filter(n => sim.winningNumbers.includes(n));
    setTestResult({
      ...sim,
      userMatches: matches
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>PRD §06 & §07 · Draw & Reward Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Transparent, Algorithm-Powered Draws
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          Every month, Digital Heroes executes a mathematical draw against all active subscribers’ 5-score tickets. Distribution is hard-coded into the protocol and split equally among winners.
        </p>
      </div>

      {/* Prize Pool Split Cards (§07) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-amber-500/5">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold uppercase mb-3">
            Jackpot Tier
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">5-Number Match</h3>
          <div className="text-3xl font-bold text-amber-300 font-mono my-2">40% Share</div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Match all 5 numbers on your ticket. If no player matches 5 numbers, this entire 40% pool carries forward into next month's jackpot.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Current March Jackpot + Rollover:</span>
            <span className="text-emerald-400 font-mono font-bold text-base">
              ${Math.round(activePoolAmount * 0.40).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold uppercase mb-3">
            Secondary Tier
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">4-Number Match</h3>
          <div className="text-3xl font-bold text-white font-mono my-2">35% Share</div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Match any 4 numbers from your 5-score ticket. Split equally across all verified 4-match subscribers. No rollover.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Current March Tier Pool:</span>
            <span className="text-slate-200 font-mono font-bold text-base">
              ${Math.round(activePoolAmount * 0.35).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold uppercase mb-3">
            Entry Tier
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">3-Number Match</h3>
          <div className="text-3xl font-bold text-white font-mono my-2">25% Share</div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Match any 3 numbers. Designed to reward high participation and consistency. Split equally among winners. No rollover.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Current March Tier Pool:</span>
            <span className="text-slate-200 font-mono font-bold text-base">
              ${Math.round(activePoolAmount * 0.25).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Draw Logic Explanation: Random vs Algorithmic */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-3">
          Two Operational Draw Modes (PRD §06)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h4 className="text-sm font-bold text-white">Algorithmic (Score Frequency Weighted)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weights the probability of drawn numbers based on the real-world statistical distribution of scores posted by golfers across the network. Stableford totals that occur more frequently in actual play receive proportionally higher lottery weight.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h4 className="text-sm font-bold text-white">Random (Standard Lottery)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              5 numbers uniformly drawn from 1 to 45 without replacement, giving every possible Stableford point outcome equal probability regardless of golf difficulty.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Public Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
              Interactive Test Chamber
            </span>
            <h3 className="text-xl font-bold text-white">
              Simulate Draw Against Sample Scores
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTestSimLogic('algorithmic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                testSimLogic === 'algorithmic'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Algorithmic Weighted
            </button>
            <button
              onClick={() => setTestSimLogic('random')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                testSimLogic === 'random'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Random Standard
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Your 5 Sample Stableford Scores:</span>
              <div className="flex items-center gap-2">
                {userSampleTicket.map((pt, idx) => (
                  <span
                    key={idx}
                    className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm"
                  >
                    {pt}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunPublicSim}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Test Simulation</span>
            </button>
          </div>

          {testResult && (
            <div className="p-5 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-300 font-medium">
                  Simulation Outcome ({testResult.drawLogic.toUpperCase()}):
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Pool: ${testResult.totalPrizePool.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 uppercase font-mono block mb-2">
                  5 Drawn Winning Numbers:
                </span>
                <div className="flex items-center gap-2">
                  {testResult.winningNumbers.map((num: number) => {
                    const matched = userSampleTicket.includes(num);
                    return (
                      <span
                        key={num}
                        className={`w-11 h-11 rounded-xl font-mono font-bold flex items-center justify-center text-base border ${
                          matched
                            ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 scale-105'
                            : 'bg-slate-900 text-white border-slate-800'
                        }`}
                      >
                        {num}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">5-Match Winners</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {testResult.tier5Winners.length}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {testResult.tier5Winners.length === 0 ? 'Rollover Triggered' : `$${testResult.summary.tier5PerWinner}/ea`}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">4-Match Winners</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {testResult.tier4Winners.length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ${testResult.summary.tier4PerWinner}/ea
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">3-Match Winners</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {testResult.tier3Winners.length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ${testResult.summary.tier3PerWinner}/ea
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <span>Your Matches on Sample Ticket: <strong>{testResult.userMatches.length} Numbers</strong></span>
                <span className="font-bold">
                  {testResult.userMatches.length >= 3 ? '🎉 Winning Ticket Match!' : 'No prize this draw'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Past Official Draws Record */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          <span>Historical Official Draws</span>
        </h3>

        <div className="space-y-3">
          {pastDraws.map(draw => (
            <div
              key={draw.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    {draw.month} Official Draw
                  </span>
                  <div className="text-sm text-slate-400 mt-0.5 font-mono">
                    Executed on {draw.drawDate} · Logic: {draw.drawLogic.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Pool</span>
                    <span className="text-amber-400 font-bold text-sm">${draw.totalPrizePool.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Charity Impact</span>
                    <span className="text-emerald-400 font-bold text-sm">${draw.charityImpactTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Numbers */}
              <div>
                <span className="text-xs text-slate-400 block mb-2">Official Winning Numbers:</span>
                <div className="flex items-center gap-2">
                  {draw.winningNumbers.map(n => (
                    <span
                      key={n}
                      className="w-9 h-9 rounded-lg bg-slate-950 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tier breakdowns */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {draw.tiers.map(t => (
                  <div key={t.matchTier} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">{t.matchTier.toUpperCase()}</div>
                    <div className="text-slate-200 font-bold font-mono">
                      {t.winnerCount} Winners {t.winnerCount > 0 && `($${Math.round(t.payoutPerWinner)} ea)`}
                    </div>
                    {t.rolloverAmount > 0 && (
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                        ${t.rolloverAmount.toLocaleString()} Rolled Over
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
