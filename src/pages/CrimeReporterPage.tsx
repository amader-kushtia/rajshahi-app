import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  EyeOff, 
  Eye,
  FileCheck,
  KeyRound,
  Shield
} from 'lucide-react';
import { PostItem } from '../types';
import { SecretCrimeBanner } from '../components/SecretCrimeBanner';

interface CrimeReporterPageProps {
  posts: PostItem[];
  onBack: () => void;
  onOpenCreateReport: () => void;
}

export const CrimeReporterPage: React.FC<CrimeReporterPageProps> = ({
  posts,
  onBack,
  onOpenCreateReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব অপরাধ');

  // CRITICAL: Crime & Secret reports are strictly restricted to APPROVED status for public view.
  // Pending reports are exclusively accessible to Admin in Admin Panel until verified and approved.
  const crimePosts = posts.filter(p => p.category === 'crime-reporter' && p.status === 'approved');

  const filteredPosts = crimePosts.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'সব অপরাধ' || 
      (item.details?.crimeCategory && item.details.crimeCategory.includes(selectedCategory)) ||
      (item.subcategory && item.subcategory.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  const categories = ['সব অপরাধ', 'মাদক ব্যবসা', 'দুর্নীতি', 'চাঁদাবাজি', 'অন্যান্য'];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
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
                <ShieldAlert className="w-5 h-5 text-indigo-700" />
                <span>গোপন অপরাধ ও দুর্নীতি রিপোর্টার</span>
              </h2>
              <p className="text-xs text-slate-500">পরিচয় গোপন রেখে কুষ্টিয়াকে অপরাধমুক্ত করুন</p>
            </div>
          </div>

          <button
            onClick={onOpenCreateReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>গোপন রিপোর্ট দিন</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="এলাকা বা অপরাধের তথ্য অনুসন্ধান করুন..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ultra Secure Flagship Secret Crime & Kushtia OC Banner */}
      <SecretCrimeBanner onOpenCrimeReporter={onOpenCreateReport} />

      {/* Crime Posts List */}
      <div className="space-y-3.5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-pink-200/80">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">কোনো তথ্য বা অপরাধ রিপোর্ট পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-400 mt-1">শহরে কোনো অসংগতি বা মাদক আড্ডা দেখলে নিরাপদে তথ্য দিন</p>
            <button
              onClick={onOpenCreateReport}
              className="mt-3 px-4 py-2 bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              গোপন রিপোর্ট জমা দিন
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{post.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 shrink-0">
                  {post.details?.crimeCategory || post.subcategory || 'অপরাধ রিপোর্ট'}
                </span>
              </div>

              {post.imageUrl && (
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                    প্রমাণ্য ছবি / অবস্থান
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {post.description}
              </p>

              {/* Author Badge */}
              <div className="pt-2.5 border-t border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${post.isAnonymous ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {post.isAnonymous ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {post.authorName} {post.isAnonymous ? '(গোপন পরিচয়)' : '(যাচাইকৃত নাগরিক)'}
                  </span>
                </div>

                <a
                  href="tel:999"
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200 transition-colors"
                >
                  প্রশাসন ৯৯৯
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
