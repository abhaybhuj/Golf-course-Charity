import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Search, Filter, Calendar, ArrowUpRight, DollarSign, Sparkles } from 'lucide-react';
import { Charity } from '../types';

interface CharityDirectoryProps {
  onSelectCharity: (charity: Charity) => void;
  onOpenDonate: (charityId?: string) => void;
  onOpenSubscribe: (charityId?: string) => void;
}

export const CharityDirectory: React.FC<CharityDirectoryProps> = ({
  onSelectCharity,
  onOpenDonate,
  onOpenSubscribe
}) => {
  const { charities, currentUser, updateUserCharityChoice, role } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Veterans & First Responders',
    'Health & Medical',
    'Youth & Sport',
    'Mental Health',
    'Environment & Community'
  ];

  const filteredCharities = useMemo(() => {
    return charities.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [charities, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>PRD §08 · Philanthropic Partners Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Causes Driving the Movement
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            Choose where your subscription percentage goes. Every round you play helps fund these vetted grassroots non-profits.
          </p>
        </div>

        <button
          onClick={() => onOpenDonate()}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <DollarSign className="w-4 h-4" />
          <span>Make One-Off Independent Gift</span>
        </button>
      </div>

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search causes, organizations, keywords..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Causes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {filteredCharities.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No causes found</h3>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search query or switching categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map(charity => {
            const isUserSelected = currentUser?.charityId === charity.id;

            return (
              <div
                key={charity.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                  isUserSelected
                    ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Image header */}
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={charity.coverImage}
                      alt={charity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono border border-slate-800">
                      {charity.category}
                    </span>

                    {isUserSelected && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" /> Your Active Cause
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white leading-snug mb-1">
                      {charity.name}
                    </h3>
                    <p className="text-xs text-emerald-300/90 font-medium italic mb-2 line-clamp-1">
                      "{charity.tagline}"
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {charity.description}
                    </p>

                    {/* Stats strip */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Total Supported</div>
                        <div className="font-bold text-emerald-400 font-mono text-sm">
                          ${charity.totalRaised.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Golf Days</div>
                        <div className="font-bold text-amber-400 font-mono text-sm">
                          {charity.upcomingEvents.length} Fixtures
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectCharity(charity)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      View Details & Events
                    </button>
                    <button
                      onClick={() => onOpenDonate(charity.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      title="Direct one-off donation"
                    >
                      Donate
                    </button>
                  </div>

                  {role === 'subscriber' ? (
                    <button
                      onClick={() => updateUserCharityChoice(charity.id, currentUser.charityPercentage || 20)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isUserSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      }`}
                      disabled={isUserSelected}
                    >
                      {isUserSelected ? '✓ Active Subscription Recipient' : 'Set as My Subscription Cause'}
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenSubscribe(charity.id)}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Subscribe & Direct Fees Here
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
