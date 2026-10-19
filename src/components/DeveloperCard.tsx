import React from 'react';
import { 
  BadgeCheck, 
  MessageCircle, 
  MapPin, 
  Heart, 
  Phone, 
  ExternalLink,
  Mail,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';

export const DeveloperCard: React.FC = () => {
  const { themeConfig } = useAdminConfig();
  const supportPhone = themeConfig.supportPhone || '01700000000';
  const cleanWhatsapp = supportPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/88${cleanWhatsapp}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Platform Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-pink-200/80 dark:border-slate-800 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-100 dark:bg-emerald-950/30 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative flex flex-col items-center text-center gap-5">
          {/* Official Platform Logo */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-2 shadow-lg shadow-emerald-500/20 flex items-center justify-center relative">
            <img 
              src="/assets/logo.svg" 
              alt="আমার কুষ্টিয়া" 
              className="w-16 h-16 object-contain" 
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-md">
              <BadgeCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Core Info */}
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              আমার কুষ্টিয়া
            </h3>
            <span className="inline-block text-xs bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-extrabold px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
              অফিসিয়াল নাগরিক সেবা পোর্টাল
            </span>

            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-lg mx-auto mt-2">
              বাউল সম্রাট লালন ও বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের পুণ্যভূমি কুষ্টিয়ার সব প্রয়োজনীয় জরুরি সেবা, রক্তদাতা, ডাক্তার ডিরেক্টরি, কেনাবেচা ও নাগরিক তথ্যের সমন্বিত প্ল্যাটফর্ম।
            </p>
          </div>

          {/* Credential Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>কুষ্টিয়া জেলা</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>নিরাপদ ও জনকল্যাণমুখী</span>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <div className="mt-8 pt-6 border-t border-pink-100 dark:border-slate-800">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4 text-center">
            এডমিন ও হেল্পডেস্ক যোগাযোগ
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp সাপোর্ট</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={`tel:${supportPhone}`}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-pink-200/80 dark:border-slate-700 font-bold text-xs transition-colors hover:border-pink-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>সরাসরি কল ({supportPhone})</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Community Dedication Note */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white text-xs leading-relaxed shadow-lg flex items-start gap-4">
        <div className="p-3 bg-rose-500/20 rounded-2xl">
          <Heart className="w-6 h-6 text-rose-400 fill-rose-400/20" />
        </div>
        <div>
          <span className="font-bold text-emerald-400 block mb-1 text-sm">আমাদের অঙ্গীকার</span>
          কুষ্টিয়া শহরের প্রতিটি নাগরিকের সহযোগিতায় এই অ্যাপ্লিকেশনটি একটি সমৃদ্ধ, নিরাপদ ও প্রযুক্তিবান্ধব কুষ্টিয়া গড়ার উদ্দেশ্যে পরিচালিত হচ্ছে।
        </div>
      </div>
    </div>
  );
};
