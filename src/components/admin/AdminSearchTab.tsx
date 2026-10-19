import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Users, 
  ShieldAlert, 
  LayoutDashboard, 
  Radio, 
  Bell, 
  Stethoscope, 
  Droplet, 
  Train, 
  Sparkles, 
  Settings, 
  Download, 
  KeyRound, 
  Database, 
  PhoneCall, 
  Edit3, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ArrowLeft,
  ShieldCheck,
  Server,
  BarChart3,
  UserCheck,
  History,
  ExternalLink,
  Phone,
  Filter,
  Layers,
  ArrowRight,
  Info,
  Heart
} from 'lucide-react';
import { PostItem, UserProfile, ActivityLog } from '../../types';
import { AdminTabType } from './AdminSidebarDrawer';
import { ManagedSponsoredCampaign } from '../../services/sponsoredService';

interface AdminSearchTabProps {
  posts: PostItem[];
  users: UserProfile[];
  campaigns: ManagedSponsoredCampaign[];
  logs: ActivityLog[];
  onSelectTab: (tab: AdminTabType) => void;
  onEditPost: (post: PostItem) => void;
  onBackToOverview: () => void;
}

interface AdminFeatureShortcut {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  tab: AdminTabType;
  icon: any;
  color: string;
  description: string;
}

