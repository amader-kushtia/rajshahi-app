import React from 'react';
import { 
  BadgeCheck, 
  Quote, 
  Heart, 
  Sparkles, 
  CheckCircle2,
  Info
} from 'lucide-react';

interface FounderNoticeCardProps {
  compact?: boolean;
}

export const FounderNoticeCard: React.FC<FounderNoticeCardProps> = ({ compact = false }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-emerald-100 dark:border-emerald-950/60 shadow-xs relative overflow-hidden transition-all">
      {/* Top Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-500"></div>

      {/* Header section with quote icon and badge */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                অফিসিয়াল এডমিন নোটিশ
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                লক্ষ্য ও অঙ্গীকার
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              অ্যাপের উদ্দেশ্য ও নাগরিক অঙ্গীকার
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] font-bold">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>ভেরিফাইড বার্তা</span>
        </span>
      </div>

      {/* Main Notice Content */}
      <div className="font-serif-bengali text-slate-700 dark:text-slate-300 text-sm sm:text-[15px] leading-[1.9] space-y-4">
        {/* Salam & Introduction */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-pink-100 dark:border-slate-800/60">
          <p className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-[16px] mb-2">
            আসসালামু আলাইকুম, সম্মানিত কুষ্টিয়াবাসী।
          </p>
          <p>
            প্রিয় কুষ্টিয়া শহর ও জেলার নাগরিকদের সুবিধার্থে অন্যায়ের বিরুদ্ধে সোচ্চার, নিরাপদ ও আধুনিক করে গড়ে তুলতে এই ডিজিটাল প্ল্যাটফর্মটি পরিচালিত হচ্ছে।
          </p>
        </div>

        {/* 100% Free Lifetime Guarantee Highlight Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/90 dark:border-emerald-800/50 text-slate-800 dark:text-slate-200 relative overflow-hidden shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-900 dark:text-emerald-200 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>নাগরিক সেবায় সম্পূর্ণ উন্মুক্ত</span>
              </div>
              
              <div className="py-2 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/70 dark:border-emerald-700/60">
                <p className="text-emerald-900 dark:text-emerald-300 font-extrabold text-base sm:text-[16px] leading-snug">
                  “সাধারণ নাগরিক সেবা ও তথ্যের জন্য এই প্ল্যাটফর্ম সবার জন্য সর্বদা উন্মুক্ত।”
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                রক্তদান, জরুরি সেবা ও নাগরিক ডিরেক্টরি সর্বদা জনস্বার্থে পরিচালিত।
              </p>
            </div>
          </div>
        </div>

        {/* Future Custom Promotion Policy Note */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-pink-200/80/70 dark:border-slate-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
            কোনো ব্যবহারকারী যদি বিশেষ বাণিজ্যিক প্রচার বা কাস্টম প্রমোশন চালাতে চান, সেক্ষেত্রে নির্ধারিত নীতিমালা প্রযোজ্য হতে পারে। তবে সাধারণ নাগরিক সেবা ও সমাজসেবামূলক কাজের জন্য প্ল্যাটফর্মটি সর্বদা ফ্রি থাকবে।
          </p>
        </div>

        {/* Blessing / Dua request */}
        <p className="font-semibold text-slate-800 dark:text-slate-200 pt-1 px-1">
          আপনাদের আন্তরিক সহযোগিতা ও ভালোবাসা নিয়ে প্রিয় কুষ্টিয়ার জন্য আমরা নিবেদিত।
        </p>
      </div>

      {/* Signature Section */}
      <div className="mt-6 pt-5 border-t border-pink-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/30 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5">
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-serif-bengali block mb-0.5">
            আন্তরিক শুভেচ্ছান্তে,
          </span>
          <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>আমার কুষ্টিয়া এডমিন টিম</span>
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
            ডিজিটাল সার্ভিস পোর্টাল, কুষ্টিয়া।
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-pink-200/80 dark:border-slate-700 shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span className="font-medium">প্রিয় কুষ্টিয়ার জন্য নিবেদিত</span>
        </div>
      </div>
    </div>
  );
};
