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
  ArrowRight,
  ShieldCheck,
  Server,
  BarChart3,
  UserCheck,
  Megaphone,
  History,
  Activity,
  Image as ImageIcon
} from 'lucide-react';
import { PostItem, UserProfile, ActivityLog } from '../../types';
import { AdminTabType } from './AdminSidebarDrawer';
import { ManagedSponsoredCampaign, getAllSponsoredCampaigns } from '../../services/sponsoredService';
import { getManagedUsers, getActivityLogs } from '../../services/adminService';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostItem[];
  users?: UserProfile[];
  campaigns?: ManagedSponsoredCampaign[];
  logs?: ActivityLog[];
  onSelectTab: (tab: AdminTabType) => void;
  onEditPost: (post: PostItem) => void;
}

interface AdminFeatureShortcut {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  tab: AdminTabType;
  icon: any;
  color: string;
}

const ADMIN_FEATURE_SHORTCUTS: AdminFeatureShortcut[] = [
  {
    id: 'feat-overview',
    title: 'ওভারভিউ ও ড্যাশবোর্ড সামারি',
    category: 'ড্যাশবোর্ড',
    keywords: ['ড্যাশবোর্ড', 'ওভারভিউ', 'মেট্রিক্স', 'সামারি', 'overview', 'dashboard', 'stats'],
    tab: 'overview',
    icon: LayoutDashboard,
    color: 'text-emerald-600 bg-emerald-50'
  },
  {
    id: 'feat-posts',
    title: 'পোস্ট ও বিজ্ঞাপন মডারেশন',
    category: 'মডারেশন',
    keywords: ['পোস্ট', 'বিজ্ঞাপন', 'মডারেশন', 'অনুমোদন', 'ডিলিট', 'posts', 'ads', 'approve'],
    tab: 'posts',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'feat-crime',
    title: 'গোপন তথ্য ও ক্রাইম রিপোর্ট ডেস্ক',
    category: 'আইন-শৃঙ্খলা',
    keywords: ['গোপন', 'ক্রাইম', 'রিপোর্ট', 'অপরাধ', 'অভিযোগ', 'crime', 'secret', 'reports'],
    tab: 'secret-reports',
    icon: ShieldAlert,
    color: 'text-rose-600 bg-rose-50'
  },
  {
    id: 'feat-users',
    title: 'ইউজার ও নাগরিক মেম্বারস কন্ট্রোল',
    category: 'সদস্য',
    keywords: ['ইউজার', 'মেম্বার', 'নাগরিক', 'ব্লক', 'ব্যান', 'users', 'members', 'block'],
    tab: 'users',
    icon: Users,
    color: 'text-purple-600 bg-purple-50'
  },
  {
    id: 'feat-sponsored',
    title: 'স্পন্সরড ব্যানার ও বিজ্ঞাপন ক্যাম্পেইন',
    category: 'বিজ্ঞাপন',
    keywords: ['স্পন্সরড', 'পিকচার', 'ছবি', 'ক্যাম্পেইন', 'বিজ্ঞাপন', 'sponsored', 'picture', 'banner', 'campaigns'],
    tab: 'sponsored',
    icon: Sparkles,
    color: 'text-amber-600 bg-amber-50'
  },
  {
    id: 'feat-logs',
    title: 'সিস্টেম সিকিউরিটি ও অ্যাক্টিভিটি অডিট লগ',
    category: 'অডিট লগ',
    keywords: ['অডিট', 'লগ', 'ইতিহাস', 'লগইন', 'audit', 'logs', 'activity'],
    tab: 'logs',
    icon: History,
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    id: 'feat-broadcast',
    title: 'জরুরি সাইরেন ব্রডকাস্ট ও ফ্ল্যাশ ব্যানার',
    category: 'লাইভ নোটিশ',
    keywords: ['সাইরেন', 'ব্রডকাস্ট', 'ফ্ল্যাশ', 'ব্যবসায়িক', 'জরুরি', 'broadcast', 'siren', 'emergency'],
    tab: 'broadcast',
    icon: Radio,
    color: 'text-red-600 bg-red-50'
  },
  {
    id: 'feat-popup',
    title: 'এন্ট্রি পপআপ নোটিশ ও ওয়েলকাম ডায়ালগ',
    category: 'লাইভ নোটিশ',
    keywords: ['পপআপ', 'ওয়েলকাম', 'নোটিশ', 'ডায়ালগ', 'মেসেজ', 'popup', 'welcome', 'dialog'],
    tab: 'broadcast',
    icon: Bell,
    color: 'text-amber-600 bg-amber-50'
  },
  {
    id: 'feat-push',
    title: 'তাত্ক্ষণিক পুশ নোটিফিকেশন সেন্ডার',
    category: 'লাইভ নোটিশ',
    keywords: ['পুশ', 'নোটিফিকেশন', 'বার্তা', 'push', 'notification', 'send'],
    tab: 'push',
    icon: Bell,
    color: 'text-teal-600 bg-teal-50'
  },
  {
    id: 'feat-directory',
    title: 'ডাক্তার ও হেল্পলাইন ডিরেক্টরি',
    category: 'সিটিজেন সেবা',
    keywords: ['ডাক্তার', 'হাসপাতাল', 'হেল্পলাইন', 'ফোন', 'doctor', 'helpline', 'hospital'],
    tab: 'directory',
    icon: Stethoscope,
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    id: 'feat-blood',
    title: 'রক্তদাতা ডিরেক্টরি ও জরুরি রক্তের ডাক',
    category: 'সিটিজেন সেবা',
    keywords: ['রক্ত', 'ব্লাড', 'ডোনার', 'জরুরি', 'blood', 'donor'],
    tab: 'blood',
    icon: Droplet,
    color: 'text-rose-600 bg-rose-50'
  },
  {
    id: 'feat-transport',
    title: 'যানবাহন, ট্রেন ও বাস সময়সূচী',
    category: 'সিটিজেন সেবা',
    keywords: ['ট্রেন', 'বাস', 'পরিবহন', 'সময়সূচী', 'শিডিউল', 'train', 'bus', 'schedule'],
    tab: 'transport',
    icon: Train,
    color: 'text-sky-600 bg-sky-50'
  },
  {
    id: 'feat-grievance',
    title: 'নাগরিক অভিযোগ ও ড্রেনেজ সমস্যা ডেস্ক',
    category: 'সিটিজেন সেবা',
    keywords: ['অভিযোগ', 'সমস্যা', 'ড্রেনেজ', 'লাইটিং', 'grievance', 'report'],
    tab: 'grievance',
    icon: ShieldAlert,
    color: 'text-orange-600 bg-orange-50'
  },
  {
    id: 'feat-settings',
    title: 'সিস্টেম সেটিংস, থিম কালার ও মার্কার অ্যানাউন্সমেন্ট',
    category: 'কনফিগারেশন',
    keywords: ['সেটিংস', 'থিম', 'কালার', 'মার্কার', 'ঘোষণা', 'settings', 'theme', 'marquee'],
    tab: 'settings',
    icon: Settings,
    color: 'text-slate-600 bg-slate-100'
  },
  {
    id: 'feat-admins',
    title: 'অ্যাডমিন সিকিউরিটি ও পিন কোড পরিবর্তন',
    category: 'কনফিগারেশন',
    keywords: ['অ্যাডমিন', 'পিন', 'পাসওয়ার্ড', 'সিকিউরিটি', 'pin', 'password', 'security'],
    tab: 'admins',
    icon: KeyRound,
    color: 'text-amber-700 bg-amber-50'
  },
  {
    id: 'feat-export',
    title: 'ডেটা এক্সপোর্ট ও ব্যাকআপ ফাইল',
    category: 'কনফিগারেশন',
    keywords: ['ব্যাকআপ', 'এক্সপোর্ট', 'ডেটা', 'ডাউনলোড', 'export', 'backup'],
    tab: 'export',
    icon: Download,
    color: 'text-emerald-600 bg-emerald-50'
  },
  {
    id: 'feat-health',
    title: 'সিস্টেম সার্ভার হেলথ ও লেটেন্সি',
    category: 'ড্যাশবোর্ড',
    keywords: ['সার্ভার', 'হেলথ', 'লেটেন্সি', 'ফায়ারস্টোর', 'health', 'server', 'firebase'],
    tab: 'system-health',
    icon: Server,
    color: 'text-cyan-600 bg-cyan-50'
  },
  {
    id: 'feat-analytics',
    title: 'অ্যাডভান্সড ইউজার অ্যানালিটিক্স ও চার্ট',
    category: 'ড্যাশবোর্ড',
    keywords: ['চার্ট', 'অ্যানালিটিক্স', 'গ্রাফ', 'মেট্রিক', 'analytics', 'chart'],
    tab: 'analytics',
    icon: BarChart3,
    color: 'text-violet-600 bg-violet-50'
  }
];

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({
  isOpen,
  onClose,
  posts = [],
  users,
  campaigns,
  logs,
  onSelectTab,
  onEditPost
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'posts' | 'users' | 'campaigns' | 'logs' | 'features'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Keyboard shortcut listener within modal (ESC to close)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const managedUsers = users && users.length > 0 ? users : getManagedUsers();
  const allCampaigns = campaigns && campaigns.length > 0 ? campaigns : getAllSponsoredCampaigns();
  const allLogs = logs && logs.length > 0 ? logs : getActivityLogs();

  const trimmed = query.trim().toLowerCase();

  // Search Results Filtering
  const matchingFeatures = ADMIN_FEATURE_SHORTCUTS.filter(feat => {
    if (!trimmed) return true; // show features on empty query
    return (
      feat.title.toLowerCase().includes(trimmed) ||
      feat.category.toLowerCase().includes(trimmed) ||
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

  const matchingUsers = managedUsers.filter(u => {
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

  const matchingCampaigns = allCampaigns.filter(c => {
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

  const matchingLogs = allLogs.filter(l => {
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
    <div 
      className="fixed inset-0 z-[150] bg-slate-950/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-16 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl border border-pink-200/80 shadow-2xl overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input Bar */}
        <div className="p-4 border-b border-pink-100 flex items-center gap-3 bg-slate-50/80">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="যেকোনো কিছু খুঁজুন (পোস্ট, ইউজার, ক্যাম্পেইন, লগ, ফোন নম্বর, সেটিং...)"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
              title="মুছে ফেলুন"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200 rounded border border-pink-300">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Badges Bar: Posts, Users, Campaigns, Activity Logs */}
        <div className="px-4 py-2 bg-slate-100/70 border-b border-pink-200/80/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 shrink-0">ফিল্টার:</span>
          
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-pink-200/80/60'
            }`}
          >
            সবকিছু ({trimmed ? totalResultsCount : matchingFeatures.length})
          </button>

          <button
            onClick={() => setActiveFilter('posts')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeFilter === 'posts'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-pink-200/80/60'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Posts / পোস্ট ({matchingPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('users')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeFilter === 'users'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-pink-200/80/60'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Users / ইউজার ({matchingUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('campaigns')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeFilter === 'campaigns'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-pink-200/80/60'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Campaigns / ক্যাম্পেইন ({matchingCampaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('logs')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeFilter === 'logs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border border-pink-200/80/60'
            }`}
          >
            <History className="w-3 h-3" />
            <span>Activity Logs / লগ ({matchingLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('features')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeFilter === 'features'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-pink-200/80/60'
            }`}
          >
            <Settings className="w-3 h-3" />
            <span>ফিচার সেটিংস ({matchingFeatures.length})</span>
          </button>
        </div>

        {/* Search Results Scrollable Area */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-5 no-scrollbar">
          
          {/* No Results Fallback */}
          {trimmed && totalResultsCount === 0 && (
            <div className="py-12 text-center space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                "{query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-400">
                অন্য কোনো শিরোনাম, নাম, ফোন নম্বর বা কিওয়ার্ড দিয়ে অনুসন্ধান করে দেখুন।
              </p>
            </div>
          )}

          {/* SECTION 1: Matching Posts */}
          {(activeFilter === 'all' || activeFilter === 'posts') && matchingPosts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <span>পোস্ট ও বিজ্ঞাপনসমূহ ({matchingPosts.length})</span>
                <span className="text-[10px] text-emerald-600 font-bold">ক্লিক করে সম্পাদনা করুন</span>
              </div>

              <div className="space-y-2">
                {matchingPosts.slice(0, 8).map(post => (
                  <div
                    key={post.id}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-pink-200/80/80 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-pink-200/80" 
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {post.category}
                          </span>
                          {post.price && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {post.price}
                            </span>
                          )}
                          {post.isVerified && (
                            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> ভেরিফাইড
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors mt-0.5">
                          {post.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 truncate">
                          লেখক: {post.authorName} • {post.contactPhone} • {post.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onEditPost(post);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
                        title="পোস্ট সম্পাদনা করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>সম্পাদনা</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectTab('posts');
                          onClose();
                        }}
                        className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="পোস্ট তালিকায় দেখুন"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: Matching Users */}
          {(activeFilter === 'all' || activeFilter === 'users') && matchingUsers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <span>ইউজার ও নাগরিক মেম্বারস ({matchingUsers.length})</span>
                <span className="text-[10px] text-purple-600 font-bold">ইউজার ম্যানেজমেন্টে পরিচালনা করুন</span>
              </div>

              <div className="space-y-2">
                {matchingUsers.slice(0, 6).map(u => (
                  <div
                    key={u.uid}
                    onClick={() => {
                      onSelectTab('users');
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-pink-200/80/80 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
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

                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-purple-700 transition-colors mt-0.5">
                          {u.displayName}
                        </h4>

                        <p className="text-[11px] text-slate-500 truncate">
                          {u.phone || 'ফোন নেই'} • {u.email || 'ইমেইল নেই'} • {u.ward || u.address || 'কুষ্টিয়া'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-purple-700 shrink-0">
                      <span>ম্যানেজ করুন</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: Matching Sponsored Campaigns */}
          {(activeFilter === 'all' || activeFilter === 'campaigns') && matchingCampaigns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <span>স্পন্সরড ব্যানার ও বিজ্ঞাপন ক্যাম্পেইন ({matchingCampaigns.length})</span>
                <span className="text-[10px] text-amber-600 font-bold">ক্যাম্পেইন পরিচালনা করুন</span>
              </div>

              <div className="space-y-2">
                {matchingCampaigns.map(camp => {
                  const campImg = (camp.images && camp.images.length > 0 && camp.images[0]?.url) ? camp.images[0].url : null;
                  return (
                    <div
                      key={camp.id}
                      onClick={() => {
                        onSelectTab('sponsored');
                        onClose();
                      }}
                      className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-pink-200/80/80 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {campImg ? (
                          <img 
                            src={campImg} 
                            alt={camp.businessName} 
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-pink-200/80 shadow-2xs" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
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

                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-800 transition-colors mt-0.5">
                            {camp.businessName}
                          </h4>

                          <p className="text-[11px] text-slate-500 truncate">
                            {camp.tagline || camp.shortDescription || camp.phone || 'স্পন্সরড ব্যানার'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 shrink-0">
                        <span>ক্যাম্পেইনে দেখুন</span>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                <span>সিস্টেম অ্যাক্টিভিটি ও অডিট লগ ({matchingLogs.length})</span>
                <span className="text-[10px] text-indigo-600 font-bold">সম্পূর্ণ অডিট হিস্টোরি</span>
              </div>

              <div className="space-y-2">
                {matchingLogs.slice(0, 6).map(log => (
                  <div
                    key={log.id}
                    onClick={() => {
                      onSelectTab('logs');
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-pink-200/80/80 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
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
                      <span>লগে দেখুন</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Admin Features & Settings Shortcuts */}
          {(activeFilter === 'all' || activeFilter === 'features') && matchingFeatures.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                {!trimmed ? 'জনপ্রিয় এডমিন ফিচার ও সেটিংস শর্টকাট' : `এডমিন ফিচার ও শর্টকাট (${matchingFeatures.length})`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingFeatures.slice(0, 10).map(feat => {
                  const Icon = feat.icon;
                  return (
                    <button
                      key={feat.id}
                      onClick={() => {
                        onSelectTab(feat.tab);
                        onClose();
                      }}
                      className="p-3 bg-slate-50 hover:bg-emerald-50 text-left rounded-2xl border border-pink-200/80/80 transition-all flex items-center gap-3 group active:scale-[0.99] cursor-pointer"
                    >
                      <div className={`p-2.5 rounded-xl ${feat.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          {feat.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {feat.title}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 border-t border-pink-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">অ্যাডমিন গ্লোবাল সার্চ</span>
            <span>• যেকোনো কিওয়ার্ড টাইপ করে এন্টার দিন</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-pink-200/80 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
