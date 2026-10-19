import React, { useEffect, useState } from 'react';
import { Info, X, ShieldAlert, HeartHandshake } from 'lucide-react';

export const DemoNoticeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShow = () => setIsOpen(true);
    window.addEventListener('show-demo-notice', handleShow);
    return () => window.removeEventListener('show-demo-notice', handleShow);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-pink-200/80/50 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-5 flex flex-col items-center justify-center text-center relative border-b border-emerald-100 dark:border-emerald-800/50">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/50 hover:bg-white text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3">
            <Info className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            এটি একটি ডেমো পোস্ট
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-center">
          <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed font-['Noto_Serif_Bengali',serif]">
            এটি একটি ডেমো পোস্ট। অ্যাপের সৌন্দর্য বৃদ্ধি করার জন্য এই পোস্টটি অ্যাড করা হয়েছে।
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30">
            <div className="flex justify-center mb-2">
              <HeartHandshake className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed">
              আপনার কাছে যদি অরিজিনাল তথ্য থাকে তাহলে এডমিনকে দিয়ে হেল্প করবেন।
            </p>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            বুঝতে পেরেছি
          </button>
        </div>
      </div>
    </div>
  );
};
