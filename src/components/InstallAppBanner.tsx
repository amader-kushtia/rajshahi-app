import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if user previously closed it in session storage
    const dismissed = sessionStorage.getItem('kushtia_install_dismissed');
    if (dismissed) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    setIsInstalling(true);
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      // Fallback: Trigger direct download or show PWA installation guide / simulation
      alert('আমার কুষ্টিয়া অ্যাপ ডাউনলোড শুরু হচ্ছে! আপনার ব্রাউজারের মেনু থেকে "Add to Home Screen" বা "Install App" সিলেক্ট করুন।');
    }
    setIsInstalling(false);
    setIsVisible(false);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('kushtia_install_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-3 relative backdrop-blur-md">
        
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl pointer-events-none animate-pulse" />

        <div className="flex items-center gap-3 relative z-10 flex-1">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Smartphone className="w-6 h-6 text-emerald-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full tracking-wider uppercase">অফিসিয়াল অ্যাপ</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <h4 className="text-sm font-bold mt-0.5 text-white">আমার কুষ্টিয়া মোবাইল অ্যাপ</h4>
            <p className="text-[11px] text-emerald-200/90">মোবাইলে দ্রুত ব্যবহারের জন্য ইনস্টল করুন</p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>অ্যাপ ইন্সটল করুন</span>
          </button>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close install banner"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
