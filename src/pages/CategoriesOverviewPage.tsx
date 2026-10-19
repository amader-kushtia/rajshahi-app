import React, { useState, useMemo } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Stethoscope, 
  Droplet, 
  Train, 
  Wrench, 
  ShieldAlert, 
  PhoneCall, 
  ChevronRight, 
  Sparkles,
  Zap,
  Snowflake,
  Car,
  GraduationCap,
  Dog,
  UtensilsCrossed,
  Briefcase,
  PackageSearch,
  Scale,
  PartyPopper,
  Hammer,
  Smartphone,
  Search,
  X,
  ArrowLeft,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { CategoryType } from '../types';
import { useAdminConfig } from '../context/AdminConfigContext';

interface CategoriesOverviewPageProps {
  onSelectCategory: (cat: CategoryType) => void;
}

type TabGroupType = 'all' | 'emergency' | 'marketplace' | 'handyman' | 'utility';

export const CategoriesOverviewPage: React.FC<CategoriesOverviewPageProps> = ({
  onSelectCategory,
}) => {
  const { themeConfig } = useAdminConfig();
  const disabled = themeConfig.disabledFeatures || [];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabGroupType>('all');

  const categoryItems = [
    {
      id: 'tourism' as CategoryType,
      title: 'দর্শনীয় স্থান ও পর্যটন',
      subtitle: 'পুঠিয়া রাজবাড়ি, বরেন্দ্র জাদুঘর, পদ্মা নদী ও উপজেলার তথ্য',
      icon: MapPin,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: 'আবিষ্কার',
      badgeColor: 'bg-blue-600 text-white',
      group: 'marketplace' as TabGroupType
    },
    {
      id: 'blood' as CategoryType,
      title: 'জরুরি রক্তদাতা ও রিকোয়েস্ট',
      subtitle: 'রক্তদাতা সন্ধান ও জরুরি রক্তের লাইভ রিকোয়েস্ট বোর্ড',
      icon: Droplet,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badge: 'জরুরি',
      badgeColor: 'bg-rose-500 text-white',
      group: 'emergency' as TabGroupType
    },
    {
      id: 'emergency' as CategoryType,
      title: 'জরুরি হেল্পলাইন সেবা',
      subtitle: 'পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স ও জাতীয় ৯৯৯ হেল্পলাইন',
      icon: PhoneCall,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badge: '২৪/৭ চালু',
      badgeColor: 'bg-red-500 text-white',
      group: 'emergency' as TabGroupType
    },
    {
      id: 'crime-reporter' as CategoryType,
      title: 'গোপন তথ্য ও ক্রাইম রিপোর্টার',
      subtitle: 'পরিচয় সম্পূর্ণ গোপন রেখে অপরাধ ও মাদক রিপোর্ট করুন',
      icon: ShieldAlert,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      badge: 'গোপন',
      badgeColor: 'bg-purple-600 text-white',
      group: 'emergency' as TabGroupType
    },
    {
      id: 'house-rent' as CategoryType,
      title: 'বাসা ভাড়া ও মেস',
      subtitle: 'ফ্যামিলি ফ্ল্যাট, ব্যাচেলর মেস ও সাবলেট বাসা',
      icon: Home,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'জনপ্রিয়',
      badgeColor: 'bg-emerald-600 text-white',
      group: 'marketplace' as TabGroupType
    },
    {
      id: 'buy-sell' as CategoryType,
      title: 'বাই-সেল মার্কেটপ্লেস',
      subtitle: 'পুরাতন মোবাইল, বাইক, ল্যাপটপ ও আসবাবপত্র বেচাকেনা',
      icon: ShoppingBag,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: 'মার্কেট',
      badgeColor: 'bg-blue-600 text-white',
      group: 'marketplace' as TabGroupType
    },
    {
      id: 'food' as CategoryType,
      title: 'রেস্টুরেন্ট ও খাবার',
      subtitle: 'মিষ্টি, বিরিয়ানি, ফাস্টফুড ও সেরা রেস্তোরাঁ',
      icon: UtensilsCrossed,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badge: 'খাবার',
      badgeColor: 'bg-amber-500 text-white',
      group: 'marketplace' as TabGroupType
    },
    {
      id: 'jobs' as CategoryType,
      title: 'চাকরি ও নিয়োগ বিজ্ঞপ্তি',
      subtitle: 'স্থানীয় শোরুম, ডায়াগনস্টিক ও প্রাইভেট প্রতিষ্ঠানের চাকরি',
      icon: Briefcase,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      badge: 'নিয়োগ',
      badgeColor: 'bg-indigo-600 text-white',
      group: 'marketplace' as TabGroupType
    },
    {
      id: 'doctor' as CategoryType,
      title: 'ডাক্তার ও স্বাস্থ্যসেবা',
      subtitle: 'সেরা বিশেষজ্ঞ ডাক্তারদের সময়সূচি ও চেম্বার ঠিকানা',
      icon: Stethoscope,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      badge: 'ডাক্তার',
      badgeColor: 'bg-teal-600 text-white',
      group: 'utility' as TabGroupType
    },
    {
      id: 'transport' as CategoryType,
      title: 'বাস ও ট্রেন শিডিউল',
      subtitle: 'ট্রেন সময়সূচি, দূরপাল্লার বাস কাউন্টার ও টিকিট বুকিং নম্বর',
      icon: Train,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      badge: 'টিকেট',
      badgeColor: 'bg-cyan-600 text-white',
      group: 'utility' as TabGroupType
    },
    {
      id: 'lost-found' as CategoryType,
      title: 'হারানো ও প্রাপ্তি বোর্ড',
      subtitle: 'জরুরি আইডি কার্ড, লাইসেন্স বা মূল্যবান সামগ্রী খোঁজ',
      icon: PackageSearch,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      badge: 'হারানো',
      badgeColor: 'bg-orange-500 text-white',
      group: 'utility' as TabGroupType
    },
    {
      id: 'legal' as CategoryType,
      title: 'আইনি সহায়তা ও আইনজীবী',
      subtitle: 'অভিজ্ঞ জজকোর্ট আইনজীবী, দলিল লেখক ও আইনি পরামর্শ',
      icon: Scale,
      iconColor: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-pink-200',
      badge: 'আইনজীবী',
      badgeColor: 'bg-slate-600 text-white',
      group: 'utility' as TabGroupType
    },
    {
      id: 'events' as CategoryType,
      title: 'অনুষ্ঠান ও ডেকোরেটর',
      subtitle: 'কমিউনিটি সেন্টার, ওয়েডিং প্ল্যানার ও সাউন্ড সিস্টেম বুকিং',
      icon: PartyPopper,
      iconColor: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      borderColor: 'border-fuchsia-200',
      badge: 'ইভেন্ট',
      badgeColor: 'bg-fuchsia-600 text-white',
      group: 'utility' as TabGroupType
    },
    {
      id: 'electrician' as CategoryType,
      title: 'ইলেকট্রিশিয়ান',
      subtitle: 'বাসাবাড়ির শর্ট সার্কিট, ওয়্যারিং ও ফ্যান/মোটর মেরামত',
      icon: Zap,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      badge: 'মিস্ত্রি',
      badgeColor: 'bg-yellow-500 text-slate-950',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'plumber' as CategoryType,
      title: 'প্লাম্বার ও স্যানিটারি',
      subtitle: 'পানির পাইপলাইন লিকেজ সমাধান ও মোটর ফিটিংস',
      icon: Wrench,
      iconColor: 'text-blue-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      badge: 'প্লাম্বিং',
      badgeColor: 'bg-sky-500 text-white',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'ac-mechanic' as CategoryType,
      title: 'এসি/ফ্রিজ মেকানিক',
      subtitle: 'বাসায় এসে এসি ও ফ্রিজ সার্ভিসিং ও গ্যাস রিফিল',
      icon: Snowflake,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      badge: 'সার্ভিস',
      badgeColor: 'bg-indigo-500 text-white',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'driver' as CategoryType,
      title: 'অভিজ্ঞ ড্রাইভার সেবা',
      subtitle: 'ব্যক্তিগত কার, হাইস বা মাইক্রোবাসের ট্রিপ ড্রাইভার',
      icon: Car,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      badge: 'ড্রাইভিং',
      badgeColor: 'bg-violet-600 text-white',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'tutor' as CategoryType,
      title: 'গৃহশিক্ষক ও টিউটর',
      subtitle: 'গণিত, বিজ্ঞান ও ইংরেজি বিষয়ের অভিজ্ঞ শিক্ষক/শিক্ষিকা',
      icon: GraduationCap,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'টিউশন',
      badgeColor: 'bg-emerald-600 text-white',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'vet' as CategoryType,
      title: 'পশু চিকিৎসক',
      subtitle: 'ডেইরি খামার, গরু-ছাগল ও পোষা বিড়াল/পাখির চিকিৎসা',
      icon: Dog,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      badge: 'ভেটেরিনারি',
      badgeColor: 'bg-pink-500 text-white',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'mason' as CategoryType,
      title: 'রাজমিস্ত্রি ও কন্ট্রাক্টর',
      subtitle: 'নতুন বাড়ি নির্মাণ, দেয়াল গাঁথুনি, প্লাস্টার ও টাইলস কাজ',
      icon: Hammer,
      iconColor: 'text-amber-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      badge: 'নির্মাণ',
      badgeColor: 'bg-amber-700 text-white',
      group: 'handyman' as TabGroupType
    },
    {
      id: 'mobile-maker' as CategoryType,
      title: 'মোবাইল মেকার',
      subtitle: 'মোবাইল সার্ভিসিং, মাদারবোর্ড সোল্ডারিং ও ডিসপ্লে মেরামত',
      icon: Smartphone,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      badge: 'রিপেয়ার',
      badgeColor: 'bg-teal-600 text-white',
      group: 'handyman' as TabGroupType
    }
  ];

  // 1. Filter based on Admin disabled config
  const enabledCategories = useMemo(() => {
    return categoryItems.filter(cat => !disabled.includes(cat.id));
  }, [disabled]);

  // 2. Filter based on Search Query and Selected Category Tab Group
  const filteredCategories = useMemo(() => {
    return enabledCategories.filter(cat => {
      const matchesSearch = 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.badge.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'all' || cat.group === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [enabledCategories, searchQuery, activeTab]);

  const TAB_ITEMS = [
    { id: 'all' as TabGroupType, label: 'সব ক্যাটাগরি', emoji: '📂' },
    { id: 'emergency' as TabGroupType, label: 'জরুরি সেবা', emoji: '🚨' },
    { id: 'marketplace' as TabGroupType, label: 'ব্যবসা ও বাজার', emoji: '💼' },
    { id: 'handyman' as TabGroupType, label: 'কারিগরি মিস্ত্রি', emoji: '🛠️' },
    { id: 'utility' as TabGroupType, label: 'নাগরিক তথ্য', emoji: '📅' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-15 flex items-center justify-between mb-3">
          <button
            onClick={() => onSelectCategory('home')}
            className="w-9 h-9 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center border border-pink-200 transition-all active:scale-95 cursor-pointer"
            title="হোমে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
              ক্যাটাগরি ব্রাউজার
            </span>
          </div>
        </div>

        <h1 className="text-lg sm:text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-600" />
          <span>সকল নাগরিক সেবা ও ক্যাটাগরি</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          আপনার প্রয়োজনীয় সেবাটি দ্রুত খুঁজে পেতে নিচের ক্যাটাগরিগুলোতে ক্লিক করুন অথবা সার্চ করুন।
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative bg-white rounded-2xl shadow-xs border border-pink-200 flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-pink-600 mr-3 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বাসা ভাড়া, ডাক্তার, রক্তদাতা বা মিস্ত্রি খুঁজুন..." 
            className="w-full text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
                isActive
                  ? 'bg-pink-700 text-white border-pink-700 shadow-pink-700/20'
                  : 'bg-white text-slate-700 hover:bg-pink-50 border-pink-200'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-28">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group bg-white rounded-2xl p-4 border ${cat.borderColor} hover:border-pink-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 relative overflow-hidden`}
            >
              {/* Soft background accent */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-pink-50/50 rounded-full blur-xl group-hover:bg-pink-100/60 transition-colors pointer-events-none" />

              <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center shrink-0 border border-pink-200/80 shadow-xs group-hover:scale-105 transition-transform`}>
                <Icon className={`w-6 h-6 ${cat.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-pink-700 transition-colors">
                    {cat.title}
                  </h3>
                  {cat.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {cat.subtitle}
                </p>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-pink-50 text-slate-400 group-hover:text-pink-700 flex items-center justify-center shrink-0 border border-pink-100 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center border border-pink-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3 border border-pink-200">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-800 mb-1">কোনো ক্যাটাগরি পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500">আপনার সার্চ কিওয়ার্ড পরিবর্তন করে আবার চেষ্টা করুন।</p>
        </div>
      )}
    </div>
  );
};
