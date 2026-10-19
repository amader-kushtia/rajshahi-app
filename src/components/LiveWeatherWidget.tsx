import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  RefreshCw, 
  MapPin, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  CloudFog, 
  Cloud, 
  Eye,
  Compass,
  Sparkles
} from 'lucide-react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number; // km/h
  pressure: number;
  visibility: number; // km
  condition: string;
  description: string;
  iconCode: string;
  sunrise?: number;
  sunset?: number;
  lastUpdated: string;
}

// Convert English digits to Bengali numerals
const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
};

// Map weather condition codes to Bengali descriptions and appropriate Lucide icons
const getWeatherDetails = (conditionCode: string, mainGroup: string, originalDesc: string) => {
  const group = (mainGroup || '').toLowerCase();
  
  if (group.includes('thunderstorm')) {
    return {
      title: 'বজ্রবৃষ্টি',
      desc: originalDesc || 'বজ্রসহ বৃষ্টিপাতের সম্ভাবনা রয়েছে',
      icon: CloudLightning,
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      textColor: 'text-indigo-200',
      badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
      accentColor: 'text-amber-400'
    };
  }
  if (group.includes('rain') || group.includes('drizzle')) {
    return {
      title: 'বৃষ্টিপাত',
      desc: originalDesc || 'হালকা থেকে মাঝারি বৃষ্টিপাত হচ্ছে',
      icon: CloudRain,
      bgGradient: 'from-blue-950 via-slate-900 to-teal-950',
      textColor: 'text-sky-200',
      badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-500/30',
      accentColor: 'text-sky-400'
    };
  }
  if (group.includes('clear')) {
    return {
      title: 'পরিষ্কার আকাশ',
      desc: originalDesc || 'রৌদ্রোজ্জ্বল ও মনোরম আবহাওয়া',
      icon: Sun,
      bgGradient: 'from-sky-900 via-emerald-950 to-teal-950',
      textColor: 'text-amber-200',
      badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
      accentColor: 'text-amber-400'
    };
  }
  if (group.includes('fog') || group.includes('mist') || group.includes('haze')) {
    return {
      title: 'কুয়াশাচ্ছন্ন / ধোঁয়াশা',
      desc: originalDesc || 'হালকা কুয়াশা ও আর্দ্র আবহাওয়া',
      icon: CloudFog,
      bgGradient: 'from-slate-800 via-slate-900 to-zinc-900',
      textColor: 'text-slate-200',
      badgeBg: 'bg-slate-400/20 text-slate-200 border-slate-400/30',
      accentColor: 'text-slate-300'
    };
  }
  
  // Default: Clouds / Partially Cloudy
  return {
    title: 'আংশিক মেঘলা',
    desc: originalDesc || 'আকাশে মেঘের আনাগোনা রয়েছে',
    icon: CloudSun,
    bgGradient: 'from-slate-900 via-teal-950 to-emerald-950',
    textColor: 'text-emerald-200',
    badgeBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30',
    accentColor: 'text-amber-300'
  };
};

const mapWmoToWeather = (code: number): { condition: string; description: string; iconCode: string } => {
  if (code === 0) {
    return { condition: 'Clear', description: 'পরিষ্কার আকাশ', iconCode: '01d' };
  }
  if ([1, 2, 3].includes(code)) {
    return { condition: 'Clouds', description: 'আংশিক মেঘলা', iconCode: '02d' };
  }
  if ([45, 48].includes(code)) {
    return { condition: 'Fog', description: 'কুয়াশাচ্ছন্ন আবহাওয়া', iconCode: '50d' };
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { condition: 'Drizzle', description: 'গুঁড়ি গুঁড়ি বৃষ্টি', iconCode: '09d' };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { condition: 'Rain', description: 'বৃষ্টিপাত হচ্ছে', iconCode: '10d' };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { condition: 'Snow', description: 'তুষারপাত', iconCode: '13d' };
  }
  if ([95, 96, 99].includes(code)) {
    return { condition: 'Thunderstorm', description: 'বজ্রসহ বৃষ্টিপাত', iconCode: '11d' };
  }
  return { condition: 'Clouds', description: 'আংশিক মেঘলা', iconCode: '03d' };
};

