import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Heart, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Star, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Send, 
  Plus, 
  ExternalLink, 
  MessageCircle, 
  Bookmark, 
  AlertTriangle,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  Filter,
  Loader2
} from 'lucide-react';
import { PostItem, CategoryType, ServiceReview, UserProfile } from '../types';
import { useThana } from '../context/ThanaContext';
import { 
  getReviewsForTarget, 
  submitServiceReview, 
  formatReviewerId,
  subscribeToReviews 
} from '../services/reviewService';
import { 
  getMasterPosts, 
  fetchPostsPaginated,
  likePost, 
  unlikePost,
  DEFAULT_PAGE_SIZE
} from '../services/postService';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface HomeCommunityFeedProps {
  onNavigate: (category: CategoryType) => void;
  onPostClick?: (post: PostItem) => void;
  onOpenCreatePost?: (category?: CategoryType) => void;
  currentUser?: UserProfile | null;
}

// 11 Categories specified by user + 'all'
interface FilterTab {
  id: string;
  label: string;
  emoji: string;
  categories: CategoryType[];
  color: string;
}

const FEED_TABS: FilterTab[] = [
  { id: 'all', label: 'সব পোস্ট', emoji: '✨', categories: [], color: 'from-blue-600 to-indigo-700' },
  { id: 'house-rent', label: 'বাসা ভাড়া', emoji: '🏠', categories: ['house-rent'], color: 'from-purple-600 to-indigo-600' },
  { id: 'buy-sell', label: 'বাই-সেল', emoji: '🏷️', categories: ['buy-sell'], color: 'from-cyan-600 to-blue-600' },
  { id: 'blood', label: 'রক্তদাতা', emoji: '🩸', categories: ['blood', 'blood-request'], color: 'from-rose-600 to-red-700' },
  { id: 'crime-reporter', label: 'গোপন তথ্য', emoji: '🔒', categories: ['crime-reporter'], color: 'from-amber-600 to-orange-700' },
  { id: 'food', label: 'রেস্টুরেন্ট ও খাবার', emoji: '🍽️', categories: ['food'], color: 'from-emerald-600 to-teal-700' },
  { id: 'jobs', label: 'চাকরি ও নিয়োগ', emoji: '💼', categories: ['jobs'], color: 'from-blue-600 to-sky-700' },
  { id: 'lost-found', label: 'হারানো ও প্রাপ্তি', emoji: '🔍', categories: ['lost-found'], color: 'from-indigo-600 to-violet-700' },
  { id: 'legal', label: 'আইনি সহায়তা', emoji: '⚖️', categories: ['legal'], color: 'from-slate-700 to-slate-900' },
  { id: 'events', label: 'অনুষ্ঠান ও ডেকোর', emoji: '🎪', categories: ['events'], color: 'from-pink-600 to-rose-600' },
  { id: 'driver', label: 'ড্রাইভার', emoji: '🚗', categories: ['driver', 'transport'], color: 'from-emerald-700 to-teal-800' },
  { id: 'tutor', label: 'গৃহশিক্ষক', emoji: '📚', categories: ['tutor'], color: 'from-amber-700 to-yellow-800' },
  { id: 'news', label: 'খবর', emoji: '📰', categories: ['news'], color: 'from-blue-700 to-indigo-800' },
];

