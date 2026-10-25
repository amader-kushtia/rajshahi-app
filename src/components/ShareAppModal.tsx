import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  CheckCircle2, 
  Share2, 
  Facebook, 
  MessageCircle,
  HeartHandshake,
  Users,
  Check
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Robust cross-platform copy utility (works on iOS, Android, Desktop, PWA, and iframe contexts)
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('Async clipboard writeText warning, trying fallback:', e);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.fontSize = '12pt';
    textArea.style.border = '0';
    textArea.style.padding = '0';
    textArea.style.margin = '0';
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    
    document.body.appendChild(textArea);

    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.focus();
      textArea.select();
    }

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('ExecCommand fallback error:', err);
    return false;
  }
};

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const { themeConfig } = useAdminConfig();
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const appName = 'আমার কুষ্টিয়া';
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

  const appLink = typeof window !== 'undefined' ? window.location.origin : 'https://amarkushtia.app';
  const shareText = `${cityName} শহরের সব সেবা এখন এক ছাদের নিচে! 🏙️\n\n'${appName}' অ্যাপে পাচ্ছেন বাসা ভাড়া, কেনাবেচা, রক্তদাতা, ডাক্তার, মিস্ত্রি থেকে শুরু করে জরুরি সব হেল্পলাইন। আসুন ডিজিটাল ${cityName} গড়ে তুলি, আজই যুক্ত হোন! 🚀\n\nলিংক: ${appLink}`;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const trackShare = () => {
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem('kushtia_share_count', newCount.toString());
  };

  const handleCopyLink = async (customMsg = 'অ্যাপ লিঙ্ক ও বার্তা সফলভাবে কপি হয়েছে!') => {
    const success = await copyTextToClipboard(shareText);
    if (success) {
      setCopied(true);
      triggerToast(customMsg);
      trackShare();
      setTimeout(() => setCopied(false), 2500);
    } else {
      triggerToast('লিঙ্ক সিলেক্ট করে কপি করুন।');
    }
  };

  const shareNative = async () => {
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: appName,
          text: shareText,
          url: appLink,
        });
        trackShare();
      } catch (err) {
        console.warn('Native share dismissed or not supported:', err);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Direct Social URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}&quote=${encodeURIComponent(shareText)}`;
  const whatsAppShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const tikTokShareUrl = `https://www.tiktok.com/upload`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Share2 className="w-24 h-24 text-white" />
          </div>
          
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors cursor-pointer"
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
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-pink-100 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-4 select-all">
              {cityName} শহরের সব সেবা এখন এক ছাদের নিচে! 🏙️
              '{appName}' অ্যাপে পাচ্ছেন বাসা ভাড়া, কেনাবেচা, রক্তদাতা, ডাক্তার, মিস্ত্রি থেকে শুরু করে জরুরি সব হেল্পলাইন। আসুন ডিজিটাল {cityName} গড়ে তুলি, আজই যুক্ত হোন! 🚀
            </p>
            <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate bg-emerald-50/50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
              {appLink}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {/* Native Share */}
            <button
              type="button"
              onClick={shareNative}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
            >
              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full flex items-center justify-center transition-colors shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[9.5px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">অন্যান্য<br/>(Share)</span>
            </button>

            {/* Facebook (Native HTML Anchor tag for 100% reliable opening on mobile/PWA) */}
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                copyTextToClipboard(shareText);
                triggerToast('ফেসবুক পোস্ট বিবরণ ও লিঙ্ক কপি হয়েছে!');
                trackShare();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-[#1877F2]/10 transition-colors group cursor-pointer"
            >
              <div className="w-11 h-11 bg-[#1877F2]/10 group-hover:bg-[#1877F2]/20 text-[#1877F2] rounded-full flex items-center justify-center transition-colors shadow-xs">
                <Facebook className="w-5 h-5" />
              </div>
              <span className="text-[9.5px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">ফেসবুক<br/>পোস্ট</span>
            </a>

            {/* TikTok (Native HTML Anchor tag) */}
            <a
              href={tikTokShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                copyTextToClipboard(shareText);
                triggerToast('টিকটক ক্যাপশন ও লিঙ্ক কপি হয়েছে! টিকটকে পেস্ট করুন।');
                trackShare();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-900/10 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
            >
              <div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.41c-.01 2.22-.84 4.38-2.38 5.98-1.55 1.6-3.76 2.53-6.02 2.53-2.27 0-4.48-.93-6.03-2.53-1.54-1.6-2.37-3.76-2.38-5.98 0-2.23.84-4.39 2.38-5.99 1.55-1.6 3.76-2.53 6.03-2.53.53 0 1.05.05 1.57.17v4.13c-.5-.16-1.03-.25-1.57-.24-1.12 0-2.22.46-2.99 1.25-.78.8-1.2 1.9-1.2 3.03s.42 2.23 1.2 3.03c.77.79 1.87 1.25 2.99 1.25 1.13 0 2.23-.46 3-1.25.78-.8 1.2-1.9 1.2-3.03V.02z"/>
                </svg>
              </div>
              <span className="text-[9.5px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">টিকটক<br/>পোস্ট</span>
            </a>

            {/* WhatsApp (Native HTML Anchor tag) */}
            <a
              href={whatsAppShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                copyTextToClipboard(shareText);
                triggerToast('হোয়াটসঅ্যাপ বার্তা কপি হয়েছে!');
                trackShare();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-[#25D366]/10 transition-colors group cursor-pointer"
            >
              <div className="w-11 h-11 bg-[#25D366]/10 group-hover:bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center transition-colors shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[9.5px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">হোয়াটস<br/>অ্যাপ</span>
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={() => handleCopyLink()}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors group cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shadow-xs ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 text-slate-700 dark:text-slate-200 group-hover:text-emerald-700'}`}>
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
              <span className="text-[9.5px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">লিংক<br/>কপি</span>
            </button>
          </div>
          
          <div className="pt-2 border-t border-pink-100 dark:border-slate-800 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>১,০০০+ প্রতিবেশীর সাথে যুক্ত হোন যারা ইতোমধ্যে অ্যাপটি ব্যবহার করছেন!</span>
            </div>
            {shareCount > 0 && (
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                আপনি {shareCount} বার অ্যাপটি শেয়ার করেছেন
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
