import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Flame, 
  Clock, 
  Check, 
  ChevronRight,
  TrendingUp,
  Globe2,
  ShieldCheck
} from 'lucide-react';
import { fetchDailyLocalNews, LocalNewsItem, NewsResponse } from '../services/newsService';

interface DailyLocalNewsSectionProps {
  city?: string;
  onViewAll?: () => void;
}

export const DailyLocalNewsSection: React.FC<DailyLocalNewsSectionProps> = ({ 
  city = 'Kushtia' 
}) => {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadNews = async (force: boolean = false) => {
    if (force) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await fetchDailyLocalNews(city, force);
      setNewsData(data);
    } catch (_) {
      // Fallback already handled gracefully in service
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(false);
  }, [city]);

  const newsList = newsData?.news || [];

  const filteredNews = newsList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breakingNews = newsList.find(n => n.isBreaking) || newsList[0];

  const handleShare = async (item: LocalNewsItem) => {
    const shareData = {
      title: item.title,
      text: `${item.title} — ${item.source} (${item.publishedTime})। আমার কুষ্টিয়াতে পড়ুন।`,
      url: item.url || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(`${item.title}\n\n${item.summary}\nসূত্র: ${item.source}\n${item.url}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (_) {}
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'উন্নয়ন': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ঐতিহ্য': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'শিক্ষা': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'প্রশাসন': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'কৃষি': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'প্রযুক্তি': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'আবহাওয়া': return 'bg-sky-50 text-sky-700 border-sky-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="px-3 sm:px-4 mb-6">
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_4px_22px_rgba(0,0,0,0.06)] border border-slate-100">
        
        {/* 1. SECTION HEADER WITH GOOGLE SEARCH BRANDING */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[10px] font-black text-blue-700 tracking-tight shadow-xs">
                {/* Google Colors G Symbol */}
                <span className="font-extrabold text-[11px] text-blue-600">G</span>
                <span className="font-extrabold text-[11px] text-red-500">o</span>
                <span className="font-extrabold text-[11px] text-amber-500">o</span>
                <span className="font-extrabold text-[11px] text-blue-600">g</span>
                <span className="font-extrabold text-[11px] text-emerald-600">l</span>
                <span className="font-extrabold text-[11px] text-red-500">e</span>
                <span className="text-slate-600 ml-0.5">Search টুল দ্বারা চালিত</span>
              </span>

              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>লাইভ হেডলাইনস</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span>প্রতিদিনের কুষ্টিয়া খবর (Daily Local News)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              গুগল সার্চ ও শীর্ষ সংবাদমাধ্যম থেকে সরাসরি সংগৃহীত কুষ্টিয়ার সর্বশেষ সংবাদ
            </p>
          </div>

          {/* Refresh Action */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {newsData?.lastUpdated && (
              <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                আপডেট: {newsData.lastUpdated}
              </span>
            )}
            <button
              onClick={() => loadNews(true)}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-black border border-slate-200 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="গুগল সার্চ দিয়ে সর্বশেষ খবর রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isRefreshing ? 'খবর আসছে...' : 'তাজা খবর'}</span>
            </button>
          </div>
        </div>

        {/* 2. BREAKING NEWS TICKER BANNER */}
        {breakingNews && (
          <div className="my-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded-lg bg-white text-red-600 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                ব্রেকিং
              </span>
              <p className="text-xs font-bold truncate text-white drop-shadow-xs">
                {breakingNews.title}
              </p>
            </div>
            {breakingNews.url && (
              <a
                href={breakingNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-red-700 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>পড়ুন</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* 3. CATEGORY FILTER TABS & SEARCH */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'সব খবর' },
              { id: 'উন্নয়ন', label: 'উন্নয়ন ও অবকাঠামো' },
              { id: 'ঐতিহ্য', label: 'লালন ও রবীন্দ্র ঐতিহ্য' },
              { id: 'শিক্ষা', label: 'শিক্ষা ও ইবি ক্যাম্পাস' },
              { id: 'প্রশাসন', label: 'প্রশাসন ও স্বাস্থ্য' },
              { id: 'কৃষি', label: 'তাঁত ও তিলের খাজা' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick News Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="কুষ্টিয়ার কোনো বিশেষ খবর বা বিষয় খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* 4. NEWS CARDS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 animate-pulse space-y-2.5">
                <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded-md w-full"></div>
                <div className="h-3 bg-slate-200 rounded-md w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">কোনো খবর খুঁজে পাওয়া যায়নি</p>
            <p className="text-[11px] text-slate-400 mt-0.5">অন্য ক্যাটাগরি বা শব্দ দিয়ে চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Metadata Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      {item.tag && (
                        <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.publishedTime}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 leading-snug line-clamp-2 transition-colors mb-1.5">
                    {item.title}
                  </h4>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 font-normal">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Bar: Source and Direct Links */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-700">
                    <Globe2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate max-w-[130px]">{item.source}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all cursor-pointer"
                      title="খবরটি শেয়ার করুন"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </button>

                    {/* Read Full Story Button */}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white transition-all active:scale-95 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white"
                        title="মূল সংবাদপত্রে বিস্তারিত পড়ুন"
                      >
                        <span>বিস্তারিত</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
