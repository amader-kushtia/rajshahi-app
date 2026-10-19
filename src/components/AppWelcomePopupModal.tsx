import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { AppThemeConfig, CategoryType } from '../types';

interface AppWelcomePopupModalProps {
  appConfig: AppThemeConfig;
  onNavigate?: (category: CategoryType) => void;
}

export const AppWelcomePopupModal: React.FC<AppWelcomePopupModalProps> = ({
  appConfig,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if admin has activated the welcome popup
    const isActive = appConfig.isWelcomePopupActive ?? true;
    if (!isActive) {
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [appConfig.isWelcomePopupActive]);

  // Listen for admin trigger to preview popup live
  useEffect(() => {
    const handleAdminPreview = () => {
      setIsOpen(true);
    };
    window.addEventListener('show-welcome-popup-preview', handleAdminPreview);
    return () => window.removeEventListener('show-welcome-popup-preview', handleAdminPreview);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('kushtia_popup_dismissed_session', 'true');
  };

  const handleActionClick = () => {
    handleClose();
    if (appConfig.welcomePopupActionUrl && onNavigate) {
      onNavigate(appConfig.welcomePopupActionUrl as CategoryType);
    }
  };

  const title = appConfig.welcomePopupTitle || 'আমার কুষ্টিয়াে স্বাগতম!';
  const message = appConfig.welcomePopupMessage || 'কুষ্টিয়া শহরের সব প্রয়োজনীয় নাগরিক সেবা, জরুরি যোগাযোগ, বাসা ভাড়া ও কেনাবেচার তথ্য এখন আপনার হাতের মুঠোয়।';
  const buttonText = appConfig.welcomePopupButtonText || 'শুরু করুন';
  const actionText = appConfig.welcomePopupActionText;
  const hasActionUrl = Boolean(appConfig.welcomePopupActionUrl && actionText);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div 
            className="relative w-full max-w-[328px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-pink-100 dark:border-slate-800"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minimalist Top Premium Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700" />

            {/* Absolute Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-5 text-center space-y-4">
              {/* Sleek Mini-Icon Container */}
              <div className="mx-auto w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shadow-2xs border border-amber-100 dark:border-amber-900/30">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>

              {/* Title & Description with high-end typography */}
              <div className="space-y-1.5">
                <h3 className="text-[15px] sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                  {title}
                </h3>
                <p className="text-[12px] sm:text-[13px] font-semibold text-slate-500 dark:text-slate-300 leading-relaxed px-1">
                  {message}
                </p>
              </div>

              {/* Minimalist Verified Citizen Badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-pink-100 dark:border-slate-800/60 mx-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>বিশ্বস্ত নাগরিক সেবা ডেস্ক</span>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-2 pt-1">
                {hasActionUrl && (
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="w-full py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-100 dark:border-emerald-900/30"
                  >
                    <span>{actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] shadow-xs"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>


            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
