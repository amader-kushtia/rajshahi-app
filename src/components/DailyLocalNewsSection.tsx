import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { fetchDailyLocalNews, LocalNewsItem, NewsResponse } from '../services/newsService';

// Memoized News Card
const NewsCard = React.memo(({ item, onShare }: { item: LocalNewsItem; onShare: (item: LocalNewsItem) => void }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    await onShare(item);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'উন্নয়ন': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ঐতিহ্য': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'শিক্ষা': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'প্রশাসন': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border ${getCategoryColor(item.category)}`}>
              {item.category}
            </span>
            {item.tag && (
              <span className="text-[9px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                {item.tag}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {item.publishedTime}
          </span>
        </div>
        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-700 leading-snug line-clamp-2 transition-colors mb-1.5">
          {item.title}
        </h4>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {item.summary}
        </p>
      </div>
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-700 dark:text-slate-300">
          <Globe2 className="w-3 h-3 text-blue-600" />
          <span className="truncate max-w-[100px]">{item.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleShare} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600">
            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
          </button>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
              <span>বিস্তারিত</span><ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

export const DailyLocalNewsSection: React.FC<DailyLocalNewsSectionProps> = ({ 
  city = 'Kushtia' 
}) => {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastManualRefresh, setLastManualRefresh] = useState<number>(0);

  const loadNews = useCallback(async (force: boolean = false) => {
    if (force) {
      if (Date.now() - lastManualRefresh < 1000 * 60 * 5) return;
      setIsRefreshing(true);
      setLastManualRefresh(Date.now());
    } else {
      setIsLoading(true);
    }
    try {
      const data = await fetchDailyLocalNews(city, force);
      setNewsData(data);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [city, lastManualRefresh]);

  useEffect(() => {
    loadNews(false);
    const interval = setInterval(() => loadNews(false), 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, [loadNews]);

  const handleShare = useCallback(async (item: LocalNewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title} — ${item.source} (${item.publishedTime})। আমার কুষ্টিয়া অ্যাপে দেখুন।`,
          url: item.url || window.location.href
        });
        return;
      } catch (_) {}
    }
    await navigator.clipboard.writeText(`${item.title}\n\n${item.summary}\nসূত্র: ${item.source}\n${item.url}`);
  }, []);

  const filteredNews = useMemo(() => {
    const list = newsData?.news || [];
    return list.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.source.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    }).slice(0, 20); // Hard limit for performance
  }, [newsData, activeCategory, searchQuery]);

  const breakingNews = useMemo(() => newsData?.news.find(n => n.isBreaking) || newsData?.news[0], [newsData]);

  return (
    <div className="px-3 sm:px-4 mb-6">
      <div className="bg-white dark:bg-slate-950 rounded-3xl p-4 sm:p-5 shadow-[0_4px_22px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>লাইভ আপডেট</span>
              </span>
            </div>
            <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span>প্রতিদিনের খবর</span>
            </h3>
          </div>
          <button
            onClick={() => loadNews(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-black shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'আসছে...' : 'রিফ্রেশ'}</span>
          </button>
        </div>

        {breakingNews && (
          <div className="my-3 p-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-1.5 py-0.5 rounded-lg bg-white text-red-600 text-[8px] font-black uppercase shrink-0">ব্রেকিং</span>
              <p className="text-[11px] font-bold truncate">{breakingNews.title}</p>
            </div>
          </div>
        )}

        <div className="mt-4">
           {isLoading ? (
             <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
           ) : filteredNews.length === 0 ? (
             <p className="text-center py-10 text-xs text-slate-500">কোনো খবর পাওয়া যায়নি।</p>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {filteredNews.map(item => <NewsCard key={item.id} item={item} onShare={handleShare} />)}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

interface DailyLocalNewsSectionProps {
  city?: string;
}
