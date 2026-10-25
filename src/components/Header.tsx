import React, { useState, useEffect } from 'react';
import { Search, Bell, CheckCircle2, Shield, X, MapPin, Sparkles, Menu, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminConfig } from '../context/AdminConfigContext';
import { CategoryType, AppThemeConfig } from '../types';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { fetchFlashAlerts, getFlashAlerts } from '../services/adminFeaturesService';

interface HeaderProps {
  currentCategory: CategoryType;
  onNavigate: (category: CategoryType) => void;
  onSearchClick: () => void;
  onOpenDrawer: () => void;
  appConfig?: AppThemeConfig;
  onBack?: () => void;
}

const READ_NOTIFICATIONS_KEY = 'kushtia_read_notifications_ids';

const getAppInitial = (name?: string): string => {
  if (!name) return 'কু';
  const trimmed = name.trim();
  if (trimmed.startsWith('সৈ') || trimmed.startsWith('কু')) return 'কু';
  const firstChar = trimmed.charAt(0);
  const secondChar = trimmed.charAt(1);
  if (secondChar && /[\u09BE-\u09CD]/.test(secondChar)) {
    return firstChar + secondChar;
  }
  return firstChar.toUpperCase();
};

export const Header: React.FC<HeaderProps> = ({ 
  currentCategory, 
  onNavigate, 
  onSearchClick, 
  onOpenDrawer,
  appConfig: propConfig,
  onBack
}) => {
  const { user, openAuthModal } = useAuth();
  const { themeConfig } = useAdminConfig();
  const config = propConfig || themeConfig;
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Enforce "আমার কুষ্টিয়া" as the official app name
  const rawAppName = 'আমার কুষ্টিয়া';
  const firstNamePart = 'আমার';
  const secondNamePart = 'কুষ্টিয়া';

  // Sync real-time unread notifications count for bell badge
  useEffect(() => {
    const getReadIds = (): Set<string> => {
      try {
        const raw = localStorage.getItem(READ_NOTIFICATIONS_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
      } catch {
        return new Set();
      }
    };

    const updateCount = (firestoreIds: string[] = []) => {
      const readIds = getReadIds();
      const localIds = getFlashAlerts().map(a => a.id);
      const allIds = Array.from(new Set([...firestoreIds, ...localIds]));
      const unread = allIds.filter(id => !readIds.has(id)).length;
      setUnreadCount(unread);
    };

    let latestFirestoreIds: string[] = [];

    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'emergency_broadcasts'), limit(25));
      unsubscribe = onSnapshot(q, (snapshot) => {
        latestFirestoreIds = snapshot.docs.map(doc => doc.id);
        updateCount(latestFirestoreIds);
      }, (err) => {
        console.warn('Header notification listener note:', err);
        updateCount();
      });
    } catch {
      updateCount();
    }

    const handleReadUpdate = () => updateCount(latestFirestoreIds);
    window.addEventListener('kushtia-notification-read-updated', handleReadUpdate);
    window.addEventListener('kushtia-flash-alert-updated', handleReadUpdate);
    window.addEventListener('kushtia-broadcast-updated', handleReadUpdate);
    window.addEventListener('storage', handleReadUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('kushtia-notification-read-updated', handleReadUpdate);
      window.removeEventListener('kushtia-flash-alert-updated', handleReadUpdate);
      window.removeEventListener('kushtia-broadcast-updated', handleReadUpdate);
      window.removeEventListener('storage', handleReadUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200/80 shadow-xs transition-colors w-full overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
        {/* Left Section: Back / Menu & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 mr-2">
          {currentCategory !== 'home' && onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 text-slate-800 bg-slate-100/90 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-2xs shrink-0"
              title="পূর্ববর্তী পেজে ফিরে যান"
              aria-label="আগের পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-800 stroke-[2.5]" />
            </button>
          )}

          <button
            onClick={onOpenDrawer}
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer group min-w-0"
          >
            <img src="/assets/logo.svg" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform" />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-950 font-['Hind_Siliguri',sans-serif] truncate">
                  {firstNamePart}{' '}
                  {secondNamePart && (
                    <span className="text-pink-600 font-black">{secondNamePart}</span>
                  )}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-pulse shrink-0"></span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-none tracking-tight truncate max-w-[130px] xs:max-w-[170px] sm:max-w-xs">
                {config?.tagline || 'ডিজিটাল সার্ভিস পোর্টাল 🌿'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Icons: Notifications & Search */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger Button - Always fully visible on mobile & desktop */}
          <button
            onClick={() => onNavigate('search')}
            className="h-9 px-2.5 sm:px-3.5 rounded-full sm:rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-pink-500/30 ring-2 ring-pink-200 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer gap-1.5"
            title="যেকোনো তথ্য বা সেবা খুঁজুন"
            aria-label="অনুসন্ধান করুন"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span className="text-[11px] sm:text-xs font-black tracking-tight">খুঁজুন</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('notifications')}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-700 flex items-center justify-center transition-colors relative shrink-0"
            title="শহরের বিজ্ঞপ্তি"
            aria-label="নোটিফিকেশন"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
