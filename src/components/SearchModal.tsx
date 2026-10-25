import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, ArrowRight, Mic, MicOff, Loader2 } from 'lucide-react';
import { PostItem, CategoryType } from '../types';
import { KUSHTIA_AREAS } from '../data/initialData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostItem[];
  onSelectPost: (category: CategoryType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
    }
  }, [isOpen]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজার ভয়েস সার্চ সাপোর্ট করে না। দয়া করে ক্রোম ব্রাউজার ব্যবহার করুন।');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  const results = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-emerald-100 dark:border-slate-800 mt-6 sm:mt-12 overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 pb-3 border-b border-pink-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-emerald-700 dark:text-emerald-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কুষ্টিয়ায়র যেকোনো সেবা খুঁজুন..."
            autoFocus
            className="w-full text-sm font-semibold text-slate-900 dark:text-white bg-transparent placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={handleVoiceSearch}
            className={`p-1.5 rounded-full transition-colors ${
              isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title="ভয়েস সার্চ"
          >
            {isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Area Suggestions */}
        {!query && (
          <div className="pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              জনপ্রিয় এলাকা ও বিষয়
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['মজমপুর', 'কোর্টপাড়া', 'থানাপাড়া', 'হাউজিং এস্টেট', 'এনএস রোড', 'ফ্যামিলি বাসা', 'বাইক', 'রক্ত'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-800 dark:hover:text-emerald-400 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
            <div className="text-[11px] font-bold text-slate-400">
              ফলাফল: {results.length} টি পাওয়া গেছে
            </div>

            {results.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                "{query}" এর সাথে মিল রেখে কিছু পাওয়া যায়নি।
              </div>
            ) : (
              results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPost(item.category);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-pink-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-emerald-50/80 dark:hover:bg-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors block">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {item.location}
                      </span>
                      {item.price && (
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.price}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
