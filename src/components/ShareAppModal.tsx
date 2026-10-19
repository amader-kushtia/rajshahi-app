import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  CheckCircle2, 
  Share2, 
  Facebook, 
  MessageCircle,
  Smartphone,
  HeartHandshake,
  Users
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const { themeConfig } = useAdminConfig();
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const appName = (themeConfig?.appName && themeConfig.appName !== 'আমার কুষ্টিয়া') ? themeConfig.appName : 'আমার কুষ্টিয়া';
  const cityName = themeConfig?.cityName || 'কুষ্টিয়া';

  useEffect(() => {
    if (isOpen) {
      const savedCount = localStorage.getItem('kushtia_share_count');
      if (savedCount) {
        setShareCount(parseInt(savedCount, 10));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appLink = window.location.origin;
  const shareText = `${cityName} শহরের সব সেবা এখন এক ছাদের নিচে! 🏙️\n\n'${appName}' অ্যাপে পাচ্ছেন বাসা ভাড়া, কেনাবেচা, রক্তদাতা, ডাক্তার, মিস্ত্রি থেকে শুরু করে জরুরি সব হেল্পলাইন। আসুন ডিজিটাল ${cityName} গড়ে তুলি, আজই যুক্ত হোন! 🚀\n\nলিংক: ${appLink}`;

  const trackShare = () => {
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem('kushtia_share_count', newCount.toString());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      trackShare();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: appName,
          text: shareText,
        });
        trackShare();
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    trackShare();
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    trackShare();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Share2 className="w-24 h-24" />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-inner">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-black text-white mb-1">ছড়িয়ে দিন শহরের কথা</h2>
          <p className="text-emerald-50 text-xs leading-relaxed font-medium">
            আপনার একটি শেয়ার হয়তো বাঁচিয়ে দিতে পারে কারো জীবন, অথবা সহজ করে দিতে পারে প্রতিদিনের কাজ।
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-pink-100">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              কুষ্টিয়া শহরের সব সেবা এখন এক ছাদের নিচে! 🏙️
              'আমার কুষ্টিয়া' অ্যাপে পাচ্ছেন বাসা ভাড়া, কেনাবেচা, রক্তদাতা, ডাক্তার, মিস্ত্রি থেকে শুরু করে জরুরি সব হেল্পলাইন। আসুন ডিজিটাল কুষ্টিয়া গড়ে তুলি, আজই যুক্ত হোন! 🚀
            </p>
            <div className="mt-2 text-xs font-bold text-emerald-600 truncate bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
              {appLink}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={shareNative}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">অন্যান্য<br/>(Share)</span>
            </button>

            <button
              onClick={shareFacebook}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-[#1877F2]/5 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#1877F2]/10 group-hover:bg-[#1877F2]/20 text-[#1877F2] rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">ফেসবুক<br/>পোস্ট</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-[#25D366]/5 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#25D366]/10 group-hover:bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">হোয়াটস<br/>অ্যাপ</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-emerald-50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700'}`}>
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
              <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">লিংক<br/>কপি</span>
            </button>
          </div>
          
          <div className="pt-2 border-t border-pink-100 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>১,০০০+ প্রতিবেশীর সাথে যুক্ত হোন যারা ইতোমধ্যে অ্যাপটি ব্যবহার করছেন!</span>
            </div>
            {shareCount > 0 && (
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                আপনি {shareCount} বার অ্যাপটি শেয়ার করেছেন
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
