import React, { useState, useMemo, useLayoutEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  Search,
  Share2,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ChevronRight,
  Info,
  Building,
  Sparkles,
  PhoneCall,
  Lock,
  X
} from 'lucide-react';
import { CategoryType } from '../types';
import {
  SERVICES_DIRECTORY,
  ServiceDefinition,
  ALL_UPAZILAS,
  ServiceListingItem
} from '../data/serviceDirectoryData';
import { allServiceCategories } from '../data/allCategories';
import { Service3DIcon } from './All3DServiceIcons';
import { useAuth } from '../context/AuthContext';
import { isCategoryPublicPostable } from '../data/serviceCategoriesPolicy';
import { getCategoryDefaultImage } from '../utils/categoryImages';

interface ServiceDetailViewProps {
  serviceId: CategoryType;
  onBack: () => void;
  onOpenCreatePost?: (serviceId?: CategoryType) => void;
  onSelectOtherService?: (serviceId: CategoryType) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  serviceId,
  onBack,
  onOpenCreatePost,
  onSelectOtherService,
}) => {
  const { isAdmin } = useAuth();
  const isPublicPost = isCategoryPublicPostable(serviceId);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestPhone, setSuggestPhone] = useState('');
  const [suggestDetails, setSuggestDetails] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);
  const [selectedUpazila, setSelectedUpazila] = useState<string>('সব উপজেলা');
  const [listingSearch, setListingSearch] = useState<string>('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Look up service in directory or fallback to allServiceCategories
  const serviceDef: ServiceDefinition | undefined = SERVICES_DIRECTORY[serviceId];
  const catSummary = allServiceCategories.find((c) => c.id === serviceId);

  const title = serviceDef?.label || catSummary?.label || 'নাগরিক সেবা';
  const englishTitle = serviceDef?.englishLabel || catSummary?.englishLabel || '';
  const tagline = serviceDef?.tagline || catSummary?.subtitle || 'প্রয়োজনীয় স্থানীয় সেবা ও যোগাযোগের তথ্য';
  const availableHours = serviceDef?.availableHours || 'সাধারণ অফিস সময়';
  const hotline = serviceDef?.emergencyHotline || catSummary?.hotline;
  const overview =
    serviceDef?.overview ||
    'কুষ্টিয়া জেলার নাগরিকদের সুবিধার্থে এই সেবার প্রয়োজনীয় তথ্য, ঠিকানা ও জরুরি যোগাযোগের নম্বর প্রদান করা হলো। যেকোনো তথ্যের জন্য নিচের নম্বরে যোগাযোগ করতে পারেন।';

  const IconComponent = serviceDef?.icon || catSummary?.icon || Building;
  const theme = serviceDef?.themeColor || {
    text: catSummary?.iconColor || 'text-emerald-700',
    bg: catSummary?.iconBg || 'bg-emerald-50',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-600 text-white',
    gradient: 'from-emerald-600 to-teal-800',
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    if (!serviceDef || !serviceDef.listings) return [];
    return serviceDef.listings.filter((item: ServiceListingItem) => {
      const matchUpazila =
        selectedUpazila === 'সব উপজেলা' ||
        item.upazila === selectedUpazila ||
        item.upazila === 'সব উপজেলা';
      const q = listingSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        (item.servicesOffered && item.servicesOffered.some((s) => s.toLowerCase().includes(q)));
      return matchUpazila && matchSearch;
    });
  }, [serviceDef, selectedUpazila, listingSearch]);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - কুষ্টিয়া নাগরিক সেবা`,
          text: `${title}: ${tagline}। যোগাযোগের নম্বর ও বিস্তারিত দেখুন।`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('লিংক কপি করা হয়েছে!');
    }
  };

  // Other related services from same group or random
  const relatedServices = useMemo(() => {
    const currentGroup = serviceDef?.group || catSummary?.group || 'emergency';
    return allServiceCategories
      .filter((c) => c.id !== serviceId && c.group === currentGroup)
      .slice(0, 4);
  }, [serviceId, serviceDef, catSummary]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28 animate-fadeIn">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 active:scale-95 transition-transform font-medium text-sm p-1.5 rounded-lg hover:bg-slate-100"
          aria-label="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
          <span>সকল সেবা</span>
        </button>

        <div className="text-center px-2 flex-1 truncate">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">{title}</h1>
        </div>

        <button
          onClick={handleShare}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 active:scale-95 transition-transform"
          title="শেয়ার করুন"
          aria-label="শেয়ার করুন"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full px-1 sm:px-2 py-2 space-y-3">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-slate-200/60 rounded-3xl blur-md scale-95" />
              <div className="relative p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200/80 shadow-md">
                <Service3DIcon id={serviceId} className="w-16 h-16 sm:w-18 sm:h-18 drop-shadow-md" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {serviceDef?.groupLabel || catSummary?.groupLabel || 'নাগরিক সেবা'}
                </span>
                {catSummary?.badge && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${catSummary.badgeColor || 'bg-emerald-50 text-emerald-700'}`}>
                    {catSummary.badge}
                  </span>
                )}
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {availableHours}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {title}
              </h2>
              {englishTitle && (
                <p className="text-xs font-medium text-slate-600 tracking-wider">
                  {englishTitle}
                </p>
              )}
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {tagline}
              </p>
            </div>
          </div>

          {/* Emergency Hotline Alert Banner (If present) */}
          {hotline && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-red-50/70 p-3.5 rounded-xl border border-red-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-900">জরুরি সরকারি হটলাইন</p>
                  <p className="text-base font-black text-red-700 tracking-wide font-mono">
                    {hotline}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${hotline}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-sm font-bold shadow-sm transition-colors text-center"
              >
                <Phone className="w-4 h-4" />
                <span>এখনই কল দিন</span>
              </a>
            </div>
          )}
        </div>

        {/* Overview Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>সেবা সংক্রান্ত পরিচিতি ও বিবরণ</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {overview}
          </p>

          {serviceDef?.onlinePortalUrl && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-500 font-medium">অফিসিয়াল ওয়েবসাইট / পোর্টাল:</span>
              <a
                href={serviceDef.onlinePortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>{serviceDef.onlinePortalTitle || 'অনলাইন পোর্টাল ভিজিট করুন'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Guidelines / Steps */}
        {serviceDef?.guidelines && serviceDef.guidelines.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>সেবা গ্রহণের নিয়ম ও প্রয়োজনীয় তথ্য</span>
            </h3>
            <div className="space-y-2.5">
              {serviceDef.guidelines.map((g, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{g.step}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings Section with Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>শাখা, অফিস ও যোগাযোগের তালিকা</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {filteredListings.length}টি তথ্য
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                সরাসরি নম্বরে কল দিয়ে প্রয়োজনীয় সেবা নিশ্চিত করুন
              </p>
            </div>

            {/* Upazila Dropdown selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="upazila-filter" className="text-xs text-slate-500 font-medium whitespace-nowrap">
                উপজেলা:
              </label>
              <select
                id="upazila-filter"
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              >
                {ALL_UPAZILAS.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick search inside listings */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={listingSearch}
              onChange={(e) => setListingSearch(e.target.value)}
              placeholder="নাম, ঠিকানা বা ফোন নম্বর দিয়ে খুঁজুন..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-2xs"
            />
          </div>

          {/* Listings Cards */}
          {filteredListings.length > 0 ? (
            <div className="space-y-3">
              {filteredListings.map((item: ServiceListingItem) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-4 sm:p-5"
                >
                  <div className="mb-3 rounded-xl overflow-hidden h-40 bg-slate-100 border border-slate-200 relative">
                    <img 
                      src={item.imageUrl || getCategoryDefaultImage(serviceId, item.id)} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {item.upazila}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </div>

                      {item.workingHours && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.workingHours}</span>
                        </div>
                      )}

                      {item.servicesOffered && item.servicesOffered.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {item.servicesOffered.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                            >
                              • {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Call & Copy Button */}
                    <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <a
                        href={`tel:${item.phone}`}
                        className="flex-1 sm:w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-transform"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>সরাসরি কল ({item.phone})</span>
                      </a>

                      <button
                        onClick={() => handleCopyPhone(item.phone)}
                        className="px-2.5 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-transform"
                        title="নম্বর কপি করুন"
                      >
                        {copiedPhone === item.phone ? '✓ কপি হয়েছে' : 'কপি'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                এই ফিল্টারে কোনো তালিকা পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-500">
                উপজেলা পরিবর্তন করুন অথবা 'সব উপজেলা' নির্বাচন করে দেখুন।
              </p>
              <button
                onClick={() => {
                  setSelectedUpazila('সব উপজেলা');
                  setListingSearch('');
                }}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>

        {/* Post / Contribute Option - PUBLIC vs ADMIN ADAPTIVE */}
        {isPublicPost ? (
          <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  পাবলিক পোস্ট উন্মুক্ত
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                আপনার কি {title} সংক্রান্ত সেবা, প্রতিষ্ঠান বা অভিজ্ঞতা আছে?
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                কুষ্টিয়ার নাগরিকদের কাছে আপনার সেবা পৌঁছে দিতে এখনই বিনামূল্যে আপনার সেবা বা বিজ্ঞাপন পোস্ট করুন।
              </p>
            </div>
            {onOpenCreatePost && (
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); onOpenCreatePost(serviceId as CategoryType); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl active:scale-95 transition-all shrink-0 shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>সেবা পোস্ট করুন</span>
              </button>
            )}
          </div>
        ) : isAdmin ? (
          <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  এডমিন প্রিভিলেজ সক্রিয়
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {title} সেবায় নতুন অফিশিয়াল লিস্টিং বা জরুরি তথ্য পোস্ট করুন
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                আপনি অ্যাডমিন হিসেবে এই সংরক্ষিত সেবায় নতুন দপ্তর, জরুরি নম্বর বা সেবা সরাসরি প্রকাশ করতে পারবেন।
              </p>
            </div>
            {onOpenCreatePost && (
              <button
                onClick={() => onOpenCreatePost(serviceId)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl active:scale-95 transition-all shrink-0 shadow-md shadow-amber-900/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>অফিশিয়াল পোস্ট যোগ করুন</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-900/90 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Lock className="w-3 h-3" />
                  সংরক্ষিত অফিশিয়াল সেবা
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
                <span>{title} — অফিশিয়াল ডিরেক্টরি</span>
              </h4>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                ভুয়া বা বিভ্রান্তিকর তথ্য রোধে এই সেবার নম্বর ও তালিকা শুধুমাত্র অনুমোদিত অ্যাডমিন কর্তৃক পোস্ট ও হালনাগাদ করা হয়। সাধারণ নাগরিক সরাসরি পোস্ট করতে পারবেন না। কোনো তথ্য সংযোজন বা সংশোধনের প্রয়োজন হলে অ্যাডমিনকে অবহিত করুন।
              </p>
            </div>
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>সংশোধন বা তথ্য প্রস্তাব করুন</span>
            </button>
          </div>
        )}

        {/* Suggest / Update Modal for Citizens */}
        {isSuggestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{title} তথ্য প্রস্তাব</h3>
                    <p className="text-[11px] text-slate-500">অ্যাডমিন রিভিউয়ের পর যাচাই করে যোগ করা হবে</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsSuggestModalOpen(false); setSuggestSuccess(false); }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {suggestSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-900">ধন্যবাদ! আপনার প্রস্তাবিত তথ্য জমা হয়েছে</h4>
                  <p className="text-[11px] text-emerald-700">এডমিন টিম তথ্যটি যাচাই করে শীঘ্রই ডিরেক্টরিতে অন্তর্ভুক্ত করবে।</p>
                  <button
                    onClick={() => { setIsSuggestModalOpen(false); setSuggestSuccess(false); }}
                    className="mt-2 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">অফিস বা প্রতিষ্ঠানের নাম</label>
                    <input
                      type="text"
                      value={suggestName}
                      onChange={(e) => setSuggestName(e.target.value)}
                      placeholder="যেমন: কুমারখালী থানা ডিউটি অফিসার"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ফোন বা হটলাইন নম্বর</label>
                    <input
                      type="text"
                      value={suggestPhone}
                      onChange={(e) => setSuggestPhone(e.target.value)}
                      placeholder="যেমন: 01711XXXXXX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">বিস্তারিত বিবরণ বা ঠিকানা</label>
                    <textarea
                      rows={3}
                      value={suggestDetails}
                      onChange={(e) => setSuggestDetails(e.target.value)}
                      placeholder="সংশোধন বা নতুন তথ্যের বিবরণ দিন..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSuggestModalOpen(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (suggestName.trim() || suggestPhone.trim() || suggestDetails.trim()) {
                          setSuggestSuccess(true);
                          setSuggestName('');
                          setSuggestPhone('');
                          setSuggestDetails('');
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
                    >
                      জমা দিন
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Services Recommendation */}
        {relatedServices.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              সম্পর্কিত অন্যান্য সেবা
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {relatedServices.map((rel) => {
                const RelIcon = rel.icon;
                return (
                  <button
                    key={rel.id}
                    onClick={() => onSelectOtherService?.(rel.id)}
                    className="p-3 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-xs transition-all text-left flex items-center gap-3 group active:scale-98"
                  >
                    <div className="shrink-0">
                      <Service3DIcon id={rel.id} className="w-9 h-9 drop-shadow-xs" />
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                        {rel.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
