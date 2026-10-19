import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Tag,
  ShieldCheck,
  Check,
  X,
  Clock,
  ThumbsUp,
  MessageSquare,
  Settings,
  ShieldAlert,
  CheckSquare,
  Square,
  RefreshCw,
  Calendar,
  CalendarDays,
  ChevronRight,
  Bookmark,
  Send
} from 'lucide-react';
import { PostItem, CategoryType } from '../../types';
import { 
  approvePost, 
  rejectPost, 
  getAutoApproveSetting, 
  setAutoApproveSetting 
} from '../../services/adminFeaturesService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { deleteLocalDraft } from '../../services/draftService';

const toBangla = (n: number | string) => 
  String(n).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[+d]);

interface PostManagementTabProps {
  posts: PostItem[];
  onDeletePost: (postId: string) => void;
  onBulkDeletePosts?: (postIds: string[], reasonTitle?: string) => Promise<void> | void;
  onToggleVerify: (postId: string) => void;
  onBulkToggleVerify?: (postIds: string[], targetVerifiedState?: boolean) => void;
  onStartEdit: (post: PostItem) => void;
  onStartCreate: () => void;
  onNavigateToSecretReports?: () => void;
  onLoadMorePosts?: () => void;
  hasMorePosts?: boolean;
  isLoadingMorePosts?: boolean;
}

