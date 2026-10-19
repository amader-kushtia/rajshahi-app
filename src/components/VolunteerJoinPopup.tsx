import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ArrowRight, Users } from 'lucide-react';
import { CategoryType } from '../types';

interface VolunteerJoinPopupProps {
  onNavigate: (category: CategoryType) => void;
}

import { useAdminConfig } from '../context/AdminConfigContext';

export const VolunteerJoinPopup: React.FC<VolunteerJoinPopupProps> = ({ onNavigate }) => {
  const { themeConfig } = useAdminConfig();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!themeConfig.volunteerPopupActive) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [themeConfig.volunteerPopupActive]);

  useEffect(() => {
    const handlePreview = () => setIsOpen(true);
    window.addEventListener('show-volunteer-popup', handlePreview);
    return () => window.removeEventListener('show-volunteer-popup', handlePreview);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('kushtia_volunteer_popup_dismissed', 'true');
  };

  const handleJoinClick = () => {
    handleClose();
    onNavigate('volunteers');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-100 dark:border-emerald-900/30"
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header with Background Gradient */}
            <div className="h-24 bg-gradient-to-br from-emerald-600 to-teal-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
              </div>
              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                স্বেচ্ছাসেবী হিসেবে যোগ দিন!
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 leading-relaxed px-2">
                {themeConfig.volunteerPopupMessage || 'কুষ্টিয়া শহরের সেবায় আপনি কি সেচ্ছাসেবী হিসেবে আমাদের সঙ্গে কাজ করতে চান? আপনার সামান্য সহযোগিতা অনেকের উপকারে আসতে পারে।'}
              </p>

              <div className="mt-6">
                <button 
                  onClick={handleJoinClick}
                  className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/20 transition-all active:scale-[0.98]"
                >
                  <Users className="w-4 h-4" />
                  <span>হ্যাঁ, আমি কাজ করতে চাই</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Subtle Bar */}
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
