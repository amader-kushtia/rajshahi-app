import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  Clock, 
  Plus, 
  Star, 
  CheckCircle2, 
  MessageCircle, 
  ShoppingBag,
  Sparkles,
  Bike,
  Facebook
} from 'lucide-react';
import { PostItem } from '../types';
import { subscribeToPosts } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { RestaurantMenuDetail } from '../components/RestaurantMenuDetail';

interface FoodPageProps {
  onBack: () => void;
  onOpenCreatePost?: () => void;
}

const INITIAL_FOOD_PLACES: PostItem[] = [
  {
    id: 'food-1',
    category: 'food',
    title: 'বোম্বে সুইটস ও কনফেকশনারি - কুষ্টিয়ায়র ঐতিহ্যবাহী মিষ্টি',
    description: 'কুষ্টিয়ায়র খাঁটি গাভির দুধের ঐতিহ্যবাহী বিশেষ চামচম, ক্ষীরসা, কাঁচাগোল্লা ও গরম গরম জিলাপি। পারিবারিক উপহার ও উৎসবের মিষ্টির পাইকারি ও খুচরা সরবরাহ।',
    price: '৩৫০ - ৬৫০ ৳/কেজি',
    location: 'শহীদ ডা. জিকরুল হক রোড, কুষ্টিয়া',
    subcategory: 'ঐতিহ্যবাহী মিষ্টি',
    contactPhone: '01711998811',
    whatsapp: '01711998811',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    authorName: 'বোম্বে সুইটস কুষ্টিয়া',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    isVerified: true,
    featured: true,
    details: {
      foodType: 'মিষ্টি ও ডেজার্ট',
      cuisine: 'ঐতিহ্যবাহী বাঙালি মিষ্টি',
      deliveryAvailable: true,
      menuHighlights: 'চামচম, রসগোল্লা, ক্ষীরভোগ, রসমালাই',
      menuItems: [
        { name: 'স্পেশাল চমচম', price: '৪৫০ ৳', ingredients: 'খাঁটি গাভির দুধের ছানা, চিনি, মাওয়া' },
        { name: 'রাজভোগ', price: '৩৫০ ৳', ingredients: 'ছানা, জাফরান, পেস্তা বাদাম' },
        { name: 'রসমালাই', price: '৫০০ ৳', ingredients: 'ঘন দুধ, ছোট রসগোল্লা, এলাচ' },
        { name: 'কাঁচাগোল্লা', price: '৪০০ ৳', ingredients: 'টাটকা ছানা, চিনি' }
      ]
    }
  },
  {
    id: 'food-2',
    category: 'food',
    title: 'কুষ্টিয়া রেলওয়ে স্পেশাল বিরিয়ানি ও কাচ্চি ঘর',
    description: 'খাসির শাহী কাচ্চি, সরিষার তেলে রান্না স্পেশাল বিফ তেহারি এবং মোরগ পোলাও। রেলওয়ে যাত্রীদের জন্য প্রি-অর্ডার ও পার্সেল প্যাকিং সুবিধা রয়েছে।',
    price: '১৮০ - ২৮০ ৳/প্লেট',
    location: 'রেলওয়ে স্টেশন মোড়, কুষ্টিয়া',
    subcategory: 'বিরিয়ানি ও কাবাব',
    contactPhone: '01722887766',
    whatsapp: '01722887766',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    authorName: 'স্টেশন বিরিয়ানি প্যালেস',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    isVerified: true,
    details: {
      foodType: 'বিরিয়ানি ও তেহারি',
      cuisine: 'মুঘলাই ও বাঙালি',
      deliveryAvailable: true,
      menuHighlights: 'কাচ্চি বিরিয়ানি, বিফ তেহারি, চিকেন চাপ',
      menuItems: [
        { name: 'খাসির শাহী কাচ্চি', price: '২৮০ ৳', ingredients: 'খাসির মাংস, বাসমতি চাল, আলু, আলু বোখারা, শাহী মশলা' },
        { name: 'বিফ তেহারি', price: '১৮০ ৳', ingredients: 'গরুর মাংস, পোলাও চাল, সরিষার তেল, কাঁচা মরিচ' },
        { name: 'চিকেন মোরগ পোলাও', price: '২২০ ৳', ingredients: 'দেশি মুরগি, পোলাও চাল, বাদাম বাটা, ঘি' },
        { name: 'বোরহানি', price: '৫০ ৳', ingredients: 'টক দই, পুদিনা, ধনেপাতা, বিট লবণ' }
      ]
    }
  },
  {
    id: 'food-3',
    category: 'food',
    title: 'ক্যাফে রয়েল অ্যান্ড রেস্টুরেন্ট (ক্যান্টনমেন্ট রোড)',
    description: 'এসি ও সুন্দর ইন্টেরিয়রসহ চাইনিজ, থাই স্যুপ, চিকেন ফ্রাই, বার্গার ও হট কফি। জন্মদিন, পারিবারিক পার্টি ও বন্ধুদের আড্ডার জন্য মনোরম পরিবেশ।',
    price: '২০০ - ৫০০ ৳',
    location: 'ক্যান্টনমেন্ট রোড, কুন্দল, কুষ্টিয়া',
    subcategory: 'ক্যাফে ও ফাস্টফুড',
    contactPhone: '01733445566',
    whatsapp: '01733445566',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    authorName: 'ক্যাফে রয়েল ম্যানেজমেন্ট',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    isVerified: true,
    details: {
      foodType: 'ফাস্টফুড ও চাইনিজ',
      cuisine: 'কন্টিনেন্টাল ও থাই',
      deliveryAvailable: true,
      menuHighlights: 'বার্গার, পিৎজা, পাস্তা, কোল্ড কফি',
      menuItems: [
        { name: 'চিকেন চিজ বার্গার', price: '২০০ ৳', ingredients: 'চিকেন প্যাটি, স্লাইস চিজ, মেয়োনিজ, লেটুস, টমেটো' },
        { name: 'স্পেশাল মিক্সড পিৎজা (১০ ইঞ্চি)', price: '৫০০ ৳', ingredients: 'চিকেন, বিফ কিমা, মাশরুম, ব্ল্যাক অলিভ, মোজারেলা চিজ' },
        { name: 'থাই স্যুপ', price: '২৫০ ৳', ingredients: 'চিকেন ব্রথ, চিংড়ি, মাশরুম, লেমনগ্রাস, থাই পাতা' },
        { name: 'কোল্ড কফি উইথ আইসক্রিম', price: '১৫০ ৳', ingredients: 'কফি, দুধ, চিনি, ভ্যানিলা আইসক্রিম, চকোলেট সিরাপ' }
      ]
    }
  },
  {
    id: 'food-4',
    category: 'food',
    title: 'ফুড ভিলেজ ফ্যামিলি ডাইনিং অ্যান্ড কাবাব কর্নার',
    description: 'চিকেন টিক্কা, রেশমি কাবাব, বাটার নান, মাটন কড়াই ও ফিরনি। পরিবার নিয়ে আরামদায়ক ডাইনিংয়ের জন্য কুষ্টিয়া শহরের অন্যতম শীর্ষ রেস্তোরাঁ।',
    price: '২৫০ - ৬০০ ৳',
    location: 'শেরে বাংলা রোড, কুষ্টিয়া',
    subcategory: 'পারিবারিক রেস্টুরেন্ট',
    contactPhone: '01755667788',
    whatsapp: '01755667788',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    authorName: 'ফুড ভিলেজ',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    isVerified: true,
    details: {
      foodType: 'ডিনার ও লাঞ্চ',
      cuisine: 'ইন্ডিয়ান ও দেশি',
      deliveryAvailable: true,
      menuHighlights: 'চিকেন বারবিকিউ, স্পেশাল নান, মিক্সড রাইস',
      menuItems: [
        { name: 'চিকেন বারবিকিউ (কোয়ার্টার)', price: '১৬০ ৳', ingredients: 'চিকেন, বিশেষ বারবিকিউ মশলা, মাস্টার্ড অয়েল' },
        { name: 'বাটার নান', price: '৪০ ৳', ingredients: 'ময়দা, দুধ, বাটার' },
        { name: 'মাটন কড়াই', price: '৩৫০ ৳', ingredients: 'খাসির মাংস, টমেটো, ক্যাপসিকাম, কড়াই মশলা' },
        { name: 'মিক্সড ফ্রাইড রাইস', price: '২২০ ৳', ingredients: 'পোলাও চাল, চিকেন, প্রন, ডিম, মিক্সড সবজি' }
      ]
    }
  }
];

