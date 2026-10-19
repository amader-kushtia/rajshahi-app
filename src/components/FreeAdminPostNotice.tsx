import React, { useState } from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  Gift, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  Phone, 
  Clock, 
  HelpCircle,
  Check,
  ChevronRight,
  Send,
  Zap,
  Tag
} from 'lucide-react';
import { UserProfile } from '../types';

interface FreeAdminPostNoticeProps {
  categoryName: string;
  categoryId: string;
  user: UserProfile | null;
  onOpenCrimeReporter?: () => void;
  adminWhatsApp?: string;
  adminFacebook?: string;
}

export const FreeAdminPostNotice: React.FC<FreeAdminPostNoticeProps> = ({
  categoryName,
  categoryId,
  user,
  onOpenCrimeReporter,
  adminWhatsApp = '01700000000',
  adminFacebook = 'https://facebook.com/kushtia'
}) => {
  const [copied, setCopied] = useState(false);
  const [userCustomDetails, setUserCustomDetails] = useState('');
  const [userPhoneInput, setUserPhoneInput] = useState(user?.phone || '');
  const [userNameInput, setUserNameInput] = useState(user?.displayName || '');

  // Clean WhatsApp number (without leading + or formatting)
  const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone}`;

  // Generated ready-to-send message payload
  const generatedMessage = `আসসালামু আলাইকুম এডমিন ভাই,
আমি "আমার কুষ্টিয়া" অ্যাপে ${categoryName || 'বিজ্ঞাপন'} ক্যাটাগরিতে একটি ফ্রি পোস্ট দিতে চাই।

📋 বিজ্ঞাপনের তথ্য:
• ক্যাটাগরি: ${categoryName}
• আমার নাম: ${userNameInput.trim() || user?.displayName || 'কুষ্টিয়া নাগরিক'}
• মোবাইল নম্বর: ${userPhoneInput.trim() || user?.phone || '০১৭xxxxxxxx'}
• এলাকা: কুষ্টিয়া
${userCustomDetails.trim() ? `• বিজ্ঞাপনের বিবরণ:\n${userCustomDetails.trim()}` : '• বিজ্ঞাপনের বিবরণ: (এখানে আপনার বাসার তথ্য/পণ্য/সার্ভিসের বিবরণ দিন)'}

