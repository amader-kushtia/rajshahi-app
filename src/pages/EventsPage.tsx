import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  PartyPopper, 
  Clock, 
  Plus, 
  Camera, 
  Music, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  Users,
  Facebook
} from 'lucide-react';
import { PostItem } from '../types';
import { subscribeToPosts } from '../services/postService';

interface EventsPageProps {
  onBack: () => void;
  onOpenCreatePost?: () => void;
}

const INITIAL_EVENTS_SERVICES: PostItem[] = [
  {
    id: 'event-1',
    category: 'events',
    title: 'ড্রিমল্যান্ড কমিউনিটি সেন্টার ও কনভেনশন হল',
    description: 'সম্পূর্ণ সেন্ট্রাল শীতাতপ নিয়ন্ত্রিত (AC), আধুনিক লাইটিং, বিশাল ডাইনিং হল, ভিআইপি ব্রাইডাল রুম ও নিজস্ব নিরাপদ কার পার্কিং সুবিধা। বিয়ে, বউভাত ও বড় সম্মেলনের জন্য উপযোগী।',
    price: '২৫,০০০ - ৪৫,০০০ ৳/শিফট',
    location: 'কুষ্টিয়া বাইপাস রোড, কুষ্টিয়া',
    subcategory: 'কমিউনিটি সেন্টার',
    contactPhone: '01711776655',
    whatsapp: '01711776655',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
    authorName: 'ড্রিমল্যান্ড কনভেনশন',
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    isVerified: true,
    featured: true,
    details: {
      decoratorService: 'সেন্ট্রাল এসি কমিউনিটি সেন্টার',
      eventCapacity: '৮০০+ অতিথি ধারণক্ষমতা'
    }
  },
  {
    id: 'event-2',
    category: 'events',
    title: 'সাজসজ্জা ডেকোরেটর ও ইভেন্ট প্ল্যানার',
    description: 'গায়ে হলুদ স্টেজ, এক্সক্লুসিভ ওয়েডিং গেট, ফ্লাওয়ার ব্যাকড্রপ, ভেন্যু ড্রাপিং ও আধুনিক এলইডি লাইটিং। প্রতিটি ইভেন্টে আকর্ষণীয় ও মানানসই থিম ডিজাইন।',
    price: '১০,০০০ - ৩৫,০০০ ৳',
    location: 'শহীদ ডা. জিকরুল হক রোড, কুষ্টিয়া',
    subcategory: 'ডেকোরেটর ও লাইটিং',
    contactPhone: '01722990011',
    whatsapp: '01722990011',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
    authorName: 'সাজসজ্জা ইভেন্টস',
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
    isVerified: true,
    details: {
      decoratorService: 'স্টেজ ও লাইটিং সলিউশন',
      eventCapacity: 'সব সাইজের প্রোগ্রাম'
    }
  },
  {
    id: 'event-3',
    category: 'events',
    title: 'ডিলাইট ক্যাটারিং সার্ভিস ও স্পেশাল শাহি বাবুর্চি',
    description: 'অভিজ্ঞ শাহি বাবুর্চি দ্বারা সেরা স্বাদের খাসির কাচ্চি, রোস্ট, বোরহানি, জর্দা ও ফিরনি রান্না ও পরিবেশন। ১০০ থেকে ১০০০+ মানুষের খাবারের সুশৃঙ্খল ক্যাটারিং সেবা।',
    price: 'জনপ্রতি ৩২০ - ৫৫০ ৳',
    location: 'শেরে বাংলা রোড, কুষ্টিয়া',
    subcategory: 'ক্যাটারিং ও বাবুর্চি',
    contactPhone: '01744112233',
    whatsapp: '01744112233',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
    authorName: 'ডিলাইট ক্যাটারিং টিম',
    createdAt: Date.now() - 1000 * 60 * 60 * 45,
    isVerified: true,
    details: {
      decoratorService: 'পূর্ণাঙ্গ ক্যাটারিং ও ডাইনিং সার্ভিস',
      eventCapacity: '১০০ - ২০০০ মানুষ'
    }
  },
  {
    id: 'event-4',
    category: 'events',
    title: 'রয়াল ফ্রেম ওয়েডিং ফটোগ্রাফি ও সিনেমাটোগ্রাফি',
    description: '৪কে সিনেমাটিক ভিডিও, ড্রোন ফুটেজ, প্রি-ওয়েডিং শুট ও প্রিমিয়াম ম্যাগাজিন ফটোবুক অ্যালবাম। কুষ্টিয়া ও পুরো রংপুর বিভাগে সেরা স্মৃতি ধরে রাখার প্রতিশ্রুতি।',
    price: '৮,০০০ - ২৫,০০০ ৳',
    location: 'ক্যান্টনমেন্ট রোড, কুন্দল, কুষ্টিয়া',
    subcategory: 'ফটোগ্রাফি ও সিনেমা',
    contactPhone: '01755998877',
    whatsapp: '01755998877',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
    authorName: 'রয়াল ফ্রেম স্টুডিও',
    createdAt: Date.now() - 1000 * 60 * 60 * 65,
    isVerified: true,
    details: {
      decoratorService: 'ওয়েডিং ফটো ও সিনেমাটোগ্রাফি',
      eventCapacity: 'পূর্ণাঙ্গ ইভেন্ট কভারেজ'
    }
  }
];

