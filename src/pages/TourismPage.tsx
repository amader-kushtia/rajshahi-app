import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  Compass, 
  Building2, 
  Sparkles, 
  SlidersHorizontal,
  Landmark
} from 'lucide-react';
import { RAJSHAHI_PLACES, RAJSHAHI_UPAZILAS, PlaceItem } from '../data/placesData';

interface TourismPageProps {
  onBack: () => void;
  onSelectPlace: (placeId: string) => void;
  onSelectUpazila: (upazilaId: string) => void;
}

export const TourismPage: React.FC<TourismPageProps> = ({
  onBack,
  onSelectPlace,
  onSelectUpazila
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const placesList: PlaceItem[] = Object.values(RAJSHAHI_PLACES);
  const upazilasList = Object.values(RAJSHAHI_UPAZILAS);

  const filteredPlaces = placesList.filter((place) => {
    const matchesSearch = 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.upazilaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.overview.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;
    return place.category === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 font-['Hind_Siliguri',sans-serif] animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER APP BAR */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-xl px-3 py-3 border-b border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            title="হোমে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-amber-300 leading-tight">
              কুষ্টিয়ার দর্শনীয় স্থান ও পর্যটন
            </h1>
            <p className="text-[10px] text-blue-200">লালন মাজার, শিলাইদহ কুঠিবাড়ি, হার্ডিঞ্জ ব্রিজ ও ঐতিহ্য গাইড</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="দর্শনীয় স্থান বা উপজেলার নাম খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl text-xs text-white placeholder-blue-200 focus:outline-hidden focus:bg-white/25 transition-all"
          />
        </div>
      </div>

      {/* 2. CATEGORY FILTER BUTTONS */}
      <div className="px-3 py-2.5 bg-white border-b border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedFilter === 'all'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          সব স্থান ({placesList.length})
        </button>
        <button
          onClick={() => setSelectedFilter('heritage')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedFilter === 'heritage'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ঐতিহাসিক ও রাজবাড়ি
        </button>
        <button
          onClick={() => setSelectedFilter('nature')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedFilter === 'nature'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          পদ্মা নদী ও প্রকৃতি
        </button>
        <button
          onClick={() => setSelectedFilter('education')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedFilter === 'education'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          জাদুঘর ও শিক্ষা
        </button>
        <button
          onClick={() => setSelectedFilter('religious')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedFilter === 'religious'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          মাজার ও মসজিদ
        </button>
        <button
          onClick={() => setSelectedFilter('entertainment')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedFilter === 'entertainment'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          পার্ক ও বিনোদন
        </button>
      </div>

      {/* 3. UPAZILAS HORIZONTAL CAROUSEL */}
      <div className="px-3 pt-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>উপজেলা ভিত্তিক অনুসন্ধান ({upazilasList.length}টি)</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-bold">ক্লিক করে বিস্তারিত দেখুন</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {upazilasList.map((upz) => (
            <div
              key={upz.id}
              onClick={() => onSelectUpazila(upz.id)}
              className="relative w-32 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-200 shadow-sm cursor-pointer group hover:border-blue-500 transition-all"
            >
              <img
                src={upz.coverImage}
                alt={upz.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2 text-center">
                <span className="text-xs font-black text-white truncate drop-shadow">
                  {upz.name}
                </span>
                <span className="text-[9px] text-amber-300 truncate font-semibold">
                  {upz.topPlaceIds.length > 0 ? `${upz.topPlaceIds.length}টি স্থান` : 'উপজেলা গাইড'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PLACES LIST */}
      <div className="px-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>দর্শনীয় স্থানসমূহ ({filteredPlaces.length})</span>
          </h3>
          <span className="text-[10px] text-blue-600 font-bold">পেজ দেখতে কার্ডে ক্লিক করুন</span>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <Landmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">কোনো দর্শনীয় স্থান পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={place.coverImage}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow">
                    {place.categoryLabel}
                  </span>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="text-base font-black drop-shadow text-white leading-tight">
                      {place.name}
                    </h4>
                    <p className="text-[11px] text-slate-200 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{place.upazilaName} · জিরো পয়েন্ট থেকে {place.distanceFromZeroPoint}</span>
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                    {place.overview}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-blue-700">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      সময়: {place.timings.split('(')[0]}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-blue-900">
                      সম্পূর্ণ বিস্তারিত দেখুন
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
