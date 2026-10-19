import React from 'react';
import { PlusCircle, PhoneCall, ShieldCheck, ChevronRight, Sparkles, CreditCard } from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';

interface CitizenCardProps {
  onOpenCreatePost: () => void;
  onOpenEmergency: () => void;
}

export const CitizenCard: React.FC<CitizenCardProps> = ({
  onOpenCreatePost,
  onOpenEmergency,
}) => {
  const { themeConfig } = useAdminConfig();
  const appName = (themeConfig?.appName && themeConfig.appName !== 'সৈ-কানেক্ট' && themeConfig.appName !== 'আমার কুষ্টিয়া') ? themeConfig.appName : 'আমার কুষ্টিয়া';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#046a4e] to-[#022c22] text-white p-5 shadow-lg shadow-emerald-950/15 border border-emerald-600/30">
      {/* Background Decorative Circles & Lines */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-emerald-500/15 rounded-full blur-xl pointer-events-none"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between relative z-10 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
            <CreditCard className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-sm font-bold tracking-wide text-emerald-100">
            নাগরিক কার্ড: {appName}
          </span>
        </div>

        {/* Active Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[11px] font-bold text-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>সক্রিয় (Active)</span>
        </div>
      </div>

      {/* Card Body Title */}
      <div className="relative z-10 mb-4">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
          স্মার্ট নাগরিক সেবা ও মার্কেটপ্লেস
        </h2>
        <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
          আপনার শহরের বাসা ভাড়া, জরুরি কন্টাক্ট, রক্তদাতা ও লোকাল সেবা
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 relative z-10">
        <button
          onClick={onOpenCreatePost}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 active:scale-[0.98] font-bold text-xs shadow-sm transition-all"
        >
          <span className="flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>নতুন পোস্ট দিন</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
        </button>

        <button
          onClick={onOpenEmergency}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 active:scale-[0.98] border border-emerald-400/30 text-white font-bold text-xs backdrop-blur-xs transition-all"
        >
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-emerald-300 animate-bounce" />
            <span>জরুরি হেল্পলাইন</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
        </button>
      </div>
    </div>
  );
};