const ADMIN_FEATURE_SHORTCUTS: AdminFeatureShortcut[] = [
  {
    id: 'feat-overview',
    title: 'ওভারভিউ ও ড্যাশবোর্ড সামারি',
    category: 'ড্যাশবোর্ড',
    keywords: ['ড্যাশবোর্ড', 'ওভারভিউ', 'মেট্রিক্স', 'সামারি', 'overview', 'dashboard', 'stats'],
    tab: 'overview',
    icon: LayoutDashboard,
    color: 'text-emerald-700 bg-emerald-100',
    description: 'দৈনিক মেট্রিক্স, ভিজিটর চার্ট ও নাগরিক সামারি'
  },
  {
    id: 'feat-posts',
    title: 'পোস্ট ও বিজ্ঞাপন মডারেশন',
    category: 'মডারেশন',
    keywords: ['পোস্ট', 'বিজ্ঞাপন', 'মডারেশন', 'অনুমোদন', 'ডিলিট', 'posts', 'ads', 'approve'],
    tab: 'posts',
    icon: FileText,
    color: 'text-blue-700 bg-blue-100',
    description: 'নাগরিক পোস্ট যাচাই, অনুমোদন ও ডিলিট করুন'
  },
  {
    id: 'feat-crime',
    title: 'গোপন তথ্য ও ক্রাইম রিপোর্ট ডেস্ক',
    category: 'আইন-শৃঙ্খলা',
    keywords: ['গোপন', 'ক্রাইম', 'রিপোর্ট', 'অপরাধ', 'অভিযোগ', 'crime', 'secret', 'reports'],
    tab: 'secret-reports',
    icon: ShieldAlert,
    color: 'text-rose-700 bg-rose-100',
    description: 'নাগরিকদের পাঠানো গোপনীয় ক্রাইম ও দুর্নীতি অ্যালার্ট'
  },
  {
    id: 'feat-users',
    title: 'ইউজার ও নাগরিক মেম্বারস কন্ট্রোল',
    category: 'সদস্য',
    keywords: ['ইউজার', 'মেম্বার', 'নাগরিক', 'ব্লক', 'ব্যান', 'users', 'members', 'block'],
    tab: 'users',
    icon: Users,
    color: 'text-purple-700 bg-purple-100',
    description: 'নিবন্ধিত নাগরিক তালিকা, ভূমিকা ও ব্লক ব্যবস্থাপনা'
  },
  {
    id: 'feat-sponsored',
    title: 'স্পন্সরড ব্যানার ও বিজ্ঞাপন ক্যাম্পেইন',
    category: 'বিজ্ঞাপন',
    keywords: ['স্পন্সরড', 'পিকচার', 'ছবি', 'ক্যাম্পেইন', 'বিজ্ঞাপন', 'sponsored', 'picture', 'banner'],
    tab: 'sponsored',
    icon: Sparkles,
    color: 'text-amber-700 bg-amber-100',
    description: 'পৌর শহরের বিশিষ্ট শপ ও ব্র্যান্ড পার্টনার ব্যানার'
  },
  {
    id: 'feat-support',
    title: 'এডমিন ও সাপোর্ট হেল্পলাইন',
    category: 'সেবা',
    keywords: ['সাপোর্ট', 'হেল্পলাইন', 'হোয়াটসঅ্যাপ', 'ফেসবুক', 'support', 'helpline', 'whatsapp', 'facebook'],
    tab: 'support',
    icon: PhoneCall,
    color: 'text-teal-700 bg-teal-100',
    description: 'হোয়াটসঅ্যাপ ও ফেসবুক আইডি যোগাযোগের অন/অফ সেটিংস'
  },
  {
    id: 'feat-broadcast',
    title: 'জরুরি সাইরেন ব্রডকাস্ট ও ফ্ল্যাশ ব্যানার',
    category: 'লাইভ নোটিশ',
    keywords: ['সাইরেন', 'ব্রডকাস্ট', 'ফ্ল্যাশ', 'ব্যবসায়িক', 'জরুরি', 'broadcast', 'siren', 'emergency'],
    tab: 'broadcast',
    icon: Radio,
    color: 'text-red-700 bg-red-100',
    description: 'শহরের বাসিন্দাদের তাৎক্ষণিক সতর্কবার্তা ও ফ্ল্যাশ অ্যানাউন্সমেন্ট'
  },
  {
    id: 'feat-push',
    title: 'তাত্ক্ষণিক পুশ নোটিফিকেশন সেন্ডার',
    category: 'লাইভ নোটিশ',
    keywords: ['পুশ', 'নোটিফিকেশন', 'বার্তা', 'push', 'notification', 'send'],
    tab: 'push',
    icon: Bell,
    color: 'text-teal-700 bg-teal-100',
    description: 'নাগরিকদের ডিভাইসে সরাসরি অফিশিয়াল পুশ মেসেজ পাঠান'
  },
  {
    id: 'feat-directory',
    title: 'ডাক্তার ও হেল্পলাইন ডিরেক্টরি',
    category: 'সিটিজেন সেবা',
    keywords: ['ডাক্তার', 'হাসপাতাল', 'হেল্পলাইন', 'ফোন', 'doctor', 'helpline', 'hospital'],
    tab: 'directory',
    icon: Stethoscope,
    color: 'text-indigo-700 bg-indigo-100',
    description: 'ডাক্তারদের চেম্বার ও জরুরি সিরিয়াল নম্বর পরিচালনা'
  },
  {
    id: 'feat-blood',
    title: 'রক্তদাতা ডিরেক্টরি ও জরুরি রক্তের ডাক',
    category: 'সিটিজেন সেবা',
    keywords: ['রক্ত', 'ব্লাড', 'ডোনার', 'জরুরি', 'blood', 'donor'],
    tab: 'blood',
    icon: Droplet,
    color: 'text-rose-700 bg-rose-100',
    description: 'ব্লাড ডোনারদের তালিকা ও রক্তের আবেদন ম্যানেজমেন্ট'
  },
  {
    id: 'feat-transport',
    title: 'যানবাহন, ট্রেন ও বাস সময়সূচী',
    category: 'সিটিজেন সেবা',
    keywords: ['ট্রেন', 'বাস', 'পরিবহন', 'সময়সূচী', 'শিডিউল', 'train', 'bus', 'schedule'],
    tab: 'transport',
    icon: Train,
    color: 'text-sky-700 bg-sky-100',
    description: 'কুষ্টিয়া রেলওয়ে স্টেশন ও বাস কাউন্টার শিডিউল'
  },
  {
    id: 'feat-grievance',
    title: 'নাগরিক অভিযোগ ও ড্রেনেজ সমস্যা ডেস্ক',
    category: 'সিটিজেন সেবা',
    keywords: ['অভিযোগ', 'সমস্যা', 'ড্রেনেজ', 'লাইটিং', 'grievance', 'report'],
    tab: 'grievance',
    icon: ShieldAlert,
    color: 'text-orange-700 bg-orange-100',
    description: 'শহরের নাগরিক সমস্যা, ভাঙা রাস্তা ও লাইটিং সমাধান'
  },
  {
    id: 'feat-volunteers',
    title: 'সেচ্ছাসেবী ম্যানেজমেন্ট',
    category: 'সিটিজেন সেবা',
    keywords: ['সেচ্ছাসেবী', 'ভলান্টিয়ার', 'volunteers', 'volunteer', 'management'],
    tab: 'volunteers',
    icon: Heart,
    color: 'text-emerald-700 bg-emerald-100',
    description: 'সেচ্ছাসেবীদের তালিকা ও কার্যক্রম পরিচালনা'
  },
  {
    id: 'feat-settings',
    title: 'সিস্টেম সেটিংস, থিম কালার ও মার্টির অ্যানাউন্সমেন্ট',
    category: 'কনফিগারেশন',
    keywords: ['সেটিংস', 'থিম', 'কালার', 'মার্কার', 'ঘোষণা', 'settings', 'theme', 'marquee'],
    tab: 'settings',
    icon: Settings,
    color: 'text-slate-700 bg-slate-200',
    description: 'অ্যাপের নাম, স্লোগান, থিম কালার ও স্ক্রলিং নোটিশ'
  },
  {
    id: 'feat-admins',
    title: 'অ্যাডমিন সিকিউরিটি ও পিন কোড পরিবর্তন',
    category: 'কনফিগারেশন',
    keywords: ['অ্যাডমিন', 'পিন', 'পাসওয়ার্ড', 'সিকিউরিটি', 'pin', 'password', 'security'],
    tab: 'admins',
    icon: KeyRound,
    color: 'text-amber-800 bg-amber-100',
    description: '৬ সংখ্যার সিকিউরড পিন কোড ও লগইন সুরক্ষাব্যবস্থা'
  },
  {
    id: 'feat-logs',
    title: 'সিস্টেম সিকিউরিটি ও অ্যাক্টিভিটি অডিট লগ',
    category: 'কনফিগারেশন',
    keywords: ['অডিট', 'লগ', 'ইতিহাস', 'লগইন', 'audit', 'logs', 'activity'],
    tab: 'logs',
    icon: History,
    color: 'text-indigo-800 bg-indigo-100',
    description: 'এডমিন কার্যক্রম ও সিস্টেম অডিট ইতিহাসের টাইমলাইন'
  },
  {
    id: 'feat-export',
    title: 'ডেটা এক্সপোর্ট ও ব্যাকআপ ফাইল',
    category: 'কনফিগারেশন',
    keywords: ['ব্যাকআপ', 'এক্সপোর্ট', 'ডেটা', 'ডাউনলোড', 'export', 'backup'],
    tab: 'export',
    icon: Download,
    color: 'text-emerald-800 bg-emerald-100',
    description: 'পোস্ট, ডোনার ও নাগরিক তালিকার JSON / CSV ডাউনলোড'
  }
];

