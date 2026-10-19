import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  Flag, 
  Check, 
  Ban, 
  Users, 
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile } from '../../types';

interface BulkTemporaryBanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: UserProfile[];
  onConfirmBan: (durationHours: number, reason: string) => void;
}

const DURATION_OPTIONS = [
  { hours: 24, label: '২৪ ঘণ্টা', sub: '১ দিন' },
  { hours: 72, label: '৩ দিন', sub: 'সুপারিশকৃত' },
  { hours: 168, label: '৭ দিন', sub: '১ সপ্তাহ' },
  { hours: 360, label: '১৫ দিন', sub: 'অর্ধ-মাস' },
  { hours: 720, label: '৩০ দিন', sub: '১ মাস' },
];

const REASON_PRESETS = [
  'কমিউনিটি নিয়ম ও শিষ্টাচার লঙ্ঘন',
  'অপ্রাসঙ্গিক স্প্যামিং ও অযাচিত লিঙ্ক প্রচার',
  'ভুয়া তথ্য ও বিভ্রান্তিকর কন্টেন্ট পোস্ট',
  'অন্যান্য নাগরিকের সাথে অশোভন আচরণ ও রিপোর্ট',
  'সন্দেহজনক অ্যাকাউন্টের কারণে তদন্তাধীন'
];

export const BulkTemporaryBanModal: React.FC<BulkTemporaryBanModalProps> = ({
  isOpen,
  onClose,
  selectedUsers,
  onConfirmBan
}) => {
  const [selectedHours, setSelectedHours] = useState<number>(72);
  const [selectedReason, setSelectedReason] = useState<string>(REASON_PRESETS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customHours, setCustomHours] = useState<string>('48');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const flaggedCount = selectedUsers.filter(u => u.isFlagged).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHours = isCustomMode 
      ? Math.max(1, parseInt(customHours) || 24) 
      : selectedHours;
    
    const finalReason = customReason.trim() 
      ? customReason.trim() 
      : selectedReason;

    setIsSubmitting(true);
    try {
      onConfirmBan(finalHours, finalReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-pink-200/80/80 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>বাল্ক সাময়িক ব্যান (Temporary Ban)</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  {selectedUsers.length} জন নির্বাচিত
                </span>
              </h3>
              <p className="text-xs text-amber-100">
                নির্দিষ্ট মেয়াদের জন্য নির্বাচিত ফ্ল্যাগড/সন্দেহজনক অ্যাকাউন্টের অ্যাক্সেস সাময়িক বন্ধ রাখুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Selected Users Pill Preview */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-pink-200/80/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>ব্যান হতে যাওয়া অ্যাকাউন্ট তালিকা ({selectedUsers.length})</span>
              </span>
              {flaggedCount > 0 && (
                <span className="flex items-center gap-1 font-bold text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  <Flag className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>{flaggedCount} জন ফ্ল্যাগড ইউজার</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {selectedUsers.map(u => (
                <span 
                  key={u.uid}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                    u.isFlagged 
                      ? 'bg-amber-50 text-amber-900 border-amber-300' 
                      : 'bg-white text-slate-700 border-pink-200/80'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {u.displayName?.charAt(0) || 'U'}
                  </span>
                  <span className="font-semibold">{u.displayName}</span>
                  {u.isFlagged && (
                    <Flag className="w-2.5 h-2.5 text-amber-600 fill-amber-600 shrink-0" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span>১. সাময়িক ব্যানের মেয়াদকাল নির্বাচন করুন</span>
              <span className="text-[11px] font-bold text-amber-700">
                {isCustomMode ? `${customHours} ঘণ্টা` : `${DURATION_OPTIONS.find(o => o.hours === selectedHours)?.label} (${DURATION_OPTIONS.find(o => o.hours === selectedHours)?.sub})`}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => {
                    setSelectedHours(opt.hours);
                    setIsCustomMode(false);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    !isCustomMode && selectedHours === opt.hours
                      ? 'bg-amber-50 border-amber-500 text-amber-950 font-black shadow-xs ring-2 ring-amber-500/20'
                      : 'bg-white border-pink-200/80 text-slate-700 hover:border-pink-300 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <span className="text-xs font-black">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  isCustomMode
                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-black shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-white border-pink-200/80 text-slate-700 hover:border-pink-300 hover:bg-slate-50 font-semibold'
                }`}
              >
                <span className="text-xs font-black">কাস্টম মেয়াদ</span>
                <span className="text-[10px] text-slate-500 mt-0.5">ঘণ্টা অনুযায়ী</span>
              </button>
            </div>

            {isCustomMode && (
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center gap-3">
                <span className="text-xs font-bold text-amber-900">কত ঘণ্টা সাময়িক ব্যান থাকবে?</span>
                <input
                  type="number"
                  min="1"
                  max="8760"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  className="w-24 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="ঘণ্টা"
                />
                <span className="text-xs text-slate-600 font-medium">
                  (প্রায় {Math.round((parseInt(customHours) || 0) / 24 * 10) / 10} দিন)
                </span>
              </div>
            )}
          </div>

          {/* Reason Presets & Input */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-800 block">
              ২. সাময়িক ব্যানের কারণ উল্লেখ করুন
            </label>

            <div className="flex flex-wrap gap-1.5">
              {REASON_PRESETS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason);
                    setCustomReason('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left border ${
                    !customReason && selectedReason === reason
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 border-pink-200/80 hover:bg-slate-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="অন্য কোনো নির্দিষ্ট কারণ লিখতে চাইলে এখানে লিখুন (ঐচ্ছিক)..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/10 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">সাময়িক ব্যান কার্যকর নীতি:</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                নির্বাচিত ইউজারদের স্ট্যাটাস <strong>"temporary_ban"</strong> হিসেবে সংরক্ষিত হবে। ব্যানের নির্ধারিত সময় অতিক্রম হলে একাউন্ট পুনরায় ব্যবহারের উপযোগী হবে অথবা এডমিন প্যানেল থেকে যেকোনো সময় এক ক্লিকে "আনব্যান" করা যাবে।
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-pink-200/80 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={isSubmitting || selectedUsers.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white text-xs font-black shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Ban className="w-4 h-4" />
              <span>{selectedUsers.length} জন ইউজারকে সাময়িক ব্যান করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