অনুগ্রহ করে আমার বিজ্ঞাপনটি একদম ফ্রিতে আমার কুষ্টিয়াে প্রকাশ করার ব্যবস্থা করুন। ধন্যবাদ!`;

  const handleCopyMessage = () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    const encoded = encodeURIComponent(generatedMessage);
    const url = `https://wa.me/${internationalPhone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleOpenFacebook = () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    // Copy the text to clipboard first so they can paste it directly in Facebook messenger
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open(adminFacebook, '_blank');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Main Notice Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-700/50 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        <div className="relative z-10 space-y-4">
          {/* Top Badge & Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-black tracking-wide">
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>১০০% ফ্রি বিজ্ঞাপন সুবিধা</span>
            </div>

            <div className="text-[11px] font-bold text-emerald-200/90 bg-black/20 px-2.5 py-1 rounded-xl">
              ক্যাটাগরি: <span className="text-white font-black">{categoryName}</span>
            </div>
          </div>

          {/* Core Announcement Message Box */}
          <div className="space-y-3 pt-1">
            <h2 className="text-base sm:text-lg font-black text-white leading-snug">
              আপনি কি <span className="text-amber-300 underline decoration-amber-400/60 underline-offset-4">{categoryName}</span> বিষয়ে একদম ফ্রিতে পোস্ট করতে চান?
            </h2>

            <div className="bg-emerald-950/60 rounded-2xl p-4 border border-emerald-700/60 space-y-2.5">
              <p className="text-xs sm:text-sm font-bold text-emerald-100 leading-relaxed">
                👉 আপনি যদি এই বিষয়ে <span className="text-amber-300 font-black">একদম ফ্রিতে পোস্ট</span> করতে চান তাহলে সরাসরি Admin কে WhatsApp এ নক দিয়ে বিস্তারিত জানান!
              </p>
              
              <p className="text-xs sm:text-sm font-bold text-emerald-100 leading-relaxed">
                👉 আপনি যদি কোনো পেশার (যেমন: ইলেকট্রিশিয়ান, ড্রাইভার, টিউশন) হয়ে থাকেন অথবা কোনোকিছু (বাসা ভাড়া, মোবাইল, পণ্য) সেল করতে চান তাহলে এডমিনকে জানান—<span className="text-amber-300 font-black">একদম ফ্রিতে, কোনো প্রকার টাকা দেওয়া লাগবে না।</span>
              </p>
              
              <div className="pt-1.5 border-t border-emerald-800/80 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium">
                  আর অতি শীঘ্রই আমরা এমন স্বয়ংক্রিয় সিস্টেম চালু করব যাতে আপনি নিজে থেকেই অ্যাপে যেকোনো বিষয়ে সরাসরি পোস্ট করতে পারেন!
                </p>
              </div>
            </div>
          </div>

          {/* Quick inputs to populate the message */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15 space-y-2.5">
            <div className="text-xs font-black text-amber-200 flex items-center justify-between">
              <span>বিজ্ঞাপনের সংক্ষিপ্ত তথ্য লিখুন (ঐচ্ছিক):</span>
              <span className="text-[10px] text-emerald-200 font-normal">মেসেজে স্বয়ংক্রিয়ভাবে যুক্ত হবে</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="আপনার নাম (উদা: মো: রফিকুল)"
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-white placeholder-emerald-300/50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
              <input
                type="tel"
                value={userPhoneInput}
                onChange={(e) => setUserPhoneInput(e.target.value)}
                placeholder="আপনার মোবাইল নম্বর (উদা: 017xxxxxxxx)"
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-white placeholder-emerald-300/50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
            </div>

            <textarea
              rows={2}
              value={userCustomDetails}
              onChange={(e) => setUserCustomDetails(e.target.value)}
              placeholder={`উদা: কুন্দল মোড়ে ২ রুমের বাসা ভাড়া / রিয়েলমি ফোন সেল / অভিজ্ঞ ইলেকট্রিশিয়ান সার্ভিস...`}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-white placeholder-emerald-300/50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 resize-none"
            />
          </div>

          {/* Action Buttons: WhatsApp & Facebook with pre-configured message payload */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-emerald-400" />
                </div>
                <span>WhatsApp এ এডমিনকে জানান</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={handleOpenFacebook}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-950/40 transition-all cursor-pointer border border-blue-400/30"
              >
                <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 font-black text-xs">
                  f
                </div>
                <span>Facebook এ এডমিনকে মেসেজ</span>
              </button>
            </div>

            {/* Copy pre-formatted text button */}
            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-700/60"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-amber-200 font-bold">মেসেজ টেক্সট কপি হয়েছে! যেকোনো চ্যাটে পেস্ট করতে পারেন</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>তৈরিকৃত মেসেজ টেক্সট কপি করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Exception Banner: গোপন তথ্য ও অপরাধ ডেস্ক (Crime Reporter is Allowed Directly!) */}
      <div className="bg-gradient-to-br from-slate-950 to-indigo-950 rounded-3xl p-4 sm:p-5 border border-indigo-500/40 text-white shadow-md flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/40">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-white">
                গোপন তথ্য ও অপরাধের তথ্য দিতে চান?
              </h4>
              <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                ১০০% নির্ভয়ে পোস্ট করুন
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/90 mt-1 leading-relaxed">
              এখানে একদম নির্ভয়ে পোস্ট করতে পারবেন। কারন আপনার তথ্য কেউই দেখতে পারবে না এমন কি এডমিন নিজেও দেখতে পারবে না। তবে অবশ্যই প্রমান সহ (ছবি/ফাইল) পোস্ট করতে হবে।
            </p>
          </div>
        </div>

        {onOpenCrimeReporter && (
          <button
            type="button"
            onClick={onOpenCrimeReporter}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black shrink-0 shadow-lg border border-indigo-400/30 flex items-center gap-1 transition-all self-center cursor-pointer"
          >
            <span>গোপন তথ্য দিন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Trust & Transparency Note */}
      <div className="bg-white rounded-2xl p-3.5 border border-pink-200/80 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>আমার কুষ্টিয়া একটি অলাভজনক প্ল্যাটফর্ম। নাগরিকদের সেবায় বিজ্ঞাপন ও প্রচার সম্পূর্ণ ফ্রি।</span>
      </div>
    </div>
  );
};
