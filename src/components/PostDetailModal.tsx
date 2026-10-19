import React, { useState } from 'react';
import { 
  X, 
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
  ArrowRight,
  User,
  ExternalLink,
  ChevronRight,
  UtensilsCrossed
} from 'lucide-react';
import { PostItem, UserProfile } from '../types';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostItem | null;
  user: UserProfile | null;
  savedPostIds: string[];
  onToggleSavePost: (postId: string) => void;
  onOpenReviewModal: (post: PostItem) => void;
  onNavigateCategory: (category: any) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
  user,
  savedPostIds,
  onToggleSavePost,
  onOpenReviewModal,
  onNavigateCategory
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  if (!isOpen || !post) return null;

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-pink-200/80 overflow-hidden max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-2 min-w-0 pr-8">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-[11px] font-black text-emerald-100 shrink-0">
              {categoryNameMap[post.category] || post.category}
            </span>
            {post.subcategory && (
              <span className="px-2 py-0.5 rounded-lg bg-white/15 text-[10px] font-bold text-emerald-100 truncate hidden sm:inline-block">
                {post.subcategory}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 no-scrollbar">
          
          {/* Post Image View */}
          {post.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-pink-200/80 group">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setShowFullImage(true)}
              />
              <button
                onClick={() => setShowFullImage(true)}
                className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>বড় করে দেখুন</span>
              </button>
            </div>
          )}

          {/* Title & Price Header */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {post.title}
              </h2>
              {post.price && (
                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-black text-sm sm:text-base shrink-0 shadow-xs">
                  {post.price}
                </div>
              )}
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{post.location}</span>
              </span>

              <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{getTimeAgo(post.createdAt)}</span>
              </span>

              {post.featured && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  PROMOTED
                </span>
              )}

              {post.isVerified && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>যাচাইকৃত</span>
                </span>
              )}
            </div>
          </div>

          {/* Details Pills if available */}
          {post.details && Object.keys(post.details).length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-3 border border-pink-200/80/80 grid grid-cols-2 gap-2 text-xs">
              {post.details.rooms && (
                <div className="bg-white p-2 rounded-xl border border-pink-100">
                  <span className="text-slate-400 font-medium block text-[10px]">রুম সংখ্যা</span>
                  <span className="font-bold text-slate-900">{post.details.rooms}</span>
                </div>
              )}
              {post.details.bathrooms && (
                <div className="bg-white p-2 rounded-xl border border-pink-100">
                  <span className="text-slate-400 font-medium block text-[10px]">বাথরুম</span>
                  <span className="font-bold text-slate-900">{post.details.bathrooms}</span>
                </div>
              )}
              {post.details.condition && (
                <div className="bg-white p-2 rounded-xl border border-pink-100">
                  <span className="text-slate-400 font-medium block text-[10px]">কন্ডিশন</span>
                  <span className="font-bold text-slate-900">{post.details.condition}</span>
                </div>
              )}
              {post.details.bloodGroup && (
                <div className="bg-white p-2 rounded-xl border border-pink-100">
                  <span className="text-slate-400 font-medium block text-[10px]">রক্তের গ্রুপ</span>
                  <span className="font-bold text-rose-700">{post.details.bloodGroup}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-pink-200/80/90 space-y-1.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              বিবরণ / বিস্তারিত তথ্য:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* Restaurant Menu Items Card if available */}
          {post.details?.menuItems && post.details.menuItems.length > 0 && (
            <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                <UtensilsCrossed className="w-4 h-4 text-amber-700 shrink-0" />
                <h4 className="text-xs font-black text-amber-950">
                  খাবারের বিস্তারিত মেনু ও দাম ({post.details.menuItems.length}টি আইটেম)
                </h4>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {post.details.menuItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-amber-100 text-xs shadow-2xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      {item.ingredients && <span className="text-[10px] text-slate-500 block">{item.ingredients}</span>}
                    </div>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author Card & Primary Action Buttons */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-4 text-white space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white font-black text-base border border-white/20 shrink-0 overflow-hidden p-1.5">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : <img src="/assets/logo.svg" alt="Logo" className="w-full h-full object-contain" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-white">{post.authorName}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <p className="text-[11px] text-emerald-200 font-medium">
                    যোগাযোগ নম্বর: {post.contactPhone}
                  </p>
                </div>
              </div>

              {/* Bookmark Save Button */}
              <button
                onClick={() => onToggleSavePost(post.id)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isSaved 
                    ? 'bg-amber-400 text-slate-950 border-amber-300' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title={isSaved ? 'সংরক্ষণ তালিকা থেকে সরান' : 'পোস্ট সংরক্ষণ করুন'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
              </button>
            </div>

            {/* Direct Communication Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>সরাসরি কল দিন</span>
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>

              {post.facebook && (
                <a
                  href={post.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                  <span>ফেসবুক পেজ / প্রোফাইলে যোগাযোগ করুন</span>
                </a>
              )}
            </div>

            {/* Extra Social and Share options */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/15 text-xs">
              <button
                onClick={() => {
                  onClose();
                  onOpenReviewModal(post);
                }}
                className="flex items-center gap-1.5 text-amber-200 hover:text-white font-bold text-[11px] cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>রিভিউ ও রেটিং দিন</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-emerald-200 hover:text-white font-bold text-[11px] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>
            </div>
          </div>

          {/* Jump to Category View Button */}
          <button
            onClick={() => {
              onClose();
              onNavigateCategory(post.category);
            }}
            className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-2xl border border-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>এই ক্যাটাগরির অন্যান্য পোস্ট দেখুন ({categoryNameMap[post.category] || 'ক্যাটাগরি'})</span>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Expanded Photo Viewer Modal */}
      {showFullImage && post.imageUrl && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition-colors"
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
