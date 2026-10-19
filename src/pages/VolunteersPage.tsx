import React from 'react';
import { Users, Phone, ShieldCheck, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { Volunteer } from '../types';

import { useAdminConfig } from '../context/AdminConfigContext';

export const VolunteersPage: React.FC = () => {
  const { volunteers, themeConfig } = useAdminConfig();

  const handleWhatsApp = (number: string) => {
    window.open(`https://wa.me/+88${number}`, '_blank');
  };

  const handleJoinWhatsApp = () => {
    const number = themeConfig.volunteerContactNumber || '01700000000';
    window.open(`https://wa.me/+88${number}?text=আমি সেচ্ছাসেবী হিসেবে যোগ দিতে চাই।`, '_blank');
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-200/80/60 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4 shadow-inner">
            <Heart className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">আমাদের সেচ্ছাসেবীবৃন্দ</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
            কুষ্টিয়া শহরের উন্নয়নে এবং মানুষের বিপদে যারা নিঃস্বার্থভাবে কাজ করে যাচ্ছেন। আপনিও আমাদের সাথে যোগ দিতে পারেন।
          </p>
          
          <button 
            onClick={handleJoinWhatsApp}
            className="mt-6 py-3 px-8 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
          >
            <Users className="w-4 h-4" />
            সেচ্ছাসেবী হিসেবে যোগ দিন
          </button>
        </div>
      </div>

      {/* Volunteer List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {volunteers.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-pink-200/80 dark:border-slate-800">
             <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <p className="text-xs font-bold text-slate-400">বর্তমানে কোনো সেচ্ছাসেবী তালিকাভুক্ত নেই।</p>
          </div>
        ) : (
          volunteers.map((volunteer) => (
            <div 
              key={volunteer.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-pink-100 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-200 dark:hover:border-emerald-900/40 transition-all group shadow-sm"
            >
              <div className="relative shrink-0">
                <img 
                  src={volunteer.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + volunteer.id} 
                  alt={volunteer.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform"
                />
                {volunteer.isVerified && (
                  <div className="absolute -right-1 -bottom-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50 dark:fill-emerald-950/40" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate flex items-center gap-1.5">
                  {volunteer.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {volunteer.address || 'কুষ্টিয়া'}
                </p>
                
                <div className="mt-3 flex items-center gap-2">
                  <button 
                    onClick={() => handleWhatsApp(volunteer.whatsapp)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.location.href = `tel:${volunteer.whatsapp}`}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-pink-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    কল করুন
                  </button>
                </div>
              </div>
              
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Community Info */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white text-center">
        <h4 className="text-sm font-black mb-1">আমাদের কমিউনিটি</h4>
        <p className="text-[11px] text-slate-400 font-medium">
          বর্তমানে আমাদের আমার কুষ্টিয়া টিমে {volunteers.length} জন সক্রিয় সেচ্ছাসেবী রয়েছেন।
        </p>
      </div>
    </div>
  );
};
