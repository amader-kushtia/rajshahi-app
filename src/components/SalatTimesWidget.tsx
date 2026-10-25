import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Sunrise, 
  Sun, 
  Cloudy, 
  Moon, 
  Sparkles,
  RefreshCw,
  Bell,
  Heart
} from 'lucide-react';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: string;
}

const toBengaliNumber = (num: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
};

const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'পিএম' : 'এএম';
  hour = hour % 12 || 12;
  return `${toBengaliNumber(hour.toString())}:${toBengaliNumber(minutes)} ${ampm}`;
};

export const SalatTimesWidget: React.FC = () => {
  const [timings, setTimings] = useState<PrayerTimes | null>(() => {
    try {
      const cached = localStorage.getItem('kushtia_salat_times');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    try {
      // API call for Kushtia, Bangladesh
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Kushtia&country=Bangladesh&method=1');
      const json = await response.json();
      if (json.code === 200 && json.data) {
        const data = json.data.timings;
        const result: PrayerTimes = {
          Fajr: data.Fajr,
          Sunrise: data.Sunrise,
          Dhuhr: data.Dhuhr,
          Asr: data.Asr,
          Maghrib: data.Maghrib,
          Isha: data.Isha,
          date: json.data.date.readable
        };
        setTimings(result);
        localStorage.setItem('kushtia_salat_times', JSON.stringify(result));
      }
    } catch (error) {
      console.error('Failed to fetch prayer times:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!timings) {
      fetchPrayerTimes();
    }
    // Auto refresh every day at midnight
    const now = new Date();
    const nextRefresh = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0);
    const msToWait = nextRefresh.getTime() - now.getTime();
    const timer = setTimeout(fetchPrayerTimes, msToWait);
    return () => clearTimeout(timer);
  }, [fetchPrayerTimes, timings]);

  if (!timings && !isLoading) return null;

  const prayerItems = [
    { name: 'ফজর', time: timings?.Fajr, icon: Sunrise, color: 'text-indigo-400' },
    { name: 'যোহর', time: timings?.Dhuhr, icon: Sun, color: 'text-amber-400' },
    { name: 'আসর', time: timings?.Asr, icon: Cloudy, color: 'text-orange-400' },
    { name: 'মাগরিব', time: timings?.Maghrib, icon: Moon, color: 'text-rose-400' },
    { name: 'এশা', time: timings?.Isha, icon: Sparkles, color: 'text-purple-400' },
  ];

  return (
    <div className="px-3 sm:px-4 mb-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-5 text-white shadow-2xl border border-white/10">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center text-indigo-300 border border-indigo-500/30">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  আজকের নামাজের সময়সূচী
                  <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full border border-indigo-400/30">কুষ্টিয়া</span>
                </h3>
                <p className="text-[10px] text-indigo-200/70 font-bold mt-0.5 uppercase tracking-wider">
                  {timings?.date || 'লোড হচ্ছে...'}
                </p>
              </div>
            </div>
            <button 
              onClick={fetchPrayerTimes}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white/70"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Times Grid */}
          <div className="grid grid-cols-5 gap-2">
            {prayerItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className={`w-full aspect-square rounded-2xl bg-white/5 backdrop-blur-xs border border-white/5 flex items-center justify-center shadow-inner group hover:bg-white/10 transition-all`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] sm:text-xs font-black text-white/90">{item.name}</span>
                    <span className="block text-[9px] sm:text-[10px] font-bold text-indigo-300 mt-0.5">
                      {item.time ? convertTo12Hour(item.time) : '--:--'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note Card */}
          <div className="mt-5 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <p className="text-[10px] sm:text-xs text-white/80 font-bold leading-tight">
              নামাজের সঠিক সময় ও ধর্মীয় তথ্যের জন্য কুষ্টিয়ার নির্ভরযোগ্য সূত্র থেকে যাচাই করে নিন।
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
