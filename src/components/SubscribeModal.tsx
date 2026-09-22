import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ShieldCheck, Heart, Sparkles, CreditCard, Lock } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCharityId?: string;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  preselectedCharityId
}) => {
  const { charities, subscribe } = useApp();
  const [plan, setPlan] = useState<SubscriptionPlan>('yearly');
  const [selectedCharity, setSelectedCharity] = useState<string>(
    preselectedCharityId || (charities[0]?.id || 'charity-1')
  );
  const [charityPercentage, setCharityPercentage] = useState<number>(20);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const price = plan === 'monthly' ? 29 : 290;
  const charityAmount = (price * (charityPercentage / 100)).toFixed(2);
  const poolAmount = (price * 0.60).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      subscribe(plan, selectedCharity, charityPercentage);
      setIsProcessing(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Membership · Edition 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Play Golf. Support Causes. Win Monthly.
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Every subscription fuels direct charitable giving and funds the monthly draw prize pool.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setPlan('monthly')}
            className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
              plan === 'monthly'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs text-slate-400 font-medium">Monthly Plan</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">$29 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span></div>
            <div className="text-[11px] text-slate-500 mt-1">Billed monthly. Cancel anytime.</div>
          </button>

          <button
            type="button"
            onClick={() => setPlan('yearly')}
            className={`p-3 rounded-lg text-left transition-all cursor-pointer relative ${
              plan === 'yearly'
                ? 'bg-emerald-950/40 text-white border border-emerald-500/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="absolute -top-2 right-2 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full uppercase">
              Save 17%
            </span>
            <div className="text-xs text-emerald-400 font-medium">Annual Plan</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">$290 <span className="text-xs text-slate-400 font-sans font-normal">/ year</span></div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Includes 2 months free ($58 saving)</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Charity Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Direct Impact: Select Your Supported Charity
            </label>
            <select
              value={selectedCharity}
              onChange={(e) => setSelectedCharity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {charities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Charity percentage slider (§08.1: Min 10%, user can voluntarily increase) */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-300">
                Voluntary Charity Allocation:
              </span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {charityPercentage}% (${charityAmount})
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={charityPercentage}
              onChange={(e) => setCharityPercentage(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>10% (PRD Minimum)</span>
              <span>25%</span>
              <span>50% (Heroic Giving)</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Monthly Prize Pool Contribution:</span>
              <span className="font-mono text-amber-400 font-medium">~${poolAmount}</span>
            </div>
          </div>

          {/* Simulated Stripe Payment Form */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                Simulated Stripe PCI-Compliant Payment
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Lock className="w-3 h-3" /> 256-bit SSL
              </span>
            </div>

            <div>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

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

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Activating Membership...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Activate (${price} {plan === 'yearly' ? '/ Year' : '/ Month'})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500">
            By confirming, you agree to monthly recurring billing under Digital Heroes Edition 2026 rules. Cancel at any time in your dashboard.
          </p>
        </form>
      </div>
    </div>
  );
};
