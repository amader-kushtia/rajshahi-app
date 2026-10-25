import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Menu, 
  CloudSun, 
  MapPin, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import kushtiaHeroImage from '../assets/images/kushtia_panoramic_hero.jpg';
import kushtiaSadarImg from '../assets/images/kushtia_sadar_real_1792162949613.jpg';
import kumarkhaliImg from '../assets/images/kumarkhali_real_1792162972148.jpg';
import bheramaraImg from '../assets/images/bheramara_real_1792162988221.jpg';
import mirpurImg from '../assets/images/mirpur_real_1792163005012.jpg';
import khoksaImg from '../assets/images/khoksa_real_1792163021767.jpg';
import daulatpurImg from '../assets/images/daulatpur_real_1792163040379.jpg';
import { 
  Monument3DIcon, 
  Restaurant3DIcon, 
  Shopping3DIcon, 
  Jobs3DIcon, 
  Transport3DIcon, 
  Hospital3DIcon, 
  Doctor3DIcon, 
  Emergency3DIcon, 
  House3DIcon, 
  News3DIcon, 
  Event3DIcon, 
  Services3DIcon 
} from './ThreeDIcons';

import { HomeCommunityFeed } from './HomeCommunityFeed';
import { DailyLocalNewsSection } from './DailyLocalNewsSection';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useThana } from '../context/ThanaContext';
import { useLanguage } from '../context/LanguageContext';
import { CategoryType, PostItem, UserProfile } from '../types';
import { AlertTriangle, Heart } from 'lucide-react';
import { LiveWeatherWidget } from './LiveWeatherWidget';
import { SalatTimesWidget } from './SalatTimesWidget';

interface KushtiaDashboardProps {
  onNavigate: (cat: CategoryType | string) => void;
  onOpenSearch?: () => void;
  onOpenDrawer?: () => void;
  onSelectPlace?: (placeId: string) => void;
  onSelectUpazila?: (upazilaId: string) => void;
  onPostClick?: (post: PostItem) => void;
  onOpenCreatePost?: (category?: CategoryType) => void;
  currentUser?: UserProfile | null;
}

