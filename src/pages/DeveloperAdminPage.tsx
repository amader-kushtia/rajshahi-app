import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BadgeCheck, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Heart,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminConfig } from '../context/AdminConfigContext';

interface DeveloperAdminPageProps {
  onBack: () => void;
  onOpenAdminPanel?: () => void;
}

export const DeveloperAdminPage: React.FC<DeveloperAdminPageProps> = ({ onBack, onOpenAdminPanel }) => {
  const { isAdmin, user } = useAuth();
  const { themeConfig } = useAdminConfig();
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportPhone = themeConfig.supportPhone || '01700000000';
  const cleanPhone = supportPhone.replace(/[^0-9]/g, '');

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    if (!feedbackMessage.trim()) return;

    const text = encodeURIComponent(
      `[আমার কুষ্টিয়া - নাগরিক বার্তা]\nনাম: ${feedbackName || 'একজন নাগরিক'}\nফোন: ${feedbackPhone || 'দেওয়া হয়নি'}\nবার্তা: ${feedbackMessage}`
    );
    window.open(`https://wa.me/88${cleanPhone}?text=${text}`, '_blank');
    setIsSubmitted(true);
    setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackName('');
      setFeedbackPhone('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-pink-200/80/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Code2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>অ্যাপ পরিচিতি ও হেল্পডেস্ক</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">কুষ্টিয়া জেলার আধুনিক ডিজিটাল নাগরিক সেবা প্ল্যাটফর্ম</p>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>অফিসিয়াল সিস্টেম</span>
        </span>
      </div>

      {/* Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-emerald-100 dark:border-emerald-950/60 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-500"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1 mb-5">
          {/* Logo with Verified Badge */}
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-emerald-900 via-emerald-800 to-emerald-600 p-2 shadow-md flex items-center justify-center shrink-0 relative">
            <img 
              src="/assets/logo.svg" 
              alt="আমার কুষ্টিয়া" 
              className="w-14 h-14 object-contain" 
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs z-10" title="ভেরিফাইড সিস্টেম">
              <BadgeCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Core Info */}
          <div className="text-center sm:text-left flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                আমার কুষ্টিয়া
              </h3>
              <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                ডিজিটাল প্ল্যাটফর্ম
              </span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold">
              কুষ্টিয়া জেলার সমন্বিত নাগরিক সেবা ও তথ্য পোর্টাল
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              নাগরিকদের জন্য জরুরি সেবা, রক্তদাতা সন্ধান, দর্শনীয় স্থান, ডাক্তার ও হাসপাতাল ডিরেক্টরি, পরিবহন সময়সূচী ও নিরাপদ কেনাবেচার ডিজিটাল সমাধান।
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>কুষ্টিয়া জেলা</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>নিরাপদ ও জনকল্যাণমূলক</span>
              </span>
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <div className="pt-4 border-t border-pink-100 dark:border-slate-800/80">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">
            সরাসরি যোগাযোগ ও সহায়তা মাধ্যম:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={`https://wa.me/88${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp সাপোর্ট ({supportPhone})</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={`tel:${supportPhone}`}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-pink-200/80/80 dark:border-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>কল করুন: {supportPhone}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Secure Admin Portal Shortcut - Visible to authenticated admin */}
          {onOpenAdminPanel && user && isAdmin && (
            <div className="pt-3 mt-3 border-t border-pink-100 dark:border-slate-800">
              <button
                id="developer-admin-panel-btn"
                type="button"
                onClick={onOpenAdminPanel}
                className="w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-sm transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs block text-white">অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
                    <span className="text-[10px] text-slate-400 block">পোস্ট অনুমোদন, ভেরিফাই ও সিস্টেম সেটিংস</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>খুলুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Direct Feedback Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-pink-200/80/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Send className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            এডমিন ডেস্কে সরাসরি বার্তা বা মতামত পাঠান
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          অ্যাপের কোনো সমস্যা, পরামর্শ বা নতুন ফিচারের প্রস্তাব থাকলে নিচের বক্সে লিখে সরাসরি এডমিন ডেস্কে পাঠাতে পারেন।
        </p>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">বার্তাটি পাঠানো হচ্ছে!</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">আপনার মূল্যবান মতামতের জন্য ধন্যবাদ।</p>
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="আপনার নাম (ঐচ্ছিক)"
                value={feedbackName}
                onChange={e => setFeedbackName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/80 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white"
              />
              <input
                type="tel"
                placeholder="মোবাইল নম্বর (ঐচ্ছিক)"
                value={feedbackPhone}
                onChange={e => setFeedbackPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/80 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <textarea
              rows={3}
              placeholder="আপনার মতামত বা সমস্যা বিস্তারিত লিখুন..."
              required
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/80 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none dark:bg-slate-800 dark:text-white"
            ></textarea>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>বার্তা পাঠান (হোয়াটসঅ্যাপে)</span>
            </button>
          </form>
        )}
      </div>

      {/* Community Pledge */}
      <div className="p-4 rounded-2xl bg-emerald-900 text-white text-xs leading-relaxed shadow-xs flex items-start gap-3">
        <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-200 block mb-0.5">আমাদের অঙ্গীকার:</span>
          কুষ্টিয়া শহরের প্রতিটি নাগরিকের সহযোগিতায় এই অ্যাপ্লিকেশনটি একটি সমৃদ্ধ, নিরাপদ ও প্রযুক্তিবান্ধব কুষ্টিয়া গড়ার উদ্দেশ্যেই পরিচালিত হচ্ছে।
        </div>
      </div>
    </div>
  );
};
