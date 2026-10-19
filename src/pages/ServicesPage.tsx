import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronRight,
  MapPin,
  Sparkles,
  PhoneCall,
  SlidersHorizontal,
  RotateCcw,
  Building,
  Check,
  ChevronDown
} from 'lucide-react';
import { CategoryType } from '../types';
import { allServiceCategories, CategoryData } from '../data/allCategories';
import { SERVICE_GROUPS, ALL_UPAZILAS, ServiceGroupType } from '../data/serviceDirectoryData';
import { ServiceDetailView } from '../components/ServiceDetailView';
import { Service3DIcon } from '../components/All3DServiceIcons';

interface ServicesPageProps {
  onBack?: () => void;
  onOpenCreatePost?: (e?: React.MouseEvent<HTMLButtonElement> | CategoryType) => void;
  onNavigate?: (category: CategoryType) => void;
  initialProfession?: string;
  initialServiceId?: CategoryType;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onBack,
  onOpenCreatePost,
  onNavigate,
  initialProfession,
  initialServiceId,
}) => {
  // If an initial service is selected or user clicked a card
  const [activeServiceId, setActiveServiceId] = useState<CategoryType | null>(() => {
    if (initialServiceId) return initialServiceId;
    if (initialProfession) {
      if (initialProfession.includes('রাজমিস্ত্রি')) return 'mason';
      if (initialProfession.includes('মোবাইল')) return 'mobile-maker';
      if (initialProfession.includes('ইলেকট্রিশিয়ান')) return 'electrician';
      if (initialProfession.includes('প্লাম্বার')) return 'plumber';
      if (initialProfession.includes('এসি')) return 'ac-mechanic';
      if (initialProfession.includes('শিক্ষক') || initialProfession.includes('গৃহশিক্ষিকা')) return 'tutor';
      if (initialProfession.includes('ড্রাইভার')) return 'driver';
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | ServiceGroupType>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('সব উপজেলা');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Filter categories - called unconditionally before any early return
  const filteredCategories = useMemo(() => {
    return allServiceCategories.filter((cat: CategoryData) => {
      // Group filter
      if (selectedGroup !== 'all' && cat.group !== selectedGroup) {
        return false;
      }

      // Search filter
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchLabel = cat.label.toLowerCase().includes(q);
        const matchSubtitle = cat.subtitle.toLowerCase().includes(q);
        const matchEnglish = cat.englishLabel?.toLowerCase().includes(q);
        const matchGroup = cat.groupLabel.toLowerCase().includes(q);
        if (!matchLabel && !matchSubtitle && !matchEnglish && !matchGroup) {
          return false;
        }
      }

      return true;
    });
  }, [selectedGroup, searchQuery]);

  const previousScrollY = React.useRef(0);

  const handleCardClick = (cat: CategoryData) => {
    previousScrollY.current = window.scrollY || document.documentElement.scrollTop || 0;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setActiveServiceId(cat.id);
  };

  const handleBackFromDetail = () => {
    setActiveServiceId(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: previousScrollY.current, behavior: 'instant' as ScrollBehavior });
    });
  };

  // If activeServiceId is set, show the dedicated ServiceDetailView!
  if (activeServiceId) {
    return (
      <ServiceDetailView
        serviceId={activeServiceId}
        onBack={handleBackFromDetail}
        onOpenCreatePost={(target?: CategoryType) => onOpenCreatePost?.(target || activeServiceId || 'services')}
        onSelectOtherService={(newServiceId) => {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          setActiveServiceId(newServiceId);
        }}
      />
    );
  }

  const hasActiveFilters = selectedGroup !== 'all' || selectedUpazila !== 'সব উপজেলা' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedGroup('all');
    setSelectedUpazila('সব উপজেলা');
    setSearchQuery('');
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28 animate-fadeIn">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  সকল নাগরিক সেবা
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ৫০টি সেবা
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                কুষ্টিয়া জেলার প্রয়োজনীয় সকল সরকারি, জরুরি ও দৈনন্দিন সেবা
              </p>
            </div>

            {/* Filter Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  isFilterDropdownOpen || hasActiveFilters
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
                aria-expanded={isFilterDropdownOpen}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>ফিল্টার</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-emerald-600" />
                      সার্ভিস ফিল্টারিং
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        রিসেট
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 py-3">
                    {/* Category Group Dropdown */}
                    <div>
                      <label htmlFor="service-group-filter" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        বিভাগ / ক্যাটাগরি
                      </label>
                      <select
                        id="service-group-filter"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      >
                        {SERVICE_GROUPS.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location / Upazila Dropdown */}
                    <div>
                      <label htmlFor="upazila-location-filter" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        লোকেশন / উপজেলা
                      </label>
                      <select
                        id="upazila-location-filter"
                        value={selectedUpazila}
                        onChange={(e) => setSelectedUpazila(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      >
                        {ALL_UPAZILAS.map((up) => (
                          <option key={up} value={up}>
                            {up}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setIsFilterDropdownOpen(false)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold active:scale-98 transition-colors"
                    >
                      ফিল্টার প্রয়োগ করুন ({filteredCategories.length}টি ফলাফল)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="যেকোনো সেবা খুঁজুন (যেমন: পুলিশ, ফায়ার সার্ভিস, ব্যাংক, কুরিয়ার...)"
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-emerald-500 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                aria-label="মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Fast Category Filter Chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {SERVICE_GROUPS.map((g) => {
              const active = selectedGroup === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-medium">সক্রিয় ফিল্টার:</span>
              {selectedGroup !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                  {SERVICE_GROUPS.find((g) => g.id === selectedGroup)?.label}
                  <button onClick={() => setSelectedGroup('all')}>
                    <X className="w-3 h-3 text-emerald-700" />
                  </button>
                </span>
              )}
              {selectedUpazila !== 'সব উপজেলা' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                  {selectedUpazila}
                  <button onClick={() => setSelectedUpazila('সব উপজেলা')}>
                    <X className="w-3 h-3 text-blue-700" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  খোঁজা: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3 text-amber-700" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-bold ml-auto"
              >
                সব মুছুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Services Grid */}
      <div className="max-w-4xl mx-auto px-4 py-5">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5">
            {filteredCategories.map((cat: CategoryData) => {
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCardClick(cat)}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-400 transition-all duration-200 cursor-pointer p-3 sm:p-3.5 flex flex-col items-center justify-center text-center active:scale-[0.96] overflow-hidden min-h-[105px] sm:min-h-[115px]"
                >
                  {/* 3D Icon */}
                  <div className="transform group-hover:scale-108 transition-transform duration-200 my-1">
                    <Service3DIcon id={cat.id} className="w-12 h-12 sm:w-13 sm:h-13 drop-shadow-sm" />
                  </div>

                  {/* Only Service Name */}
                  <h3 className="font-bold text-xs sm:text-[13px] text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2 mt-1">
                    {cat.label}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              কোনো সেবা পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              আপনার অনুসন্ধানকৃত শব্দের সাথে কোনো সেবা মেলেনি। অনুগ্রহ করে বানান পরীক্ষা করুন অথবা ফিল্টার রিসেট করুন।
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সকল ৫০টি সেবা দেখুন</span>
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-8 bg-linear-to-r from-slate-800 to-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>আপনার সেবা বা প্রতিষ্ঠানের তথ্য যুক্ত করতে চান?</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              কুষ্টিয়া সিটিজেন অ্যাপের সকল নাগরিকের কাছে পৌঁছাতে আপনার প্রতিষ্ঠান বা সেবার তথ্য বিনামূল্যে যুক্ত করুন।
            </p>
          </div>
          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform shrink-0"
            >
              সেবা যুক্ত করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
