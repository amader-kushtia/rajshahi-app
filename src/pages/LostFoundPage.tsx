import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  PackageSearch, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  MessageCircle, 
  FileQuestion, 
  AlertCircle, 
  Tag, 
  Award,
  Sparkles,
  Facebook
} from 'lucide-react';
import { PostItem } from '../types';
import { subscribeToPosts } from '../services/postService';

interface LostFoundPageProps {
  onBack: () => void;
  onOpenCreatePost?: () => void;
}

const INITIAL_LOST_FOUND_POSTS: PostItem[] = [
  {
    id: 'lf-1',
    category: 'lost-found',
    title: 'জাতীয় পরিচয়পত্র ও মোটরসাইকেল ড্রাইভিং লাইসেন্স হারিয়েছে',
    description: 'বিমানবন্দর রোড থেকে কেন্দ্রীয় বাস টার্মিনাল যাওয়ার পথে একটি বাদামি রঙের চামড়ার মানিব্যাগে মো. তানভীর ইসলাম নামের স্মার্ট এনআইডি কার্ড, বিআরটিএ ড্রাইভিং লাইসেন্স ও প্রয়োজনীয় কাগজপত্র ছিল। কোনো সহৃদয়বান ব্যক্তি সন্ধান পেলে উপযুক্ত পুরস্কার দেওয়া হবে।',
    location: 'বিমানবন্দর রোড - বাস টার্মিনাল, কুষ্টিয়া',
    subcategory: 'আইডি কার্ড ও নথিপত্র',
    contactPhone: '01711223344',
    whatsapp: '01711223344',
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80',
    authorName: 'মো. তানভীর ইসলাম',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    isVerified: true,
    details: {
      lostFoundType: 'lost',
      lostDate: '১১ সেপ্টেম্বর ২০২৬ (সন্ধ্যা ৭টা)',
      itemType: 'জাতীয় পরিচয়পত্র ও ড্রাইভিং লাইসেন্স'
    }
  },
  {
    id: 'lf-2',
    category: 'lost-found',
    title: 'কুষ্টিয়া রেলওয়ে স্টেশনের ওয়েটিং রুমে চাবির তোড়া পাওয়া গেছে',
    description: '১ নম্বর প্ল্যাটফর্মের ভিআইপি ওয়েটিং রুমের সোফায় বাজাজ পালসার মোটরসাইকেলের একটি চাবি ও সাথে ৩টি ছোট চাবির তোড়া পড়ে থাকতে দেখা গেছে। উপযুক্ত প্রমাণ দিয়ে যোগাযোগ করে চাবি ফেরত নিতে অনুরোধ করা হলো।',
    location: 'কুষ্টিয়া রেলওয়ে স্টেশন, প্ল্যাটফর্ম ১',
    subcategory: 'চাবি ও আনুষঙ্গিক',
    contactPhone: '01799887766',
    whatsapp: '01799887766',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    authorName: 'রেলওয়ে টিকিট কাউন্টার স্টাফ',
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    isVerified: true,
    details: {
      lostFoundType: 'found',
      lostDate: '১০ সেপ্টেম্বর ২০২৬ (সকাল ১১টা)',
      itemType: 'চাবির তোড়া'
    }
  },
  {
    id: 'lf-3',
    category: 'lost-found',
    title: 'নয়া বাজারে কালো কাভারসহ স্যামসাং স্মার্টফোন হারিয়ে গেছে',
    description: 'গতকাল বিকেলে নয়া বাজার মাছ বাজার ও মিষ্টির গলি থেকে কেনাকাটার সময় পকেট থেকে স্যামসাং গ্যালাক্সি মোবাইলটি পড়ে যায়। ডিসপ্লেতে কালো রঙের গ্লাস ও ব্যাকসাইডে একটি প্রেস কার্ডের স্টিকার রয়েছে। অনুগ্রহ করে ফেরত দিলে কৃতজ্ঞ থাকব।',
    location: 'নয়া বাজার মিষ্টির গলি, কুষ্টিয়া',
    subcategory: 'মোবাইল ও ইলেকট্রনিক্স',
    contactPhone: '01744556677',
    whatsapp: '01744556677',
    authorName: 'হাফিজুর রহমান',
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    isVerified: false,
    details: {
      lostFoundType: 'lost',
      lostDate: '০৯ সেপ্টেম্বর ২০২৬ (বিকেল ৫টা)',
      itemType: 'স্যামসাং স্মার্টফোন'
    }
  },
  {
    id: 'lf-4',
    category: 'lost-found',
    title: 'ক্যান্টনমেন্ট রোডে এইচএসসি পরীক্ষার প্রবেশপত্র ও রেজিস্ট্রেশন কার্ড পাওয়া গেছে',
    description: 'কুষ্টিয়া ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজের প্রবেশদ্বারের কাছে রোদসী জাহান নামের এক ছাত্রীর ২০২৬ সালের এইচএসসি পরীক্ষার মূল অ্যাডমিট কার্ড ও রেজিস্ট্রেশন কার্ড পাওয়া গেছে। সংশ্লিষ্ট শিক্ষার্থী জরুরি ভিত্তিতে কল করুন।',
    location: 'ক্যান্টনমেন্ট রোড, কুন্দল, কুষ্টিয়া',
    subcategory: 'আইডি কার্ড ও নথিপত্র',
    contactPhone: '01722334455',
    whatsapp: '01722334455',
    authorName: 'কামরুল হাসান (ফার্মেসি ব্যবসায়ী)',
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
    isVerified: true,
    details: {
      lostFoundType: 'found',
      lostDate: '০৮ সেপ্টেম্বর ২০২৬ (দুপুর ১২টা)',
      itemType: 'পরীক্ষার অ্যাডমিট ও রেজিস্ট্রেশন'
    }
  }
];