export const KushtiaDashboard: React.FC<KushtiaDashboardProps> = ({ 
  onNavigate, 
  onOpenSearch, 
  onOpenDrawer,
  onSelectPlace,
  onSelectUpazila,
  onPostClick,
  onOpenCreatePost,
  currentUser
}) => {
  const { themeConfig } = useAdminConfig();
  const { selectedThana, setSelectedThana } = useThana();
  const { t } = useLanguage();
  const [showAllUpazilas, setShowAllUpazilas] = useState(false);

  // All 6 Upazilas of Kushtia District with Real Authentic Landmark Photos
  const allRegions = [
    { 
      id: 'kushtia-sadar', 
      name: t('কুষ্টিয়া সদর', 'Kushtia Sadar'), 
      img: kushtiaSadarImg 
    },
    { 
      id: 'kumarkhali', 
      name: t('কুমারখালী', 'Kumarkhali'), 
      img: kumarkhaliImg 
    },
    { 
      id: 'bheramara', 
      name: t('ভেড়ামারা', 'Bheramara'), 
      img: bheramaraImg 
    },
    { 
      id: 'mirpur', 
      name: t('মিরপুর', 'Mirpur'), 
      img: mirpurImg 
    },
    { 
      id: 'khoksa', 
      name: t('খোকসা', 'Khoksa'), 
      img: khoksaImg 
    },
    { 
      id: 'daulatpur', 
      name: t('দৌলতপুর', 'Daulatpur'), 
      img: daulatpurImg 
    }
  ];

  const displayedRegions = allRegions;

  // 12 MAIN SERVICES IN 3D GLOSSY DESIGN
  const services = [
    // Row 1
    { 
      name: t('দর্শনীয় স্থান', 'Tourism'), 
      icon: Monument3DIcon, 
      id: 'tourism', 
      bg: 'from-[#2563EB] via-[#1D4ED8] to-[#1E40AF]', 
      shadow: 'shadow-blue-500/30' 
    },
    { 
      name: t('রেস্টুরেন্ট', 'Restaurants'), 
      icon: Restaurant3DIcon, 
      id: 'food', 
      bg: 'from-[#F59E0B] via-[#EA580C] to-[#C2410C]', 
      shadow: 'shadow-orange-500/30' 
    },
    { 
      name: t('শপিং', 'Shopping'), 
      icon: Shopping3DIcon, 
      id: 'buy-sell', 
      bg: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]', 
      shadow: 'shadow-purple-500/30' 
    },
    { 
      name: t('চাকরি', 'Jobs'), 
      icon: Jobs3DIcon, 
      id: 'jobs', 
      bg: 'from-[#38BDF8] via-[#0284C7] to-[#0369A1]', 
      shadow: 'shadow-sky-500/30' 
    },
    
    // Row 2
    { 
      name: t('বাস-ট্রেন', 'Transport'), 
      icon: Transport3DIcon, 
      id: 'transport', 
      bg: 'from-[#F87171] via-[#EF4444] to-[#DC2626]', 
      shadow: 'shadow-red-500/30' 
    },
    { 
      name: t('হাসপাতাল', 'Hospital'), 
      icon: Hospital3DIcon, 
      id: 'doctor', 
      bg: 'from-[#2DD4BF] via-[#0D9488] to-[#0F766E]', 
      shadow: 'shadow-teal-500/30' 
    },
    { 
      name: t('ডাক্তার', 'Doctors'), 
      icon: Doctor3DIcon, 
      id: 'doctor', 
      bg: 'from-[#F472B6] via-[#EC4899] to-[#BE185D]', 
      shadow: 'shadow-pink-500/30' 
    },
    { 
      name: t('জরুরি সেবা', 'Emergency'), 
      icon: Emergency3DIcon, 
      id: 'emergency', 
      bg: 'from-[#EF4444] via-[#DC2626] to-[#991B1B]', 
      shadow: 'shadow-red-500/40',
      isPulse: true 
    },

    // Row 3
    { 
      name: t('বাসা ভাড়া', 'House Rent'), 
      icon: House3DIcon, 
      id: 'house-rent', 
      bg: 'from-[#C084FC] via-[#A855F7] to-[#7E22CE]', 
      shadow: 'shadow-purple-500/30' 
    },
    { 
      name: t('স্থানীয় খবর', 'Local News'), 
      icon: News3DIcon, 
      id: 'crime-reporter', 
      bg: 'from-[#34D399] via-[#10B981] to-[#047857]', 
      shadow: 'shadow-emerald-500/30' 
    },
    { 
      name: t('ইভেন্ট', 'Events'), 
      icon: Event3DIcon, 
      id: 'events', 
      bg: 'from-[#FB923C] via-[#F97316] to-[#EA580C]', 
      shadow: 'shadow-orange-500/30' 
    },
    { 
      name: t('সেবা সমূহ', 'Services'), 
      icon: Services3DIcon, 
      id: 'services', 
      bg: 'from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]', 
      shadow: 'shadow-blue-500/30' 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800 font-['Hind_Siliguri',sans-serif] pb-24 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & PANORAMIC SCENIC KUSHTIA HERO */}
      <div className="relative w-full overflow-hidden shadow-md">
        
        {/* The Big Panoramic Scenic Photo of Kushtia Landmarks */}
        <div className="relative w-full h-[270px] sm:h-[300px]">
          <img 
            src={themeConfig.homeBannerUrl || kushtiaHeroImage} 
            alt="কুষ্টিয়া জেলার দর্শনীয় স্থান — শিলাইদহ কুঠিবাড়ি, লালন শাহের মাজার ও হার্ডিঞ্জ ব্রিজ" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle top and bottom lighting gradients for text contrast */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Top Navbar Row */}
        <div className="absolute top-2.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-auto">
          {/* Hamburger Menu Button */}
          <button 
            onClick={onOpenDrawer}
            className="p-2 bg-black/35 hover:bg-black/55 backdrop-blur-md rounded-xl text-white active:scale-95 transition-all cursor-pointer border border-white/30"
            title="মেনু খুলুন"
            aria-label="সাইডবার মেনু"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* CENTRAL BRAND EMBLEM */}
        <div className="absolute top-8 inset-x-0 z-20 flex flex-col items-center pointer-events-auto">
        </div>



      </div>

      {/* 2. FLOATING SEARCH BAR */}
      <div className="px-4 -mt-5 relative z-30 mb-4">
        <div 
          onClick={onOpenSearch}
          className="relative bg-white rounded-full shadow-[0_6px_20px_rgba(0,35,90,0.18)] border-[2.5px] border-[#0A4CC7] flex items-center px-4 py-3 cursor-pointer hover:border-amber-400 active:scale-98 transition-all group"
        >
          <Search className="w-5 h-5 text-[#0A4CC7] mr-3 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="w-full text-xs sm:text-sm font-bold text-slate-500 select-none truncate">
            {t("কুষ্টিয়ার যেকোনো সেবা বা তথ্য খুঁজুন...", "Search any service or info in Kushtia...")}
          </span>
          <div className="p-1 rounded-full text-[#0A4CC7] ml-2 shrink-0">
            <Mic className="w-5 h-5 text-[#0A4CC7]" />
          </div>
        </div>
      </div>


      {themeConfig.isEmergencyBloodDonorActive && (
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg shadow-red-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="text-white font-black text-sm">{themeConfig.emergencyBloodDonorMessage}</span>
            </div>
            <a 
              href={`tel:${themeConfig.bloodHelplinePhone || '01711224455'}`}
              className="bg-white text-red-700 p-3 rounded-full shadow-md active:scale-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {themeConfig.isPatientBloodRequestActive && (
        <div className="px-4 mb-4">
          <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-sm flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-3 rounded-2xl">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-rose-950 text-sm">জরুরি রক্তের প্রয়োজন</h3>
                <p className="text-slate-500 text-xs font-bold">রোগী: {themeConfig.patientName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-xl">রক্তের গ্রুপ: {themeConfig.patientBloodGroup}</div>
              <div className="p-2.5 bg-slate-50 rounded-xl">বয়স: {themeConfig.patientAge}</div>
            </div>

            <a 
              href={`tel:${themeConfig.patientContactNumber}`}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-2xl text-center shadow-lg shadow-rose-200 transition-all active:scale-95"
            >
              কল করুন: {themeConfig.patientContactNumber ? '***' + themeConfig.patientContactNumber.slice(-4) : ''}
            </a>
          </div>
        </div>
      )}

      {/* Live Weather & AQI Widget */}
      <LiveWeatherWidget />

      {/* Salat Times Widget */}
      <SalatTimesWidget />

      {/* 3. 12 MAIN SERVICES GRID */}
      <div className="px-3 sm:px-4 mb-5">
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
            {services.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(item.id)}
                  className="flex flex-col items-center group active:scale-92 transition-all cursor-pointer"
                >
                  {/* 3D Glossy Squircle Box */}
                  <div 
                    className={`relative w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-2xl bg-gradient-to-b ${item.bg} flex items-center justify-center shadow-md ${item.shadow} border-t-2 border-white/60 border-b-2 border-black/30 mb-1.5 group-hover:scale-105 transition-all overflow-hidden`}
                  >
                    {/* Top specular glossy highlight */}
                    <div className="absolute top-0.5 inset-x-1.5 h-2/5 rounded-t-xl bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />
                    
                    {/* Pulsing indicator for emergency */}
                    {item.isPulse && (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping absolute top-1 right-1" />
                    )}

                    <div className="relative z-10 p-1 flex items-center justify-center">
                      <IconComponent className="w-9 h-9 sm:w-10 sm:h-10" />
                    </div>
                  </div>

                  {/* Bengali Category Label */}
                  <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-blue-700 text-center leading-tight tracking-tight">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>



      {/* 5. UPAZILAS IMAGE CARDS 3-COLUMN GRID (কুষ্টিয়ার ৬টি উপজেলা) */}
      <div className="px-3 sm:px-4 mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {displayedRegions.map((item) => (
            <div 
              key={item.id} 
              className="relative h-28 sm:h-32 rounded-xl overflow-hidden shadow-md border border-slate-200 group cursor-pointer active:scale-95 transition-all hover:border-[#0A4CC7] hover:shadow-lg bg-slate-100"
              onClick={() => {
                setSelectedThana(item.id);
                window.scrollTo({ top: 800, behavior: 'smooth' }); // Scroll down to feed
              }}
              title={`${item.name} উপজেলা সম্পর্কে সম্পূর্ণ তথ্য দেখুন`}
            >
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300" 
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {/* Bottom solid royal blue pill badge with pin */}
              <div className="absolute inset-x-0 bottom-1.5 flex justify-center px-1">
                <div className="w-[90%] bg-[#082C6A]/95 backdrop-blur-xs py-1 px-1.5 rounded-lg border border-white/20 shadow-md flex items-center justify-center gap-1 group-hover:bg-[#0A4CC7] transition-colors">
                  <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="text-[11px] font-black text-white truncate text-center">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DAILY LOCAL NEWS (Google Search Powered Live Headlines for Kushtia) */}
      <DailyLocalNewsSection city="Kushtia" />

      {/* 7. FACEBOOK-STYLE COMMUNITY POSTS FEED */}
      <HomeCommunityFeed
        onNavigate={onNavigate as any}
        onPostClick={onPostClick}
        onOpenCreatePost={onOpenCreatePost}
        currentUser={currentUser}
      />

    </div>
  );
};
