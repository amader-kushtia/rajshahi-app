import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Send, 
  AlertCircle,
  LogIn,
  Lock,
  User as UserIcon,
  ThumbsUp
} from 'lucide-react';
import { TechnicianService, ServiceReview, UserProfile } from '../types';
import { 
  getReviewsForTarget, 
  getUserReview, 
  submitServiceReview, 
  formatReviewerId 
} from '../services/reviewService';

interface ServiceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianService | null;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onReviewSubmitted?: () => void;
}

export const ServiceReviewModal: React.FC<ServiceReviewModalProps> = ({
  isOpen,
  onClose,
  technician,
  user,
  onOpenAuthModal,
  onReviewSubmitted
}) => {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingUserReview, setExistingUserReview] = useState<ServiceReview | null>(null);

  useEffect(() => {
    if (technician && isOpen) {
      const targetReviews = getReviewsForTarget(technician.id);
      setReviews(targetReviews);

      if (user) {
        const found = getUserReview(technician.id, user.uid);
        if (found) {
          setExistingUserReview(found);
          setSelectedRating(found.rating);
          setCommentText(found.comment || '');
        } else {
          setExistingUserReview(null);
          setSelectedRating(5);
          setCommentText('');
        }
      } else {
        setExistingUserReview(null);
        setSelectedRating(5);
        setCommentText('');
      }

      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [technician, isOpen, user]);

  if (!isOpen || !technician) return null;

  const currentDisplayRating = hoverRating || selectedRating;

  const ratingDescriptions: Record<number, string> = {
    1: '১★ দুর্বল / ভালো নয়',
    2: '২★ মোটামুটি সন্তোষজনক',
    3: '৩★ ভালো কাজ',
    4: '৪★ খুব ভালো ও অভিজ্ঞ',
    5: '৫★ অসাধারণ / সেরা সেবা'
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuthModal();
      return;
    }

    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setErrorMessage('অনুগ্রহ করে ১ থেকে ৫ স্টার নির্বাচন করুন।');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await submitServiceReview({
        targetId: technician.id,
        targetType: 'technician',
        userId: user.uid,
        userName: user.displayName || 'সম্মানিত নাগরিক',
        userPhoto: user.photoURL || undefined,
        userEmail: user.email || undefined,
        rating: selectedRating,
        comment: commentText.trim()
      });

      setSuccessMessage(
        result.isUpdate 
          ? 'আপনার রিভিউ ও ৫-স্টার রেটিং সফলভাবে আপডেট হয়েছে!' 
          : 'ধন্যবাদ! আপনার ৫-স্টার রিভিউ সফলভাবে যুক্ত হয়েছে।'
      );
      
      // Refresh reviews list
      const updatedList = getReviewsForTarget(technician.id);
      setReviews(updatedList);
      setExistingUserReview(result.review);

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'রিভিউ সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diffMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (diffMinutes < 60) return `${Math.max(1, diffMinutes)} মি. আগে`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} দিন আগে`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} মাস আগে`;
  };

  const averageScore = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : technician.rating.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-pink-200/80 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 font-black text-xl flex items-center justify-center shadow-md shrink-0">
              {technician.name.split(' ')[1] ? technician.name.split(' ')[1][0] : technician.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-black text-white">{technician.name}</h3>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  যাচাইকৃত পেশাদার
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">{technician.profession}</p>
            </div>
          </div>

          {/* Rating Snapshot Banner */}
          <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl font-black text-sm shadow-xs">
                <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{averageScore}</span>
              </div>
              <div>
                <span className="font-bold text-white block leading-tight">গড় রেটিং</span>
                <span className="text-[10px] text-emerald-200 font-medium">
                  {reviews.length || technician.reviewsCount} টি কাস্টমার রিভিউ
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] bg-white/15 px-2.5 py-1 rounded-lg text-emerald-100 font-bold inline-block">
                ১ মেম্বার = ১ রিভিউ
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 no-scrollbar">
          
          {/* SECTION A: Submit 5-Star Review Form */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-pink-200/80/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{existingUserReview ? 'আপনার রেটিং ও রিভিউ আপডেট করুন' : 'আপনার ৫ স্টার রিভিউ ও মতামত দিন'}</span>
              </h4>

              {existingUserReview && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ইতোমধ্যে রিভিউ দেওয়া হয়েছে
                </span>
              )}
            </div>

            {!user ? (
              <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200/90 text-center space-y-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-amber-950">অতিথি হিসেবে রিভিউ বা রেটিং দেওয়া সম্ভব নয়</h5>
                  <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                    পেশাদারের কাজের মান ও বিশ্বস্ততা সম্পর্কে ৫-স্টার রেটিং ও মতামত জমা দিতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>রেটিং ও রিভিউ দিতে এখনই লগইন করুন</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-3">
                {/* Active Member ID pill as requested */}
                <div className="flex items-center justify-between text-[11px] bg-white px-3 py-2 rounded-xl border border-pink-200/80">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold">{user.displayName || 'সম্মানিত নাগরিক'}</span>
                  </div>
                  <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                    মেম্বার আইডি: {formatReviewerId(user.uid)}
                  </span>
                </div>

                {/* 5-Star Interactive Rating Selection */}
                <div className="bg-white rounded-xl p-3 border border-pink-200/80 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= currentDisplayRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 sm:p-1.5 rounded-xl hover:bg-amber-50 active:scale-95 transition-all group"
                          title={`${star} স্টার`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                              isFilled
                                ? 'fill-amber-400 text-amber-500 drop-shadow-xs scale-105'
                                : 'text-slate-300 group-hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs font-bold text-amber-700">
                    {ratingDescriptions[currentDisplayRating]}
                  </p>
                </div>

                {/* Comment textarea */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    কাজের অভিজ্ঞতা ও সুপারিশ (ঐচ্ছিক):
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    placeholder="যেমন: সময়মতো কাজ শেষ করেছেন, ব্যবহার খুব ভালো, কাজের মান প্রশংসনীয়..."
                    className="w-full p-2.5 rounded-xl bg-white border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Success & Error alerts */}
                {successMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>সংরক্ষণ করা হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{existingUserReview ? 'রিভিউ ও রেটিং আপডেট করুন' : 'রিভিউ ও ৫-স্টার রেটিং জমা দিন'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* SECTION B: List of Customer Reviews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>নাগরিকদের রিভিউসমূহ ({reviews.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                সর্বশেষ রিভিউ প্রথমে
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-pink-200/80 text-slate-500 text-xs">
                এখনো কোনো রিভিউ যোগ করা হয়নি। আপনি প্রথম রিভিউ প্রদান করুন!
              </div>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      user && rev.userId === user.uid
                        ? 'bg-emerald-50/60 border-emerald-200/90'
                        : 'bg-white border-pink-200/80/90'
                    }`}
                  >
                    {/* Review Header: User details + ID + Stars */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.userId}`}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-xl object-cover bg-slate-100 border border-pink-200/80 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              {rev.userName}
                            </span>
                            {user && rev.userId === user.uid && (
                              <span className="bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                                আপনার রিভিউ
                              </span>
                            )}
                          </div>
                          
                          {/* Reviewer ID Display */}
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mt-0.5">
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">
                              {formatReviewerId(rev.userId)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <Clock className="w-2.5 h-2.5" />
                              {getTimeAgo(rev.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Given Star Rating */}
                      <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment Body */}
                    {rev.comment && (
                      <p className="text-xs text-slate-700 leading-relaxed pl-10 pt-1 font-normal">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-pink-200/80 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
