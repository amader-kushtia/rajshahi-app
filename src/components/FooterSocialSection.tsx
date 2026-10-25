import React from 'react';
import { 
  Facebook, 
  Youtube, 
  Instagram, 
  Globe, 
  ExternalLink, 
  Share2, 
  Users,
  Video
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';

export const FooterSocialSection: React.FC = () => {
  const { themeConfig } = useAdminConfig();

  const socials = [
    {
      key: 'facebookPage',
      label: 'ফেসবুক পেজ',
      url: themeConfig.socialFacebookPageUrl,
      isActive: themeConfig.isSocialFacebookPageActive,
      icon: Facebook,
      bg: 'bg-[#1877F2] hover:bg-[#166fe5]',
      shadow: 'shadow-[#1877F2]/20',
      badge: 'লাইক দিন'
    },
    {
      key: 'facebookGroup',
      label: 'ফেসবুক গ্রুপ',
      url: themeConfig.socialFacebookGroupUrl,
      isActive: themeConfig.isSocialFacebookGroupActive,
      icon: Users,
      bg: 'bg-[#0084FF] hover:bg-[#0077e6]',
      shadow: 'shadow-[#0084FF]/20',
      badge: 'যুক্ত হোন'
    },
    {
      key: 'youtube',
      label: 'ইউটিউব',
      url: themeConfig.socialYoutubeUrl,
      isActive: themeConfig.isSocialYoutubeActive,
      icon: Youtube,
      bg: 'bg-[#FF0000] hover:bg-[#e60000]',
      shadow: 'shadow-[#FF0000]/20',
      badge: 'সাবস্ক্রাইব'
    },
    {
      key: 'tiktok',
      label: 'টিকটক',
      url: themeConfig.socialTiktokUrl,
      isActive: themeConfig.isSocialTiktokActive,
      icon: Video,
      bg: 'bg-slate-900 hover:bg-black',
      shadow: 'shadow-black/20',
      badge: 'ফলো করুন'
    },
    {
      key: 'instagram',
      label: 'ইনস্টাগ্রাম',
      url: themeConfig.socialInstagramUrl,
      isActive: themeConfig.isSocialInstagramActive,
      icon: Instagram,
      bg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95',
      shadow: 'shadow-pink-500/20',
      badge: 'ফলো করুন'
    },
    {
      key: 'website',
      label: 'ওয়েবসাইট',
      url: themeConfig.socialWebsiteUrl,
      isActive: themeConfig.isSocialWebsiteActive,
      icon: Globe,
      bg: 'bg-emerald-600 hover:bg-emerald-700',
      shadow: 'shadow-emerald-600/20',
      badge: 'ভিজিট করুন'
    },
  ].filter(s => s.isActive && s.url && s.url.trim() !== '');

  if (socials.length === 0) return null;

  return (
    <footer className="w-full bg-slate-950 text-white pt-6 pb-4 px-4 mt-8 rounded-t-[2.5rem] border-t border-emerald-500/20 shadow-2xl relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-emerald-500/10 blur-2xl rounded-full"></div>

      <div className="max-w-xl mx-auto space-y-5 relative z-10">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>আমাদের সাথে যুক্ত থাকুন</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            সর্বশেষ আপডেট ও জরুরি তথ্য পেতে জয়েন করুন
          </p>
        </div>

        {/* Compact Social Grid */}
        <div className="grid grid-cols-3 gap-2">
          {socials.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-black leading-none">{item.label}</span>
                  <span className="text-[8px] text-slate-500 font-bold leading-none mt-1 group-hover:text-emerald-400 transition-colors">{item.badge}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Minimal Footer Info */}
        <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            <span>© {new Date().getFullYear()}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>{themeConfig.appName || 'আমার কুষ্টিয়া'}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>সর্বস্বত্ব সংরক্ষিত</span>
          </div>
          
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] font-black text-emerald-400 tracking-wide uppercase">ডিজিটাল কুষ্টিয়া গড়ার প্রত্যয়ে</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

