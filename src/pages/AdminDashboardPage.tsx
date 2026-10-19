import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Palette, 
  BellRing, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  RefreshCw, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle,
  Search,
  Filter,
  Save,
  KeyRound,
  Layers,
  Phone,
  MapPin,
  Check,
  Megaphone,
  Radio,
  Heart,
  Settings,
  Wallet
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useAuth } from '../context/AuthContext';
import { PostItem, CategoryType, ThemeColor } from '../types';
import { KUSHTIA_AREAS } from '../data/initialData';
import { VolunteerManagementTab } from '../components/admin/VolunteerManagementTab';
import { PaymentHistoryTab } from '../components/admin/PaymentHistoryTab';

interface AdminDashboardPageProps {
  posts: PostItem[];
  onBack: () => void;
  onUpdatePosts: (updatedPosts: PostItem[]) => void;
  onAddPost: (post: Omit<PostItem, 'id' | 'createdAt'>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  posts = [],
  onBack,
  onUpdatePosts,
  onAddPost
}) => {
  const { 
    isAdmin, 
    verifyPin, 
    adminLogout, 
    changePin, 
    themeColor, 
    setThemeColor, 
    marqueeNotice, 
    updateMarqueeNotice, 
    analytics 
  } = useAdminConfig();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'notice' | 'volunteers' | 'theme' | 'security' | 'payment-history'>('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'house-rent' as PostItem['category'],
    subcategory: '',
    location: KUSHTIA_AREAS[0],
    price: '',
    contactPhone: '',
    whatsapp: '',
    imageUrl: '',
    authorName: 'এডমিন (আমার কুষ্টিয়া)',
    isVerified: true
  });

  const [noticeText, setNoticeText] = useState(marqueeNotice);
  const [noticeSaved, setNoticeSaved] = useState(false);

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setNoticeText(marqueeNotice);
  }, [marqueeNotice]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await verifyPin(pinInput);
    if (isValid) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('ভুল পিন কোড! সঠিক ৬-সংখ্যার সিকিউরিটি পিন দিন (ডিফল্ট: 123456)');
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান? এটি মূল অ্যাপ থেকে সঙ্গে সঙ্গে মুছে যাবে।')) {
      const updated = posts.filter(p => p.id !== id);
      onUpdatePosts(updated);
    }
  };

  const handleToggleVerify = (id: string) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return { ...p, isVerified: !p.isVerified };
      }
      return p;
    });
    onUpdatePosts(updated);
  };

  const handleStartEdit = (post: PostItem) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      category: post.category,
      subcategory: post.subcategory || '',
      location: post.location,
      price: post.price || '',
      contactPhone: post.contactPhone,
      whatsapp: post.whatsapp || '',
      imageUrl: post.imageUrl || '',
      authorName: post.authorName,
      isVerified: post.isVerified
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const updated = posts.map(p => {
      if (p.id === editingPost.id) {
        return {
          ...p,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory || undefined,
          location: formData.location,
          price: formData.price || undefined,
          contactPhone: formData.contactPhone,
          whatsapp: formData.whatsapp || undefined,
          imageUrl: formData.imageUrl || undefined,
          isVerified: formData.isVerified
        };
      }
      return p;
    });

    onUpdatePosts(updated);
    setEditingPost(null);
  };

  const handleSaveNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPost({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      location: formData.location,
      price: formData.price || undefined,
      contactPhone: formData.contactPhone,
      whatsapp: formData.whatsapp || undefined,
      imageUrl: formData.imageUrl || undefined,
      authorName: formData.authorName,
      authorPhone: formData.contactPhone,
      authorId: 'admin-system',
      isVerified: true,
      isAnonymous: false
    });
    setIsAddingPost(false);
    setFormData({
      title: '',
      description: '',
      category: 'house-rent',
      subcategory: '',
      location: KUSHTIA_AREAS[0],
      price: '',
      contactPhone: '',
      whatsapp: '',
      imageUrl: '',
      authorName: 'এডমিন (আমার কুষ্টিয়া)',
      isVerified: true
    });
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    updateMarqueeNotice(noticeText);
    setNoticeSaved(true);
    setTimeout(() => setNoticeSaved(false), 2000);
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmNewPin) {
      setPinChangeMessage({ type: 'error', text: 'নতুন পিন এবং নিশ্চিতকরণ পিন মেলেনি!' });
      return;
    }
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      setPinChangeMessage({ type: 'error', text: 'পিন অবশ্যই ৬ সংখ্যার (digits) হতে হবে!' });
      return;
    }
    const success = await changePin(oldPin, newPin);
    if (success) {
      setPinChangeMessage({ type: 'success', text: 'এডমিন সিকিউরিটি পিন ফায়ারস্টোরে সফলভাবে সংরক্ষিত হয়েছে!' });
      setOldPin('');
      setNewPin('');
      setConfirmNewPin('');
    } else {
      setPinChangeMessage({ type: 'error', text: 'বর্তমান পিন ভুল দেওয়া হয়েছে!' });
    }
  };

  const filteredPosts = (posts || []).filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.authorName && post.authorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const themeOptions: { id: ThemeColor; name: string; hex: string; bgClass: string }[] = [
    { id: 'emerald', name: 'ক্ল্যাসিক এমারেল্ড (ডিফল্ট)', hex: '#047857', bgClass: 'bg-emerald-700' },
    { id: 'blue', name: 'রয়্যাল ওশান ব্লু', hex: '#1d4ed8', bgClass: 'bg-blue-700' },
    { id: 'indigo', name: 'ডিপ ইন্ডিগো নাইট', hex: '#4338ca', bgClass: 'bg-indigo-700' },
    { id: 'rose', name: 'প্রিমিয়াম রোজ রেড', hex: '#be123c', bgClass: 'bg-rose-700' },
    { id: 'amber', name: 'গোল্ডেন সানসেট অ্যাম্বার', hex: '#b45309', bgClass: 'bg-amber-600' },
    { id: 'teal', name: 'সিয়াটেল গ্রিন টিল', hex: '#0f766e', bgClass: 'bg-teal-700' },
    { id: 'purple', name: 'ম্যাজেস্টিক পার্পল', hex: '#7e22ce', bgClass: 'bg-purple-700' }
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>অ্যাপে ফিরে যান</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Lock className="w-3.5 h-3.5" />
            <span>সুরক্ষিত এডমিন অঞ্চল</span>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-pink-200/80/90 shadow-xl text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">এডমিন কন্ট্রোল প্যানেল</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            আমার কুষ্টিয়ার ডেটা ও কন্টেন্ট নিয়ন্ত্রণ করতে আপনার ৬-সংখ্যার গোপন সিকিউরিটি পিন দিন।
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="৬-সংখ্যার পিন দিন (ডিফল্ট: 123456)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-pink-200/80 rounded-2xl text-center text-lg font-mono tracking-widest font-bold text-slate-900 focus:outline-none focus:border-pink-600 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {pinError && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>প্যানেলে প্রবেশ করুন</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>ডিফল্ট মাস্টার পিন: <b>1234</b></span>
            <span>প্রবেশের পর পরিবর্তনযোগ্য</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12">
      <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
            title="মূল অ্যাপে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>অ্যাপে ফিরুন</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">এডমিন কন্ট্রোল ড্যাশবোর্ড</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full animate-pulse">
                <Radio className="w-3 h-3 text-emerald-600" />
                <span>লাইভ সিঙ্ক</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">আমার কুষ্টিয়ার রিয়েল-টাইম কন্টেন্ট ও সিস্টেম সেটিংস</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsAddingPost(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পোস্ট যুক্ত করুন</span>
          </button>
          <button
            onClick={adminLogout}
            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="এডমিন লগআউট"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white rounded-2xl border border-pink-200/80/80 shadow-xs text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ওভারভিউ ও মেট্রিক্স</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'volunteers'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>সেচ্ছাসেবী ম্যানেজমেন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'posts'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>পোস্ট ও কন্টেন্ট CRUD ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notice')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'notice'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>জরুরি নোটিশ / ব্রডকাস্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'theme'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>থিম ও কালার</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'security'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>সিকিউরিটি ও পিন কোড</span>
        </button>

        <button
          onClick={() => setActiveTab('payment-history')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'payment-history'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>পেমেন্ট হিস্ট্রি</span>
        </button>
      </div>

      {activeTab === 'payment-history' && <PaymentHistoryTab />}

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500">মোট সক্রিয় পোস্ট</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{posts.length} টি</div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>রিয়েল-টাইম সক্রিয়</span>
              </span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500">যাচাইকৃত বিজ্ঞাপন</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {posts.filter(p => p.isVerified).length} টি
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                ভেরিফায়েড ব্যাজ যুক্ত
              </span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500">নিবন্ধিত নাগরিক</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{analytics.totalUsers} জন</div>
              <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
                কুষ্টিয়া সিটিজেন কার্ড
              </span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500">গোপন ক্রাইম রিপোর্ট</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {posts.filter(p => p.category === 'crime-reporter').length} টি
              </div>
              <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
                ১০০% এনক্রিপ্টেড
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
              <span>ক্যাটাগরি ভিত্তিক পোস্ট ডিস্ট্রিবিউশন</span>
              <span className="text-xs font-normal text-slate-400">রিয়েল-টাইম ট্র্যাকিং</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { label: 'বাসা ও মেস ভাড়া', cat: 'house-rent', color: 'emerald' },
                { label: 'কেনাবেচা বাজার', cat: 'buy-sell', color: 'blue' },
                { label: 'খাবার ও রেস্তোরাঁ', cat: 'food', color: 'amber' },
                { label: 'চাকরি ও নিয়োগ', cat: 'jobs', color: 'indigo' },
                { label: 'হারানো ও প্রাপ্তি', cat: 'lost-found', color: 'orange' },
                { label: 'গোপন ক্রাইম রিপোর্ট', cat: 'crime-reporter', color: 'purple' },
                { label: 'ইভেন্ট ও ডেকোরেশন', cat: 'events', color: 'fuchsia' },
                { label: 'আইনজীবী সেবা', cat: 'legal', color: 'slate' },
                { label: 'রাজমিস্ত্রি', cat: 'mason', color: 'amber' },
                { label: 'মোবাইল মেকার', cat: 'mobile-maker', color: 'blue' }
              ].map(item => {
                const count = posts.filter(p => p.category === item.cat).length;
                return (
                  <div key={item.cat} className="p-3 rounded-2xl bg-slate-50 border border-pink-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-black px-2 py-0.5 rounded-lg bg-white shadow-xs text-slate-900">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-emerald-700" />
                <span>বর্তমানে প্রদর্শিত লাইভ স্ক্রল নোটিশ:</span>
              </span>
              <button
                onClick={() => setActiveTab('notice')}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                সম্পাদনা করুন →
              </button>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs font-medium border border-slate-800">
              <span className="text-emerald-400 font-bold mr-2">[জরুরি নোটিশ]:</span>
              {marqueeNotice}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="পোস্টের শিরোনাম, স্থান বা লেখকের নাম দিয়ে ফিল্টার করুন..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-pink-200/80 rounded-2xl px-3 py-2.5 font-semibold text-slate-700 focus:outline-none focus:border-pink-600"
              >
                <option value="all">সকল ক্যাটাগরি ({posts.length})</option>
                <option value="house-rent">বাসা ভাড়া</option>
                <option value="buy-sell">কেনাবেচা</option>
                <option value="food">খাবার</option>
                <option value="jobs">চাকরি</option>
                <option value="lost-found">হারানো ও প্রাপ্তি</option>
                <option value="crime-reporter">ক্রাইম রিপোর্ট</option>
                <option value="events">ইভেন্ট</option>
                <option value="legal">আইনজীবী</option>
                <option value="mason">রাজমিস্ত্রি</option>
                <option value="mobile-maker">মোবাইল মেকার</option>
              </select>

              <button
                onClick={() => setIsAddingPost(true)}
                className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-1 shadow-xs whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন বিজ্ঞাপন</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-pink-200/80 text-slate-400 text-xs">
                কোনো পোস্ট পাওয়া যায়নি
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs hover:border-pink-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-pink-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        কোনো ছবি নেই
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {post.category}
                        </span>
                        {post.isVerified ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>ভেরিফায়েড</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                            যাচাই অপেক্ষমাণ
                          </span>
                        )}
                        {post.price && (
                          <span className="text-[11px] font-black text-slate-800">
                            {post.price}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                        {post.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {post.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {post.contactPhone}
                        </span>
                        <span>লেখক: {post.authorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-100 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleToggleVerify(post.id)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        post.isVerified
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title={post.isVerified ? 'ভেরিফিকেশন প্রত্যাহার' : 'ভেরিফাই করুন'}
                    >
                      {post.isVerified ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span className="text-[11px]">{post.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}</span>
                    </button>

                    <button
                      onClick={() => handleStartEdit(post)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="সম্পাদনা করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'notice' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-700" />
              <span>রিয়েল-টাইম স্ক্রলিং নোটিশ পরিবর্তন</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              এখানে কোনো তথ্য লিখে সংরক্ষণ করলে তা সাথে সাথে মূল অ্যাপের শীর্ষে স্ক্রল হওয়া শুরু করবে।
            </p>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  স্ক্রলিং নোটিশের বার্তা:
                </label>
                <textarea
                  rows={4}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="কুষ্টিয়া পৌরসভা বা জরুরি নাগরিক বার্তা লিখুন..."
                  className="w-full text-xs p-3.5 rounded-2xl bg-slate-50 border border-pink-200/80 focus:outline-none focus:border-pink-600 font-medium leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>নোটিশ আপডেট করুন</span>
                </button>

                {noticeSaved && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>নোটিশ সফলভাবে লাইভ আপডেট হয়েছে!</span>
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              জরুরি নোটিশের কিছু ড্রাফট বা টেমপ্লেট
            </span>
            <div className="space-y-2">
              {[
                'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতালে জরুরি ভিত্তিতে ১ ব্যাগ "B+" রক্তের প্রয়োজন। যোগাযোগ: 01712-345678',
                'বাস টার্মিনাল মোড়ে মহাসড়কে সংস্কার কাজ চলমান থাকায় ধীরগতিতে যানবাহন চলাচলের অনুরোধ করা হচ্ছে।',
                'বিদ্যুৎ অফিস (নেসকো): আগামীকাল সকাল ৯টা থেকে দুপুর ১টা পর্যন্ত লাইনে রক্ষণাবেক্ষণের জন্য বিদ্যুৎ বন্ধ থাকবে।'
              ].map((template, idx) => (
                <div
                  key={idx}
                  onClick={() => setNoticeText(template)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-pink-100 cursor-pointer text-xs text-slate-700 font-medium transition-all flex items-center justify-between"
                >
                  <span>{template}</span>
                  <span className="text-[10px] text-emerald-800 font-bold shrink-0 ml-2">ব্যবহার করুন</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'volunteers' && (
        <VolunteerManagementTab />
      )}

      {activeTab === 'theme' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-700" />
              <span>অ্যাপের প্রধান থিম কালার নির্ধারণ</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              যেকোনো কালার নির্বাচন করলেই পুরো অ্যাপের হেডার, কার্ড এবং বাটন কালার তাৎক্ষণিকভাবে পরিবর্তিত হবে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themeOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setThemeColor(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    themeColor === opt.id
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-pink-200/80 hover:border-pink-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl shadow-xs shrink-0 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: opt.hex }}
                    >
                      {themeColor === opt.id && <Check className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{opt.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{opt.hex}</span>
                    </div>
                  </div>

                  {themeColor === opt.id && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      সক্রিয়
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-700" />
              <span>এডমিন মাস্টার পিন পরিবর্তন</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              এডমিন প্যানেলে অনুপ্রবেশ রুখতে নিয়মিত সিকিউরিটি পিন আপডেট রাখুন।
            </p>

            <form onSubmit={handleChangePinSubmit} className="max-w-md space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বর্তমান পিন কোড:
                </label>
                <input
                  type="password"
                  required
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="বর্তমান পিন দিন"
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-pink-200/80 focus:outline-none focus:border-pink-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নতুন পিন কোড (কমপক্ষে ৪ সংখ্যা):
                </label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="নতুন পিন কোড লিখুন"
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-pink-200/80 focus:outline-none focus:border-pink-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নতুন পিন নিশ্চিত করুন:
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="আবার নতুন পিন দিন"
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-pink-200/80 focus:outline-none focus:border-pink-600 font-medium"
                />
              </div>

              {pinChangeMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    pinChangeMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {pinChangeMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{pinChangeMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                পিন সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {isAddingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl border border-pink-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                <span>এডমিন থেকে নতুন পোস্ট তৈরি</span>
              </h3>
              <button
                onClick={() => setIsAddingPost(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80 font-semibold"
                >
                  <option value="house-rent">বাসা ভাড়া</option>
                  <option value="buy-sell">কেনাবেচা</option>
                  <option value="food">খাবার ও রেস্তোরাঁ</option>
                  <option value="jobs">চাকরি</option>
                  <option value="lost-found">হারানো ও প্রাপ্তি</option>
                  <option value="crime-reporter">ক্রাইম রিপোর্ট</option>
                  <option value="events">ইভেন্ট ও ডেকোরেশন</option>
                  <option value="legal">আইনজীবী</option>
                  <option value="mason">রাজমিস্ত্রি</option>
                  <option value="mobile-maker">মোবাইল মেকার</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পোস্টের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: ৩ রুমের ফ্ল্যাট ভাড়া দেওয়া হবে..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  >
                    {KUSHTIA_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মূল্য / ভাড়া</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="যেমন: ৳ ৮,০০০"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="বিস্তারিত বিবরণ লিখুন..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবি URL (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPost(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  পোস্ট প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl border border-pink-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-700" />
                <span>পোস্ট সম্পাদনা (ID: {editingPost.id})</span>
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পোস্টের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  >
                    {KUSHTIA_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মূল্য / ভাড়া</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবি লিঙ্ক (URL)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-pink-200/80"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verifyCheckbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="verifyCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  ভেরিফায়েড বিজ্ঞাপন হিসেবে প্রদর্শন করুন
                </label>
              </div>

              <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
