import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Landmark, 
  GraduationCap, 
  Waves, 
  Share2, 
  PhoneCall, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Shield, 
  Compass, 
  ExternalLink,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { RAJSHAHI_UPAZILAS, RAJSHAHI_PLACES, UpazilaItem } from '../data/placesData';

interface UpazilaDetailPageProps {
  upazilaId: string;
  onBack: () => void;
  onSelectPlace?: (placeId: string) => void;
}

export const UpazilaDetailPage: React.FC<UpazilaDetailPageProps> = ({
  upazilaId,
  onBack,
  onSelectPlace
}) => {
  const upazila: UpazilaItem | undefined = RAJSHAHI_UPAZILAS[upazilaId] || RAJSHAHI_UPAZILAS['kushtia-sadar'];
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'admin' | 'transport'>('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [upazilaId]);

  if (!upazila) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">উপজেলাটি খুঁজে পাওয়া যায়নি</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: `${upazila.fullName} - কুষ্টিয়া জেলা`,
      text: `${upazila.fullName} পরিচিতি, ইতিহাস, দর্শনীয় স্থান ও প্রশাসনিক সেবা।`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${upazila.fullName}\n${window.location.href}`);
        alert('লিংক কপি করা হয়েছে!');
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 font-['Hind_Siliguri',sans-serif] animate-in fade-in duration-200">
      
      {/* 1. TOP STICKY APP BAR */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-xl px-3 py-3 flex items-center justify-between border-b border-blue-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            title="পেছনে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate max-w-[220px]">
            <h1 className="text-base font-black truncate text-amber-300 leading-tight">
              {upazila.fullName}
            </h1>
            <p className="text-[10px] text-blue-200 truncate">কুষ্টিয়া জেলা প্রশাসন তথ্যভাণ্ডার</p>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 transition-all"
          title="শেয়ার করুন"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. HERO COVER BANNER */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
        <img
          src={upazila.coverImage}
          alt={upazila.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent" />
        
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow mb-1">
            পোস্টকোড: {upazila.postCode}
          </div>
          <h2 className="text-2xl font-black text-white drop-shadow-md">
            {upazila.fullName}
          </h2>
          <p className="text-xs text-blue-200 font-medium">
            {upazila.englishName} · খুলনা বিভাগ
          </p>
        </div>
      </div>

      {/* 3. KEY STATISTICS 4-GRID */}
      <div className="px-3 -mt-4 relative z-10 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white rounded-2xl p-3 shadow-lg border border-slate-200">
          <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">মোট আয়তন</span>
              <span className="text-xs font-black text-blue-900 truncate block">{upazila.area}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">মোট জনসংখ্যা</span>
              <span className="text-xs font-black text-amber-900 truncate block">{upazila.population}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">ইউনিয়ন ও পৌরসভা</span>
              <span className="text-xs font-black text-emerald-900 truncate block">{upazila.unionsCount}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">সাক্ষরতার হার</span>
              <span className="text-xs font-black text-purple-900 truncate block">{upazila.literacyRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAMOUS FOR TAGS */}
      <div className="px-3 mb-4">
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/80">
          <span className="text-xs font-black text-amber-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>উপজেলার ঐতিহ্য ও যে কারণে বিখ্যাত:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {upazila.famousFor.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-white text-xs font-black text-amber-950 border border-amber-300 shadow-xs"
              >
                ★ {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SEGMENTED TABS */}
      <div className="px-3 mb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            পরিচিতি ও ইতিহাস
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'places'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            দর্শনীয় স্থানসমূহ ({upazila.topPlaceIds.length})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            প্রশাসন ও জরুরি সেবা
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'transport'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            যাতায়াত ও ম্যাপ
          </button>
        </div>
      </div>

      {/* 6. TAB BODIES */}
      <div className="px-3 space-y-4">

        {/* TAB 1: OVERVIEW & HISTORY */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-2 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>ভৌগোলিক পরিচিতি</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify mb-3">
                {upazila.overview}
              </p>

              {upazila.rivers && upazila.rivers.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <Waves className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-bold text-slate-800">নদীসমূহ:</span>
                  <span className="text-slate-600">{upazila.rivers.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-2">ঐতিহাসিক পটভূমি</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                {upazila.history}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>অর্থনীতি ও কৃষি বাণিজ্য</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {upazila.economy}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PLACES IN THIS UPAZILA */}
        {activeTab === 'places' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {upazila.topPlaceIds.length > 0 ? (
              upazila.topPlaceIds.map((pId) => {
                const place = RAJSHAHI_PLACES[pId];
                if (!place) return null;
                return (
                  <div
                    key={pId}
                    onClick={() => onSelectPlace && onSelectPlace(place.id)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-blue-500 transition-all cursor-pointer group flex flex-col sm:flex-row"
                  >
                    <div className="relative h-40 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-slate-900">
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow">
                        {place.categoryLabel}
                      </span>
                    </div>

                    <div className="p-3.5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-black text-blue-950 group-hover:text-blue-700 transition-colors">
                            {place.name}
                          </h4>
                          <span className="text-xs font-bold text-amber-600">★ {place.rating}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                          {place.overview}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-blue-700">
                        <span>বিস্তারিত দেখুন</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                <Landmark className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-black text-slate-800 mb-1">উপজেলায় প্রধান দর্শনীয় স্থানসমূহ তালিকাভুক্ত হচ্ছে</h4>
                <p className="text-[11px] text-slate-500">
                  উপজেলার প্রাকৃতিক গ্রামীণ পরিবেশ, হাট-বাজার এবং ঐতিহ্যবাহী দিঘি পর্যটকদের আকর্ষিত করে।
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN & EMERGENCY */}
        {activeTab === 'admin' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Admin Contacts */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>উপজেলা প্রশাসন ও নাগরিক সেবা কর্মকর্তা</span>
              </h3>
              <div className="space-y-2.5">
                {upazila.administrativeContacts.map((contact, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{contact.designation}</h4>
                      <span className="text-[10px] text-slate-500 block">{contact.office}</span>
                      <span className="text-xs font-bold text-blue-900">{contact.phone}</span>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2.5 bg-blue-900 text-white rounded-xl shadow hover:bg-blue-800 active:scale-95 transition-all flex items-center gap-1 text-xs font-black"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>কল</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>জরুরি সেবা ও থানা পুলিশ</span>
              </h3>
              <div className="space-y-2">
                {upazila.emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{contact.service}</h4>
                      <span className="text-xs font-bold text-rose-700">{contact.phone}</span>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2.5 bg-rose-600 text-white rounded-xl shadow hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1 text-xs font-black"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>কল</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSPORT & MAP */}
        {activeTab === 'transport' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-2">যাতায়াত ও পৌঁছানোর নির্দেশিকা</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                {upazila.transportInfo}
              </p>

              <a
                href={upazila.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>গুগল ম্যাপে উপজেলার অবস্থান দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
