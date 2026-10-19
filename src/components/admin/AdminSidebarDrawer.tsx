import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  Search,
  FileText, 
  Sparkles, 
  Users, 
  Settings, 
  Image as ImageIcon, 
  Eye, 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  Radio, 
  Bell, 
  PhoneCall, 
  Palette, 
  KeyRound, 
  ChevronRight,
  Database,
  ExternalLink,
  Smartphone,
  Stethoscope,
  ShieldAlert,
  Droplet,
  Download,
  BarChart3,
  Server,
  Train,
  Heart,
  Wallet
} from 'lucide-react';
import { AppThemeConfig } from '../../types';

export type AdminTabType = 
  | 'overview' 
  | 'search'
  | 'posts' 
  | 'secret-reports'
  | 'analytics'
  | 'system-health'
  | 'broadcast' 
  | 'push'
  | 'directory' 
  | 'transport'
  | 'grievance' 
  | 'blood' 
  | 'export' 
  | 'sponsored' 
  | 'users' 
  | 'admins'
  | 'settings'
  | 'support'
  | 'logs'
  | 'volunteers'
  | 'payment'
  | 'home-banner';

interface AdminSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  onOpenCitizenPreview: () => void;
  onOpenCreatePost: () => void;
  onOpenSponsoredPictureUpload: () => void;
  onLogout: () => void;
  onExitToCitizenApp?: () => void;
  postsCount: number;
  secretReportsCount?: number;
  pendingSecretReportsCount?: number;
  sponsoredCount: number;
  activeSponsoredCount: number;
  usersCount: number;
  appTheme: AppThemeConfig;
}

