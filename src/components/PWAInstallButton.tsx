import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Info, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <div className="mx-4 my-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
          <Download className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">আমার কুষ্টিয়া অ্যাপ ইন্সটল করুন</p>
            <p className="opacity-90">অফলাইন সাপোর্ট ও দ্রুত এক্সেস পেতে</p>
          </div>
        </div>
        <button
          onClick={install}
          className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap"
        >
          ইন্সটল করুন
        </button>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <div className="mx-4 my-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Info className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">অ্যাপ হিসেবে ইন্সটল করুন</p>
              <p className="opacity-90">আপনার আইফোনের হোম স্ক্রিনে যোগ করুন</p>
            </div>
          </div>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap"
          >
            কীভাবে?
          </button>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">আইফোনে ইন্সটল করার নিয়ম</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                1. সাফারি (Safari) ব্রাউজারের নিচের দিকে থাকা <strong>Share</strong> (শেয়ার) আইকনে ক্লিক করুন।<br /><br />
                2. একটু নিচে স্ক্রোল করে <strong>Add to Home Screen</strong> অপশনটি বেছে নিন।
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 py-2.5 text-sm font-bold text-slate-800 dark:text-white transition"
              >
                বুঝতে পেরেছি
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
