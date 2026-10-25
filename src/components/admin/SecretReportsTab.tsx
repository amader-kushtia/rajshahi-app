import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Search, 
  Phone, 
  Share2, 
  Printer, 
  FileText, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ShieldCheck,
  Radio,
  Send,
  Sparkles
} from 'lucide-react';
import { PostItem } from '../../types';
import { approvePost, rejectPost } from '../../services/adminFeaturesService';

interface SecretReportsTabProps {
  posts: PostItem[];
  onDeletePost: (postId: string) => void;
  onRefreshPosts?: () => void;
}

export const SecretReportsTab: React.FC<SecretReportsTabProps> = ({
  posts,
  onDeletePost,
  onRefreshPosts
}) => {
  // Filter exclusively for secret / crime-reporter posts
  const secretReports = posts.filter(p => p.category === 'crime-reporter');

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [crimeCategoryFilter, setCrimeCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & previews
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectingPost, setRejectingPost] = useState<PostItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [postToDelete, setPostToDelete] = useState<PostItem | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Convert numbers to Bengali
  const toBangla = (num: number) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, ch => bengaliNumbers[parseInt(ch, 10)]);
  };

  // Action handlers
  const handleApprove = async (post: PostItem) => {
    await approvePost(post.id);
    showToast(`"${post.title}" গোপন তথ্যটি অনুমোদন করা হয়েছে এবং এখন পাবলিক ফিডে দৃশ্যমান।`);
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPost) return;

    await rejectPost(rejectingPost.id, rejectionReason.trim() || 'অপর্যাপ্ত বা অস্পষ্ট প্রমাণ');
    showToast(`"${rejectingPost.title}" তথ্যটি বাতিল করা হয়েছে।`);
    setRejectingPost(null);
    setRejectionReason('');
  };

  const handleDeleteConfirm = () => {
    if (!postToDelete) return;
    onDeletePost(postToDelete.id);
    showToast(`"${postToDelete.title}" রিপোর্টটি স্থায়ীভাবে মুছে ফেলা হয়েছে।`);
    setPostToDelete(null);
  };

  const handleCopyReportForPolice = (post: PostItem) => {
    const reportText = `🚨 [আমার কুষ্টিয়া - গোপন ক্রাইম ও তথ্য রিপোর্ট] 🚨
----------------------------------------
📌 অপরাধের ধরন: ${post.details?.crimeCategory || post.subcategory || 'গোপন তথ্য'}
📍 ঘটনাস্থল: ${post.location}
📅 তারিখ: ${new Date(post.createdAt).toLocaleDateString('bn-BD')} ${new Date(post.createdAt).toLocaleTimeString('bn-BD')}
👤 প্রেরক: ${post.isAnonymous ? 'গোপন নাগরিক (নাম প্রকাশে অনিচ্ছুক)' : post.authorName}
${post.contactPhone ? `📞 যোগাযোগের ফোন: ${post.contactPhone}` : ''}

📝 বিবরণ:
${post.description}

${post.imageUrl ? `📷 প্রমাণের ছবি লিঙ্ক: ${post.imageUrl}` : ''}
----------------------------------------
নোট: এই তথ্যটি আমার কুষ্টিয়া অ্যাপের গোপন ডেস্কে জমা হয়েছে।`;

    navigator.clipboard.writeText(reportText);
    showToast('পুলিশের কাছে পাঠানোর জন্য সম্পূর্ণ তথ্যটি ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  const handlePrintReport = (post: PostItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>গোপন তথ্য রিপোর্ট - ${post.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; }
            h1 { color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 10px; }
            .meta { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .desc { font-size: 16px; line-height: 1.6; white-space: pre-wrap; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>আমার কুষ্টিয়া - গোপন ক্রাইম রিপোর্ট</h1>
          <div class="meta">
            <p><strong>শিরোনাম:</strong> ${post.title}</p>
            <p><strong>অপরাধের ধরন:</strong> ${post.details?.crimeCategory || post.subcategory || 'অনির্দিষ্ট'}</p>
            <p><strong>ঘটনাস্থল:</strong> ${post.location}</p>
            <p><strong>তারিখ:</strong> ${new Date(post.createdAt).toLocaleString('bn-BD')}</p>
            <p><strong>প্রেরকের পরিচয়:</strong> ${post.isAnonymous ? 'নাম গোপন রাখা হয়েছে' : post.authorName}</p>
            ${post.contactPhone ? `<p><strong>যোগাযোগ:</strong> ${post.contactPhone}</p>` : ''}
          </div>
          <h3>পূর্ণাঙ্গ বিবরণ:</h3>
          <div class="desc">${post.description}</div>
          ${post.imageUrl ? `<p><strong>ছবি সংযুক্ত রয়েছে:</strong> <br><img src="${post.imageUrl}" style="max-width: 400px; margin-top: 15px; border-radius: 8px;" /></p>` : ''}
          <div class="footer">কুষ্টিয়া পৌরসভা ও স্থানীয় আইনশৃঙ্খলা বাহিনীর সমন্বয়ে সংরক্ষিত।</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Counts
  const pendingCount = secretReports.filter(p => p.status === 'pending').length;
  const approvedCount = secretReports.filter(p => p.status === 'approved').length;
  const rejectedCount = secretReports.filter(p => p.status === 'rejected').length;

  // Filtered List
  const filteredReports = secretReports.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      post.title?.toLowerCase().includes(term) ||
      post.description?.toLowerCase().includes(term) ||
      post.location?.toLowerCase().includes(term) ||
      post.authorName?.toLowerCase().includes(term);

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending' && post.status === 'pending') ||
      (statusFilter === 'approved' && post.status === 'approved') ||
      (statusFilter === 'rejected' && post.status === 'rejected');

    const crimeType = post.details?.crimeCategory || post.subcategory || '';
    const matchesCrimeCategory = 
      crimeCategoryFilter === 'all' || crimeType.includes(crimeCategoryFilter);

    return matchesSearch && matchesStatus && matchesCrimeCategory;
  });

  const categories = ['all', 'মাদক ব্যবসা', 'দুর্নীতি', 'চাঁদাবাজি', 'ইভটিজিং', 'চুরি/ছিনতাই', 'অন্যান্য'];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Confidential Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-red-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-600/30 border border-red-500/40 rounded-xl text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider bg-red-950 text-red-400 border border-red-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                সম্পূর্ণ পৃথক ও অতি-গোপনীয় নিয়ন্ত্রণ কেন্দ্র
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              গোপন তথ্য ও ক্রাইম রিপোর্ট ডেস্ক
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              কুষ্টিয়া শহরের নাগরিকদের পাঠানো অপরাধ, মাদক, চাঁদাবাজি বা দুর্নীতির গোপন তথ্যসমূহ সাধারণ পোস্ট থেকে সম্পূর্ণ আলাদাভাবে এখানে সংরক্ষিত হয়। এডমিন যাচাই করে অনুমোদন দিলেই কেবল এটি সাধারণ জনগণের সতর্কতার জন্য লাইভ হবে।
            </p>
          </div>

          {/* Emergency Helplines Fast Action */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a 
              href="tel:01320146300"
              className="px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-red-900/40"
              title="সরাসরি কুষ্টিয়া মডেল থানার ওসির সরকারি মোবাইল নম্বর"
            >
              <Phone className="w-4 h-4" />
              <span>ওসি কুষ্টিয়া মডেল থানা (০১৩২০-১৪৬৩০০)</span>
            </a>
            <a 
              href="tel:999"
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <span>জাতীয় জরুরি সেবা (৯৯৯)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500">মোট গোপন রিপোর্ট</span>
            <span className="p-1.5 bg-slate-100 text-slate-700 rounded-xl">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{toBangla(secretReports.length)} টি</div>
          <div className="text-[10px] text-slate-400 mt-0.5">নাগরিকদের পাঠানো তথ্য</div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-800">অনুমোদনের অপেক্ষায়</span>
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="w-4 h-4 animate-pulse" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-900">{toBangla(pendingCount)} টি</div>
          <div className="text-[10px] text-amber-700 mt-0.5">এডমিন পর্যালোচনার অপেক্ষায়</div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-emerald-200/80 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-800">অনুমোদিত (পাবলিক)</span>
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-900">{toBangla(approvedCount)} টি</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">নাগরিক ফিডে দৃশ্যমান</div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-rose-200/80 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-800">বাতিলকৃত রিপোর্ট</span>
            <span className="p-1.5 bg-rose-100 text-rose-800 rounded-xl">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-900">{toBangla(rejectedCount)} টি</div>
          <div className="text-[10px] text-rose-600 mt-0.5">ভিত্তিহীন বা বাতিল</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সব তথ্য ({toBangla(secretReports.length)})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>অনুমোদনের অপেক্ষায় ({toBangla(pendingCount)})</span>
            </button>

            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === 'approved'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>অনুমোদিত ({toBangla(approvedCount)})</span>
            </button>

            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === 'rejected'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>বাতিল ({toBangla(rejectedCount)})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ঘটনাস্থল, অপরাধ বা তথ্য খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Crime Type Category Sub-filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-pink-100">
          <span className="text-[11px] font-bold text-slate-400 mr-1 whitespace-nowrap">অপরাধের ধরন:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCrimeCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                crimeCategoryFilter === cat
                  ? 'bg-red-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'সব ধরন' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-pink-200/80/80 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">কোনো গোপন তথ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || crimeCategoryFilter !== 'all' || statusFilter !== 'all'
              ? 'ফিল্টারের সাথে মিলে এমন কোনো গোপন রিপোর্ট মেলেনি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।'
              : 'কুষ্টিয়াবাসী এখনো কোনো নতুন গোপন ক্রাইম রিপোর্ট পাঠাননি।'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map(post => {
            const isPending = post.status === 'pending';
            const isApproved = post.status === 'approved';
            const isRejected = post.status === 'rejected';
            const isExpanded = expandedPostId === post.id;
            const crimeType = post.details?.crimeCategory || post.subcategory || 'গোপন তথ্য';

            return (
              <div 
                key={post.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                  isPending 
                    ? 'border-amber-300 shadow-md bg-gradient-to-r from-amber-50/20 via-white to-white' 
                    : isRejected
                    ? 'border-pink-200/80 opacity-80'
                    : 'border-pink-200/80 shadow-xs hover:border-pink-300'
                }`}
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Status badge */}
                        {isPending && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-lg font-black flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            অনুমোদনের অপেক্ষায় (পেন্ডিং)
                          </span>
                        )}
                        {isApproved && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            অনুমোদিত (পাবলিক)
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            বাতিল
                          </span>
                        )}

                        {/* Crime Type Badge */}
                        <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-lg font-bold">
                          {crimeType}
                        </span>

                        {/* Anonymity Tag */}
                        {post.isAnonymous ? (
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-slate-500" />
                            পরিচয় গোপন রাখা হয়েছে
                          </span>
                        ) : (
                          <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-lg font-bold">
                            প্রেরক: {post.authorName}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-slate-900 pt-1">
                        {post.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-red-600" />
                          {post.location}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">
                          {new Date(post.createdAt).toLocaleTimeString('bn-BD', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Buttons on Top Right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <button
                          onClick={() => handleApprove(post)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>অনুমোদন ও পাবলিক করুন</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => setRejectingPost(post)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>বাতিল</span>
                        </button>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => setRejectingPost(post)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all"
                          title="পাবলিক ফিড থেকে অপ্রকাশিত করুন"
                        >
                          <span>অপ্রকাশিত করুন</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-pink-100 text-xs text-slate-700 leading-relaxed space-y-2">
                    <p className={isExpanded ? '' : 'line-clamp-3'}>
                      {post.description}
                    </p>

                    {post.description.length > 200 && (
                      <button
                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        className="text-[11px] font-bold text-red-700 hover:text-red-800 flex items-center gap-0.5 pt-1"
                      >
                        {isExpanded ? (
                          <><span>কম দেখুন</span> <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <><span>পুরো বিবরণ পড়ুন</span> <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Rejection Note if rejected */}
                  {isRejected && post.rejectionReason && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>বাতিলের কারণ: <b>{post.rejectionReason}</b></span>
                    </div>
                  )}

                  {/* Attached Evidence Photo */}
                  {post.imageUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage(post.imageUrl || null)}
                        className="relative group cursor-pointer w-24 h-20 rounded-2xl overflow-hidden border border-pink-200/80 shrink-0 shadow-xs"
                      >
                        <img 
                          src={post.imageUrl} 
                          alt="সংযুক্ত প্রমাণ" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                          প্রমাণের ছবি সংযুক্ত রয়েছে
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">ছবি বড় করে দেখতে ক্লিক করুন</p>
                      </div>
                    </div>
                  )}

                  {/* Reporter Contact Info if provided and not anonymous */}
                  {post.contactPhone && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl w-fit">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>প্রেরকের ফোন: <a href={`tel:${post.contactPhone}`} className="text-emerald-700 underline font-mono">{post.contactPhone}</a></span>
                    </div>
                  )}

                  {/* Action Bar Footer */}
                  <div className="mt-4 pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyReportForPolice(post)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="পুলিশের কাছে মেসেজ পাঠানোর সুবিধার্থে ফরম্যাটেড টেক্সট কপি করুন"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>রিপোর্ট কপি করুন (পুলিশের জন্য)</span>
                      </button>

                      <button
                        onClick={() => handlePrintReport(post)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="প্রিন্ট করুন বা পিডিএফ সেভ করুন"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>প্রিন্ট / সেভ</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setPostToDelete(post)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ডিলিট</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Zoom Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-slate-900 rounded-3xl overflow-hidden p-2">
            <img 
              src={previewImage} 
              alt="প্রমাণ বড় আকারে" 
              className="max-w-full max-h-[75vh] object-contain rounded-2xl mx-auto" 
            />
            <div className="p-3 text-center">
              <button 
                onClick={() => setPreviewImage(null)}
                className="px-5 py-1.5 bg-white text-slate-900 rounded-xl font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 border border-pink-200/80 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">তথ্যটি বাতিল করুন</h3>
                <p className="text-xs text-slate-500">প্রেরককে বাতিলের কারণ জানিয়ে দেওয়া হবে</p>
              </div>
            </div>

            <form onSubmit={handleRejectConfirm} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                বাতিলের কারণ লিখুন:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="যেমন: তথ্যে পর্যাপ্ত প্রমাণ নেই, অথবা এটি ভুয়া বা বিভ্রান্তিকর..."
                rows={3}
                required
                className="w-full p-3 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-hidden"
              />

              {/* Quick Reason Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'অসম্পূর্ণ বা অস্পষ্ট তথ্য',
                  'পর্যাপ্ত প্রমাণ সংযুক্ত নেই',
                  'ব্যক্তিগত শত্রুতা বা অবাস্তব অভিযোগ',
                  'নীতিমালা পরিপন্থী কনটেন্ট'
                ].map((reason) => (
                  <button
                    type="button"
                    key={reason}
                    onClick={() => setRejectionReason(reason)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-lg transition-colors"
                  >
                    + {reason}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingPost(null)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 transition-colors shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-pink-200/80 shadow-2xl space-y-3">
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 w-fit">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">গোপন রিপোর্ট মুছে ফেলবেন?</h3>
            <p className="text-xs text-slate-500">
              "{postToDelete.title}" স্থায়ীভাবে ডাটাবেজ থেকে মুছে যাবে। এই অ্যাকশনটি ফিরিয়ে আনা সম্ভব নয়।
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-2xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 shadow-xs"
              >
                স্থায়ীভাবে ডিলিট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