export const PostManagementTab: React.FC<PostManagementTabProps> = ({
  posts = [],
  onDeletePost,
  onBulkDeletePosts,
  onToggleVerify,
  onBulkToggleVerify,
  onStartEdit,
  onStartCreate,
  onNavigateToSecretReports,
  onLoadMorePosts,
  hasMorePosts = false,
  isLoadingMorePosts = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'draft' | 'expired'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Expiry date modal state
  const [expiryPostTarget, setExpiryPostTarget] = useState<PostItem | null>(null);
  const [customExpiryDate, setCustomExpiryDate] = useState<string>('');

  // Modals & Selection
  const [postToDelete, setPostToDelete] = useState<PostItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDateDeleteModalOpen, setIsDateDeleteModalOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<'today' | 'yesterday' | 'week' | 'month' | 'custom'>('today');
  const [targetDeleteDate, setTargetDeleteDate] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  
  // Rejection modal
  const [rejectingPost, setRejectingPost] = useState<PostItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Auto-approve toggle
  const [autoApprove, setAutoApprove] = useState(() => getAutoApproveSetting());

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 50;

  // Reset page when filter, search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, statusFilter, verificationFilter, dateFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Date utilities
  const getPostDateString = (timestamp: number | undefined): string => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatBanglaDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      const monthNames = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const toBanglaNum = (str: string) => String(str).replace(/[0-9]/g, ch => bengaliNumbers[parseInt(ch, 10)]);

      const monthIdx = parseInt(m, 10) - 1;
      const monthName = monthNames[monthIdx] || m;
      return `${toBanglaNum(d)} ${monthName} ${toBanglaNum(y)}`;
    } catch {
      return dateStr;
    }
  };

  const toBanglaNumber = (num: number): string => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, ch => bengaliNumbers[parseInt(ch, 10)]);
  };

  const handleToggleAutoApprove = () => {
    const nextVal = !autoApprove;
    setAutoApprove(nextVal);
    setAutoApproveSetting(nextVal);
    showToast(nextVal ? 'নতুন পোস্ট এখন স্বয়ংক্রিয়ভাবে অনুমোদিত হবে।' : 'নতুন পোস্ট এখন অ্যাডমিন অনুমোদনের অপেক্ষায় থাকবে।');
  };

  const handleApprove = async (post: PostItem) => {
    await approvePost(post.id);
    showToast(`"${post.title}" পোস্টটি অনুমোদন করা হয়েছে।`);
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPost) return;

    await rejectPost(rejectingPost.id, rejectionReason.trim());
    showToast(`"${rejectingPost.title}" পোস্টটি বাতিল করা হয়েছে।`);
    setRejectingPost(null);
    setRejectionReason('');
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      onDeletePost(postToDelete.id);
      showToast(`"${postToDelete.title}" পোস্টটি সফলভাবে মূল অ্যাপ থেকে মুছে ফেলা হয়েছে।`);
      setPostToDelete(null);
    }
  };

  // Draft & Expiration Handlers for Admins
  const handlePublishDraft = async (post: PostItem) => {
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        status: 'approved',
        isDraft: false,
        approvedAt: Date.now(),
        approvedBy: 'Admin'
      }).catch(err => console.warn('Firestore publish note:', err));
      deleteLocalDraft(post.id);
      post.status = 'approved';
      post.isDraft = false;
      post.approvedAt = Date.now();
      showToast(`"${post.title}" খসড়াটি সফলভাবে লাইভ ও পাবলিশ করা হয়েছে!`);
    } catch (e: any) {
      console.error('Publish draft error:', e);
      showToast('ড্রাফট পাবলিশ করতে সমস্যা হয়েছে।');
    }
  };

  const updatePostExpiry = async (postId: string, expiryTimestamp: number | null) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        expiryDate: expiryTimestamp
      }).catch(err => console.warn('Firestore update expiry note:', err));
      const target = posts.find(p => p.id === postId);
      if (target) {
        target.expiryDate = expiryTimestamp || undefined;
      }
      showToast(expiryTimestamp ? 'পোস্টের স্বয়ংক্রিয় মেয়াদ নির্ধারণ সম্পন্ন হয়েছে।' : 'পোস্টের মেয়াদ সফলভাবে বাতিল (আজীবন) করা হয়েছে।');
      setExpiryPostTarget(null);
    } catch (e: any) {
      console.error('Update expiry error:', e);
      showToast('মেয়াদ সংরক্ষণ করতে সমস্যা হয়েছে।');
    }
  };

  const handleApplyExpiryPreset = async (days: number) => {
    if (!expiryPostTarget) return;
    const expiryTimestamp = Date.now() + days * 24 * 60 * 60 * 1000;
    await updatePostExpiry(expiryPostTarget.id, expiryTimestamp);
  };

  const handleSaveCustomExpiry = async () => {
    if (!expiryPostTarget || !customExpiryDate) return;
    const targetTime = new Date(customExpiryDate).getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000;
    await updatePostExpiry(expiryPostTarget.id, targetTime);
  };

  const handleRemoveExpiry = async () => {
    if (!expiryPostTarget) return;
    await updatePostExpiry(expiryPostTarget.id, null);
  };

  // Get matching posts for date deletion modal
  const getMatchingPostsForPreset = () => {
    const now = Date.now();
    const todayStr = getPostDateString(now);

    const yesterdayObj = new Date(now - 86400000);
    const yesterdayStr = getPostDateString(yesterdayObj.getTime());

    if (datePreset === 'today') {
      return posts.filter(p => getPostDateString(p.createdAt) === todayStr);
    }
    if (datePreset === 'yesterday') {
      return posts.filter(p => getPostDateString(p.createdAt) === yesterdayStr);
    }
    if (datePreset === 'week') {
      const sevenDaysAgo = now - 7 * 86400000;
      return posts.filter(p => p.createdAt && p.createdAt < sevenDaysAgo);
    }
    if (datePreset === 'month') {
      const thirtyDaysAgo = now - 30 * 86400000;
      return posts.filter(p => p.createdAt && p.createdAt < thirtyDaysAgo);
    }
    return posts.filter(p => getPostDateString(p.createdAt) === targetDeleteDate);
  };

  // Bulk Delete Handlers
  const handleConfirmBulkDelete = async () => {
    if (selectedPostIds.length === 0) return;
    setIsDeletingBatch(true);
    try {
      const count = selectedPostIds.length;
      if (onBulkDeletePosts) {
        await onBulkDeletePosts(selectedPostIds, 'বাল্ক পোস্ট ডিলিট');
      } else {
        selectedPostIds.forEach(id => onDeletePost(id));
      }
      showToast(`একসাথে ${count}টি পোস্ট সফলভাবে মুছে ফেলা হয়েছে।`);
      setSelectedPostIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('পোস্ট ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsDeletingBatch(false);
    }
  };

  const handleConfirmDateDelete = async () => {
    const matching = getMatchingPostsForPreset();
    if (matching.length === 0) return;
    setIsDeletingBatch(true);
    try {
      const ids = matching.map(p => p.id);
      const reason = datePreset === 'custom'
        ? `${formatBanglaDate(targetDeleteDate)} তারিখের বাল্ক পোস্ট ডিলিট`
        : datePreset === 'today'
        ? 'আজকের পোস্ট ডিলিট'
        : datePreset === 'yesterday'
        ? 'গতকালকের পোস্ট ডিলিট'
        : datePreset === 'week'
        ? '৭ দিনের পুরোনো পোস্ট ডিলিট'
        : '৩০ দিনের পুরোনো পোস্ট ডিলিট';

      if (onBulkDeletePosts) {
        await onBulkDeletePosts(ids, reason);
      } else {
        ids.forEach(id => onDeletePost(id));
      }
      showToast(`নির্দিষ্ট তারিখের ${ids.length}টি পোস্ট সম্পূর্ণভাবে মুছে ফেলা হয়েছে।`);
      setIsDateDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('তারিখ অনুযায়ী পোস্ট ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsDeletingBatch(false);
    }
  };

  const handleDeleteFilteredDatePosts = async (dateStr: string, idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;
    setIsDeletingBatch(true);
    try {
      if (onBulkDeletePosts) {
        await onBulkDeletePosts(idsToDelete, `${formatBanglaDate(dateStr)} তারিখের পোস্ট ডিলিট`);
      } else {
        idsToDelete.forEach(id => onDeletePost(id));
      }
      showToast(`${formatBanglaDate(dateStr)} তারিখের ${idsToDelete.length}টি পোস্ট চিরতরে মুছে ফেলা হয়েছে।`);
      setDateFilter('');
    } catch (err) {
      console.error(err);
      showToast('পোস্ট ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsDeletingBatch(false);
    }
  };

  // Merge any local drafts so admin can see and publish drafts immediately
  const localDrafts = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('kushtia_local_post_drafts_v1');
      if (!raw) return [];
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list.map((d: any): PostItem => ({
        id: d.id,
        category: d.category,
        title: d.title,
        description: d.description,
        price: d.price,
        location: d.location,
        contactPhone: d.contactPhone || '',
        authorName: d.authorName || 'কুষ্টিয়া নাগরিক',
        authorId: d.authorId,
        createdAt: d.savedAt || Date.now(),
        status: 'draft',
        isDraft: true,
        imageUrl: d.imagePreview
      }));
    } catch {
      return [];
    }
  }, []);

  const allCombinedPosts = React.useMemo(() => {
    const existingIds = new Set(posts.map(p => p.id));
    const uniqueLocalDrafts = localDrafts.filter(d => !existingIds.has(d.id));
    return [...posts, ...uniqueLocalDrafts];
  }, [posts, localDrafts]);

  // Separate standard posts from secret crime reports so they remain completely separated
  const standardPosts = allCombinedPosts.filter(p => p.category !== 'crime-reporter');
  const secretInfoCount = allCombinedPosts.filter(p => p.category === 'crime-reporter').length;

  // Counts for standard posts
  const pendingCount = standardPosts.filter(p => p.status === 'pending').length;
  const approvedCount = standardPosts.filter(p => (!p.status || p.status === 'approved') && !p.isDraft).length;
  const rejectedCount = standardPosts.filter(p => p.status === 'rejected').length;
  const draftsCount = standardPosts.filter(p => p.status === 'draft' || p.isDraft).length;
  const expiredCount = standardPosts.filter(p => p.expiryDate && p.expiryDate < Date.now()).length;

  // Filter posts
  const filteredPosts = standardPosts.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      post.title?.toLowerCase().includes(term) ||
      post.description?.toLowerCase().includes(term) ||
      post.location?.toLowerCase().includes(term) ||
      post.authorName?.toLowerCase().includes(term) ||
      post.contactPhone?.includes(term);

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending' && post.status === 'pending') ||
      (statusFilter === 'approved' && (!post.status || post.status === 'approved') && !post.isDraft) ||
      (statusFilter === 'rejected' && post.status === 'rejected') ||
      (statusFilter === 'draft' && (post.status === 'draft' || post.isDraft)) ||
      (statusFilter === 'expired' && post.expiryDate && post.expiryDate < Date.now());

    const matchesVerification = 
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && post.isVerified) ||
      (verificationFilter === 'unverified' && !post.isVerified);

    const matchesDate = !dateFilter || getPostDateString(post.createdAt) === dateFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesVerification && matchesDate;
  });

  // Bulk Selection Handlers
  const isAllFilteredSelected = 
    filteredPosts.length > 0 && filteredPosts.every(p => selectedPostIds.includes(p.id));

  const handleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIds = new Set(filteredPosts.map(p => p.id));
      setSelectedPostIds(prev => prev.filter(id => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredPosts.map(p => p.id);
      setSelectedPostIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleToggleSelectPost = (postId: string) => {
    setSelectedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleApplyBulkVerify = (targetState?: boolean) => {
    if (selectedPostIds.length === 0) return;
    if (onBulkToggleVerify) {
      onBulkToggleVerify(selectedPostIds, targetState);
    } else {
      selectedPostIds.forEach(id => onToggleVerify(id));
    }
    const stateLabel = targetState === true 
      ? 'ভেরিফায়েড' 
      : targetState === false 
      ? 'আনভেরিফায়েড' 
      : 'টগল';
    showToast(`একসাথে ${selectedPostIds.length}টি বিজ্ঞাপনের ভেরিফিকেশন ${stateLabel} করা হয়েছে।`);
    setSelectedPostIds([]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Notice Banner: Secret Crime Reports Separation */}
      {secretInfoCount > 0 && onNavigateToSecretReports && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white rounded-3xl p-4 sm:p-5 border border-red-900/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-red-600/30 border border-red-500/40 rounded-2xl text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <span>গোপন তথ্য ও ক্রাইম রিপোর্ট সম্পূর্ণ আলাদা ডেস্কে রয়েছে</span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {toBangla(secretInfoCount)}টি রিপোর্ট
                </span>
              </h4>
              <p className="text-[11px] text-slate-300">
                নাগরিকদের পাঠানো গোপনীয় তথ্য ও অপরাধ রিপোর্ট সাধারণ বিজ্ঞাপন থেকে আলাদা করে নিরাপদ স্থানে সংরক্ষণ করা হয়েছে।
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToSecretReports}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-md shadow-red-900/40 transition-all cursor-pointer"
          >
            <span>গোপন তথ্য ডেস্কে যান</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Header & Moderation Status Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">পোস্ট ও বিজ্ঞাপন মডারেশন কিউ</h3>
            <p className="text-xs text-slate-500">
              নাগরিকদের জমা দেওয়া সাধারণ পোস্ট যাচাই, অনুমোদন বা বাতিল করুন (মোট {toBangla(standardPosts.length)} টি)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date-based Delete Tool Button */}
            <button
              onClick={() => setIsDateDeleteModalOpen(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs"
              title="নির্দিষ্ট কোনো তারিখের বা মেয়াদের সব পোস্ট এক ক্লিকে ডিলিট করুন"
            >
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>তারিখ অনুযায়ী ডিলিট</span>
            </button>

            {/* Auto-Approve Toggle */}
            <button
              onClick={handleToggleAutoApprove}
              className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                autoApprove
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-pink-200/80'
              }`}
              title="নতুন পোস্ট স্বয়ংক্রিয়ভাবে অনুমোদন হবে নাকি অ্যাডমিন অনুমোদনের অপেক্ষায় থাকবে"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>অটো-অনুমোদন: <b>{autoApprove ? 'চালু' : 'বন্ধ'}</b></span>
            </button>

            <button
              onClick={onStartCreate}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পোস্ট লিখুন</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-pink-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব বিজ্ঞাপন ({posts.length})
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>অনুমোদনের অপেক্ষায় ({pendingCount})</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'approved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            অনুমোদিত ({approvedCount})
          </button>

          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>খসড়া / ড্রাফট ({draftsCount})</span>
            {draftsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              statusFilter === 'expired'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>মেয়াদ উত্তীর্ণ ({expiredCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            প্রত্যাখ্যাত ({rejectedCount})
          </button>

          {/* Quick Filter: Secret Info / Crime Desk */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'crime-reporter' ? 'all' : 'crime-reporter')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === 'crime-reporter'
                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400/40'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>গোপন তথ্য ({secretInfoCount})</span>
          </button>
        </div>

        {/* Search and Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-pink-100">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="শিরোনাম, এলাকা, ফোন বা লেখকের নাম..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-hidden focus:border-pink-600 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-pink-600"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="house-rent">বাসা ও মেস ভাড়া</option>
              <option value="buy-sell">কেনাবেচা বাজার</option>
              <option value="doctor">ডাক্তার তালিকা</option>
              <option value="blood">রক্তদান সেবা</option>
              <option value="transport">পরিবহন সেবা</option>
              <option value="mason">রাজমিস্ত্রি</option>
              <option value="mobile-maker">মোবাইল মেকার</option>
              <option value="electrician">ইলেকট্রিশিয়ান</option>
              <option value="plumber">প্লাম্বার</option>
              <option value="ac-mechanic">এসি/ফ্রিজ</option>
              <option value="driver">ড্রাইভার</option>
              <option value="tutor">গৃহশিক্ষক</option>
              <option value="vet">পশু চিকিৎসক</option>
              <option value="food">খাবার ও রেস্তোরাঁ</option>
              <option value="jobs">চাকরি ও নিয়োগ</option>
              <option value="lost-found">হারানো ও প্রাপ্তি</option>
              <option value="crime-reporter">গোপন ক্রাইম রিপোর্ট</option>
              <option value="events">ইভেন্ট ও ডেকোরেশন</option>
              <option value="legal">আইনজীবী সেবা</option>
              <option value="citizen-fund">নাগরিক ফান্ড</option>
              <option value="services">নাগরিক সার্ভিস</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="sm:col-span-2">
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-pink-600"
            >
              <option value="all">সব ভেরিফিকেশন</option>
              <option value="verified">ভেরিফায়েড</option>
              <option value="unverified">আনভেরিফায়েড</option>
            </select>
          </div>

          {/* Date Filter Input */}
          <div className="sm:col-span-3 flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-pink-600"
                title="নির্দিষ্ট তারিখের পোস্ট ফিল্টার করুন"
              />
            </div>
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold shrink-0"
                title="তারিখ ফিল্টার ক্লিয়ার করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Date Filter Banner */}
        {dateFilter && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="text-xs text-rose-900 font-bold">
                তারিখ ফিল্টার: <span className="underline decoration-rose-400">{formatBanglaDate(dateFilter)}</span>
                <span className="ml-2 font-normal text-rose-700">
                  (এই তারিখে মোট <b>{filteredPosts.length}টি</b> পোস্ট পাওয়া গেছে)
                </span>
              </div>
            </div>
            {filteredPosts.length > 0 && (
              <button
                type="button"
                disabled={isDeletingBatch}
                onClick={() => {
                  if (confirm(`আপনি কি নিশ্চিতভাবে ${formatBanglaDate(dateFilter)} তারিখের মোট ${filteredPosts.length}টি পোস্ট চিরতরে ডিলিট করতে চান?`)) {
                    handleDeleteFilteredDatePosts(dateFilter, filteredPosts.map(p => p.id));
                  }
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>এই তারিখের সব পোস্ট ডিলিট করুন ({toBanglaNumber(filteredPosts.length)}টি)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Moderate Control Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs border border-slate-800">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAllFilteredSelected}
              onChange={handleSelectAllFiltered}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-pink-500/30 border-slate-700 bg-slate-800 cursor-pointer"
            />
            <span className="text-xs font-black text-slate-200">
              বাল্ক নির্বাচন: সব নির্বাচন করুন ({filteredPosts.length}টির মধ্যে)
            </span>
          </label>
          {selectedPostIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
              {selectedPostIds.length}টি নির্বাচিত
            </span>
          )}
        </div>

        {selectedPostIds.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap animate-in fade-in duration-150">
            <span className="text-[11px] font-bold text-slate-400 mr-1 hidden md:inline">একশন:</span>
            
            {/* Bulk Delete Button */}
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
              title="নির্বাচিত পোস্টগুলো স্থায়ীভাবে মুছে ফেলুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>মুছে ফেলুন ({selectedPostIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyBulkVerify(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
              title="নির্বাচিত সব পোস্টে ভেরিফাইড ব্যাজ যুক্ত করুন"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ভেরিফাই</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyBulkVerify(false)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
              title="নির্বাচিত সব পোস্ট থেকে ভেরিফিকেশন বাদ দিন"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>আনভেরিফাই</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyBulkVerify(undefined)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1"
              title="ভেরিফিকেশন স্ট্যাটাস বিপরীত করুন"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>টগল</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPostIds([])}
              className="px-2.5 py-1.5 text-rose-400 hover:text-rose-300 text-xs font-bold transition-colors"
            >
              বাতিল
            </button>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-2.5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-pink-200/80/80 shadow-xs">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো পোস্ট পাওয়া যায়নি!</p>
            <p className="text-xs text-slate-400 mt-1">আপনার সার্চ বা ফিল্টার পরিবর্তন করে দেখুন।</p>
          </div>
        ) : (
          filteredPosts
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map((post) => {
            const isPending = post.status === 'pending';
            const isRejected = post.status === 'rejected';
            const isSelected = selectedPostIds.includes(post.id);

            return (
              <div
                key={post.id}
                className={`bg-white rounded-2xl p-4 border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : isPending 
                    ? 'border-amber-400/80 bg-amber-50/20' 
                    : isRejected 
                    ? 'border-rose-300 bg-rose-50/20 opacity-80' 
                    : 'border-pink-200/80/80 hover:border-pink-300'
                }`}
              >
                {/* Bulk Select Checkbox */}
                <div 
                  className="flex items-center pr-1 shrink-0 cursor-pointer pt-1 md:pt-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSelectPost(post.id);
                  }}
                  title="বাল্ক মডারেশনের জন্য সিলেক্ট করুন"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectPost(post.id)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-pink-500 border-pink-300 cursor-pointer"
                  />
                </div>

                {/* Post Details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-pink-100 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-400 flex flex-col items-center justify-center shrink-0 border border-pink-200/80/60">
                      <Tag className="w-5 h-5 text-slate-300" />
                      <span className="text-[9px] font-bold mt-1">ছবি নেই</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {post.category}
                      </span>

                      {/* Status Badges */}
                      {post.isDraft || post.status === 'draft' ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                          <Bookmark className="w-3 h-3 text-amber-700" />
                          <span>খসড়া</span>
                        </span>
                      ) : isPending ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>অনুমোদন প্রয়োজন</span>
                        </span>
                      ) : isRejected ? (
                        <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                          বাতিল করা হয়েছে
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          অনুমোদিত
                        </span>
                      )}

                      {/* Expiry Badge */}
                      {post.expiryDate && (
                        post.expiryDate < Date.now() ? (
                          <span className="flex items-center gap-1 text-[10px] font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-300">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>মেয়াদ শেষ ({formatBanglaDate(getPostDateString(post.expiryDate))})</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>মেয়াদ: {formatBanglaDate(getPostDateString(post.expiryDate))}</span>
                          </span>
                        )
                      )}

                      {post.isVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ভেরিফায়েড</span>
                        </span>
                      )}

                      {post.price && (
                        <span className="text-[11px] font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                          {post.price}
                        </span>
                      )}

                      {/* Date Badge */}
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatBanglaDate(getPostDateString(post.createdAt)) || 'তারিখ অপ্রাপ্ত'}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {post.description}
                    </p>

                    {post.rejectionReason && (
                      <p className="text-[11px] text-rose-700 font-medium mt-1">
                        বাতিলের কারণ: {post.rejectionReason}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {post.location}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {post.contactPhone}
                      </span>
                      <span className="text-slate-400">
                        লেখক: <b className="text-slate-700 font-semibold">{post.authorName}</b>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Prominent Approve/Reject Controls + Publish Draft + Expiry + Edit + Delete */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-pink-100 w-full md:w-auto justify-end flex-wrap">
                  {/* Draft Publish Control */}
                  {(post.isDraft || post.status === 'draft') && (
                    <button
                      onClick={() => handlePublishDraft(post)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                      title="খসড়াটি লাইভ ও সবার জন্য পাবলিশ করুন"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>পাবলিশ করুন</span>
                    </button>
                  )}

                  {/* Pending Approval Controls */}
                  {isPending && !post.isDraft && (
                    <>
                      <button
                        onClick={() => handleApprove(post)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="বিজ্ঞাপন অনুমোদন করুন"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>অনুমোদন করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectingPost(post);
                          setRejectionReason('বিজ্ঞাপনের বিবরণ নীতিমালার পরিপন্থী বা অসম্পূর্ণ।');
                        }}
                        className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="বিজ্ঞাপন বাতিল করুন"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>বাতিল</span>
                      </button>
                    </>
                  )}

                  {/* Automatic Expiry Date Control Button */}
                  <button
                    onClick={() => {
                      setExpiryPostTarget(post);
                      if (post.expiryDate) {
                        const d = new Date(post.expiryDate);
                        setCustomExpiryDate(d.toISOString().split('T')[0]);
                      } else {
                        setCustomExpiryDate('');
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border cursor-pointer ${
                      post.expiryDate && post.expiryDate < Date.now()
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : post.expiryDate
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-pink-200/80'
                    }`}
                    title="পোস্টের মেয়াদ নির্ধারণ বা পরিবর্তন করুন"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[11px]">{post.expiryDate ? 'মেয়াদ এডিট' : 'মেয়াদ সেট'}</span>
                  </button>

                  {/* Verify Toggle */}
                  <button
                    onClick={() => onToggleVerify(post.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border cursor-pointer ${
                      post.isVerified
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                    title={post.isVerified ? 'ভেরিফিকেশন প্রত্যাহার করুন' : 'পোস্টে ভেরিফায়েড ব্যাজ যুক্ত করুন'}
                  >
                    {post.isVerified ? <XCircle className="w-3.5 h-3.5 text-amber-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="text-[11px]">{post.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onStartEdit(post)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-pink-200/80 cursor-pointer"
                    title="পোস্ট সম্পাদনা করুন"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Post Remove Button */}
                  <button
                    onClick={() => setPostToDelete(post)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-200 flex items-center gap-1 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination Controls */}
        {filteredPosts.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-pink-200/80 shadow-xs mt-4">
            <span className="text-xs font-bold text-slate-600">
              পাতা {currentPage} / {Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)} (মোট {filteredPosts.length}টি পোস্ট)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-700 transition-colors"
              >
                আগের পাতা
              </button>
              <button
                type="button"
                disabled={currentPage >= Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl text-xs font-bold text-white transition-colors"
              >
                পরের পাতা
              </button>
            </div>
          </div>
        )}

        {/* Load More Pagination Button */}
        {hasMorePosts && !searchTerm && selectedCategory === 'all' && statusFilter === 'all' && verificationFilter === 'all' && !dateFilter && (
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              disabled={isLoadingMorePosts}
              onClick={onLoadMorePosts}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMorePosts ? 'animate-spin' : ''}`} />
              <span>{isLoadingMorePosts ? 'লোড হচ্ছে...' : 'আরও পোস্ট লোড করুন (পরবর্তী ৫০টি)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-pink-200/80 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              বিজ্ঞাপন বাতিলের কারণ উল্লেখ করুন
            </h3>
            <p className="text-xs text-slate-500">
              পোস্ট: <span className="font-bold text-slate-700">{rejectingPost.title}</span>
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-3">
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="বাতিলের কারণ লিখুন..."
                className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingPost(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20"
                >
                  বাতিল নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-pink-200/80 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">পোস্ট মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনি কি নিশ্চিতভাবে এই পোস্টটি রিমুভ করতে চান? এটি মূল অ্যাপ ও ডাটাবেজ থেকে অবিলম্বে স্থায়ীভাবে মুছে যাবে।
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-pink-200/80/80 text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase">নির্বাচিত পোস্ট</div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{postToDelete.title}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>ক্যাটাগরি: <b>{postToDelete.category}</b></span>
                <span>লেখক: <b>{postToDelete.authorName}</b></span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-pink-200/80 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                একসাথে {toBanglaNumber(selectedPostIds.length)}টি পোস্ট ডিলিট করতে চান?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                নির্বাচিত সকল পোস্ট মূল অ্যাপ, হোমফিড ও ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে। এটি আর পুনরায় ফিরিয়ে আনা সম্ভব নয়।
              </p>
            </div>

            {/* Selected items preview */}
            <div className="bg-slate-50 border border-pink-200/80 rounded-2xl p-3 max-h-40 overflow-y-auto space-y-1.5 text-left">
              <div className="text-[11px] font-black text-slate-600 mb-1">
                মুছে ফেলার তালিকায় থাকা পোস্টসমূহ ({toBanglaNumber(selectedPostIds.length)}টি):
              </div>
              {selectedPostIds.map(id => {
                const p = posts.find(item => item.id === id);
                return (
                  <div key={id} className="text-xs text-slate-700 flex items-center gap-1.5 truncate border-b border-pink-200/80/50 pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span className="font-semibold truncate">{p?.title || id}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-auto">
                      {p?.createdAt ? formatBanglaDate(getPostDateString(p.createdAt)) : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingBatch}
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={isDeletingBatch}
                onClick={handleConfirmBulkDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingBatch ? 'মুছে ফেলা হচ্ছে...' : 'এক ক্লিকে সব মুছুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date-Based Delete Tool Modal */}
      {isDateDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-pink-200/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">তারিখ অনুযায়ী পোস্ট ডিলিট</h3>
                  <p className="text-[11px] text-slate-500">নির্দিষ্ট তারিখ বা মেয়াদের পোস্ট এক ক্লিকে মুছুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsDateDeleteModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">সময়সীমা / ফিল্টার নির্বাচন করুন:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDatePreset('today')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    datePreset === 'today'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-pink-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>আজকের পোস্ট</span>
                  {datePreset === 'today' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDatePreset('yesterday')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    datePreset === 'yesterday'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-pink-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>গতকালকের পোস্ট</span>
                  {datePreset === 'yesterday' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDatePreset('week')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    datePreset === 'week'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-pink-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>৭ দিনের পুরোনো</span>
                  {datePreset === 'week' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDatePreset('month')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    datePreset === 'month'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-pink-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>৩০ দিনের পুরোনো</span>
                  {datePreset === 'month' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDatePreset('custom')}
                className={`w-full mt-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                  datePreset === 'custom'
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : 'bg-slate-50 border-pink-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>ক্যালেন্ডার থেকে নির্দিষ্ট কোনো তারিখ</span>
                {datePreset === 'custom' && <Check className="w-3.5 h-3.5 text-rose-600" />}
              </button>
            </div>

            {/* Custom Date Input */}
            {datePreset === 'custom' && (
              <div className="space-y-1 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                <label className="text-[11px] font-bold text-rose-900 block">যে তারিখের পোস্ট মুছতে চান:</label>
                <input
                  type="date"
                  value={targetDeleteDate}
                  onChange={(e) => setTargetDeleteDate(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}

            {/* Matching Posts Counter & Preview */}
            {(() => {
              const matching = getMatchingPostsForPreset();
              return (
                <div className="bg-slate-50 rounded-2xl p-3 border border-pink-200/80/80 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">পাওয়া গেছে:</span>
                    <span className={`font-black px-2 py-0.5 rounded-full ${
                      matching.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {toBanglaNumber(matching.length)}টি পোস্ট
                    </span>
                  </div>

                  {matching.length > 0 ? (
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1 border-t border-pink-200/80/60 pt-1.5">
                      {matching.slice(0, 10).map(p => (
                        <div key={p.id} className="text-[11px] text-slate-600 truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                          <span className="truncate font-medium">{p.title}</span>
                          <span className="text-[9px] text-slate-400 ml-auto shrink-0">
                            {formatBanglaDate(getPostDateString(p.createdAt))}
                          </span>
                        </div>
                      ))}
                      {matching.length > 10 && (
                        <div className="text-[10px] text-slate-400 text-center italic">
                          ...এবং আরও {toBanglaNumber(matching.length - 10)}টি বিজ্ঞাপন
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 text-center py-2">
                      এই মানদণ্ডে বর্তমানে কোনো পোস্ট নেই।
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingBatch}
                onClick={() => setIsDateDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={isDeletingBatch || getMatchingPostsForPreset().length === 0}
                onClick={handleConfirmDateDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-40 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {isDeletingBatch 
                    ? 'মুছে ফেলা হচ্ছে...' 
                    : `এক ক্লিকে সব মুছুন (${toBanglaNumber(getMatchingPostsForPreset().length)})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expiry Date Setting Modal for Admins */}
      {expiryPostTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">পোস্টের স্বয়ংক্রিয় মেয়াদ নির্ধারণ</h4>
                  <p className="text-[11px] text-slate-500">মেয়াদ পার হলে পোস্টটি স্বয়ংক্রিয়ভাবে পাবলিক ফিড থেকে লুকানো থাকবে</p>
                </div>
              </div>
              <button 
                onClick={() => setExpiryPostTarget(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-pink-100">
              <span className="text-xs font-bold text-slate-800 block line-clamp-1">{expiryPostTarget.title}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                বর্তমান অবস্থা: {expiryPostTarget.expiryDate ? (
                  expiryPostTarget.expiryDate < Date.now() ? (
                    <b className="text-rose-600">মেয়াদ উত্তীর্ণ ({formatBanglaDate(getPostDateString(expiryPostTarget.expiryDate))})</b>
                  ) : (
                    <b className="text-blue-600">মেয়াদ বাকি ({formatBanglaDate(getPostDateString(expiryPostTarget.expiryDate))})</b>
                  )
                ) : (
                  <b className="text-emerald-600">মেয়াদহীন (স্থায়ী পোস্ট)</b>
                )}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">কুইক প্রিসেট থেকে মেয়াদ নির্ধারণ করুন:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyExpiryPreset(3)}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-all text-center cursor-pointer"
                >
                  ৩ দিন (+3 Days)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyExpiryPreset(7)}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-all text-center cursor-pointer"
                >
                  ৭ দিন (+7 Days)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyExpiryPreset(15)}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-all text-center cursor-pointer"
                >
                  ১৫ দিন (+15 Days)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyExpiryPreset(30)}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-all text-center cursor-pointer"
                >
                  ৩০ দিন (+30 Days)
                </button>
              </div>
            </div>

            {/* Custom Date Input */}
            <div className="space-y-1.5 pt-2 border-t border-pink-100">
              <label className="text-xs font-bold text-slate-700 block">অথবা নির্দিষ্ট শেষ তারিখ বেছে নিন:</label>
              <input
                type="date"
                value={customExpiryDate}
                onChange={(e) => setCustomExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCustomExpiry}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                মেয়াদ সংরক্ষণ করুন
              </button>

              <button
                type="button"
                onClick={handleRemoveExpiry}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="মেয়াদ তুলে নিয়ে আজীবন প্রদর্শন করুন"
              >
                মেয়াদহীন করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