export const FoodPage: React.FC<FoodPageProps> = ({ onBack, onOpenCreatePost }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('সব রেস্তোরাঁ');
  const [foodItems, setFoodItems] = useState<PostItem[]>(INITIAL_FOOD_PLACES);
  const [selectedRestaurant, setSelectedRestaurant] = useState<PostItem | null>(null);

  const subcategories = [
    'সব রেস্তোরাঁ',
    'ঐতিহ্যবাহী মিষ্টি',
    'বিরিয়ানি ও কাবাব',
    'ক্যাফে ও ফাস্টফুড',
    'পারিবারিক রেস্টুরেন্ট'
  ];

  // Subscribe to real-time posts from Firestore for food
  useEffect(() => {
    const unsub = subscribeToPosts((livePosts) => {
      const liveFood = livePosts.filter(p => p.category === 'food');
      if (liveFood.length > 0) {
        const combined = [...liveFood];
        INITIAL_FOOD_PLACES.forEach(init => {
          if (!combined.some(c => c.id === init.id)) {
            combined.push(init);
          }
        });
        setFoodItems(combined);
      }
    }, 'food');

    return () => unsub();
  }, []);

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.details?.menuHighlights || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSub = 
      selectedSubcategory === 'সব রেস্তোরাঁ' || item.subcategory === selectedSubcategory;

    return matchesSearch && matchesSub;
  });

  if (selectedRestaurant) {
    return (
      <RestaurantMenuDetail 
        restaurant={selectedRestaurant} 
        onBack={() => setSelectedRestaurant(null)} 
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Premium Hero Header */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-white rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-xs space-y-3.5">
        
        {/* Row 1: Back Button & Create Action Button */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-2xl bg-white border border-pink-200/80/80 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold">ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden xs:inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/40">
              কুষ্টিয়া ফুড গাইড 🍽️
            </span>
            {onOpenCreatePost && (
              <button
                onClick={onOpenCreatePost}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold shadow-sm shadow-amber-950/10 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>বিজ্ঞাপন দিন</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Title & Subtitle (Full width, never wrapped awkwardly) */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <UtensilsCrossed className="w-5 h-5 text-amber-700 shrink-0" />
            <span>কুষ্টিয়া রেস্টুরেন্ট ও বিখ্যাত খাবার</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
            ঐতিহ্যবাহী মিষ্টি, সুস্বাদু বিরিয়ানি, ক্যাফে ও পারিবারিক রেস্তোরাঁ ডিরেক্টরি
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="মিষ্টি, বিরিয়ানি, কাবাব, ফাস্টফুড বা রেস্তোরাঁ খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-amber-600 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shadow-2xs ${
                selectedSubcategory === sub
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-pink-200/80/80'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* RESTAURANTS & FOOD LIST */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-pink-200/80 text-center shadow-2xs">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো রেস্টুরেন্ট বা খাবার পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">অনুসন্ধান কিওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedRestaurant(item)}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all group overflow-hidden cursor-pointer space-y-3.5"
            >
              {/* Image Banner with Overlays */}
              {item.imageUrl && (
                <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-100 border border-pink-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-amber-800/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                      {item.subcategory || 'খাবার'}
                    </span>
                    {item.isVerified && (
                      <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        ভেরিফাইড
                      </span>
                    )}
                  </div>

                  {/* Top Right Price Badge */}
                  {item.price && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-md text-emerald-800 text-xs font-black px-3 py-1 rounded-xl shadow-sm border border-white/40">
                        {item.price}
                      </span>
                    </div>
                  )}

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-slate-100 drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {item.location}
                    </span>
                    {item.details?.deliveryAvailable && (
                      <span className="flex items-center gap-1 bg-emerald-600/90 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-xs">
                        <Bike className="w-3 h-3" />
                        হোম ডেলিভারি
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {item.details?.menuHighlights && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl text-[11px] font-semibold border border-amber-200/60">
                    <span className="text-amber-700 font-bold">প্রধান মেনু:</span> {item.details.menuHighlights}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-pink-100">
                <span className="text-[11px] text-amber-700 font-bold group-hover:underline">
                  সম্পূর্ণ মেনু ও অর্ডার দেখুন →
                </span>

                <div className="flex items-center gap-2">
                  {item.whatsapp && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          window.dispatchEvent(new CustomEvent('require-auth'));
                          return;
                        }
                        window.open(`https://wa.me/88${item.whatsapp!.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়াতে "${item.title}" খাবারের মেনু দেখে অর্ডার করতে চাচ্ছি।`)}`, '_blank');
                      }}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition-all font-bold text-xs flex items-center gap-1 active:scale-95 border border-emerald-200/60"
                      title="হোয়াটসঅ্যাপে অর্ডার দিন"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        window.dispatchEvent(new CustomEvent('require-auth'));
                        return;
                      }
                      window.open(`tel:${item.contactPhone}`, '_self');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>কল করুন</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
