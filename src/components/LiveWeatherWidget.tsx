import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  RefreshCw, 
  MapPin, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  CloudFog, 
  Eye,
  Activity,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface WeatherAqiData {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  condition: string;
  description: string;
  iconCode: string;
  aqi: number;
  pm25: number;
  pm10: number;
  lastUpdated: string;
}

const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
};

const getAqiDetails = (aqi: number) => {
  if (aqi <= 50) {
    return { label: 'ভালো (Good)', color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40', barColor: 'bg-emerald-400' };
  }
  if (aqi <= 100) {
    return { label: 'সহনীয় (Moderate)', color: 'bg-amber-500/20 text-amber-200 border-amber-400/40', barColor: 'bg-amber-400' };
  }
  if (aqi <= 150) {
    return { label: 'সংবেদনশীলদের জন্য ঝুঁকিপূর্ণ', color: 'bg-orange-500/20 text-orange-200 border-orange-400/40', barColor: 'bg-orange-400' };
  }
  if (aqi <= 200) {
    return { label: 'অস্বাস্থ্যকর (Unhealthy)', color: 'bg-rose-500/20 text-rose-200 border-rose-400/40', barColor: 'bg-rose-500' };
  }
  return { label: 'খুবই অস্বাস্থ্যকর (Very Unhealthy)', color: 'bg-purple-500/20 text-purple-200 border-purple-400/40', barColor: 'bg-purple-500' };
};

const getWeatherDetails = (conditionCode: string, mainGroup: string, originalDesc: string) => {
  const group = (mainGroup || '').toLowerCase();
  
  if (group.includes('thunderstorm')) {
    return {
      title: 'বজ্রবৃষ্টি',
      desc: originalDesc || 'বজ্রসহ বৃষ্টিপাতের সম্ভাবনা রয়েছে',
      icon: CloudLightning,
      bgGradient: 'from-indigo-900 via-slate-900 to-blue-950',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30'
    };
  }
  if (group.includes('rain') || group.includes('drizzle')) {
    return {
      title: 'বৃষ্টিপাত',
      desc: originalDesc || 'হালকা থেকে মাঝারি বৃষ্টিপাত হচ্ছে',
      icon: CloudRain,
      bgGradient: 'from-blue-900 via-teal-950 to-slate-900',
      accentColor: 'text-sky-300',
      badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-500/30'
    };
  }
  if (group.includes('clear')) {
    return {
      title: 'পরিষ্কার আকাশ',
      desc: originalDesc || 'রৌদ্রোজ্জ্বল ও মনোরম আবহাওয়া',
      icon: Sun,
      bgGradient: 'from-sky-800 via-teal-900 to-emerald-950',
      accentColor: 'text-amber-300',
      badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/30'
    };
  }
  if (group.includes('fog') || group.includes('mist') || group.includes('haze')) {
    return {
      title: 'কুয়াশাচ্ছন্ন / ধোঁয়াশা',
      desc: originalDesc || 'হালকা কুয়াশা ও আর্দ্র আবহাওয়া',
      icon: CloudFog,
      bgGradient: 'from-slate-800 via-teal-950 to-zinc-900',
      accentColor: 'text-teal-300',
      badgeBg: 'bg-teal-400/20 text-teal-200 border-teal-400/30'
    };
  }
  
  return {
    title: 'আংশিক মেঘলা',
    desc: originalDesc || 'আকাশে মেঘের আনাগোনা রয়েছে',
    icon: CloudSun,
    bgGradient: 'from-slate-900 via-emerald-950 to-teal-950',
    accentColor: 'text-amber-300',
    badgeBg: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
  };
};

const mapWmoToWeather = (code: number) => {
  if (code === 0) return { condition: 'Clear', description: 'পরিষ্কার আকাশ', iconCode: '01d' };
  if ([1, 2, 3].includes(code)) return { condition: 'Clouds', description: 'আংশিক মেঘলা', iconCode: '02d' };
  if ([45, 48].includes(code)) return { condition: 'Fog', description: 'কুয়াশাচ্ছন্ন আবহাওয়া', iconCode: '50d' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Drizzle', description: 'গুঁড়ি গুঁড়ি বৃষ্টি', iconCode: '09d' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { condition: 'Rain', description: 'বৃষ্টিপাত হচ্ছে', iconCode: '10d' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', description: 'বজ্রসহ বৃষ্টিপাত', iconCode: '11d' };
  return { condition: 'Clouds', description: 'আংশিক মেঘলা', iconCode: '03d' };
};

export const LiveWeatherWidget: React.FC = () => {
  const [data, setData] = useState<WeatherAqiData | null>(() => {
    try {
      const cached = localStorage.getItem('kushtia_weather_aqi_v2');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {
      temp: 29,
      feelsLike: 32,
      tempMin: 25,
      tempMax: 33,
      humidity: 65,
      windSpeed: 14,
      pressure: 1011,
      visibility: 9,
      condition: 'Clear',
      description: 'রৌদ্রোজ্জ্বল ও মনোরম আবহাওয়া',
      iconCode: '01d',
      aqi: 48,
      pm25: 14.2,
      pm10: 28.5,
      lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWeatherAndAqi = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parallel fetch for Open-Meteo Weather and Air Quality for Kushtia (23.9015, 89.1205)
      const [weatherRes, aqiRes] = await Promise.all([
        fetch('https://api.open-meteo.com/v1/forecast?latitude=23.9015&longitude=89.1205&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto'),
        fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=23.9015&longitude=89.1205&current=european_aqi,pm2_5,pm10')
      ]);

      if (!weatherRes.ok) throw new Error('Weather fetch failed');
      const weatherJson = await weatherRes.json();
      const current = weatherJson.current;
      const daily = weatherJson.daily;
      const mapped = mapWmoToWeather(current.weather_code);

      let aqiVal = 48;
      let pm25Val = 14.2;
      let pm10Val = 28.5;

      if (aqiRes.ok) {
        const aqiJson = await aqiRes.json();
        if (aqiJson.current) {
          aqiVal = Math.round(aqiJson.current.european_aqi || 48);
          pm25Val = Number((aqiJson.current.pm2_5 || 14.2).toFixed(1));
          pm10Val = Number((aqiJson.current.pm10 || 28.5).toFixed(1));
        }
      }

      const updated: WeatherAqiData = {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        tempMin: Math.round(daily.temperature_2m_min[0]),
        tempMax: Math.round(daily.temperature_2m_max[0]),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        pressure: Math.round(current.surface_pressure),
        visibility: 10,
        condition: mapped.condition,
        description: mapped.description,
        iconCode: mapped.iconCode,
        aqi: aqiVal,
        pm25: pm25Val,
        pm10: pm10Val,
        lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setData(updated);
      try {
        localStorage.setItem('kushtia_weather_aqi_v2', JSON.stringify(updated));
      } catch {}
    } catch (err) {
      console.warn('Live weather/AQI fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherAndAqi();
    const interval = setInterval(fetchWeatherAndAqi, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeatherAndAqi]);

  if (!data) return null;

  const weatherStyle = getWeatherDetails(data.iconCode, data.condition, data.description);
  const IconComponent = weatherStyle.icon;
  const aqiInfo = getAqiDetails(data.aqi);

  return (
    <div className="px-3 sm:px-4 mb-5 animate-in fade-in duration-300">
      <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${weatherStyle.bgGradient} p-4 sm:p-5 text-white shadow-xl border border-white/20 transition-all`}>
        
        {/* Glowing Lighting Accents */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
                <MapPin className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">
                    কুষ্টিয়া আবহাওয়া ও বাতাস (Weather & AQI)
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-400/50">
                    রিয়েল-টাইম
                  </span>
                </div>
                <span className="text-[11px] text-amber-200 font-bold block mt-0.5">
                  আপডেট: {data.lastUpdated}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchWeatherAndAqi}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all backdrop-blur-md flex items-center gap-1.5 text-xs font-bold border border-white/20 shadow-sm cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>

          {/* Weather Main Showcase & AQI Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
            
            {/* Weather Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-md">
                  <IconComponent className={`w-8 h-8 sm:w-9 sm:h-9 ${weatherStyle.accentColor} animate-pulse`} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                      {toBengaliNumber(data.temp)}
                    </span>
                    <span className="text-xl font-black text-amber-300">°C</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${weatherStyle.badgeBg}`}>
                      {weatherStyle.title}
                    </span>
                    <span className="text-[11px] text-white/90 font-bold">
                      অনুভূত {toBengaliNumber(data.feelsLike)}°C
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right hidden xs:block">
                <span className="text-[11px] text-amber-200 font-bold block">
                  সর্বোচ্চ: {toBengaliNumber(data.tempMax)}°
                </span>
                <span className="text-[11px] text-sky-200 font-bold block mt-0.5">
                  সর্বনিম্ন: {toBengaliNumber(data.tempMin)}°
                </span>
              </div>
            </div>

            {/* AQI (Air Quality Index) Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs">
                  <Activity className="w-4 h-4 text-emerald-300" />
                  <span>বায়ুর মান (AQI Index)</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${aqiInfo.color}`}>
                  {aqiInfo.label}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {toBengaliNumber(data.aqi)}
                  </span>
                  <span className="text-xs text-white/80 font-bold">AQI</span>
                </div>
                <div className="text-right text-[11px] text-emerald-200 font-bold">
                  <div>PM2.5: {toBengaliNumber(data.pm25)}</div>
                  <div>PM10: {toBengaliNumber(data.pm10)}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Small Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 flex items-center gap-2 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-white/80 block font-bold">আর্দ্রতা</span>
                <span className="text-xs font-black text-amber-300 block">
                  {toBengaliNumber(data.humidity)}%
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 flex items-center gap-2 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center shrink-0">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-white/80 block font-bold">বাতাস</span>
                <span className="text-xs font-black text-amber-300 block truncate">
                  {toBengaliNumber(data.windSpeed)} কিমি/ঘ
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 flex items-center gap-2 border border-white/10">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-white/80 block font-bold">দৃশ্যমানতা</span>
                <span className="text-xs font-black text-amber-300 block">
                  {toBengaliNumber(data.visibility)} কিমি
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
