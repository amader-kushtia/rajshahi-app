import React from 'react';
import { ShieldCheck, Lock, FileCheck, ShieldAlert, EyeOff, KeyRound } from 'lucide-react';

interface SecretInfoSecurityNoticeProps {
  compact?: boolean;
}

export const SecretInfoSecurityNotice: React.FC<SecretInfoSecurityNoticeProps> = ({ compact = false }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl text-white shadow-xl relative overflow-hidden ${compact ? 'p-3.5 my-2' : 'p-4 sm:p-5 my-3'}`}>
      {/* Background Subtle Accent Glows */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-indigo-500/30 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                গোপন তথ্য ও অপরাধ রিপোর্ট ডেস্ক
              </h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>১০০% সিকিউর এনক্রিপ্টেড</span>
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/90 font-medium mt-0.5">
              কুষ্টিয়া শহরের ডিজিটাল নিরাপদে তথ্য প্রদান ব্যবস্থা
            </p>
          </div>
        </div>
      </div>

      {/* Main Content & Exact Wording */}
      <div className="space-y-2.5 text-xs relative z-10">
        {/* Box 1: Fearless & Zero Trace Privacy Guarantee */}
        <div className="p-3 bg-indigo-900/40 border border-indigo-400/30 rounded-2xl flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-indigo-100 leading-relaxed font-medium">
            <span className="font-black text-emerald-300 block mb-0.5">🔒 ১০০% নির্ভয়ে গোপন তথ্য প্রদান:</span>
            এখানে একদম নির্ভয়ে গোপন তথ্য ও ক্রাইম রিপোর্ট করতে পারবেন। আপনার পরিচয় ও তথ্য সম্পূর্ণ সুরক্ষিত থাকে এবং রিপোর্টটি শুধুমাত্র অ্যাডমিন প্যানেলের সুরক্ষিত গোপন তথ্য ডেস্কে পর্যালোচনার জন্য জমা হয়।
          </div>
        </div>

        {/* Box 2: Mandatory Proof & Fake Post Policy */}
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl flex items-start gap-2.5">
          <FileCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-rose-100 leading-relaxed font-medium">
            <span className="font-black text-rose-300 block mb-0.5">📸 প্রমান সহ পোস্ট করা বাধ্যতামূলক:</span>
            অবশ্যই আপনাকে প্রমান সহ পোস্ট করতে হবে। ফেক পোস্ট অথবা প্রমান ছাড়া পোস্ট করলে সেটা অ্যাপরুভ হবে না।
          </div>
        </div>
      </div>

      {/* Security Features Badges Footer */}
      <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center justify-between gap-2 text-[10px] text-indigo-300 font-bold flex-wrap">
        <span className="flex items-center gap-1">
          <EyeOff className="w-3 h-3 text-indigo-400" />
          পরিচয় চিরতরে গোপন
        </span>
        <span className="flex items-center gap-1">
          <KeyRound className="w-3 h-3 text-emerald-400" />
          জিরো মেটাডাটা ট্রেস
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          এডমিন ভেরিফাইড পেন্ডিং পোস্ট
        </span>
      </div>
    </div>
  );
};