export const LostFoundPage: React.FC<LostFoundPageProps> = ({ onBack, onOpenCreatePost }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('সব বস্তু');
  const [items, setItems] = useState<PostItem[]>(INITIAL_LOST_FOUND_POSTS);

  const subcategories = [
    'সব বস্তু',
    'আইডি কার্ড ও নথিপত্র',
    'মানিব্যাগ ও টাকা',
    'মোবাইল ও ইলেকট্রনিক্স',
    'চাবি ও আনুষঙ্গিক',
    'অন্যান্য জিনিস'
  ];

  // Subscribe to real-time posts from Firestore for lost-found
  useEffect(() => {
    const unsub = subscribeToPosts((livePosts) => {
      const liveItems = livePosts.filter(p => p.category === 'lost-found');
      if (liveItems.length > 0) {
        const combined = [...liveItems];
        INITIAL_LOST_FOUND_POSTS.forEach(init => {
          if (!combined.some(c => c.id === init.id)) {
            combined.push(init);
          }
        });
        setItems(combined);
      }
    }, 'lost-found');

    return () => unsub();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.details?.itemType || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = 
      activeTab === 'all' || item.details?.lostFoundType === activeTab;

    const matchesSub = 
      selectedSubcategory === 'সব বস্তু' || item.subcategory === selectedSubcategory;

    return matchesSearch && matchesTab && matchesSub;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-800 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <PackageSearch className="w-5 h-5 text-orange-600" />
                <span>কুষ্টিয়া হারানো ও প্রাপ্তি বোর্ড</span>
              </h2>
              <p className="text-xs text-slate-500">আইডি কার্ড, মূল্যবান নথিপত্র বা সামগ্রী হারানো/প্রাপ্তি পোস্ট করুন</p>
            </div>
          </div>

          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-900/10 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>হারানো/প্রাপ্তি পোস্ট দিন</span>
            </button>
          )}
        </div>

        {/* Tab Switcher: All, Lost, Found */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>সব বিজ্ঞপ্তি ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lost')}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'lost'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>হারিয়ে গেছে ({items.filter(i => i.details?.lostFoundType === 'lost').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              activeTab === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>পাওয়া গেছে ({items.filter(i => i.details?.lostFoundType === 'found').length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="আইডি কার্ড, মানিব্যাগ, মোবাইল বা স্থান লিখে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600"
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
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-pink-200/80 text-center">
            <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো নোটিশ পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">আপনার কোনো জিনিস হারিয়ে গেলে বা খুঁজে পেলে পোস্ট করুন।</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isLost = item.details?.lostFoundType === 'lost';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-pink-300 transition-all group relative overflow-hidden"
              >
                {/* Status Ribbon */}
                <div className="absolute top-0 right-0">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 text-white ${
                    isLost ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}>
                    {isLost ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>হারিয়ে গেছে</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>পাওয়া গেছে</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 mb-3">
                  {item.imageUrl && (
                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-pink-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="flex-1 pr-14 sm:pr-0">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-orange-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 flex-wrap text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <MapPin className="w-3 h-3 text-orange-600" />
                        {item.location}
                      </span>
                      {item.details?.lostDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.details.lostDate}
                        </span>
                      )}
                      {item.subcategory && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                          {item.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-pink-100">
                  <div className="text-[11px] text-slate-500">
                    পোস্টদাতা: <span className="font-bold text-slate-800">{item.authorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.whatsapp && (
                      <a
                        href={`https://wa.me/88${item.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়া অ্যাপে "${item.title}" সংক্রান্ত নোটিশ দেখে যোগাযোগ করছি।`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                        title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
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
                      className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল: {item.contactPhone}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