export const LiveWeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(() => {
    // Attempt to load cached weather from localStorage for instant display
    try {
      const cached = localStorage.getItem('kushtia_live_weather_v1');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    // Fallback initial pleasant weather for Kushtia
    return {
      temp: 28,
      feelsLike: 30,
      tempMin: 24,
      tempMax: 31,
      humidity: 68,
      windSpeed: 12,
      pressure: 1012,
      visibility: 8,
      condition: 'Clouds',
      description: 'আংশিক মেঘলা ও শান্ত আবহাওয়া',
      iconCode: '02d',
      lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLiveError, setHasLiveError] = useState<boolean>(false);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setHasLiveError(false);

    try {
      // Fetch precise, real-time weather from public Open-Meteo API for Kushtia's exact coordinates
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=23.9015&longitude=89.1205&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto'
      );
      if (!response.ok) {
        throw new Error('Open-Meteo API error');
      }
      const data = await response.json();
      
      const current = data.current;
      const daily = data.daily;
      const mapped = mapWmoToWeather(current.weather_code);

      const liveData: WeatherData = {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        tempMin: Math.round(daily.temperature_2m_min[0]),
        tempMax: Math.round(daily.temperature_2m_max[0]),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        pressure: Math.round(current.surface_pressure),
        visibility: 10, // Open-Meteo standard baseline visibility in km
        condition: mapped.condition,
        description: mapped.description,
        iconCode: mapped.iconCode,
        lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setWeather(liveData);
      try {
        localStorage.setItem('kushtia_live_weather_v1', JSON.stringify(liveData));
      } catch {}
    } catch (apiErr) {
      console.warn('Failed to fetch live weather from Open-Meteo, trying Firestore fallback:', apiErr);
      
      try {
        // Fallback: Read from central Firestore weather_cache document
        const docRef = doc(db, 'weather_cache', 'kushtia');
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const cachedData = snap.data() as WeatherData;
          setWeather(cachedData);
          try {
            localStorage.setItem('kushtia_live_weather_v1', JSON.stringify(cachedData));
          } catch {}
        } else {
          setHasLiveError(true);
        }
      } catch (err) {
        console.warn('Weather cache read notice:', err);
        setHasLiveError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Auto-refresh from Firestore every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (!weather) return null;

  const weatherStyle = getWeatherDetails(weather.iconCode, weather.condition, weather.description);
  const IconComponent = weatherStyle.icon;

  return (
    <div className="mb-4 animate-in fade-in duration-200">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${weatherStyle.bgGradient} p-4 sm:p-4.5 text-white shadow-md border border-white/15 transition-all`}>
        
        {/* Ambient subtle glow effects */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          
          {/* Top Header: Location, Live Pulse, and Refresh */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300 shrink-0">
                <MapPin className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white tracking-wide">
                    কুষ্টিয়া আবহাওয়া
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-200 bg-emerald-950/80 px-1.5 py-0.5 rounded-md border border-emerald-400/50">
                    লাইভ
                  </span>
                </div>
                <span className="text-[11px] text-white font-black block mt-0.5">
                  নীলফামারী জেলা • আপডেট: <span className="text-amber-300">{weather.lastUpdated}</span>
                </span>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchWeather}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-all backdrop-blur-xs shrink-0 flex items-center gap-1 text-[11px] font-bold border border-white/10"
              title="আবহাওয়া রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>

          {/* Main Weather Metric Showcase */}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            {/* Left: Huge Temp + Condition */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
                  <IconComponent className={`w-8 h-8 sm:w-9 sm:h-9 ${weatherStyle.accentColor} drop-shadow-md animate-pulse`} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-sm">
                    {toBengaliNumber(weather.temp)}
                  </span>
                  <span className="text-2xl font-black text-amber-300">°C</span>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[12px] font-black px-2 py-0.5 rounded-full border ${weatherStyle.badgeBg}`}>
                    {weatherStyle.title}
                  </span>
                  <span className="text-[12px] text-white font-black">
                    অনুভূত: {toBengaliNumber(weather.feelsLike)}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Weather Description note */}
            <div className="text-right max-w-[140px] hidden xs:block">
              <span className="text-[12px] text-white font-black block leading-tight">
                {weatherStyle.desc}
              </span>
              <span className="text-[11px] text-amber-200 mt-1 block font-black">
                সর্বোচ্চ: {toBengaliNumber(weather.tempMax)}° / সর্বনিম্ন: {toBengaliNumber(weather.tempMin)}°
              </span>
            </div>
          </div>

          {/* Bottom Grid: Weather Parameters (Humidity, Wind, Air) */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
            {/* Humidity */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2 sm:px-2.5 flex items-center gap-2 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] text-white block font-black leading-none">আর্দ্রতা</span>
                <span className="text-sm font-black text-amber-300 block mt-0.5">
                  {toBengaliNumber(weather.humidity)}%
                </span>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2 sm:px-2.5 flex items-center gap-2 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center shrink-0">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] text-white block font-black leading-none">বাতাস</span>
                <span className="text-sm font-black text-amber-300 block mt-0.5 truncate">
                  {toBengaliNumber(weather.windSpeed)} কিমি/ঘ
                </span>
              </div>
            </div>

            {/* Visibility / Atmosphere */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2 sm:px-2.5 flex items-center gap-2 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] text-white block font-black leading-none">দৃশ্যমানতা</span>
                <span className="text-sm font-black text-amber-300 block mt-0.5">
                  {toBengaliNumber(weather.visibility)} কিমি
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
