import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminConfig } from '../context/AdminConfigContext';
import { Sparkles, MapPin, Search } from 'lucide-react';

interface GreetingBannerProps {
  onSearchClick?: () => void;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({ onSearchClick }) => {
  const { user } = useAuth();
  const { themeConfig } = useAdminConfig();

  const userName = user?.displayName ? (user.displayName.split(' ')[0]) : 'সম্মানিত নাগরিক';
  const cityName = themeConfig?.cityName || 'কুষ্টিয়া জেলা';
  const appName = 'আমার কুষ্টিয়া';

  return (
    <div className="pt-2 pb-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-0.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {cityName}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Hello, {userName}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
            Stay connected, stay ahead 🌱
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{appName}</span>
        </div>
      </div>

      {/* Prominent Search Bar for mobile-first visibility */}
      <div 
        onClick={onSearchClick}
        className="mt-4 relative group cursor-pointer active:scale-98 transition-all"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
        </div>
        <div className="w-full bg-white dark:bg-slate-900 border-2 border-pink-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700 py-3 pl-11 pr-4 rounded-2xl shadow-xs text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-bold flex items-center transition-all">
          কি খুঁজছেন? (যেমন: বাসা ভাড়া, ডাক্তার...)
        </div>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm">
            খুঁজুন
          </div>
        </div>
      </div>
    </div>
  );
};
