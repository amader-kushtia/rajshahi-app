import React from 'react';
import { ShieldCheck, Eye, Radio, Sparkles, Menu, Image as ImageIcon, Search } from 'lucide-react';
import { AppThemeConfig } from '../../types';

interface AdminHeaderProps {
  appTheme: AppThemeConfig;
  activeTab?: string;
  onToggleMenu: () => void;
  onOpenSearch?: () => void;
  onOpenAppPreview: () => void;
  onOpenSponsoredPictureUpload?: () => void;
  onSwitchToCitizenApp?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  appTheme,
  activeTab,
  onToggleMenu,
  onOpenSearch,
  onOpenAppPreview,
  onOpenSponsoredPictureUpload,
  onSwitchToCitizenApp
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200/80/80 shadow-xs px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: 3-Line Menu Button & Branding */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMenu}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 active:scale-95 text-slate-800 hover:text-emerald-800 transition-all border border-pink-200/80/80 shadow-xs flex items-center justify-center group cursor-pointer"
            title="থ্রি লাইন মেনু খুলুন"
            aria-label="Toggle Admin Navigation Menu"
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-base font-black text-slate-900 leading-none truncate max-w-[120px] sm:max-w-none">
                  আমার কুষ্টিয়া
                </h1>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 hidden xs:inline-block">
                  অ্যাডমিন
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 hidden lg:block">
                মাস্টার ম্যানেজমেন্ট পোর্টাল
              </p>
            </div>
          </div>
        </div>

        {/* Center: Prominent Admin Global Search Bar Input Trigger */}
        {onOpenSearch && (
          <div 
            onClick={onOpenSearch}
            className="flex-1 max-w-md mx-1 sm:mx-3 relative cursor-pointer group"
            title="অ্যাডমিন গ্লোবাল সার্চ পেজ - Ctrl+K"
          >
            <div className={`w-full py-2.5 px-4 sm:px-5 border-2 rounded-2xl text-xs font-medium flex items-center justify-between shadow-md transition-all ${
              activeTab === 'search'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-50 border-pink-200 group-hover:border-emerald-500'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <Search className={`w-4 h-4 shrink-0 transition-transform ${
                  activeTab === 'search' ? 'text-emerald-700 scale-110 font-bold' : 'text-emerald-600 group-hover:scale-110'
                }`} />
                <span className={`truncate text-[11px] sm:text-xs font-semibold ${
                  activeTab === 'search' ? 'text-emerald-950 font-bold' : 'text-slate-600'
                }`}>
                  {activeTab === 'search' ? 'সার্চ পেজে আছেন — টাইপ করুন...' : 'যেকোনো কিছু সার্চ করুন (পোস্ট, ইউজার, নোটিশ)...'}
                </span>
              </div>
              <span className={`hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border shadow-2xs ${
                activeTab === 'search'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-slate-500 border-pink-200/80'
              }`}>
                Ctrl+K
              </span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="px-2.5 py-1.5 sm:hidden rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm border border-emerald-600 cursor-pointer active:scale-95 transition-all"
              title="অ্যাডমিন সার্চ করুন"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>সার্চ</span>
            </button>
          )}

          {/* Sponsored Picture Shortcut */}
          {onOpenSponsoredPictureUpload && (
            <button
              onClick={onOpenSponsoredPictureUpload}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 active:scale-98 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="স্পন্সরড পিকচার যুক্ত করুন"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>পিকচার এড</span>
            </button>
          )}

          {onSwitchToCitizenApp && (
            <button
              onClick={onSwitchToCitizenApp}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="ইউজার/নাগরিক অ্যাপে সুইচ করুন"
            >
              <span className="hidden sm:inline">সিটিজেন অ্যাপ</span>
              <span className="sm:hidden text-[11px]">ইউজার</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
