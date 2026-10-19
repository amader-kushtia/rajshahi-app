import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Phone, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles, 
  EyeOff, 
  ShieldCheck, 
  Building2,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SecretCrimeBannerProps {
  onOpenCrimeReporter?: () => void;
  className?: string;
  isGridMiddle?: boolean;
}

export const KUSHTIA_OC_PHONE = '01320135402';
export const KUSHTIA_OC_WHATSAPP = '8801320135402';

export const SecretCrimeBanner: React.FC<SecretCrimeBannerProps> = ({
  onOpenCrimeReporter,
  className = '',
  isGridMiddle = false
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Respectful, pre-formatted official message for Kushtia OC acknowledging the app source
  const defaultOcMessage = `আসসালামু আলাইকুম ওসি স্যার,
আমি "আমার কুষ্টিয়া" অ্যাপ থেকে আপনার অফিশিয়াল নম্বরটি পেয়ে গোপন অপরাধ/জরুরি বিষয় সংক্রান্ত তথ্য জানাতে যোগাযোগ করছি।

📋 তথ্যের বিস্তারিত:
• স্থান/এলাকা: 
• ঘটনা/অভিযোগ: 
• সংক্ষিপ্ত বিবরণ: 

(আমার কুষ্টিয়া অ্যাপের মাধ্যমে এনক্রিপ্ট করে প্রেরিত নাগরিক বার্তা)`;

  const handleCopyOcMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    navigator.clipboard.writeText(defaultOcMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenOcWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    const encoded = encodeURIComponent(defaultOcMessage);
    const url = `https://wa.me/${KUSHTIA_OC_WHATSAPP}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCallOc = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    window.location.href = `tel:${KUSHTIA_OC_PHONE}`;
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-2 border-rose-500/50 text-white shadow-2xl transition-all duration-300 hover:border-rose-400/80 ${className}`}
    >
      {/* Background Glows & Cyber Gradients */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 space-y-4">
        {/* Top Header Badge & Security Pill */}
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-indigo-500/30 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-black tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>কুষ্টিয়া গোপন তথ্য ও অপরাধ ডেস্ক</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>১০০% এনক্রিপ্টেড & গোপন</span>
          </div>
        </div>

        {/* Main Headline & Security Assurance */}
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-black text-white leading-tight flex items-center gap-2">
            <span>গোপন অপরাধ বা দুর্নীতি বিষয়ে তথ্য দিতে চান?</span>
          </h2>
          <div className="bg-slate-900/80 backdrop-blur-xs rounded-2xl p-3.5 border border-indigo-500/30 space-y-2 text-xs text-indigo-100">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                <strong className="text-emerald-300 font-bold">শতভাগ পরিচয় গোপন রাখার নিশ্চয়তা:</strong> আপনার পরিচয় কেউই জানতে পারবে না, এমনকি অ্যাপের এডমিন নিজেও দেখতে পারবে না। নির্ভয়ে তথ্য দিন।
              </p>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-indigo-500/20">
              <FileCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] text-indigo-200">
                <strong className="text-amber-300 font-bold">প্রমাণ সহ সাবমিট:</strong> ভুয়া পোস্ট রোধে ছবি বা ফাইলের প্রমাণসহ পোস্ট করা বাধ্যতামূলক।
              </p>
            </div>
          </div>
        </div>

        {/* Official Kushtia Officer In-Charge (OC) Direct Contact Card */}
        <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-slate-950 rounded-2xl p-4 border border-emerald-500/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    কুষ্টিয়া থানা ওসি (Officer In-Charge)
                  </h4>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                    অফিশিয়াল নম্বর
                  </span>
                </div>
                <p className="text-xs text-emerald-200 font-mono font-bold mt-0.5">
                  ফোন & WhatsApp: <span className="text-amber-300 underline decoration-amber-400/50">{KUSHTIA_OC_PHONE}</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-emerald-100/90 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-emerald-500/20">
            💬 ওসি স্যারকে সরাসরি WhatsApp-এ গোপন তথ্য পাঠাতে নিচের বাটনে চাপ দিন। মেসেজে স্বয়ংক্রিয়ভাবে লেখা থাকবে যে আপনি <strong>"আমার কুষ্টিয়া"</strong> অ্যাপ থেকে এই নম্বরটি পেয়ে যোগাযোগ করছেন।
          </p>

          {/* Action Buttons: WhatsApp to OC & Direct Call */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleOpenOcWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-500 shrink-0" />
              <span>ওসি স্যারকে WhatsApp এ সরাসরি লিখুন</span>
            </button>

            <button
              type="button"
              onClick={handleCallOc}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-emerald-500/30 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>সরাসরি কল দিন ({KUSHTIA_OC_PHONE})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyOcMessage}
            className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-600/30 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-amber-200 font-bold">ওসি স্যারের মেসেজ টেক্সট কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ওসি স্যারের জন্য প্রস্তুতকৃত মেসেজ টেক্সট কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Action Button: Online Secret Report */}
        {onOpenCrimeReporter && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenCrimeReporter}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-rose-700 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/60 transition-all border border-indigo-400/40 cursor-pointer"
            >
              <EyeOff className="w-4 h-4 text-rose-300 shrink-0" />
              <span>অ্যাপে গোপন তথ্য / ক্রাইম রিপোর্ট জমা দিন</span>
              <ChevronRight className="w-4 h-4 text-indigo-200 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