export const EventsPage: React.FC<EventsPageProps> = ({ onBack, onOpenCreatePost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('সব ইভেন্ট সেবা');
  const [events, setEvents] = useState<PostItem[]>(INITIAL_EVENTS_SERVICES);

  const subcategories = [
    'সব ইভেন্ট সেবা',
    'কমিউনিটি সেন্টার',
    'ডেকোরেটর ও লাইটিং',
    'ক্যাটারিং ও বাবুর্চি',
    'ফটোগ্রাফি ও সিনেমা'
  ];

  // Subscribe to real-time posts from Firestore for events
  useEffect(() => {
    const unsub = subscribeToPosts((livePosts) => {
      const liveEvents = livePosts.filter(p => p.category === 'events');
      if (liveEvents.length > 0) {
        const combined = [...liveEvents];
        INITIAL_EVENTS_SERVICES.forEach(init => {
          if (!combined.some(c => c.id === init.id)) {
            combined.push(init);
          }
        });
        setEvents(combined);
      }
    }, 'events');

    return () => unsub();
  }, []);

  const filteredEvents = events.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.details?.decoratorService || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSub = 
      selectedSubcategory === 'সব ইভেন্ট সেবা' || item.subcategory === selectedSubcategory;

    return matchesSearch && matchesSub;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-fuchsia-50 text-slate-700 hover:text-fuchsia-800 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <PartyPopper className="w-5 h-5 text-fuchsia-700" />
                <span>কুষ্টিয়া অনুষ্ঠান ও ডেকোরেটর</span>
              </h2>
              <p className="text-xs text-slate-500">কমিউনিটি সেন্টার, স্টেজ ডেকোরেশন, শাহি ক্যাটারিং ও ফটোগ্রাফি</p>
            </div>
          </div>

          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-fuchsia-950/10 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>ইভেন্ট সেবা যোগ করুন</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কমিউনিটি সেন্টার, ডেকোরেশন, ক্যাটারিং বা ফটোগ্রাফি খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-fuchsia-600"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedSubcategory === sub
                  ? 'bg-fuchsia-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* EVENTS LIST */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-pink-200/80 text-center">
            <PartyPopper className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো ইভেন্ট সার্ভিস পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">অনুসন্ধান ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
          </div>
        ) : (
          filteredEvents.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-fuchsia-300 transition-all group overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3.5 mb-3">
                {item.imageUrl && (
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-pink-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200">
                      {item.subcategory || 'ইভেন্ট'}
                    </span>
                    {item.price && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {item.price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 group-hover:text-fuchsia-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2.5 flex-wrap text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 text-slate-800 font-semibold">
                      <MapPin className="w-3 h-3 text-fuchsia-600" />
                      {item.location}
                    </span>
                    {item.details?.eventCapacity && (
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                        <Users className="w-3 h-3 text-slate-400" />
                        {item.details.eventCapacity}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-pink-100">
                <span className="text-[11px] text-slate-500 truncate">
                  তারিখ বুকিং ও রেট জানতে কল করুন
                </span>

                <div className="flex items-center gap-2">
                  {item.whatsapp && (
                    <a
                      href={`https://wa.me/88${item.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়া অ্যাপে আপনার "${item.title}" সংক্রান্ত সেবা দেখে বুকিংয়ের ব্যাপারে জানতে চাচ্ছি।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                      title="হোয়াটসঅ্যাপে বুকিং মেসেজ দিন"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">হোয়াটসঅ্যাপ</span>
                    </a>
                  )}

                  {item.facebook && (
                    <a
                      href={item.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                      title="ফেসবুকে যোগাযোগ করুন"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <a
                    href={`tel:${item.contactPhone}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল: {item.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