// Memoized Post Card for massive performance boost
const PostCard = React.memo(({ 
  post, 
  onPostClick, 
  onNavigate, 
  currentUser, 
  isLiked, 
  onToggleLike, 
  onShare,
  onOpenReview,
  isOpenReview
}: { 
  post: PostItem; 
  onPostClick?: (post: PostItem) => void;
  onNavigate: (cat: CategoryType) => void;
  currentUser?: UserProfile | null;
  isLiked: boolean;
  onToggleLike: (postId: string) => void;
  onShare: (post: PostItem) => void;
  onOpenReview: (postId: string) => void;
  isOpenReview: boolean;
}) => {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToReviews((all) => {
      setReviews(all.filter(r => r.targetId === post.id));
    });
    return () => unsub();
  }, [post.id]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return (post.rating || 5.0).toFixed(1);
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews, post.rating]);

  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return 'আজ';
    const diffMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (diffMinutes < 1) return 'এইমাত্র';
    if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} দিন আগে`;
    return `${Math.floor(diffDays / 30)} মাস আগে`;
  };

  const getCategoryMeta = (cat: CategoryType) => {
    switch (cat) {
      case 'house-rent': return { label: 'বাসা ভাড়া', bg: 'bg-purple-100 text-purple-800 border-purple-200', emoji: '🏠' };
      case 'buy-sell': return { label: 'বাই-সেল', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', emoji: '🏷️' };
      case 'blood':
      case 'blood-request': return { label: 'রক্তদাতা', bg: 'bg-rose-100 text-rose-800 border-rose-200', emoji: '🩸' };
      case 'crime-reporter': return { label: 'গোপন তথ্য 🔒', bg: 'bg-amber-100 text-amber-900 border-amber-300 font-black', emoji: '🔒' };
      case 'food': return { label: 'রেস্টুরেন্ট ও খাবার', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', emoji: '🍽️' };
      case 'jobs': return { label: 'চাকরি ও নিয়োগ', bg: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '💼' };
      case 'lost-found': return { label: 'হারানো ও প্রাপ্তি', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', emoji: '🔍' };
      case 'legal': return { label: 'আইনি সহায়তা', bg: 'bg-slate-100 text-slate-800 border-slate-300', emoji: '⚖️' };
      case 'events': return { label: 'অনুষ্ঠান ও ডেকোর', bg: 'bg-pink-100 text-pink-800 border-pink-200', emoji: '🎪' };
      case 'driver':
      case 'transport': return { label: 'ড্রাইভার', bg: 'bg-teal-100 text-teal-800 border-teal-200', emoji: '🚗' };
      case 'tutor': return { label: 'গৃহশিক্ষক', emoji: '📚', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      case 'news': return { label: 'আজকের খবর', bg: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '📰' };
      default: return { label: 'নাগরিক সেবা', bg: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '📢' };
    }
  };

  const catMeta = getCategoryMeta(post.category);

  const handleReviewSubmit = async () => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitServiceReview({
        targetId: post.id,
        targetType: 'post',
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL || undefined,
        rating,
        comment
      });
      setSuccessMsg('ধন্যবাদ! আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে।');
      setComment('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'রিভিউ দিতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/90 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all">
      {/* Post Header */}
      <div className="p-3.5 sm:p-4 flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            {post.authorPhoto ? (
              <img src={post.authorPhoto} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0C3E8A] to-[#0A4CC7] text-white font-black text-sm flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                {post.authorName.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-none">{post.authorName}</h3>
              {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 text-white shrink-0" />}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mt-1">
              <span>{getTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-red-500" /><span className="truncate max-w-[120px]">{post.location}</span></span>
            </div>
          </div>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${catMeta.bg}`}>
          <span>{catMeta.emoji}</span><span>{catMeta.label}</span>
        </span>
      </div>

      {/* Post Content */}
      <div className="px-3.5 sm:px-4 pb-2">
        <h4 onClick={() => onPostClick?.(post)} className="text-sm sm:text-[15px] font-black text-slate-900 dark:text-slate-100 leading-snug hover:text-blue-700 cursor-pointer mb-1.5">{post.title}</h4>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed whitespace-pre-line line-clamp-4">{post.description}</p>
        
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {post.price && <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 px-2.5 py-0.5 rounded-lg text-[11px] font-black">🏷️ {post.price}</span>}
          {post.details?.bloodGroup && <span className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 px-2.5 py-0.5 rounded-lg text-[11px] font-black animate-pulse">🩸 {post.details.bloodGroup}</span>}
        </div>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div onClick={() => onPostClick?.(post)} className="relative w-full max-h-72 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer mt-1">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      {/* Actions */}
      <div className="px-3.5 sm:px-4 py-2 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href={`tel:${post.contactPhone}`} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-all">
            <Phone className="w-3 h-3" /><span>কল দিন</span>
          </a>
          {post.whatsapp && (
            <a href={`https://wa.me/88${post.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-[11px] shadow-xs transition-all">
              <MessageCircle className="w-3 h-3" /><span>হোয়াটসঅ্যাপ</span>
            </a>
          )}
        </div>
        <button onClick={() => onPostClick?.(post)} className="text-blue-700 dark:text-blue-400 hover:underline font-bold text-[11px] flex items-center gap-1">
          বিস্তারিত <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Social Reactions */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] shadow-2xs"><ThumbsUp className="w-2.5 h-2.5" /></div>
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] shadow-2xs"><Heart className="w-2.5 h-2.5 fill-white" /></div>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-400">{post.likes || 15} জন লাইক করেছেন</span>
        </div>
        <div onClick={() => onOpenReview(post.id)} className="flex items-center gap-1 cursor-pointer hover:text-blue-700 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span className="text-slate-800 dark:text-slate-200">{avgRating}</span>
          <span>({reviews.length} রিভিউ)</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-2 py-1 grid grid-cols-3 gap-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => onToggleLike(post.id)} className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${isLiked ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-600' : ''}`} /><span>লাইক</span>
        </button>
        <button onClick={() => onOpenReview(post.id)} className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${isOpenReview ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Star className={`w-4 h-4 ${isOpenReview ? 'fill-amber-400 text-amber-500' : ''}`} /><span>রিভিউ</span>
        </button>
        <button onClick={() => onShare(post)} className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <Share2 className="w-4 h-4" /><span>শেয়ার</span>
        </button>
      </div>

      {/* Inline Review Form */}
      {isOpenReview && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
             <h5 className="text-xs font-black dark:text-white">আপনার রেটিং দিন</h5>
             <div className="flex items-center gap-1">
               {[1,2,3,4,5].map(s => (
                 <Star 
                   key={s} 
                   onClick={() => setRating(s)} 
                   onMouseEnter={() => setHoverRating(s)} 
                   onMouseLeave={() => setHoverRating(0)}
                   className={`w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${s <= (hoverRating || rating) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} 
                 />
               ))}
             </div>
          </div>
          <textarea 
            rows={2} 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="আপনার মতামত লিখুন..." 
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
          {successMsg && <p className="text-[10px] text-emerald-600 font-bold mt-2">{successMsg}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => onOpenReview('')} className="px-3 py-1.5 text-xs font-bold text-slate-500">বাতিল</button>
            <button disabled={isSubmitting} onClick={handleReviewSubmit} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50">
              {isSubmitting ? 'সেভ হচ্ছে...' : 'সাবমিট করুন'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
});

export const HomeCommunityFeed: React.FC<HomeCommunityFeedProps> = ({
  onNavigate,
  onPostClick,
  onOpenCreatePost,
  currentUser,
}) => {
  const { selectedThana, setSelectedThana } = useThana();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);
  
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Real-time listener for current user's likes
  useEffect(() => {
    if (!currentUser) {
      setLikedPosts({});
      return;
    }
    const q = query(collection(db, 'likes'), where('userId', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const newLikes: Record<string, boolean> = {};
      snapshot.forEach(doc => newLikes[doc.data().postId] = true);
      setLikedPosts(newLikes);
    });
    return () => unsub();
  }, [currentUser]);

  // Initial Load & Tab/Thana Change
  const loadPosts = useCallback(async (isFirst = true) => {
    if (isFirst) {
      setIsLoading(true);
      setPosts([]);
      setLastDoc(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const currentCategory = activeTab === 'all' ? undefined : activeTab;
      const result = await fetchPostsPaginated(
        DEFAULT_PAGE_SIZE,
        isFirst ? null : lastDoc,
        currentCategory
      );

      // Filter by thana client-side for now to keep DB simple
      let filtered = result.posts;
      if (selectedThana !== 'all') {
        filtered = filtered.filter(p => p.location.includes(selectedThana));
      }

      setPosts(prev => isFirst ? filtered : [...prev, ...filtered]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeTab, selectedThana, lastDoc]);

  useEffect(() => {
    loadPosts(true);
  }, [activeTab, selectedThana]);

  const handleToggleLike = useCallback(async (postId: string) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    if (likedPosts[postId]) {
      await unlikePost(postId, currentUser.uid);
    } else {
      await likePost(postId, currentUser.uid);
    }
  }, [currentUser, likedPosts, onNavigate]);

  const handleShare = useCallback((post: PostItem) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title}\nলোকেশন: ${post.location}\nআমার কুষ্টিয়া অ্যাপে দেখুন:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${post.title}\n${window.location.href}`);
      alert('লিঙ্ক কপি করা হয়েছে!');
    }
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 mt-2 mb-10 pb-10">
      {/* Header */}
      <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-[#0C3E8A] via-[#0A4CC7] to-[#1E3A8A] p-3.5 shadow-md border-2 border-amber-300 text-white flex items-center justify-between overflow-hidden">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-amber-300 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white drop-shadow-xs">সিটিজেন কমিউনিটি ফিড</h2>
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse uppercase">LIVE</span>
            </div>
            <p className="text-[10px] text-blue-100 font-medium">কুষ্টিয়ার সকল নাগরিক তথ্য ও আপডেট</p>
          </div>
        </div>
        {onOpenCreatePost && (
          <button onClick={() => onOpenCreatePost(activeTab !== 'all' ? (activeTab as CategoryType) : 'house-rent')} className="relative z-10 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-[11px] px-3 py-1.5 rounded-xl shadow-md border border-white/40 flex items-center gap-1 active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5 stroke-[3]" /><span>পোস্ট করুন</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 overflow-x-auto pb-1.5 scrollbar-none flex items-center gap-2">
        {FEED_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 ${
              activeTab === tab.id
                ? 'bg-[#0A4CC7] text-white shadow-md border-2 border-amber-300'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{tab.emoji}</span><span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
             <p className="text-xs font-bold text-slate-500">পোস্ট লোড হচ্ছে...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto mb-3 flex items-center justify-center">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold dark:text-white mb-1">কোনো পোস্ট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">এই ক্যাটাগরিতে এখনো কোনো আপডেট নেই।</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                onPostClick={onPostClick}
                onNavigate={onNavigate}
                currentUser={currentUser}
                isLiked={!!likedPosts[post.id]}
                onToggleLike={handleToggleLike}
                onShare={handleShare}
                onOpenReview={(id) => setOpenReviewId(id === openReviewId ? null : id)}
                isOpenReview={openReviewId === post.id}
              />
            ))}
            
            {hasMore && (
              <button 
                onClick={() => loadPosts(false)}
                disabled={isLoadingMore}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all"
              >
                {isLoadingMore ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>লোড হচ্ছে...</span></>
                ) : (
                  <span>আরও দেখুন</span>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

