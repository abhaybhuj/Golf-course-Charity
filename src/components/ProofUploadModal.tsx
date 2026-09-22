import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UploadCloud, CheckCircle2, ShieldCheck, Image, FileText } from 'lucide-react';
import { UserWinning } from '../types';

interface ProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  winning: UserWinning | null;
}

export const ProofUploadModal: React.FC<ProofUploadModalProps> = ({
  isOpen,
  onClose,
  winning
}) => {
  const { submitWinnerProof } = useApp();
  const [previewUrl, setPreviewUrl] = useState<string>(winning?.proofScreenshotUrl || '');
  const [selectedSample, setSelectedSample] = useState<string>('');

  if (!isOpen || !winning) return null;

  const sampleProofs = [
    {
      id: 'sample-1',
      title: 'Golf Genius Verified Scorecard',
      url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sample-2',
      title: 'GHIN / National Handicap Portal Export',
      url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sample-3',
      title: 'Clubhouse Physical Scored Card Sign-off',
      url: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = previewUrl || sampleProofs[0].url;
    submitWinnerProof(winning.id, finalUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PRD §09 Winner Verification Flow</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Upload Official Golf Platform Proof
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Verification applies to prize winners only. Submit an official scorecard screenshot (from Golf Genius, GHIN, HowDidiDo, etc.) showing the rounds that produced your winning ticket.
          </p>
        </div>

        {/* Winning Details Card */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 uppercase font-mono">
              Draw: {winning.drawMonth}
            </div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              ${winning.amount.toLocaleString()} Prize Claim
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
              {winning.matchTier.toUpperCase()}
            </span>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Matched: [{winning.matchedNumbers.join(', ')}]
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Scorecard Screenshot
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-center transition-colors bg-slate-950/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-1" />
              <div className="text-xs text-slate-300 font-medium">
                Click or drag & drop scorecard image here
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                PNG, JPG, or WEBP up to 10MB
              </div>
            </div>
          </div>

          {/* Or Select Sample Verification Document */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Or pick sample test document:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sampleProofs.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSample(s.id);
                    setPreviewUrl(s.url);
                  }}
                  className={`p-2 rounded-lg text-left text-[11px] border transition-all cursor-pointer ${
                    previewUrl === s.url
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold line-clamp-1">{s.title}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Sample Test File</div>
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot Preview */}
          {previewUrl && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Selected Document Preview:</span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready to submit
                </span>
              </div>
              <img
                src={previewUrl}
                alt="Scorecard Proof"
                className="w-full h-36 object-cover rounded-lg border border-slate-800"
              />
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit for Admin Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
