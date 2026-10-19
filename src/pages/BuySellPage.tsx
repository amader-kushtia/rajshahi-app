import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShoppingBag, 
  CheckCircle2, 
  Filter, 
  PlusCircle, 
  Tag,
  Facebook,
  ChevronDown,
  ShieldCheck,
  Star
} from 'lucide-react';
import { PostItem } from '../types';
import { KUSHTIA_AREAS } from '../data/initialData';
import { PostReviewModal } from '../components/PostReviewModal';
import { useAuth } from '../context/AuthContext';

interface BuySellPageProps {
  posts: PostItem[];
  onBack: () => void;
  onOpenCreatePost: () => void;
}

export const BuySellPage: React.FC<BuySellPageProps> = ({
  posts,
  onBack,
  onOpenCreatePost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcat, setSelectedSubcat] = useState('সব');
  const [selectedCondition, setSelectedCondition] = useState('সব কন্ডিশন');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [visibleCount, setVisibleCount] = useState(20);

  const { user, openAuthModal } = useAuth();
  const [selectedPostForReview, setSelectedPostForReview] = useState<PostItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const buySellPosts = posts.filter(p => p.category === 'buy-sell');

  const parsePrice = (priceStr?: string) => {
    if (!priceStr) return 0;
    const bengaliToEnglish: Record<string, string> = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    let converted = priceStr.replace(/[০-৯]/g, m => bengaliToEnglish[m] || m);
    let num = parseInt(converted.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const filteredPosts = buySellPosts.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubcat = 
      selectedSubcat === 'সব' || (item.subcategory && item.subcategory.includes(selectedSubcat));

    const matchesCondition = 
      selectedCondition === 'সব কন্ডিশন' || 
      (item.details?.condition && item.details.condition === selectedCondition);

    return matchesSearch && matchesSubcat && matchesCondition;
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
  }, [searchQuery, selectedSubcat, selectedCondition, sortBy]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const subcategories = ['সব', 'স্মার্টফোন', 'মোটরসাইকেল', 'আসবাবপত্র', 'ইলেকট্রনিক্স'];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
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
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>বাই-সেল মার্কেটপ্লেস</span>
              </h2>
              <p className="text-xs text-slate-500">কুষ্টিয়ায়র নতুন ও পুরোনো পণ্য ক্রয়-বিক্রয়</p>
            </div>
          </div>

          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>বিজ্ঞাপন দিন</span>
          </button>
        </div>

        {/* Dedicated Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য বা মডেল অনুসন্ধান করুন (যেমন: Discover 125, Redmi, ফ্রিজ)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
          />
        </div>

        {/* Subcategories */}
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

        {/* Condition & Sort Filter */}
        <div className="mt-2.5 pt-2.5 border-t border-pink-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="text-xs bg-slate-50 border border-pink-200/80 rounded-lg px-2.5 py-1 text-slate-800 font-medium"
            >
              <option value="সব কন্ডিশন">সব কন্ডিশন</option>
              <option value="ব্যবহৃত">ব্যবহৃত (Used)</option>
              <option value="নতুন">নতুন (Brand New)</option>
              <option value="অরিজিনাল কন্ডিশন">অরিজিনাল কন্ডিশন</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-pink-200/80 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:border-pink-600"
            >
              <option value="newest">নতুন পোস্ট</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
          
          <span className="text-[11px] text-slate-400">
            মোট: <b className="text-emerald-800">{filteredPosts.length}</b> টি
          </span>
        </div>
      </div>

      {/* Grid of Buy-Sell listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-pink-200/80">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">কোনো পণ্যের বিজ্ঞাপন পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-400 mt-1">আপনার অব্যবহৃত কোনো পণ্য বিক্রি করতে বিজ্ঞাপন দিন</p>
            <button
              onClick={onOpenCreatePost}
              className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              ফ্রি বিজ্ঞাপন পোস্ট করুন
            </button>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const cleanPhone = post.contactPhone.replace(/[^0-9]/g, '');
            const whatsappNumber = (post.whatsapp || post.contactPhone).replace(/[^0-9]/g, '');
            const whatsappLink = `https://wa.me/88${whatsappNumber}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমার কুষ্টিয়াতে আপনার "${post.title}" পণ্যের বিক্রয় বিজ্ঞাপনটি দেখেছি। এটি কি এখনো পাওয়া যাবে?`)}`;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-pink-200/80/90 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between overflow-hidden"
              >
                {post.imageUrl && (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 flex-wrap max-w-[90%]">
                      <span className="bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {post.subcategory || 'পণ্য'}
                      </span>
                      {post.details?.condition && (
                        <span className="bg-white/90 backdrop-blur-xs text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {post.details.condition}
                        </span>
                      )}
                      {post.featured && (
                        <span className="bg-orange-500/95 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center shadow-sm">
                          PROMOTED
                        </span>
                      )}
                    </div>
                    {post.price && (
                      <div className="absolute bottom-2.5 right-2.5 bg-emerald-700 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-md">
                        {post.price}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(post.location + ', Kushtia, Nilphamari')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 mb-1 hover:text-emerald-700 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="text-slate-500 font-medium truncate">{post.location}</span>
                    </a>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-pink-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800 flex items-center gap-1 truncate max-w-[120px]">
                        {post.authorName}
                        {post.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      </span>
                      <span className="text-[10px] text-slate-400">বিক্রেতা</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedPostForReview(post);
                          setIsReviewModalOpen(true);
                        }}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-colors"
                        title="রিভিউ দিন"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-600" />
                      </button>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors"
                        title="সরাসরি কল"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      
                      {post.facebook && (
                        <a
                          href={post.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-lg text-xs font-bold transition-colors"
                          title="ফেসবুক"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">চ্যাট</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {filteredPosts.length > visibleCount && (
          <div className="col-span-full pt-2 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="w-full py-3 px-4 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ChevronDown className="w-4 h-4 text-emerald-700" />
              <span>আরও ২০টি পণ্যের বিজ্ঞাপন দেখুন ({filteredPosts.length - visibleCount}টি বাকি)</span>
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
