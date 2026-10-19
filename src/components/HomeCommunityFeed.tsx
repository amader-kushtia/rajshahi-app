import React, { useState, useEffect } from 'react';
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
  Filter
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
  subscribeToPosts, 
  likePost, 
  unlikePost 
} from '../services/postService';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

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
];

export const HomeCommunityFeed: React.FC<HomeCommunityFeedProps> = ({
  onNavigate,
  onPostClick,
  onOpenCreatePost,
  currentUser,
}) => {
  const { selectedThana, setSelectedThana } = useThana();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [allPosts, setAllPosts] = useState<PostItem[]>(() => getMasterPosts());
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kushtia_user_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Local like counts to make liking instant and reactive
  const [localLikeCounts, setLocalLikeCounts] = useState<Record<string, number>>({});

  // Review states: mapping postId -> boolean (whether inline review form is open)
  const [openReviewPostId, setOpenReviewPostId] = useState<string | null>(null);
  const [ratingInputs, setRatingInputs] = useState<Record<string, number>>({});
  const [hoverRatingInputs, setHoverRatingInputs] = useState<Record<string, number>>({});
  const [nameInputs, setNameInputs] = useState<Record<string, string>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingReview, setSubmittingReview] = useState<Record<string, boolean>>({});
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<Record<string, string | null>>({});
  const [showAllReviewsPostId, setShowAllReviewsPostId] = useState<Record<string, boolean>>({});

  // Real-time posts subscriber
  useEffect(() => {
    const unsub = subscribeToPosts((updated) => {
      setAllPosts(updated);
    });
    return () => unsub();
  }, []);

  // Listen for user's likes in real-time
  useEffect(() => {
    if (!currentUser) {
      setLikedPosts({});
      return;
    }
    const q = query(collection(db, 'likes'), where('userId', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const newLikedPosts: Record<string, boolean> = {};
      snapshot.forEach(docSnap => {
        newLikedPosts[docSnap.data().postId] = true;
      });
      setLikedPosts(newLikedPosts);
    });
    return () => unsub();
  }, [currentUser]);

  // Real-time reviews subscriber
  const [, setReviewRefreshKey] = useState(0);
  useEffect(() => {
    const unsub = subscribeToReviews(() => {
      setReviewRefreshKey(prev => prev + 1);
    });
    return () => unsub();
  }, []);

  // Filter posts based on activeTab and selectedThana
  const filteredPosts = React.useMemo(() => {
    let filtered = allPosts;
    
    // 0. Filter out drafts and expired posts from public feed
    const now = Date.now();
    filtered = filtered.filter(p => {
      if (p.isDraft || p.status === 'draft') return false;
      if (p.expiryDate && p.expiryDate < now) return false;
      return true;
    });

    // 1. Filter by category
    if (activeTab !== 'all') {
      const tabObj = FEED_TABS.find(t => t.id === activeTab);
      if (tabObj) {
        filtered = filtered.filter(p => tabObj.categories.includes(p.category));
      }
    } else {
      const targetCategorySet = new Set<string>([
        'house-rent', 'buy-sell', 'blood', 'blood-request', 'crime-reporter', 
        'food', 'jobs', 'lost-found', 'legal', 'events', 'driver', 'tutor', 'transport'
      ]);
      filtered = filtered.filter(p => targetCategorySet.has(p.category));
    }

    // 2. Filter by thana (location)
    if (selectedThana !== 'all') {
      filtered = filtered.filter(p => p.location.includes(selectedThana));
    }
    
    return filtered;
  }, [allPosts, activeTab, selectedThana]);

  // Handle Like Button Toggle (Facebook Like)
  const handleToggleLike = async (postId: string, currentLikes = 0) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    const isCurrentlyLiked = !!likedPosts[postId];
    
    if (isCurrentlyLiked) {
      await unlikePost(postId, currentUser.uid);
    } else {
      await likePost(postId, currentUser.uid);
    }
  };

  // Submit Review on specific post
  const handleSubmitPostReview = async (postId: string) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    const rating = ratingInputs[postId] || 5;
    const comment = (commentInputs[postId] || '').trim();
    const reviewerName = (nameInputs[postId] || '').trim() || (currentUser?.displayName) || 'কুষ্টিয়া সম্মানিত নাগরিক';

    setSubmittingReview(prev => ({ ...prev, [postId]: true }));
    setReviewSuccessMsg(prev => ({ ...prev, [postId]: null }));

    try {
      const res = await submitServiceReview({
        targetId: postId,
        targetType: 'post',
        userId: currentUser.uid,
        userName: reviewerName,
        userPhoto: currentUser?.photoURL || undefined,
        userEmail: currentUser?.email || undefined,
        rating,
        comment
      });

      setReviewSuccessMsg(prev => ({
        ...prev,
        [postId]: res.isUpdate ? 'আপনার রিভিউ আপডেট হয়েছে!' : 'ধন্যবাদ! আপনার ৫-স্টার রিভিউ সফলভাবে প্রকাশিত হয়েছে।'
      }));

      // Reset comment & rating input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));

      // Automatically show reviews for this post
      setShowAllReviewsPostId(prev => ({ ...prev, [postId]: true }));

      // Auto close the review box after 3 seconds
      setTimeout(() => {
        setReviewSuccessMsg(prev => ({ ...prev, [postId]: null }));
        setOpenReviewPostId(null);
      }, 3500);

    } catch (err: any) {
      alert(err.message || 'রিভিউ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubmittingReview(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Copy/Share link
  const handleSharePost = (post: PostItem) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title}\nলোকেশন: ${post.location}\nকুষ্টিয়া সিটিজেন অ্যাপে দেখুন:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${post.title}\n${window.location.href}`);
      alert('পোস্টের লিংক কপি করা হয়েছে!');
    }
  };

  // Helper for Category styling & badge label
  const getCategoryMeta = (cat: CategoryType) => {
    switch (cat) {
      case 'house-rent':
        return { label: 'বাসা ভাড়া', bg: 'bg-purple-100 text-purple-800 border-purple-200', emoji: '🏠' };
      case 'buy-sell':
        return { label: 'বাই-সেল', bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', emoji: '🏷️' };
      case 'blood':
      case 'blood-request':
        return { label: 'রক্তদাতা', bg: 'bg-rose-100 text-rose-800 border-rose-200', emoji: '🩸' };
      case 'crime-reporter':
        return { label: 'গোপন তথ্য 🔒', bg: 'bg-amber-100 text-amber-900 border-amber-300 font-black', emoji: '🔒' };
      case 'food':
        return { label: 'রেস্টুরেন্ট ও খাবার', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', emoji: '🍽️' };
      case 'jobs':
        return { label: 'চাকরি ও নিয়োগ', bg: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '💼' };
      case 'lost-found':
        return { label: 'হারানো ও প্রাপ্তি', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', emoji: '🔍' };
      case 'legal':
        return { label: 'আইনি সহায়তা', bg: 'bg-slate-100 text-slate-800 border-slate-300', emoji: '⚖️' };
      case 'events':
        return { label: 'অনুষ্ঠান ও ডেকোর', bg: 'bg-pink-100 text-pink-800 border-pink-200', emoji: '🎪' };
      case 'driver':
      case 'transport':
        return { label: 'ড্রাইভার', bg: 'bg-teal-100 text-teal-800 border-teal-200', emoji: '🚗' };
      case 'tutor':
        return { label: 'গৃহশিক্ষক', emoji: '📚', bg: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      default:
        return { label: 'নাগরিক সেবা', bg: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '📢' };
    }
  };

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

  const ratingDescriptions: Record<number, string> = {
    1: '১★ দুর্বল / সন্তোষজনক নয়',
    2: '২★ মোটামুটি কাজ চলেছে',
    3: '৩★ ভালো অভিজ্ঞতা',
    4: '৪★ খুব ভালো ও মানসম্মত সেবা',
    5: '৫★ অসাধারণ / সেরা ও বিশ্বস্ত'
  };

  return (
    <div className="w-full font-['Hind_Siliguri',sans-serif] px-3 sm:px-4 mt-2 mb-10">
      
      {/* 1. SECTION HEADER RIBBON (ফেসবুক স্টাইল পোস্ট ফিড হেডার) */}
      <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-[#0C3E8A] via-[#0A4CC7] to-[#1E3A8A] p-3.5 shadow-md border-2 border-amber-300 text-white flex items-center justify-between overflow-hidden">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white drop-shadow-xs">
                কুষ্টিয়া সিটিজেন কমিউনিটি পোস্ট
              </h2>
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-blue-100 font-medium line-clamp-1">
              বাসা ভাড়া, বাই-সেল, রক্তদাতা, গোপন তথ্য ও জরুরি নাগরিক সকল পোস্ট
            </p>
          </div>
        </div>

        {/* Create Post Button */}
        {onOpenCreatePost && (
          <button
            onClick={() => onOpenCreatePost(activeTab !== 'all' ? (activeTab as CategoryType) : 'house-rent')}
            className="relative z-10 shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-black text-xs px-3 py-1.5 rounded-xl shadow-md border border-white/40 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">পোস্ট করুন</span>
            <span className="sm:hidden">পোস্ট</span>
          </button>
        )}
      </div>

      {/* 2. CATEGORY FILTER TABS (হরাইজন্টাল স্ক্রল পিলে ১১টি ক্যাটাগরি) */}
      <div className="mb-4 overflow-x-auto pb-1.5 scrollbar-none flex items-center gap-1.5 sm:gap-2">
        {FEED_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#0A4CC7] text-white shadow-md shadow-blue-500/20 border-2 border-amber-300 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs'
              }`}
            >
              <span className="text-xs">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Thana Display */}
      {selectedThana !== 'all' && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-800">
            বর্তমানে সিলেক্টেড: <span className="font-black">{selectedThana === 'kushtia-sadar' ? 'কুষ্টিয়া সদর' : selectedThana === 'kumarkhali' ? 'কুমারখালী' : selectedThana === 'bheramara' ? 'ভেড়ামারা' : selectedThana === 'mirpur' ? 'মিরপুর' : selectedThana === 'khoksa' ? 'খোকসা' : 'দৌলতপুর'}</span>
          </span>
          <button 
            onClick={() => setSelectedThana('all')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-white px-2 py-1 rounded-lg border border-blue-200"
          >
            সব দেখুন
          </button>
        </div>
      )}

      {/* 3. POSTS FEED LIST (হুবহু ফেসবুক পোস্ট কার্ডের মতো) */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0A4CC7] flex items-center justify-center mx-auto mb-3">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই</h3>
            <p className="text-xs text-slate-500 mb-4">আপনি প্রথম ব্যক্তি হিসেবে এখানে নতুন পোস্ট দিতে পারেন!</p>
            {onOpenCreatePost && (
              <button
                onClick={() => onOpenCreatePost(activeTab !== 'all' ? (activeTab as CategoryType) : 'house-rent')}
                className="px-5 py-2 rounded-xl bg-[#0A4CC7] text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer"
              >
                + নতুন পোস্ট যোগ করুন
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => {
            const catMeta = getCategoryMeta(post.category);
            const isLiked = !!likedPosts[post.id];
            const currentLikes = localLikeCounts[post.id] !== undefined 
              ? localLikeCounts[post.id] 
              : (post.likes || 15);
            
            // Fetch reviews for this post
            const postReviews = getReviewsForTarget(post.id);
            const reviewsCount = Math.max(post.reviewsCount || 0, postReviews.length);
            const avgRating = postReviews.length > 0
              ? (postReviews.reduce((sum, r) => sum + r.rating, 0) / postReviews.length).toFixed(1)
              : (post.rating ? post.rating.toFixed(1) : '5.0');

            const isReviewFormOpen = openReviewPostId === post.id;
            const currentSelectedRating = hoverRatingInputs[post.id] || ratingInputs[post.id] || 5;
            const isSubmitting = !!submittingReview[post.id];
            const successMsg = reviewSuccessMsg[post.id];
            const showAllReviews = !!showAllReviewsPostId[post.id];

            return (
              <article 
                key={post.id}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/90 overflow-hidden hover:shadow-md transition-all"
              >
                {/* A. POST HEADER (AUTHOR & TIME & CATEGORY BADGE) */}
                <div className="p-3.5 sm:p-4 flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* Author Avatar with Online Badge */}
                    <div className="relative shrink-0">
                      {post.authorPhoto ? (
                        <img 
                          src={post.authorPhoto} 
                          alt={post.authorName} 
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0C3E8A] to-[#0A4CC7] text-white font-black text-sm sm:text-base flex items-center justify-center border-2 border-white shadow-sm">
                          {post.authorName.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="অ্যাক্টিভ মেম্বার" />
                    </div>

                    {/* Author Details */}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-none">
                          {post.authorName}
                        </h3>
                        {post.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 text-white shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                        <span>{getTimeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-600">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate max-w-[130px] sm:max-w-[200px]">{post.location}</span>
                        </span>
                        <span>•</span>
                        <Globe className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Category Pill Badge */}
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border shadow-2xs ${catMeta.bg}`}>
                    <span>{catMeta.emoji}</span>
                    <span>{catMeta.label}</span>
                  </span>
                </div>

                {/* B. POST TITLE & BENGALI TEXT CONTENT */}
                <div className="px-3.5 sm:px-4 pb-2">
                  <h4 
                    onClick={() => onPostClick ? onPostClick(post) : onNavigate(post.category)}
                    className="text-sm sm:text-[15px] font-black text-slate-900 leading-snug hover:text-blue-700 cursor-pointer transition-colors mb-1.5"
                  >
                    {post.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed whitespace-pre-line">
                    {post.description}
                  </p>

                  {/* Highlighting tags (Price / Salary / Blood Group / Reward) */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {post.price && (
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg text-xs font-black shadow-2xs">
                        🏷️ {post.price}
                      </span>
                    )}

                    {post.details?.bloodGroup && (
                      <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-lg text-xs font-black animate-pulse">
                        🩸 রক্তের গ্রুপ: {post.details.bloodGroup}
                      </span>
                    )}

                    {post.category === 'crime-reporter' && (
                      <span className="bg-slate-900 text-amber-400 border border-amber-400/40 px-2.5 py-0.5 rounded-lg text-[11px] font-black flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        পরিচয় সম্পূর্ণ গোপন ও সুরক্ষিত
                      </span>
                    )}

                    {post.subcategory && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                        #{post.subcategory}
                      </span>
                    )}
                  </div>
                </div>

                {/* C. POST PHOTO / IMAGE (ফেসবুক ইমেজ স্টাইল) */}
                {post.imageUrl && (
                  <div 
                    onClick={() => onPostClick ? onPostClick(post) : onNavigate(post.category)}
                    className="relative w-full max-h-72 sm:max-h-80 bg-slate-100 overflow-hidden cursor-pointer group mt-1"
                  >
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                )}

                {/* D. QUICK CONTACT & DETAILS STRIP */}
                <div className="px-3.5 sm:px-4 py-2 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${post.contactPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>কল: {post.contactPhone ? '***' + post.contactPhone.slice(-4) : ''}</span>
                    </a>

                    {post.whatsapp && (
                      <a
                        href={`https://wa.me/88${post.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>হোয়াটসঅ্যাপ</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onPostClick ? onPostClick(post) : onNavigate(post.category)}
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5 cursor-pointer ml-auto"
                  >
                    <span>বিস্তারিত দেখুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* E. ENGAGEMENT COUNTER STRIP (FACEBOOK REACTIONS BAR) */}
                <div className="px-3.5 sm:px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                  {/* Left: Likes counter */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center -space-x-1">
                      <div className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow-2xs">
                        <ThumbsUp className="w-2.5 h-2.5" />
                      </div>
                      <div className="w-4.5 h-4.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] shadow-2xs">
                        <Heart className="w-2.5 h-2.5 fill-white" />
                      </div>
                    </div>
                    <span className="font-bold text-slate-700">
                      {currentLikes} জন লাইক করেছেন
                    </span>
                  </div>

                  {/* Right: Reviews & Rating summary */}
                  <div 
                    onClick={() => setOpenReviewPostId(isReviewFormOpen ? null : post.id)}
                    className="flex items-center gap-1 cursor-pointer hover:text-blue-700 font-bold"
                  >
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="ml-0.5 text-slate-800">{avgRating}</span>
                    </div>
                    <span>({reviewsCount}টি রিভিউ)</span>
                  </div>
                </div>

                {/* F. FACEBOOK 3 ACTION BUTTONS (লাইক, রিভিউ দিন, শেয়ার) */}
                <div className="px-2 py-1 grid grid-cols-3 gap-1 bg-white">
                  {/* 1. LIKE BUTTON */}
                  <button
                    onClick={() => handleToggleLike(post.id, post.likes)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                      isLiked 
                        ? 'text-blue-600 bg-blue-50 font-black' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-600 text-blue-600 scale-110' : ''}`} />
                    <span>{isLiked ? 'পছন্দ হয়েছে' : 'লাইক'}</span>
                  </button>

                  {/* 2. GIVE REVIEW BUTTON (USER EXPLICIT REQUIREMENT: প্রত্যেকটা পোস্টের নিচে রিভিউ দেয়ার অপশন থাকবে) */}
                  <button
                    onClick={() => setOpenReviewPostId(isReviewFormOpen ? null : post.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                      isReviewFormOpen
                        ? 'text-amber-700 bg-amber-50 border border-amber-300 font-black'
                        : 'text-slate-700 hover:bg-amber-50/60 hover:text-amber-800'
                    }`}
                  >
                    <Star className={`w-4 h-4 text-amber-500 ${isReviewFormOpen ? 'fill-amber-400' : ''}`} />
                    <span>রিভিউ দিন</span>
                    {isReviewFormOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* 3. SHARE BUTTON */}
                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>শেয়ার</span>
                  </button>
                </div>

                {/* G. INLINE REVIEW SUBMISSION BOX (প্রত্যেকটা পোস্টের নিচে রিভিউ দেয়ার অপশন) */}
                {isReviewFormOpen && (
                  <div className="p-3.5 sm:p-4 bg-gradient-to-b from-amber-50/70 via-blue-50/40 to-white border-t border-amber-200/80 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                          ★
                        </div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          পোস্টে আপনার মূল্যবান রিভিউ ও রেটিং দিন
                        </h5>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {ratingDescriptions[currentSelectedRating]}
                      </span>
                    </div>

                    {/* Star Rating Interactive Selector */}
                    <div className="flex items-center gap-1.5 mb-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-600 mr-1">রেটিং:</span>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= currentSelectedRating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInputs(prev => ({ ...prev, [post.id]: star }))}
                            onMouseEnter={() => setHoverRatingInputs(prev => ({ ...prev, [post.id]: star }))}
                            onMouseLeave={() => setHoverRatingInputs(prev => ({ ...prev, [post.id]: 0 }))}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer"
                            title={`${star} স্টার`}
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                isFilled 
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs' 
                                  : 'text-slate-300'
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Reviewer Name input */}
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="আপনার নাম (যেমন: মোঃ রফিকুল ইসলাম)"
                        value={nameInputs[post.id] !== undefined ? nameInputs[post.id] : (currentUser?.displayName || '')}
                        onChange={(e) => setNameInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs"
                      />
                    </div>

                    {/* Review Comment textarea */}
                    <div className="mb-2.5">
                      <textarea
                        rows={2}
                        placeholder="এই পোস্ট ও সেবা সম্পর্কে আপনার বাস্তব অভিজ্ঞতা ও মতামত লিখুন..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs resize-none"
                      />
                    </div>

                    {/* Success notification */}
                    {successMsg && (
                      <div className="mb-2.5 p-2 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    {/* Action button */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenReviewPostId(null)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSubmitPostReview(post.id)}
                        className="px-4 py-1.5 bg-[#0A4CC7] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>সাবমিট হচ্ছে...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>রিভিউ জমা দিন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* H. REVIEWS LIST DISPLAY (নাগরিকদের মতামত ও রিভিউ) */}
                {postReviews.length > 0 && (
                  <div className="px-3.5 sm:px-4 py-3 bg-slate-50/60 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        নাগরিক রিভিউ সমূহ ({postReviews.length})
                      </span>
                      {postReviews.length > 2 && (
                        <button
                          onClick={() => setShowAllReviewsPostId(prev => ({ ...prev, [post.id]: !showAllReviews }))}
                          className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                        >
                          {showAllReviews ? 'সংক্ষেপ করুন' : `সবগুলো দেখুন (${postReviews.length})`}
                        </button>
                      )}
                    </div>

                    {/* List of reviews */}
                    <div className="space-y-2">
                      {(showAllReviews ? postReviews : postReviews.slice(0, 2)).map((rev) => (
                        <div 
                          key={rev.id}
                          className="p-2.5 bg-white rounded-xl border border-slate-150 shadow-2xs flex items-start gap-2.5"
                        >
                          {/* Reviewer avatar */}
                          {rev.userPhoto ? (
                            <img 
                              src={rev.userPhoto} 
                              alt={rev.userName} 
                              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0A4CC7] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {rev.userName.charAt(0)}
                            </div>
                          )}

                          {/* Review content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-black text-slate-800">{rev.userName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {formatReviewerId(rev.userId)}
                                </span>
                              </div>
                              <div className="flex items-center text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`} 
                                  />
                                ))}
                              </div>
                            </div>

                            {rev.comment && (
                              <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-normal font-normal">
                                {rev.comment}
                              </p>
                            )}

                            <span className="text-[10px] text-slate-400 block mt-1">
                              {getTimeAgo(rev.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