export const AdminSidebarDrawer: React.FC<AdminSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenCitizenPreview,
  onOpenCreatePost,
  onOpenSponsoredPictureUpload,
  onLogout,
  onExitToCitizenApp,
  postsCount,
  secretReportsCount = 0,
  pendingSecretReportsCount = 0,
  sponsoredCount,
  activeSponsoredCount,
  usersCount,
  appTheme
}) => {
  if (!isOpen) return null;

  const handleTabClick = (tab: AdminTabType) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel (Left-side three-line menu panel) */}
      <aside 
        className="relative z-10 w-80 sm:w-96 max-w-[88vw] h-full bg-white text-slate-800 flex flex-col shadow-2xl border-r border-pink-200/80 animate-in slide-in-from-left duration-200"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-pink-200/80 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-900">{(appTheme.appName && appTheme.appName !== 'আমার কুষ্টিয়া') ? appTheme.appName : 'আমার কুষ্টিয়া'}</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">অ্যাডমিন কন্ট্রোল সেন্টার</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="মেনু বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Section: ড্যাশবোর্ড ও অ্যানালিটিক্স */}
          <div className="space-y-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-3 pb-1">
              ড্যাশবোর্ড ও রিপোর্টস
            </div>

            {/* Overview */}
            <button
              onClick={() => handleTabClick('overview')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>ওভারভিউ ও ড্যাশবোর্ড</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Global Search Page */}
            <button
              onClick={() => handleTabClick('search')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className={`w-4 h-4 ${activeTab === 'search' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>গ্লোবাল সার্চ ও এক্সপ্লোরার</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'search' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                Ctrl+K
              </span>
            </button>

            {/* Analytics */}
            <button
              onClick={() => handleTabClick('analytics')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>অ্যানালিটিক্স ও চার্ট</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* System Health */}
            <button
              onClick={() => handleTabClick('system-health')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'system-health'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Server className={`w-4 h-4 ${activeTab === 'system-health' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>সিস্টেম হেলথ ও সার্ভার</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'system-health' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Payment History */}
            <button
              onClick={() => handleTabClick('payment')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'payment'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className={`w-4 h-4 ${activeTab === 'payment' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>পেমেন্ট ও ট্রানজেকশন হিস্ট্রি</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'payment' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* Section: মডারেশন ও আইন-শৃঙ্খলা */}
          <div className="space-y-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-3 pb-1">
              মডারেশন ও আইন-শৃঙ্খলা
            </div>

            {/* Posts */}
            <button
              onClick={() => handleTabClick('posts')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'posts'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className={`w-4 h-4 ${activeTab === 'posts' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>পোস্ট ও বিজ্ঞাপন মডারেশন</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'posts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-pink-200/80'}`}>
                {postsCount}
              </span>
            </button>

            {/* Secret Crime Reports */}
            <button
              onClick={() => handleTabClick('secret-reports')}
              className={`w-full p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${
                activeTab === 'secret-reports'
                  ? 'bg-red-950 text-white border border-red-800 shadow-xs'
                  : 'text-slate-700 hover:bg-red-50/60 hover:text-red-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className={`w-4 h-4 ${activeTab === 'secret-reports' ? 'text-red-400' : 'text-red-600 group-hover:text-red-700'}`} />
                <span>গোপন তথ্য ও ক্রাইম ডেস্ক</span>
              </div>
              <div className="flex items-center gap-1.5">
                {pendingSecretReportsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                )}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'secret-reports' ? 'bg-white/10 text-white' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {secretReportsCount}
                </span>
              </div>
            </button>

            {/* Volunteer Management */}
            <button
              onClick={() => handleTabClick('volunteers')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'volunteers'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className={`w-4 h-4 ${activeTab === 'volunteers' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>সেচ্ছাসেবী ম্যানেজমেন্ট</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'volunteers' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Grievance Desk */}
            <button
              onClick={() => handleTabClick('grievance')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'grievance'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className={`w-4 h-4 ${activeTab === 'grievance' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>নাগরিক অভিযোগ ডেস্ক</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'grievance' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* Section: সিটিজেন ও লাইভ সার্ভিস */}
          <div className="space-y-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-3 pb-1">
              সিটিজেন ও লাইভ সার্ভিস
            </div>

            {/* Emergency Notice */}
            <button
              onClick={() => handleTabClick('broadcast')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'broadcast'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className={`w-4 h-4 ${activeTab === 'broadcast' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>জরুরি সাইরেন ব্রডকাস্ট</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'broadcast' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Push Notification */}
            <button
              onClick={() => handleTabClick('push')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'push'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className={`w-4 h-4 ${activeTab === 'push' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>তাত্ক্ষণিক পুশ নোটিফিকেশন</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'push' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Blood Services */}
            <button
              onClick={() => handleTabClick('blood')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'blood'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Droplet className={`w-4 h-4 ${activeTab === 'blood' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>রক্তদাতা ও রক্তের ডাক</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'blood' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Transport Schedules */}
            <button
              onClick={() => handleTabClick('transport')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'transport'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Train className={`w-4 h-4 ${activeTab === 'transport' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>যাতায়াত ও সময়সূচী</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'transport' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Doctor Helplines */}
            <button
              onClick={() => handleTabClick('directory')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'directory'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Stethoscope className={`w-4 h-4 ${activeTab === 'directory' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>ডাক্তার ও হেল্পলাইন ডিরেক্টরি</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'directory' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* Section: বিপণন ও মেম্বারস */}
          <div className="space-y-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-3 pb-1">
              বিজ্ঞাপন ও মেম্বারস
            </div>

            {/* Sponsored ads */}
            <button
              onClick={() => handleTabClick('sponsored')}
              className={`w-full p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${
                activeTab === 'sponsored'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`w-4 h-4 ${activeTab === 'sponsored' ? 'text-slate-950' : 'text-amber-500'}`} />
                <span>স্পন্সরড বিজ্ঞাপন ও ছবি</span>
              </div>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'sponsored' ? 'bg-slate-950/10 text-slate-950' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                {sponsoredCount}
              </span>
            </button>

            {/* Home Banner Management */}
            <button
              onClick={() => handleTabClick('home-banner')}
              className={`w-full p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${
                activeTab === 'home-banner'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className={`w-4 h-4 ${activeTab === 'home-banner' ? 'text-white' : 'text-emerald-600'}`} />
                <span>এড হোম পেজ ব্যানার</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'home-banner' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Users */}
            <button
              onClick={() => handleTabClick('users')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'users'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>ইউজার ও নাগরিক মেম্বারস</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-pink-200/80'}`}>
                {usersCount}
              </span>
            </button>
          </div>

          {/* Section:システム ও সেটিংস */}
          <div className="space-y-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-3 pb-1">
              সিস্টেম ও কনফিগারেশন
            </div>

            {/* Data Export */}
            <button
              onClick={() => handleTabClick('export')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'export'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Download className={`w-4 h-4 ${activeTab === 'export' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>ডেটা এক্সপোর্ট ও ব্যাকআপ</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'export' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Security */}
            <button
              onClick={() => handleTabClick('admins')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'admins'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className={`w-4 h-4 ${activeTab === 'admins' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>অ্যাডমিন ও সিকিউরিটি</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'admins' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Settings */}
            <button
              onClick={() => handleTabClick('settings')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>সিস্টেম সেটিংস ও থিম</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* Support Configuration */}
            <button
              onClick={() => handleTabClick('support')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'support'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className={`w-4 h-4 ${activeTab === 'support' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>সাপোর্ট ও হেল্পলাইন</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'support' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* System Audit Log */}
            <button
              onClick={() => handleTabClick('logs')}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                activeTab === 'logs'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className={`w-4 h-4 ${activeTab === 'logs' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                <span>সিস্টেম অডিট লগ</span>
              </div>
              <ChevronRight className={`w-3 h-3 ${activeTab === 'logs' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3">
              কুইক অ্যাকশন শর্টকাট
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80 space-y-1.5 shadow-xs">
              {/* Add Sponsored Picture Shortcut */}
              <button
                onClick={() => {
                  onOpenSponsoredPictureUpload();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-2.5 transition-colors border border-amber-200 text-left"
              >
                <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">স্পন্সরড পিকচার এড করুন</div>
                  <div className="text-[10px] text-amber-700/80 font-normal">ছবি আপলোড ও গ্যালারি</div>
                </div>
              </button>

              {/* Create Post */}
              <button
                onClick={() => {
                  onOpenCreatePost();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2.5 transition-colors text-left border border-pink-200/80"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">নতুন পোস্ট প্রকাশ করুন</div>
                  <div className="text-[10px] text-slate-500 font-normal">সরাসরি নোটিশ বা বিজ্ঞাপন</div>
                </div>
              </button>

              {/* Citizen App Live Preview */}
              <button
                onClick={() => {
                  onOpenCitizenPreview();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2.5 transition-colors text-left border border-emerald-200"
              >
                <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate">সিটিজেন ভিউ লাইভ প্রিভিউ</div>
                  <div className="text-[10px] text-slate-500 font-normal">নাগরিকরা যেমন দেখছেন</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-pink-200/80 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onExitToCitizenApp?.();
              onClose();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 text-xs font-black shadow-xs shadow-emerald-500/30"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ইউজার অ্যাপ</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors flex items-center gap-1.5 text-xs font-black border border-rose-200"
            title="লক করুন"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );
};
