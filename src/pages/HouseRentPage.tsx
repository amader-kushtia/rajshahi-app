import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Home, 
  CheckCircle2, 
  Filter, 
  PlusCircle, 
  Share2, 
  Calendar,
  Facebook,
  ChevronDown,
  ShieldCheck,
  Star
} from 'lucide-react';
import { PostItem } from '../types';
import { RAJSHAHI_AREAS } from '../data/initialData';
import { PostReviewModal } from '../components/PostReviewModal';
import { useAuth } from '../context/AuthContext';

interface HouseRentPageProps {
  posts: PostItem[];
  onBack: () => void;
  onOpenCreatePost: () => void;
}

export const HouseRentPage: React.FC<HouseRentPageProps> = ({
  posts,
  onBack,
  onOpenCreatePost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcat, setSelectedSubcat] = useState('সব');
  const [selectedArea, setSelectedArea] = useState('সব এলাকা');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [visibleCount, setVisibleCount] = useState(20);

  const { user, openAuthModal } = useAuth();
  const [selectedPostForReview, setSelectedPostForReview] = useState<PostItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const houseRentPosts = posts.filter(p => p.category === 'house-rent');

  const parsePrice = (priceStr?: string) => {
    if (!priceStr) return 0;
    const bengaliToEnglish: Record<string, string> = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    let converted = priceStr.replace(/[০-৯]/g, m => bengaliToEnglish[m] || m);
    let num = parseInt(converted.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const filteredPosts = houseRentPosts.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubcat = 
      selectedSubcat === 'সব' || item.subcategory === selectedSubcat;

    const matchesArea = 
      selectedArea === 'সব এলাকা' || item.location.includes(selectedArea);

    return matchesSearch && matchesSubcat && matchesArea;
  }).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    if (sortBy === 'newest') return b.createdAt - a.createdAt;
    
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);
    
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    return 0;
  });

  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery, selectedSubcat, selectedArea, sortBy]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const subcategories = ['সব', 'ফ্যামিলি বাসা', 'ব্যাচেলর মেস', 'সাবলেট', 'অফিস/দোকান'];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Home className="w-5 h-5 text-emerald-700" />
                <span>বাসা ভাড়া ও মেস সার্ভিস</span>
              </h2>
              <p className="text-xs text-slate-500">কুষ্টিয়া শহরের ফ্যামিলি ফ্ল্যাট, ব্যাচেলর মেস ও সাবলেট</p>
            </div>
          </div>

          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ভাড়ার পোস্ট দিন</span>
          </button>
        </div>

        {/* Dedicated Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বাসা, মেস বা এলাকা খুঁজুন (যেমন: রেলওয়ে কলোনি, ৩ রুম)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white transition-all"
          />
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcat(sub)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedSubcat === sub
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Area Filter & Sort Selector */}
        <div className="mt-2.5 pt-2.5 border-t border-pink-100 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-xs bg-slate-50 border border-pink-200/80 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:border-pink-600"
            >
              <option value="সব এলাকা">সকল এলাকা</option>
              {RAJSHAHI_AREAS.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-pink-200/80 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:border-pink-600"
            >
              <option value="newest">নতুন পোস্ট</option>
              <option value="price-low">ভাড়া: কম থেকে বেশি</option>
              <option value="price-high">ভাড়া: বেশি থেকে কম</option>
            </select>
          </div>
          
          <span className="text-[11px] text-slate-400">
            মোট: <b className="text-emerald-800">{filteredPosts.length}</b> টি
          </span>
        </div>
      </div>

      {/* House Rent Listings List */}
      <div className="space-y-3.5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-pink-200/80">
            <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">কোনো বাসা ভাড়ার পোস্ট পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-400 mt-1">অনুসন্ধান পরিবর্তন করুন অথবা আপনি নিজেই নতুন ভাড়ার পোস্ট দিন</p>
            <button
              onClick={onOpenCreatePost}
              className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              নতুন ভাড়ার পোস্ট যোগ করুন
            </button>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const cleanPhone = post.contactPhone.replace(/[^0-9]/g, '');
            const whatsappNumber = (post.whatsapp || post.contactPhone).replace(/[^0-9]/g, '');
            const whatsappLink = `https://wa.me/88${whatsappNumber}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমার কুষ্টিয়া অ্যাপে আপনার "${post.title}" বাসা ভাড়ার পোস্টটি দেখলাম। বিস্তারিত জানতে চাচ্ছি।`)}`;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-pink-200/80/90 shadow-xs hover:border-emerald-200 transition-all overflow-hidden"
              >
                {/* Image Banner */}
                {post.imageUrl && (
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap max-w-[90%]">
                      <span className="bg-emerald-800/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                        {post.subcategory || 'বাসা ভাড়া'}
                      </span>
                      {post.isVerified && (
                        <span className="bg-white/90 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          যাচাইকৃত
                        </span>
                      )}
                      {post.featured && (
                        <span className="bg-orange-500/95 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center shadow-sm">
                          PROMOTED
                        </span>
                      )}
                    </div>
                    {post.price && (
                      <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-xs text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-md border border-white/20">
                        {post.price}
                      </div>
                    )}
                  </div>
                )}

                {/* Content Details */}
                <div className="p-4">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(post.location + ', Rajshahi, Nilphamari')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 hover:text-emerald-700 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-600 font-medium">{post.location}</span>
                  </a>

                  <h3 className="text-base font-bold text-slate-900 hover:text-emerald-800 transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {post.description}
                  </p>

                  {/* Rooms, Floor info tags */}
                  {post.details && (
                    <div className="flex flex-wrap gap-2 mb-3.5 text-[11px]">
                      {post.details.rooms && (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-700 font-semibold rounded-lg border border-pink-100">
                          🛏️ {post.details.rooms}
                        </span>
                      )}
                      {post.details.bathrooms && (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-700 font-semibold rounded-lg border border-pink-100">
                          🚿 {post.details.bathrooms}
                        </span>
                      )}
                      {post.details.floor && (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-700 font-semibold rounded-lg border border-pink-100">
                          🏢 {post.details.floor}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Post author & Direct Contact Buttons */}
                  <div className="pt-3 border-t border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorPhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=landlord'}
                        alt={post.authorName}
                        className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          {post.authorName}
                          {post.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                        </span>
                        <span className="text-[10px] text-slate-400">বাড়িওয়ালা / দায়িত্বপ্রাপ্ত</span>
                      </div>
                    </div>

                    {/* Call & WhatsApp Quick Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPostForReview(post);
                          setIsReviewModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold border border-amber-200 transition-colors"
                        title="রিভিউ দিন"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-600" />
                        <span className="hidden sm:inline">রিভিউ</span>
                      </button>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>সরাসরি কল</span>
                      </a>

                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>হোয়াটসঅ্যাপ</span>
                      </a>

                      {post.facebook && (
                        <a
                          href={post.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-none flex items-center justify-center p-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl text-xs font-bold transition-colors"
                          title="ফেসবুকে যোগাযোগ করুন"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {filteredPosts.length > visibleCount && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="w-full py-3 px-4 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ChevronDown className="w-4 h-4 text-emerald-700" />
              <span>আরও ২০টি বাসা ভাড়া পোস্ট দেখুন ({filteredPosts.length - visibleCount}টি বাকি)</span>
            </button>
          </div>
        )}
      </div>

      <PostReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        post={selectedPostForReview}
        user={user}
        onOpenAuthModal={openAuthModal}
      />
    </div>
  );
};
