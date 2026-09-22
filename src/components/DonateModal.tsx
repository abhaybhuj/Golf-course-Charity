import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, ShieldCheck, Check } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCharityId?: string;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  preselectedCharityId
}) => {
  const { charities, donateDirectly, currentUser } = useApp();

  const [selectedCharity, setSelectedCharity] = useState<string>(
    preselectedCharityId || (charities[0]?.id || '')
  );
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>(currentUser?.name || '');
  const [message, setMessage] = useState<string>('');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [25, 50, 100, 250];

  const handleQuickSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 0) {
      setAmount(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharity || amount <= 0) return;

    donateDirectly(selectedCharity, amount, donorName || 'Anonymous Hero', message);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  const charityObj = charities.find(c => c.id === selectedCharity);

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
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-2">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Direct Philanthropic Gift</h2>
          <p className="text-slate-400 text-xs mt-1">
            100% of independent donations flow directly to your chosen cause. Not tied to gaming or draw entries.
          </p>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-white">Donation Processed!</div>
            <div className="text-xs text-slate-400">
              Thank you for supporting {charityObj?.name}.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Cause
              </label>
              <select
                value={selectedCharity}
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {charities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Donation Amount
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickSelect(amt)}
                    className={`py-2 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                      amount === amt && !customAmount
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono text-sm">$</span>
                <input
                  type="number"
                  min={1}
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Donor Name
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Your Name (or leave blank for Anonymous)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Dedication Message (Optional)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. In honor of junior golf development"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all cursor-pointer text-xs flex items-center justify-center gap-2 mt-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Complete Donation of ${amount}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
