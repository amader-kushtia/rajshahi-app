import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Ticket, 
  Calendar, 
  Compass, 
  Navigation, 
  Share2, 
  Bookmark, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Bus, 
  Car, 
  ChevronRight,
  Shield,
  Building,
  Sparkles,
  MessageSquarePlus,
  Send,
  ThumbsUp
} from 'lucide-react';
import { RAJSHAHI_PLACES, RAJSHAHI_UPAZILAS, PlaceItem } from '../data/placesData';

interface PlaceDetailPageProps {
  placeId: string;
  onBack: () => void;
  onSelectUpazila?: (upazilaId: string) => void;
  onSelectNearbyPlace?: (placeId: string) => void;
}

export const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({
  placeId,
  onBack,
  onSelectUpazila,
  onSelectNearbyPlace
}) => {
  const place: PlaceItem | undefined = RAJSHAHI_PLACES[placeId] || RAJSHAHI_PLACES['lalon-shrine'];

  const [activeImage, setActiveImage] = useState<string>(place?.coverImage || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'howToGo' | 'tips' | 'emergency'>('overview');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);

  // Review System
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewsList, setReviewsList] = useState<Array<{ name: string; rating: number; date: string; comment: string; likes: number }>>([
    {
      name: 'তানভীর আহমেদ',
      rating: 5,
      date: '২ দিন আগে',
      comment: 'অসাধারণ একটি জায়গা! বিশেষ করে এখানকার স্থাপত্য ও দিঘির পরিবেশ চোখ জুড়িয়ে যায়। অবশ্যই পরিবার নিয়ে ঘুরে আসার মতো।',
      likes: 14
    },
    {
      name: 'নাসরিন সুলতানা',
      rating: 5,
      date: '১ সপ্তাহ আগে',
      comment: 'খুব সুন্দর ও পরিচ্ছন্ন পরিবেশ। বিকালের দিকে সূর্যাস্ত দেখতে দারুণ লাগে। পুঠিয়ার ছানার মিষ্টির স্বাদ ভুলবার মতো নয়।',
      likes: 9
    }
  ]);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState<boolean>(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (place) {
      setActiveImage(place.coverImage);
      // Check saved
      try {
        const saved = JSON.parse(localStorage.getItem('saved_places') || '[]');
        setIsSaved(saved.includes(place.id));
      } catch {
        setIsSaved(false);
      }
    }
    // Stop audio on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [placeId, place]);

  if (!place) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-slate-800">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">স্থানটি খুঁজে পাওয়া যায়নি</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const toggleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_places') || '[]');
      let updated: string[];
      if (saved.includes(place.id)) {
        updated = saved.filter((id: string) => id !== place.id);
        setIsSaved(false);
      } else {
        updated = [...saved, place.id];
        setIsSaved(true);
      }
      localStorage.setItem('saved_places', JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${place.name} - কুষ্টিয়া জেলা`,
      text: `${place.name}: ${place.tagline}। অবস্থান: ${place.upazilaName}`,
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
        await navigator.clipboard.writeText(`${place.name}\n${place.tagline}\n${window.location.href}`);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } catch {
        // Fallback
      }
    }
  };

  const toggleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে অডিও স্পিচ সমর্থন করে না');
      return;
    }
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const text = `${place.name}। ${place.tagline}। ${place.overview} ${place.history}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const newRev = {
      name: reviewName.trim() || 'কুষ্টিয়ার নাগরিক',
      rating: userRating,
      date: 'এইমাত্র',
      comment: reviewComment.trim(),
      likes: 1
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
    setIsReviewSubmitted(true);
    setTimeout(() => setIsReviewSubmitted(false), 4000);
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
          <div className="truncate max-w-[200px] sm:max-w-xs">
            <h1 className="text-sm sm:text-base font-black truncate text-amber-300 leading-tight">
              {place.name}
            </h1>
            <p className="text-[10px] text-blue-200 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{place.upazilaName}</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* TTS Audio Guide */}
          <button
            onClick={toggleTextToSpeech}
            className={`p-2 rounded-xl border transition-all ${
              isPlayingAudio 
                ? 'bg-amber-400 text-blue-950 border-amber-300 animate-pulse' 
                : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/15'
            }`}
            title={isPlayingAudio ? 'অডিও বন্ধ করুন' : 'বাংলায় বর্ণনা শুনুন'}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={toggleSave}
            className={`p-2 rounded-xl border transition-all ${
              isSaved 
                ? 'bg-rose-600 text-white border-rose-500' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
            title="সংরক্ষণ করুন"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 transition-all"
            title="শেয়ার করুন"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>লিংক কপি করা হয়েছে!</span>
        </div>
      )}

      {/* 2. HERO IMAGE & GALLERY SECTION */}
      <div className="relative bg-slate-900">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={activeImage}
            alt={place.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-transparent" />

          {/* Overlay info */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950 shadow">
                {place.categoryLabel}
              </span>
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-amber-300 border border-amber-400/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{place.rating}</span>
                <span className="text-[10px] text-slate-300">({place.reviewsCount} রিভিউ)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight">
              {place.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium italic drop-shadow">
              "{place.tagline}"
            </p>
          </div>
        </div>

        {/* Thumbnails Row */}
        {place.galleryImages && place.galleryImages.length > 1 && (
          <div className="bg-slate-950/90 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800">
            {place.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeImage === img ? 'border-amber-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. QUICK STATS CARDS */}
      <div className="px-3 -mt-3 relative z-10 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white rounded-2xl p-3 shadow-lg border border-slate-200">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/70 border border-blue-100">
            <Compass className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">জিরো পয়েন্ট থেকে</span>
              <span className="text-xs font-black text-blue-900 truncate block">{place.distanceFromZeroPoint}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-100">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">সময়সূচি</span>
              <span className="text-xs font-black text-amber-900 truncate block">{place.timings.split('(')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <Ticket className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">প্রবেশ ফি</span>
              <span className="text-xs font-black text-emerald-900 truncate block">{place.entryFee.split('(')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-50/70 border border-purple-100">
            <Calendar className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">প্রতিষ্ঠাকাল</span>
              <span className="text-xs font-black text-purple-900 truncate block">{place.established.split('(')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. UPZILA BANNER LINK (Clickable to view Upazila Page) */}
      <div className="px-3 mb-4">
        <div 
          onClick={() => onSelectUpazila && onSelectUpazila(place.upazilaId)}
          className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-3 shadow-md flex items-center justify-between cursor-pointer hover:from-blue-800 hover:to-indigo-800 transition-all border border-blue-700/60 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">উপজেলা পরিচিতি</span>
              <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                {place.upazilaName} সম্পর্কে সম্পূর্ণ জানুন
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
            <span>দেখুন</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE SEGMENTED TABS */}
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
            সংক্ষিপ্ত পরিচিতি
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'history'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            ইতিহাস ও ঐতিহ্য
          </button>
          <button
            onClick={() => setActiveTab('howToGo')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'howToGo'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            কীভাবে যাবেন?
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'tips'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            টিপস ও আশেপাশের স্থান
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
              activeTab === 'emergency'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            জরুরি যোগাযোগ
          </button>
        </div>
      </div>

      {/* 6. TAB CONTENT BODIES */}
      <div className="px-3 space-y-4">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Overview text */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>স্থানের বিবরণ</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                {place.overview}
              </p>
              
              {place.architecture && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2">
                  <span className="text-xs font-black text-slate-900 shrink-0">স্থাপত্যশৈলী:</span>
                  <span className="text-xs text-slate-600 font-medium">{place.architecture}</span>
                </div>
              )}
            </div>

            {/* Key highlights */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>প্রধান আকর্ষণ ও দর্শনীয় উপাদান</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {place.keyHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timings & Rules card */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80">
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>সময়সূচি ও প্রবেশের তথ্য</span>
              </h4>
              <div className="space-y-1.5 text-xs text-amber-900">
                <p>• <strong>খোলা থাকার সময়:</strong> {place.timings}</p>
                <p>• <strong>টিকেট মূল্য:</strong> {place.entryFee}</p>
                <p>• <strong>দূরত্ব ও সময়:</strong> কুষ্টিয়া শহর থেকে প্রায় {place.distanceFromZeroPoint} ({place.travelTime})</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                  🏛️
                </div>
                <div>
                  <h3 className="text-sm font-black text-blue-950">ঐতিহাসিক পটভূমি</h3>
                  <p className="text-[10px] text-slate-500">শতবর্ষের গৌরবময় ইতিহাস ও কাহিনী</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify mb-3">
                {place.history}
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>প্রতিষ্ঠা কাল:</strong> {place.established}</p>
                <p><strong>ঐতিহাসিক গুরুত্ব:</strong> প্রত্নতাত্ত্বিক গবেষণা ও বাংলার সাংস্কৃতিক ঐতিহ্যের অমূল্য রত্ন।</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOW TO GO */}
        {activeTab === 'howToGo' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-3 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>যাতায়াত ও পৌঁছানোর সহজ উপায়</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-950 mb-1">বাস / পাবলিক ট্রান্সপোর্ট</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{place.howToGo.bus}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950 mb-1">লোকাল অটোরিকশা / ভ্যান</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{place.howToGo.localTransport}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0 mt-0.5">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-950 mb-1">আনুমানিক সম্ভাব্য খরচ</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{place.howToGo.fareEstimate}</p>
                  </div>
                </div>

                {place.howToGo.routeTip && (
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-900">
                    <strong>ভ্রমণ রুট পরামর্শ:</strong> {place.howToGo.routeTip}
                  </div>
                )}
              </div>

              {/* Google Map Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={place.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>গুগল ম্যাপে লাইভ রুট ও দিকনির্দেশনা দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TIPS & NEARBY */}
        {activeTab === 'tips' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Tips */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>দর্শনার্থীদের জন্য বিশেষ পরামর্শ</span>
              </h3>
              <div className="space-y-2">
                {place.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-black">✓</span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby spots */}
            {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <h3 className="text-sm font-black text-blue-950 mb-3">
                  আশেপাশের আরও দর্শনীয় স্থান
                </h3>
                <div className="space-y-2">
                  {place.nearbyAttractions.map((spot, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (spot.placeId && onSelectNearbyPlace) {
                          onSelectNearbyPlace(spot.placeId);
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-blue-50/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <span className="text-xs font-black text-slate-800 group-hover:text-blue-900 transition-colors block">
                            {spot.name}
                          </span>
                          <span className="text-[10px] text-slate-500">দূরত্ব: {spot.distance}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EMERGENCY CONTACTS */}
        {activeTab === 'emergency' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-blue-950 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>স্থানীয় জরুরি সেবা ও হেল্পলাইন</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                ভ্রমণকালীন যেকোনো নিরাপত্তা বা জরুরি চিকিৎসায় সরাসরি কল করুন:
              </p>

              <div className="space-y-2.5">
                {place.emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{contact.title}</h4>
                      <span className="text-[10px] text-slate-500 block">{contact.role}</span>
                      <span className="text-xs font-bold text-rose-700">{contact.phone}</span>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2.5 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1 text-xs font-black"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>কল করুন</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 7. VISITOR REVIEWS & RATINGS SECTION */}
      <div className="px-3 mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-blue-950 flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-amber-500" />
                <span>দর্শনার্থীদের মতামত ও রেটিং</span>
              </h3>
              <p className="text-[10px] text-slate-500">আপনার নিজস্ব ভ্রমণ অভিজ্ঞতা শেয়ার করুন</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-800 text-xs font-black">
              ★ {place.rating} ({place.reviewsCount})
            </div>
          </div>

          {/* Form to submit review */}
          <form onSubmit={handleAddReview} className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">রেটিং দিন:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 focus:outline-hidden"
                  >
                    <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="আপনার নাম (ঐচ্ছিক)"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
            />

            <textarea
              rows={2}
              placeholder="এই স্থান সম্পর্কে আপনার ভ্রমণ অভিজ্ঞতা বা টিপস লিখুন..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-900 text-white rounded-lg text-xs font-black flex items-center justify-center gap-1.5 hover:bg-blue-800 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>মন্তব্য পোস্ট করুন</span>
            </button>
          </form>

          {isReviewSubmitted && (
            <div className="mb-3 p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 text-center animate-in fade-in">
              ধন্যবাদ! আপনার মূল্যবান মতামত যুক্ত হয়েছে।
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3 divide-y divide-slate-100">
            {reviewsList.map((rev, idx) => (
              <div key={idx} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-black text-[10px] flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <span className="text-xs font-black text-slate-800">{rev.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
