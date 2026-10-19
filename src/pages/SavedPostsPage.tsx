import React from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Tag,
  Home
} from 'lucide-react';
import { PostItem, CategoryType } from '../types';

interface SavedPostsPageProps {
  posts: PostItem[];
  savedPostIds: string[];
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onNavigateToCategory: (cat: CategoryType) => void;
}

export const SavedPostsPage: React.FC<SavedPostsPageProps> = ({
  posts,
  savedPostIds,
  onToggleSave,
  onBack,
  onNavigateToCategory,
}) => {
  const savedList = posts.filter(p => savedPostIds.includes(p.id));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <Bookmark className="w-5 h-5 text-emerald-700 fill-emerald-700" />
              <span>সংরক্ষিত পোস্টসমূহ</span>
            </h2>
            <p className="text-xs text-slate-500">
              {savedList.length > 0 
                ? `আপনি মোট ${savedList.length}টি পোস্ট সেভ করে রেখেছেন` 
                : 'আপনার পছন্দের পোস্টগুলো বুকমার্ক করে রাখুন'}
            </p>
          </div>
        </div>

        {savedList.length > 0 && (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
            {savedList.length} টি পোস্ট
          </span>
        )}
      </div>

      {/* Posts List or Empty State */}
      {savedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-pink-200/80/80 shadow-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 mx-auto flex items-center justify-center text-emerald-700 mb-3">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">এখনো কোনো পোস্ট সংরক্ষিত নেই</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            বাসা ভাড়া, কেনাবেচা বা প্রয়োজনীয় যেকোনো পোস্টে বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন, যাতে পরে সহজে খুঁজে পান।
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => onNavigateToCategory('home')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>হোম ফিডে যান</span>
            </button>
            <button
              onClick={() => onNavigateToCategory('house-rent')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              বাসা ভাড়া দেখুন
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {savedList.map(item => {
            const cleanPhone = item.contactPhone?.replace(/[^0-9+]/g, '') || '';
            const whatsappLink = item.whatsapp
              ? `https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`
              : `https://wa.me/880${cleanPhone.slice(-10)}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs hover:border-emerald-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {item.subcategory || (item.category === 'house-rent' ? 'বাসা ভাড়া' : 'মার্কেট')}
                    </span>
                    {item.price && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleSave(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] font-medium"
                    title="সংরক্ষণ বাতিল করুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                {/* Contact & Action Buttons */}
                <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.authorPhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=landlord'}
                      alt={item.authorName}
                      className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                      {item.authorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cleanPhone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-emerald-700" />
                        <span>কল</span>
                      </a>
                    )}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
