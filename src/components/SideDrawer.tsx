import React from 'react';
import { 
  User, FileText, Bookmark, Ghost, Bell, Compass, Code, HelpCircle, Shield, LogOut, X, PlusCircle, Share2, Users, Languages, Globe 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useLanguage } from '../context/LanguageContext';
import { CategoryType } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (category: CategoryType) => void;
  onOpenShareApp?: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, onNavigate, onOpenShareApp }) => {
  const { user, logOut, openAuthModal, isAdmin } = useAuth();
  const { themeConfig } = useAdminConfig();
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const handleNav = (category: CategoryType | 'close') => {
    onClose();
    if (category !== 'close') {
      onNavigate(category as CategoryType);
    }
  };

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        
        {/* Header Profile Section */}
        <div className="bg-emerald-900 p-5 pt-7 relative overflow-hidden shrink-0">
          <div className="text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>আমার কুষ্টিয়া</span>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-emerald-100 hover:text-white transition-colors z-20 p-2"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative z-10">
            {user ? (
              <div className="flex items-center gap-3">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt={user.displayName}
                  className="w-14 h-14 rounded-full border-2 border-emerald-400 object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ctext%20y%3D%22.9em%22%20font-size%3D%2290%22%3E%F0%9F%91%A4%3C%2Ftext%3E%3C%2Fsvg%3E`;
                  }}
                />
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{user.displayName}</h3>
                  <button 
                    onClick={() => handleNav('profile')}
                    className="text-emerald-200 text-xs mt-1 hover:text-white flex items-center gap-1"
                  >
                    এডিট প্রোফাইল
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-800 flex items-center justify-center border-2 border-emerald-400 text-emerald-200">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">অতিথি ব্যবহারকারী</h3>
                  <button 
                    onClick={() => { onClose(); openAuthModal(); }}
                    className="text-emerald-200 text-xs mt-1 hover:text-white font-medium"
                  >
                    লগইন করুন
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-800 rounded-full opacity-50 blur-2xl"></div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-3">
          <nav className="space-y-0.5 px-3">
            <button 
              onClick={() => handleNav('create-post')} 
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 transition-colors mb-2 font-bold text-sm border border-emerald-200/60 shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">নতুন পোস্ট করুন</span>
                <span className="text-[10px] text-emerald-700 font-normal block">শহরের মানুষের কাছে পৌঁছান</span>
              </div>
            </button>

            <button onClick={() => handleNav('profile')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-sm">আমার প্রোফাইল</span>
            </button>
            <button onClick={() => handleNav('profile')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <FileText className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-sm">আমার পোস্টসমূহ</span>
            </button>
            <button onClick={() => handleNav('saved-posts')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <Bookmark className="w-5 h-5 text-emerald-700" />
              <span className="font-medium text-sm">সংরক্ষিত পোস্ট</span>
            </button>
            <button onClick={() => handleNav('volunteers')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <Users className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-sm">আমাদের সেচ্ছাসেবীবৃন্দ</span>
            </button>

            <button onClick={() => handleNav('admin-panel')} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-sm transition-all shadow-md my-2 border border-emerald-700/60 active:scale-98">
              <Shield className="w-5 h-5 text-amber-300 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">অ্যাডমিন কন্ট্রোল প্যানেল</span>
                <span className="text-[10px] text-emerald-200 font-normal block">অ্যাপ কনফিগার ও পোস্ট ম্যানেজমেন্ট</span>
              </div>
            </button>
            
            <button 
              onClick={() => {
                onClose();
                if (onOpenShareApp) onOpenShareApp();
              }} 
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-800 transition-colors border border-emerald-100 shadow-sm"
            >
              <Share2 className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <span className="font-bold text-sm block leading-tight">অ্যাপটি শেয়ার করুন</span>
                <span className="text-[10px] text-emerald-600 font-medium block">ফেসবুক, হোয়াটসঅ্যাপ বা ইমুতে</span>
              </div>
            </button>
            
            <div className="h-px bg-slate-100 my-2 mx-3"></div>
            
            <button onClick={() => handleNav('crime-reporter')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <Ghost className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-sm">পরিচয় গোপন মোড</span>
            </button>
            <button onClick={() => handleNav('notifications')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-sm">নোটিফিকেশন সেটিংস</span>
            </button>
            <button onClick={() => handleNav('tourism')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-sm">সিটি ম্যাপ ও দর্শনীয় স্থান</span>
            </button>
            
            <div className="h-px bg-slate-100 my-2 mx-3"></div>
            
            {/* Developer profile link removed */}




            {/* Language Switcher */}
            <div className="px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 my-2.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 block leading-tight">{t('ভাষা নির্বাচন', 'Language')}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{t('বাংলা / English', 'Bangla / English')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    language === 'bn' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    language === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <button onClick={() => handleNav('help-support')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-sm">{t('সাহায্য ও সাপোর্ট', 'Help & Support')}</span>
            </button>
            <button onClick={() => handleNav('terms-privacy')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-sm">{t('শর্তাবলী ও গোপনীয়তা', 'Terms & Privacy')}</span>
            </button>

            <div className="pt-3 px-3 pb-1 text-center">
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                আমার কুষ্টিয়া • {themeConfig?.cityName || 'কুষ্টিয়া'}
              </p>
            </div>
          </nav>
        </div>

        {/* Footer / Logout */}
        {user && (
          <div className="p-4 border-t border-pink-100 bg-slate-50 shrink-0">
            <button 
              onClick={() => { logOut(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl font-bold text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
