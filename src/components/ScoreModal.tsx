import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Flag, AlertCircle, Info, Check } from 'lucide-react';
import { GolfScore } from '../types';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingScore?: GolfScore | null;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  editingScore
}) => {
  const { addGolfScore, editGolfScore, currentUser } = useApp();

  const [points, setPoints] = useState<number>(36);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [courseName, setCourseName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingScore) {
      setPoints(editingScore.points);
      setDate(editingScore.date);
      setCourseName(editingScore.courseName || '');
      setNotes(editingScore.notes || '');
      setErrorMessage(null);
    } else {
      // Find a default date that doesn't conflict with existing scores
      const today = new Date().toISOString().split('T')[0];
      const hasToday = currentUser.scores.some(s => s.date === today);
      if (hasToday) {
        // yesterday or day before
        const d = new Date();
        d.setDate(d.getDate() - 1);
        setDate(d.toISOString().split('T')[0]);
      } else {
        setDate(today);
      }
      setPoints(36);
      setCourseName('');
      setNotes('');
      setErrorMessage(null);
    }
  }, [editingScore, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (editingScore) {
      const res = editGolfScore(editingScore.id, points, date, courseName, notes);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update score');
        return;
      }
    } else {
      const res = addGolfScore(points, date, courseName, notes);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to add score');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <Flag className="w-3 h-3" />
            <span>PRD §05 Stableford Scoring</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {editingScore ? 'Edit Recorded Score' : 'Log Stableford Score'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Scores range between 1–45 points. Only 1 score is allowed per date. Your latest 5 scores form your draw ticket.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Constraint Notice: </span>
              {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stableford Points Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Stableford Points (1 – 45)
              </label>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {points} pts
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={45}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-white text-center focus:outline-none focus:border-emerald-500"
                required
              />
              <input
                type="range"
                min={1}
                max={45}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>1 pt (Tough Round)</span>
              <span>36 pts (Playing to Handicap)</span>
              <span>45 pts (Dream Round)</span>
            </div>
          </div>

          {/* Date Picker (Strict 1 score per date) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Round Date
            </label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              * One score entry allowed per date. Duplicate dates are rejected automatically.
            </p>
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Course / Club Name (Optional)
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. St. Andrews, Bayside Links, Royal Melbourne"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Round Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Birdie on 18th hole, windy conditions"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Rolling Buffer Explanation */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-medium">Rolling 5-Score Rule: </span>
              Digital Heroes strictly maintains your latest 5 rounds. Adding a newer round automatically cycles out the oldest stored round from your active lottery draw ticket.
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingScore ? 'Save Changes' : 'Record Score'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
