import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Facebook, 
  Share2, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  Eye, 
  ShieldCheck, 
  Tag, 
  Star, 
  Sparkles, 
  User, 
  ChevronRight,
  Send,
  AlertCircle,
  X,
  Building,
  TrendingUp,
  Check
} from 'lucide-react';
import { PostItem, UserProfile } from '../types';

interface PostDetailPageProps {
  post: PostItem;
  user: UserProfile | null;
  savedPostIds: string[];
  onBack: () => void;
  onToggleSavePost: (postId: string) => void;
  onOpenReviewModal: (post: PostItem) => void;
  onNavigateCategory: (category: any) => void;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({
  post,
  user,
  savedPostIds,
  onBack,
  onToggleSavePost,
  onOpenReviewModal,
  onNavigateCategory
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const isSaved = savedPostIds.includes(post.id);
  const cleanPhone = post.contactPhone ? post.contactPhone.replace(/[^0-9+]/g, '') : '';
  const whatsappNumber = post.whatsapp || post.contactPhone;
  const cleanWhatsapp = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, '') : '';
  const formattedWhatsapp = cleanWhatsapp.startsWith('88') ? cleanWhatsapp : `88${cleanWhatsapp}`;
  const whatsappLink = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমার কুষ্টিয়া অ্যাপে আপনার এই পোস্টটি দেখেছি: "${post.title}"`)}`;

  const getTimeAgo = (timestamp: number) => {
    if (!timestamp) return 'সাম্প্রতিক';
    const diffMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (diffMinutes < 60) return `${Math.max(1, diffMinutes)} মি. আগে`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} দিন আগে`;
  };

  const categoryNameMap: Record<string, string> = {
    'house-rent': 'বাসা ভাড়া',
    'buy-sell': 'বাই-সেল ও কেনাবেচা',
    'crime-reporter': 'অভিযোগ ও জনদুর্ভোগ',
    'services': 'নাগরিক সেবা',
    'doctor': 'ডাক্তার ও স্বাস্থ্য',
    'blood': 'রক্তদান সেবা',
    'transport': 'যানবাহন ও যাতায়াত',
    'emergency': 'জরুরি হেল্পলাইন',
    'food': 'খাবার ও রেস্টুরেন্ট',
    'jobs': 'চাকরি ও ক্যারিয়ার',
    'lost-found': 'হারানো ও প্রাপ্তি',
    'legal': 'আইনি সহায়তা',
    'events': 'অনুষ্ঠান ও ডেকোরেটর'
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `${post.title}\nস্থান: ${post.location}\nমোবাইল: ${post.contactPhone}\nআমার কুষ্টিয়া অ্যাপ`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${post.title}\nযোগাযোগ: ${post.contactPhone}\nআমার কুষ্টিয়া`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (e) {
        // clipboard error
      }
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200 pb-12 pt-0">
      {/* Top Navigation Header Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-pink-200/80/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            title="পেছনে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">পেছনে</span>
          </button>
          
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
              {categoryNameMap[post.category] || post.category}
            </span>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
              {post.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleSavePost(post.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSaved 
                ? 'bg-amber-400 text-slate-950 border-amber-300' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-pink-200/80'
            }`}
            title={isSaved ? 'সংরক্ষণ থেকে সরান' : 'সেভ করুন'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors border border-pink-200/80 cursor-pointer"
            title="শেয়ার করুন"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      {post.imageUrl ? (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-pink-200/80/80 shadow-md group">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <button
            onClick={() => setShowFullImage(true)}
            className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
          >
            <Eye className="w-4 h-4" />
            <span>সম্পূর্ণ ছবি দেখুন</span>
          </button>
        </div>
      ) : (
        <div className="w-full h-36 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white flex flex-col items-center justify-center p-4 text-center shadow-md border border-emerald-600/30">
          <Building className="w-8 h-8 text-emerald-200 mb-1" />
          <h3 className="text-sm font-extrabold text-white">কুষ্টিয়া ডিজিটাল নাগরিক সেবা</h3>
          <p className="text-xs text-emerald-200 font-medium">ছবির জায়গায় টেক্সট বিবরণ দেওয়া রয়েছে</p>
        </div>
      )}

      {/* Title, Badges & Price Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
            {post.title}
          </h1>

          {post.price && (
            <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300/80 rounded-2xl font-black text-base sm:text-lg shrink-0 shadow-xs">
              {post.price}
            </div>
          )}
        </div>

        {/* Metadata badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 font-medium pt-1 border-t border-pink-100">
          <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{post.location}</span>
          </span>

          <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{getTimeAgo(post.createdAt)}</span>
          </span>

          {post.featured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              PROMOTED
            </span>
          )}

          {post.isVerified && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>যাচাইকৃত</span>
            </span>
          )}
        </div>
      </div>

      {/* Extra Detail Cards (if available) */}
      {post.details && Object.keys(post.details).length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-pink-200/80/90 shadow-xs space-y-2">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
            অতিরিক্ত তথ্যাবলী:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {post.details.rooms && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80/60">
                <span className="text-slate-400 font-medium block text-[10px]">রুম সংখ্যা</span>
                <span className="font-extrabold text-slate-900">{post.details.rooms}</span>
              </div>
            )}
            {post.details.bathrooms && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80/60">
                <span className="text-slate-400 font-medium block text-[10px]">বাথরুম</span>
                <span className="font-extrabold text-slate-900">{post.details.bathrooms}</span>
              </div>
            )}
            {post.details.condition && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80/60">
                <span className="text-slate-400 font-medium block text-[10px]">কন্ডিশন</span>
                <span className="font-extrabold text-slate-900">{post.details.condition}</span>
              </div>
            )}
            {post.details.bloodGroup && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80/60">
                <span className="text-slate-400 font-medium block text-[10px]">রক্তের গ্রুপ</span>
                <span className="font-black text-rose-700">{post.details.bloodGroup}</span>
              </div>
            )}
            {post.details.hospitalName && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80/60">
                <span className="text-slate-400 font-medium block text-[10px]">হাসপাতাল</span>
                <span className="font-extrabold text-slate-900">{post.details.hospitalName}</span>
              </div>
            )}
            {post.details.speciality && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-pink-200/80/60">
                <span className="text-slate-400 font-medium block text-[10px]">বিশেষজ্ঞতা</span>
                <span className="font-extrabold text-slate-900">{post.details.speciality}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Description Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-2">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-emerald-700" />
          <span>বিবরণ / বিস্তারিত তথ্য:</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line pt-1">
          {post.description}
        </p>
      </div>

      {/* Author & Direct Communication Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-4 sm:p-5 text-white space-y-4 shadow-lg border border-emerald-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white font-black text-lg border border-white/20 shrink-0 overflow-hidden p-2">
              {post.authorName ? post.authorName.charAt(0).toUpperCase() : <img src="/assets/logo.svg" alt="Logo" className="w-full h-full object-contain" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm sm:text-base font-black text-white">{post.authorName}</h4>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xs text-emerald-200 font-medium mt-0.5">
                যোগাযোগ নম্বর: {post.contactPhone}
              </p>
            </div>
          </div>

          <span className="bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            ভেরিফাইড নাগরিক
          </span>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white hover:bg-emerald-50 text-emerald-900 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-[0.98]"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>সরাসরি কল দিন</span>
          </a>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপ</span>
          </a>
        </div>

        {/* Secondary options */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/15 text-xs">
          <button
            onClick={() => onOpenReviewModal(post)}
            className="flex items-center gap-1.5 text-amber-200 hover:text-white font-bold text-xs cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>রিভিউ ও ৫-স্টার রেটিং দিন</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-emerald-200 hover:text-white font-bold text-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'কপি হয়েছে!' : 'শেয়ার করুন'}</span>
          </button>
        </div>
      </div>

      {/* Jump to Category Navigation */}
      <button
        onClick={() => onNavigateCategory(post.category)}
        className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-extrabold rounded-2xl border border-emerald-200 shadow-xs transition-colors flex items-center justify-between cursor-pointer"
      >
        <span>এই ক্যাটাগরির সকল পোস্ট দেখুন ({categoryNameMap[post.category] || post.category})</span>
        <ChevronRight className="w-4 h-4 text-emerald-700" />
      </button>

      {/* Full Photo Modal */}
      {showFullImage && post.imageUrl && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
