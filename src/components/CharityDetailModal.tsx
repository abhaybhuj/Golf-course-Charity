import React from 'react';
import { X, Calendar, MapPin, Heart, Globe, DollarSign, Trophy } from 'lucide-react';
import { Charity } from '../types';

interface CharityDetailModalProps {
  charity: Charity | null;
  onClose: () => void;
  onSelectForSubscription: (charityId: string) => void;
  onDirectDonate: (charityId: string) => void;
}

export const CharityDetailModal: React.FC<CharityDetailModalProps> = ({
  charity,
  onClose,
  onSelectForSubscription,
  onDirectDonate
}) => {
  if (!charity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/90 my-6">
        {/* Cover image & close */}
        <div className="relative h-52 sm:h-64 w-full">
          <img
            src={charity.coverImage}
            alt={charity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider mb-2">
              {charity.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              {charity.name}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Key Metric strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Platform Community Total</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                ${charity.totalRaised.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Minimum Allocation</div>
              <div className="text-lg font-bold text-white font-mono">
                10% of Fee
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Upcoming Golf Days</div>
              <div className="text-lg font-bold text-amber-400 font-mono">
                {charity.upcomingEvents.length} Events
              </div>
            </div>
          </div>

          {/* Tagline & Mission */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Cause & Impact Mission
            </h3>
            <p className="text-base text-emerald-300 font-medium italic mb-2">
              "{charity.tagline}"
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {charity.description}
            </p>
          </div>

          {/* Upcoming Events / Golf Days (PRD §08.2) */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Charity Golf Days & Community Fixtures
            </h3>
            <div className="space-y-2.5">
              {charity.upcomingEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{evt.title}</h4>
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                      <Calendar className="w-3 h-3" />
                      {evt.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{evt.venue}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onSelectForSubscription(charity.id);
              }}
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs text-center cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span>Choose as My Primary Subscription Charity</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDirectDonate(charity.id);
              }}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 text-xs text-center cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-rose-400" />
              <span>Make Direct Donation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
