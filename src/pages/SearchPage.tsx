import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Clock, X, ArrowUpRight, MapPin, Tag, SlidersHorizontal, Filter } from 'lucide-react';
import { PostItem } from '../types';
import { RAJSHAHI_AREAS } from '../data/initialData';

interface SearchPageProps {
  onBack: () => void;
  posts: PostItem[];
  onSelectResult: (category: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onBack, posts, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<PostItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Advanced Filters
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const parsePrice = (priceStr?: string) => {
    if (!priceStr) return 0;
    const bengaliToEnglish: Record<string, string> = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
    let converted = priceStr.replace(/[০-৯]/g, m => bengaliToEnglish[m] || m);
    let num = parseInt(converted.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    // Load recent searches
    const saved = localStorage.getItem('rajshahi_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const hasFilters = selectedCategory !== 'all' || selectedLocation !== 'all' || minPrice || maxPrice;

    if (query.trim().length > 0 || hasFilters) {
      const lowerQuery = query.toLowerCase();
      let results = posts;

      if (query.trim().length > 0) {
        results = results.filter(post => 
          post.title.toLowerCase().includes(lowerQuery) ||
          post.description.toLowerCase().includes(lowerQuery) ||
          post.location.toLowerCase().includes(lowerQuery) ||
          (post.subcategory && post.subcategory.toLowerCase().includes(lowerQuery))
        );
      }

      if (selectedCategory !== 'all') {
        results = results.filter(post => post.category === selectedCategory);
      }

      if (selectedLocation !== 'all') {
        results = results.filter(post => post.location.includes(selectedLocation));
      }

      if (minPrice) {
        const minNum = parsePrice(minPrice);
        results = results.filter(post => parsePrice(post.price) >= minNum);
      }

      if (maxPrice) {
        const maxNum = parsePrice(maxPrice);
        results = results.filter(post => {
          const price = parsePrice(post.price);
          return price > 0 && price <= maxNum; // Make sure it actually has a price and it's within range
        });
      }

      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query, posts, selectedCategory, selectedLocation, minPrice, maxPrice]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('rajshahi_recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('rajshahi_recent_searches', JSON.stringify(updated));
  };

  const handleSelect = (post: PostItem) => {
    saveRecentSearch(query || post.title);
    onSelectResult(post.category);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
  };

  const cleanQuickFilters = [
    { label: 'বাসা ভাড়া', category: 'house-rent' },
    { label: 'ডাক্তার', category: 'doctor' },
    { label: 'বাই-সেল', category: 'buy-sell' },
    { label: 'মিস্ত্রি', category: 'services' },
  ];

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 fixed inset-0 w-full overflow-y-auto">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-md mx-auto px-3 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="কুষ্টিয়াে কী খুঁজছেন?..."
                className="w-full bg-slate-100/80 text-slate-900 text-sm px-4 py-2.5 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all font-medium placeholder:font-normal placeholder:text-slate-400"
              />
              {query.length > 0 && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`p-2 rounded-xl border transition-colors shrink-0 flex items-center justify-center ${isAdvancedOpen ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-pink-200/80 text-slate-600 hover:bg-slate-100'}`}
              title="অ্যাডভান্সড ফিল্টার"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {isAdvancedOpen && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-pink-200/80 space-y-3 mb-1 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Filter className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-slate-800">অ্যাডভান্সড ফিল্টার</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ক্যাটাগরি</label>
                  <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-pink-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    <option value="house-rent">বাসা ভাড়া</option>
                    <option value="buy-sell">কেনাবেচা</option>
                    <option value="services">মিস্ত্রি ও সার্ভিস</option>
                    <option value="doctor">ডাক্তার</option>
                    <option value="blood">রক্তদাতা</option>
                    <option value="transport">পরিবহন</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">এলাকা / স্থান</label>
                  <select 
                    value={selectedLocation} 
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="w-full bg-white border border-pink-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="all">সব এলাকা</option>
                    {RAJSHAHI_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(selectedCategory === 'house-rent' || selectedCategory === 'buy-sell' || selectedCategory === 'all') && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">দামের রেঞ্জ (৳)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="সর্বনিম্ন" 
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-1/2 bg-white border border-pink-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input 
                      type="number" 
                      placeholder="সর্বোচ্চ" 
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-1/2 bg-white border border-pink-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Quick Filters */}
        {!query && !isAdvancedOpen && (
          <div className="mb-6 flex flex-wrap gap-2">
            {cleanQuickFilters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => onSelectResult(filter.category)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100/50 transition-colors"
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Suggestions List (YouTube style) */}
        {query.length > 0 || (isAdvancedOpen && (selectedCategory !== 'all' || selectedLocation !== 'all' || minPrice || maxPrice)) ? (
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-500 mb-2 px-2 flex items-center justify-between">
              <span>অনুসন্ধানের ফলাফল</span>
              <span className="text-emerald-700">{suggestions.length}টি পাওয়া গেছে</span>
            </h3>
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 py-3 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                >
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Tag className="w-3 h-3 text-emerald-500" />
                        {item.category === 'house-rent' ? 'বাসা ভাড়া' : item.category === 'buy-sell' ? 'কেনাবেচা' : item.category}
                      </span>
                      <span className="flex items-center gap-0.5 truncate">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {item.location}
                      </span>
                      {item.price && (
                        <span className="font-bold text-slate-700 ml-auto">
                          {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 shrink-0" />
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600">কোনো ফলাফল পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-1">ভিন্ন শব্দ বা ফিল্টার দিয়ে আবার খুঁজুন</p>
              </div>
            )}
          </div>
        ) : (
          /* Recent Searches */
          recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-800">সাম্প্রতিক অনুসন্ধান</h3>
                <button 
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('rajshahi_recent_searches');
                  }}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-600"
                >
                  ক্লিয়ার করুন
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    onClick={() => handleRecentClick(term)}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">{term}</span>
                    </div>
                    <button 
                      onClick={(e) => removeRecentSearch(term, e)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