export const AdminSearchTab: React.FC<AdminSearchTabProps> = ({
  posts = [],
  users = [],
  campaigns = [],
  logs = [],
  onSelectTab,
  onEditPost,
  onBackToOverview
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'posts' | 'users' | 'campaigns' | 'logs' | 'features'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus on page mount
  useEffect(() => {
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const trimmed = query.trim().toLowerCase();

  // Search Results Filtering
  const matchingFeatures = ADMIN_FEATURE_SHORTCUTS.filter(feat => {
    if (!trimmed) return true;
    return (
      feat.title.toLowerCase().includes(trimmed) ||
      feat.category.toLowerCase().includes(trimmed) ||
      feat.description.toLowerCase().includes(trimmed) ||
      feat.keywords.some(k => k.toLowerCase().includes(trimmed))
    );
  });

  const matchingPosts = posts.filter(post => {
    if (!trimmed) return false;
    return (
      post.title?.toLowerCase().includes(trimmed) ||
      post.description?.toLowerCase().includes(trimmed) ||
      post.location?.toLowerCase().includes(trimmed) ||
      post.authorName?.toLowerCase().includes(trimmed) ||
      post.contactPhone?.includes(trimmed) ||
      post.category?.toLowerCase().includes(trimmed) ||
      post.id?.toLowerCase().includes(trimmed) ||
      (post.price && post.price.toLowerCase().includes(trimmed))
    );
  });

  const matchingUsers = users.filter(u => {
    if (!trimmed) return false;
    return (
      u.displayName?.toLowerCase().includes(trimmed) ||
      u.email?.toLowerCase().includes(trimmed) ||
      u.phone?.includes(trimmed) ||
      u.role?.toLowerCase().includes(trimmed) ||
      u.uid?.toLowerCase().includes(trimmed) ||
      u.address?.toLowerCase().includes(trimmed) ||
      u.ward?.toLowerCase().includes(trimmed)
    );
  });

  const matchingCampaigns = campaigns.filter(c => {
    if (!trimmed) return false;
    return (
      c.businessName?.toLowerCase().includes(trimmed) ||
      c.tagline?.toLowerCase().includes(trimmed) ||
      c.shortDescription?.toLowerCase().includes(trimmed) ||
      c.phone?.includes(trimmed) ||
      c.badge?.toLowerCase().includes(trimmed) ||
      c.discountBadge?.toLowerCase().includes(trimmed) ||
      c.location?.toLowerCase().includes(trimmed) ||
      c.id?.toLowerCase().includes(trimmed)
    );
  });

  const matchingLogs = logs.filter(l => {
    if (!trimmed) return false;
    return (
      l.title?.toLowerCase().includes(trimmed) ||
      l.description?.toLowerCase().includes(trimmed) ||
      l.actor?.toLowerCase().includes(trimmed) ||
      l.type?.toLowerCase().includes(trimmed) ||
      l.id?.toLowerCase().includes(trimmed)
    );
  });

  const totalResultsCount = 
    matchingFeatures.length + 
    matchingPosts.length + 
    matchingUsers.length +
    matchingCampaigns.length +
    matchingLogs.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToOverview}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors border border-pink-200/80/80 shadow-2xs shrink-0 cursor-pointer"
              title="ওভারভিউতে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  অ্যাডমিন গ্লোবাল সার্চ ও এক্সপ্লোরার
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ফুল পেজ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                সম্পূর্ণ পোর্টাল, পোস্ট, ইউজার, স্পন্সরড ক্যাম্পেইন, অডিট লগ ও সেটিংস থেকে তাৎক্ষণিক অনুসন্ধান
              </p>
            </div>
          </div>

          {/* Quick Summary Counts */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-pink-200/80/80">
              পোস্ট: {posts.length}টি
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-pink-200/80/80">
              ইউজার: {users.length}জন
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-pink-200/80/80">
              ক্যাম্পেইন: {campaigns.length}টি
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Full-Width Search Input Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-sm space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-emerald-700">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="যেকোনো কিছু খুঁজুন — পোস্টের নাম, বিবরণ, মোবাইল নম্বর, ব্যবহারকারী, নোটিশ বা সেটিংস..."
            className="w-full pl-12 sm:pl-14 pr-24 py-3.5 sm:py-4 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-2 border-pink-200/80/80 focus:border-pink-600 rounded-2xl sm:rounded-3xl text-xs sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all shadow-inner"
          />
          {query ? (
            <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="absolute inset-y-0 right-4 hidden sm:flex items-center">
              <span className="px-2 py-1 text-[11px] font-mono font-bold bg-white text-slate-400 rounded-lg border border-pink-200/80 shadow-2xs">
                Ctrl + K
              </span>
            </div>
          )}
        </div>

        {/* Filter Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>ফিল্টার:</span>
          </span>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-pink-200/80/60'
            }`}
          >
            সবকিছু ({trimmed ? totalResultsCount : matchingFeatures.length})
          </button>

          <button
            onClick={() => setActiveFilter('posts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'posts'
                ? 'bg-emerald-600 text-white shadow-xs font-black'
                : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-pink-200/80/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>পোস্ট ও বিজ্ঞাপন ({matchingPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'users'
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'bg-slate-100 hover:bg-purple-50 hover:text-purple-800 text-slate-700 border border-pink-200/80/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ইউজার ও নাগরিক ({matchingUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('campaigns')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'campaigns'
                ? 'bg-amber-600 text-white shadow-xs font-black'
                : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-pink-200/80/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ক্যাম্পেইন ({matchingCampaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('logs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'logs'
                ? 'bg-indigo-600 text-white shadow-xs font-black'
                : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 border border-pink-200/80/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>অ্যাক্টিভিটি লগ ({matchingLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('features')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'features'
                ? 'bg-slate-700 text-white shadow-xs font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-pink-200/80/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>এডমিন সেটিংস ({matchingFeatures.length})</span>
          </button>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="space-y-6">

        {/* Empty Search Feedback */}
        {trimmed && totalResultsCount === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-200/80/80 shadow-xs space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              "{query}" এর জন্য কোনো ফলাফল খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              দয়া করে বানান পরীক্ষা করুন অথবা অন্য কোনো শিরোনাম, মোবাইল নম্বর বা কিওয়ার্ড দিয়ে পুনরায় অনুসন্ধান করুন।
            </p>
            <button
              onClick={() => setQuery('')}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              সার্চ রিসেট করুন
            </button>
          </div>
        )}

        {/* SECTION 1: Matching Posts */}
        {(activeFilter === 'all' || activeFilter === 'posts') && matchingPosts.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900">
                  পোস্ট ও বিজ্ঞাপনসমূহ ({matchingPosts.length}টি)
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('posts')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>পোস্ট ডেস্কে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {matchingPosts.map(post => (
                <div
                  key={post.id}
                  className="p-4 bg-slate-50/70 hover:bg-emerald-50/40 rounded-2xl border border-pink-200/80/80 hover:border-pink-300 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3.5">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-pink-200/80 shadow-2xs" 
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                          {post.category}
                        </span>
                        {post.price && (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {post.price}
                          </span>
                        )}
                        {post.isVerified && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ভেরিফাইড
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {post.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-pink-200/80/60 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-slate-700">{post.authorName}</span>
                      <span>• {post.contactPhone}</span>
                      <span>• {post.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onEditPost(post)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
                        title="পোস্ট সম্পাদনা করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>সম্পাদনা</span>
                      </button>

                      <button
                        onClick={() => onSelectTab('posts')}
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="পোস্ট তালিকায় দেখুন"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: Matching Users */}
        {(activeFilter === 'all' || activeFilter === 'users') && matchingUsers.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-700" />
                <h3 className="text-sm font-black text-slate-900">
                  ইউজার ও নাগরিক মেম্বারস ({matchingUsers.length}জন)
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('users')}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>ইউজার ম্যানেজমেন্টে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {matchingUsers.map(u => (
                <div
                  key={u.uid}
                  onClick={() => onSelectTab('users')}
                  className="p-4 bg-slate-50/70 hover:bg-purple-50/40 rounded-2xl border border-pink-200/80/80 hover:border-purple-300 transition-all flex items-center justify-between gap-3.5 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                      {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {u.role === 'admin' ? 'এডমিন' : 'সিটিজেন'}
                        </span>
                        {u.status === 'blocked' && (
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                            ব্লকড
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-purple-700 transition-colors mt-0.5">
                        {u.displayName || 'নামহীন নাগরিক'}
                      </h4>

                      <p className="text-[11px] text-slate-500 truncate">
                        {u.phone || u.email || 'মোবাইল নম্বর নেই'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-purple-700 shrink-0">
                    <span>ম্যানেজ</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Matching Sponsored Campaigns */}
        {(activeFilter === 'all' || activeFilter === 'campaigns') && matchingCampaigns.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-black text-slate-900">
                  স্পন্সরড ব্যানার ও বিজ্ঞাপন ক্যাম্পেইন ({matchingCampaigns.length}টি)
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('sponsored')}
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>ক্যাম্পেইন ডেস্কে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {matchingCampaigns.map(camp => {
                const campImg = (camp.images && camp.images.length > 0 && camp.images[0]?.url) ? camp.images[0].url : null;
                return (
                  <div
                    key={camp.id}
                    onClick={() => onSelectTab('sponsored')}
                    className="p-4 bg-slate-50/70 hover:bg-amber-50/40 rounded-2xl border border-pink-200/80/80 hover:border-amber-300 transition-all flex items-center justify-between gap-3.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {campImg ? (
                        <img 
                          src={campImg} 
                          alt={camp.businessName} 
                          className="w-13 h-13 rounded-2xl object-cover shrink-0 border border-pink-200/80 shadow-2xs" 
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                            camp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {camp.isActive ? 'সক্রিয় ক্যাম্পেইন' : 'নিষ্ক্রিয়'}
                          </span>
                          {camp.badge && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md">
                              {camp.badge}
                            </span>
                          )}
                          {camp.discountBadge && (
                            <span className="text-[9px] font-medium bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                              {camp.discountBadge}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-amber-800 transition-colors mt-0.5">
                          {camp.businessName}
                        </h4>

                        <p className="text-[11px] text-slate-500 truncate">
                          {camp.tagline || camp.shortDescription || camp.phone || 'স্পন্সরড ব্যানার'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 shrink-0">
                      <span>দেখুন</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: Matching Activity Logs */}
        {(activeFilter === 'all' || activeFilter === 'logs') && matchingLogs.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-700" />
                <h3 className="text-sm font-black text-slate-900">
                  অ্যাক্টিভিটি ও অডিট লগ ({matchingLogs.length}টি)
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('logs')}
                className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>অডিট ডেস্কে যান</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchingLogs.map(log => (
                <div
                  key={log.id}
                  onClick={() => onSelectTab('logs')}
                  className="p-3.5 bg-slate-50/70 hover:bg-indigo-50/40 rounded-2xl border border-pink-200/80/80 hover:border-indigo-300 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <History className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {log.actor || 'সিস্টেম'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors mt-0.5">
                        {log.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 truncate">
                        {log.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: Admin Features & Settings Shortcuts */}
        {(activeFilter === 'all' || activeFilter === 'features') && matchingFeatures.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-black text-slate-900">
                  {!trimmed ? 'জনপ্রিয় এডমিন ফিচার ও সেটিংস শর্টকাট' : `এডমিন ফিচার ও শর্টকাট (${matchingFeatures.length}টি)`}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                এক ক্লিকে সরাসরি বিভাগে যান
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchingFeatures.map(feat => {
                const Icon = feat.icon;
                return (
                  <button
                    key={feat.id}
                    onClick={() => onSelectTab(feat.tab)}
                    className="p-4 bg-slate-50/70 hover:bg-emerald-50/50 text-left rounded-2xl border border-pink-200/80/80 hover:border-pink-300 transition-all flex items-start gap-3.5 group active:scale-[0.99] cursor-pointer"
                  >
                    <div className={`p-3 rounded-2xl ${feat.color} shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                        {feat.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-emerald-800 transition-colors mt-0.5">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {feat.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
