import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Power, 
  Save, 
  Eye, 
  CheckCircle2, 
  Megaphone, 
  X, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Plus,
  Trash2,
  Edit3,
  Clock,
  Radio,
  FileText,
  RotateCcw
} from 'lucide-react';
import { AppThemeConfig } from '../../types';

interface SavedWelcomePopup {
  id: string;
  title: string;
  badge: string;
  message: string;
  buttonText: string;
  actionText?: string;
  actionUrl?: string;
  isActive: boolean;
  createdAt: number;
}

const SAVED_POPUPS_KEY = 'kushtia_saved_welcome_popups_v2';

const INITIAL_POPUPS: SavedWelcomePopup[] = [
  {
    id: 'popup-default-1',
    title: 'আমার কুষ্টিয়ায় আপনাকে স্বাগতম!',
    badge: 'স্বাগতম বার্তা',
    message: 'কুষ্টিয়া শহরের সব প্রয়োজনীয় জরুরি সেবা, ডাক্তার ডিরেক্টরি, রক্তের ডাক, ট্রেনের সময়সূচি এবং স্থানীয় কেনাবেচা ও বাসা ভাড়ার তথ্য এখন আপনার হাতের মুঠোয়।',
    buttonText: 'শুরু করুন',
    actionText: 'জরুরি সেবা',
    actionUrl: 'emergency',
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 'popup-default-2',
    title: 'জরুরি নাগরিক সতর্কতা ও নোটিশ',
    badge: 'জরুরি বিজ্ঞপ্তি',
    message: 'শহরের নাগরিকদের অবগতির জন্য জানানো যাচ্ছে যে, বিশেষ প্রশাসনিক সতর্কতা ও জরুরি সেবা হেল্পলাইন সার্বক্ষণিক সচল রয়েছে। কোনো সমস্যায় হটলাইনে যোগাযোগ করুন।',
    buttonText: 'ঠিক আছে',
    actionText: 'হেল্পলাইন দেখুন',
    actionUrl: 'emergency',
    isActive: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14
  },
  {
    id: 'popup-default-3',
    title: 'পবিত্র ঈদের আন্তরিক শুভেচ্ছা!',
    badge: 'উৎসবের শুভেচ্ছা',
    message: 'কুষ্টিয়াবাসীর জন্য রইলো পবিত্র ঈদের আন্তরিক শুভেচ্ছা ও অভিনন্দন। আপনার এবং আপনার পরিবারের প্রতিটি দিন আনন্দময় হোক — আমার কুষ্টিয়া পরিবার।',
    buttonText: 'ঈদ মোবারক',
    actionText: 'কমিউনিটি পোস্ট',
    actionUrl: 'home',
    isActive: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30
  }
];

interface WelcomePopupManagerCardProps {
  appTheme?: AppThemeConfig;
  onUpdateTheme?: (updated: Partial<AppThemeConfig>) => void;
  onShowToast?: (msg: string) => void;
}

export const WelcomePopupManagerCard: React.FC<WelcomePopupManagerCardProps> = ({
  appTheme,
  onUpdateTheme,
  onShowToast
}) => {
  const [popupsList, setPopupsList] = useState<SavedWelcomePopup[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_POPUPS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved welcome popups:', e);
    }
    return INITIAL_POPUPS;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(appTheme?.isWelcomePopupActive ?? true);
  const [title, setTitle] = useState<string>(() => {
    const raw = appTheme?.welcomePopupTitle || 'আমার কুষ্টিয়ায় আপনাকে স্বাগতম!';
    if (raw.includes('কানেক্টে') || raw.includes('কুষ্টিয়া কানেক্ট')) return 'আমার কুষ্টিয়ায় আপনাকে স্বাগতম!';
    return raw.replace(/সৈয়দপুর|সৈয়দপুর|Syedpur|Saidpur/gi, 'কুষ্টিয়া').replace(/আমার কুষ্টিয়াে/g, 'আমার কুষ্টিয়ায়');
  });
  const [message, setMessage] = useState<string>(() => {
    const raw = appTheme?.welcomePopupMessage || 'কুষ্টিয়া শহরের সব প্রয়োজনীয় জরুরি সেবা, ডাক্তার ডিরেক্টরি, রক্তের ডাক, ট্রেনের সময়সূচি এবং স্থানীয় কেনাবেচা ও বাসা ভাড়ার তথ্য এখন আপনার হাতের মুঠোয়।';
    return raw.replace(/সৈয়দপুর|সৈয়দপুর|Syedpur|Saidpur/gi, 'কুষ্টিয়া');
  });
  const [buttonText, setButtonText] = useState<string>(appTheme?.welcomePopupButtonText || 'শুরু করুন');
  const [badge, setBadge] = useState<string>(appTheme?.welcomePopupBadge || 'স্বাগতম বার্তা');
  const [actionText, setActionText] = useState<string>(appTheme?.welcomePopupActionText || 'জরুরি সেবা');
  const [actionUrl, setActionUrl] = useState<string>(appTheme?.welcomePopupActionUrl || 'emergency');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (appTheme) {
      setIsActive(appTheme.isWelcomePopupActive ?? true);
      if (!editingId) {
        const rawT = appTheme.welcomePopupTitle || 'আমার কুষ্টিয়ায় আপনাকে স্বাগতম!';
        const cleanT = (rawT.includes('কানেক্টে') || rawT.includes('কুষ্টিয়া কানেক্ট'))
          ? 'আমার কুষ্টিয়ায় আপনাকে স্বাগতম!'
          : rawT.replace(/সৈয়দপুর|সৈয়দপুর|Syedpur|Saidpur/gi, 'কুষ্টিয়া').replace(/আমার কুষ্টিয়াে/g, 'আমার কুষ্টিয়ায়');
        setTitle(cleanT);
        const rawM = appTheme.welcomePopupMessage || 'কুষ্টিয়া শহরের সব প্রয়োজনীয় জরুরি সেবা, ডাক্তার ডিরেক্টরি, রক্তের ডাক, ট্রেনের সময়সূচি এবং স্থানীয় কেনাবেচা ও বাসা ভাড়ার তথ্য এখন আপনার হাতের মুঠোয়।';
        setMessage(rawM.replace(/সৈয়দপুর|সৈয়দপুর|Syedpur|Saidpur/gi, 'কুষ্টিয়া'));
        setButtonText(appTheme.welcomePopupButtonText || 'শুরু করুন');
        setBadge(appTheme.welcomePopupBadge || 'স্বাগতম বার্তা');
        setActionText(appTheme.welcomePopupActionText || 'জরুরি সেবা');
        setActionUrl(appTheme.welcomePopupActionUrl || 'emergency');
      }
    }
  }, [appTheme, editingId]);

  const savePopupsToStorage = (updatedList: SavedWelcomePopup[]) => {
    setPopupsList(updatedList);
    try {
      localStorage.setItem(SAVED_POPUPS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save welcome popups to storage:', e);
    }
  };

  const handleToggleGlobalActive = (newStatus: boolean) => {
    setIsActive(newStatus);
    if (onUpdateTheme) {
      onUpdateTheme({
        isWelcomePopupActive: newStatus
      });
      if (onShowToast) {
        onShowToast(newStatus ? 'পপআপ মেসেজ চালু (ON) করা হয়েছে!' : 'পপআপ মেসেজ বন্ধ (OFF) করা হয়েছে!');
      }
    }
  };

  const handleCreateNewPopup = () => {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setBadge('নতুন নোটিশ');
    setButtonText('ঠিক আছে');
    setActionText('');
    setActionUrl('');
    if (onShowToast) {
      onShowToast('নতুন পপআপ লেখার জন্য ফর্ম ফাঁকা করা হয়েছে। নিচের ঘরে লিখুন।');
    }
  };

  const handleSaveAndPublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('দয়া করে পপআপ শিরোনাম ও মেসেজ বিবরণ প্রবেশ করুন।');
      return;
    }

    const popupData: SavedWelcomePopup = {
      id: editingId || `popup-${Date.now()}`,
      title: title.trim(),
      badge: badge.trim() || 'স্বাগতম বার্তা',
      message: message.trim(),
      buttonText: buttonText.trim() || 'শুরু করুন',
      actionText: actionText.trim() || undefined,
      actionUrl: actionUrl.trim() || undefined,
      isActive: true,
      createdAt: editingId ? (popupsList.find(p => p.id === editingId)?.createdAt || Date.now()) : Date.now()
    };

    // Deactivate other popups in the list
    const updatedList = popupsList.map(p => ({
      ...p,
      isActive: p.id === popupData.id
    }));

    if (!editingId) {
      updatedList.unshift(popupData);
    } else {
      const idx = updatedList.findIndex(p => p.id === editingId);
      if (idx !== -1) updatedList[idx] = popupData;
    }

    savePopupsToStorage(updatedList);
    setEditingId(popupData.id);

    // Update global app theme so this popup goes live immediately
    if (onUpdateTheme) {
      onUpdateTheme({
        isWelcomePopupActive: true,
        welcomePopupTitle: popupData.title,
        welcomePopupMessage: popupData.message,
        welcomePopupButtonText: popupData.buttonText,
        welcomePopupBadge: popupData.badge,
        welcomePopupActionText: popupData.actionText,
        welcomePopupActionUrl: popupData.actionUrl
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);

      if (onShowToast) {
        onShowToast('পপআপ মেসেজটি সফলভাবে সংরক্ষিত এবং অ্যাপে লাইভ অন করা হয়েছে!');
      }
    }
  };

  const handleMakePopupLive = (popup: SavedWelcomePopup) => {
    const updatedList = popupsList.map(p => ({
      ...p,
      isActive: p.id === popup.id
    }));

    savePopupsToStorage(updatedList);
    setEditingId(popup.id);
    setTitle(popup.title);
    setMessage(popup.message);
    setBadge(popup.badge);
    setButtonText(popup.buttonText);
    setActionText(popup.actionText || '');
    setActionUrl(popup.actionUrl || '');
    setIsActive(true);

    if (onUpdateTheme) {
      onUpdateTheme({
        isWelcomePopupActive: true,
        welcomePopupTitle: popup.title,
        welcomePopupMessage: popup.message,
        welcomePopupButtonText: popup.buttonText,
        welcomePopupBadge: popup.badge,
        welcomePopupActionText: popup.actionText,
        welcomePopupActionUrl: popup.actionUrl
      });

      if (onShowToast) {
        onShowToast(`"${popup.title}" পপআপটি লাইভ অন করা হয়েছে!`);
      }
    }
  };

  const handleEditPopup = (popup: SavedWelcomePopup) => {
    setEditingId(popup.id);
    setTitle(popup.title);
    setMessage(popup.message);
    setBadge(popup.badge);
    setButtonText(popup.buttonText);
    setActionText(popup.actionText || '');
    setActionUrl(popup.actionUrl || '');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeletePopup = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পপআপ বার্তাটি মুছে ফেলতে চান?')) {
      const updated = popupsList.filter(p => p.id !== id);
      savePopupsToStorage(updated);
      if (editingId === id) {
        setEditingId(null);
      }
      if (onShowToast) {
        onShowToast('পপআপ বার্তা তালিকা থেকে মুছে ফেলা হয়েছে।');
      }
    }
  };

  const triggerLiveTestPreview = () => {
    window.dispatchEvent(new CustomEvent('show-welcome-popup-preview'));
  };

  const applyPreset = (presetType: 'welcome' | 'emergency' | 'eid' | 'update') => {
    setEditingId(null);
    switch (presetType) {
      case 'welcome':
        setTitle('আমার কুষ্টিয়ায় আপনাকে স্বাগতম!');
        setBadge('স্বাগতম বার্তা');
        setMessage('কুষ্টিয়া শহরের সব প্রয়োজনীয় জরুরি সেবা, ডাক্তার ডিরেক্টরি, রক্তের ডাক, ট্রেনের সময়সূচি এবং স্থানীয় কেনাবেচা ও বাসা ভাড়ার তথ্য এখন আপনার হাতের মুঠোয়।');
        setButtonText('শুরু করুন');
        setActionText('জরুরি সেবা');
        setActionUrl('emergency');
        break;
      case 'emergency':
        setTitle('জরুরি নাগরিক সতর্কতা ও নোটিশ');
        setBadge('জরুরি বিজ্ঞপ্তি');
        setMessage('শহরের নাগরিকদের অবগতির জন্য জানানো যাচ্ছে যে, বিশেষ প্রশাসনিক সতর্কতা ও জরুরি সেবা হেল্পলাইন সার্বক্ষণিক সচল রয়েছে। কোনো সমস্যায় হটলাইনে যোগাযোগ করুন।');
        setButtonText('ঠিক আছে');
        setActionText('হেল্পলাইন দেখুন');
        setActionUrl('emergency');
        break;
      case 'eid':
        setTitle('পবিত্র ঈদের আন্তরিক শুভেচ্ছা!');
        setBadge('উৎসবের শুভেচ্ছা');
        setMessage('কুষ্টিয়াবাসীর জন্য রইলো পবিত্র ঈদের আন্তরিক শুভেচ্ছা ও অভিনন্দন। আপনার এবং আপনার পরিবারের প্রতিটি দিন আনন্দময় হোক — আমার কুষ্টিয়া পরিবার।');
        setButtonText('ঈদ মোবারক');
        setActionText('কমিউনিটি পোস্ট');
        setActionUrl('home');
        break;
      case 'update':
        setTitle('আমার কুষ্টিয়াে নতুন ফিচার যুক্ত হয়েছে!');
        setBadge('অ্যাপ আপডেট');
        setMessage('অ্যাপে এখন ট্রেন, বাস ও ফ্লাইট শিডিউল এবং ডাক্তারদের সম্পূর্ণ চেম্বার ডিরেক্টরি যুক্ত হয়েছে। খুব সহজেই যেকোনো সেবা এক ক্লিকে বুকিং বা সন্ধান করুন।');
        setButtonText('এক্সপ্লোর করুন');
        setActionText('যাতায়াত শিডিউল');
        setActionUrl('transport');
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 dark:border-slate-800 shadow-md space-y-6">
      {/* Header with Switch and "+ New Popup" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                অ্যাপ প্রবেশ পপআপ মেসেজ ম্যানেজার (Entry Modal Popups)
              </h3>
              {isActive ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  চালু (ON)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-pink-200/80 dark:border-slate-700">
                  বন্ধ (OFF)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              নতুন পপআপ বার্তা লিখুন, ১-ক্লিকে লাইভ অন/অফ করুন এবং সংরক্ষিত পপআপের তালিকা থেকে নির্বাচন করুন।
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Add New Popup Button */}
          <button
            type="button"
            onClick={handleCreateNewPopup}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
            title="নতুন একটি পপআপ বার্তা লিখুন"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পপআপ তৈরি করুন</span>
          </button>

          <button
            type="button"
            onClick={triggerLiveTestPreview}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            title="স্ক্রিনে আসল পপআপটি কেমন দেখাবে তা পরীক্ষা করুন"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>লাইভ টেস্ট</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleGlobalActive(!isActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs ${
              isActive
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'অন (ON)' : 'অফ (OFF)'}</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          দ্রুত টেমপ্লেট:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('welcome')}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold transition-colors border border-emerald-200 dark:border-emerald-800/60"
        >
          স্বাগতম বার্তা
        </button>
        <button
          type="button"
          onClick={() => applyPreset('emergency')}
          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-800 dark:text-rose-300 text-[11px] font-bold transition-colors border border-rose-200 dark:border-rose-800/60"
        >
          জরুরি নোটিশ
        </button>
        <button
          type="button"
          onClick={() => applyPreset('eid')}
          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold transition-colors border border-amber-200 dark:border-amber-800/60"
        >
          ঈদের শুভেচ্ছা
        </button>
        <button
          type="button"
          onClick={() => applyPreset('update')}
          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/80 text-sky-800 dark:text-sky-300 text-[11px] font-bold transition-colors border border-sky-200 dark:border-sky-800/60"
        >
          নতুন আপডেট
        </button>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 cols */}
        <form onSubmit={handleSaveAndPublish} className="lg:col-span-7 space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-3xl border border-pink-200/80/80 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-pink-200/80 dark:border-slate-700 pb-2">
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'পপআপ এডিট করুন' : 'নতুন পপআপ ফর্মে লিখুন'}</span>
            </span>
            {editingId && (
              <button
                type="button"
                onClick={handleCreateNewPopup}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>নতুন তৈরি করুন</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পপআপ শিরোনাম (Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: আমার কুষ্টিয়াে আপনাকে স্বাগতম!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pink-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ট্যাগ বা ব্যাজ (Badge Text)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="যেমন: স্বাগতম বার্তা / বিশেষ নোটিশ"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pink-600 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পপআপ মূল বার্তা বা বিবরণ (Message Description) *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="এখানে আপনার পপআপ বার্তা বিস্তারিত লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-pink-600 leading-relaxed shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                প্রধান বাটন টেক্সট
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="যেমন: শুরু করুন / ঠিক আছে"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pink-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                অ্যাকশন পেজ লিঙ্ক (ঐচ্ছিক)
              </label>
              <select
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pink-600 shadow-xs"
              >
                <option value="">কোনো লিংক নেই</option>
                <option value="emergency">জরুরি সেবা (Emergency)</option>
                <option value="doctors">ডাক্তার ডিরেক্টরি (Doctors)</option>
                <option value="transport">ট্রেন/বাস শিডিউল (Transport)</option>
                <option value="blood">রক্তদাতা অনুসন্ধান (Blood)</option>
                <option value="house-rent">বাসা ভাড়া (House Rent)</option>
                <option value="buy-sell">মার্কেটপ্লেস (Buy/Sell)</option>
                <option value="services">নাগরিক সার্ভিস (Services)</option>
                <option value="crime-reporter">পরিচয় গোপন মোড (Anonymous Mode)</option>
                <option value="terms-privacy">শর্তাবলী ও গোপনীয়তা (Terms & Privacy)</option>
                <option value="help-support">সাহায্য ও সাপোর্ট (Help & Support)</option>
                <option value="developer">অ্যাপ নির্মাতা ও পরিচিতি (Developer Profile)</option>
                <option value="share-app">অ্যাপটি শেয়ার করুন (Share App)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                লিঙ্ক বাটন টেক্সট
              </label>
              <input
                type="text"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="যেমন: জরুরি সেবা দেখুন"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pink-600 shadow-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              💡 ব্যবহারকারী একবার দেখলে এবং "আজকের জন্য আর দেখাবেন না" সিলেক্ট করলে সেদিন আর ডিস্টার্ব করবে না।
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 shrink-0"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>সংরক্ষিত ও লাইভ হয়েছে!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>পপআপ সেভ ও লাইভ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Preview Card: 5 cols */}
        <div className="lg:col-span-5 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-3xl border border-pink-200/80/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              লাইভ প্রিভিউ (নাগরিকদের চোখে যেমন দেখাবে)
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isActive ? 'পপআপ লাইভ আছে' : 'পপআপ বন্ধ আছে'}
            </span>
          </div>

          {/* Realistic Card Mockup */}
          <div className="w-full bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-xl border border-pink-200/80 dark:border-slate-800 text-left">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-teal-800 p-5 text-white text-center">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold mb-1">
                <Megaphone className="w-3 h-3 text-amber-300" />
                <span>{badge || 'স্বাগতম বার্তা'}</span>
              </div>
              <h4 className="text-base font-black text-white leading-snug">
                {title || 'পপআপ শিরোনাম'}
              </h4>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-pink-100 dark:border-slate-800">
                {message || 'পপআপ মেসেজের টেক্সট...'}
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>কুষ্টিয়া শহরের নির্ভরযোগ্য ডিজিটাল পোর্টাল</span>
              </div>

              {/* Buttons */}
              <div className="space-y-1.5 pt-1">
                {actionUrl && actionText && (
                  <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] text-center flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                    <span>{actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-black text-xs text-center shadow-md shadow-emerald-600/20">
                  {buttonText || 'শুরু করুন'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Popups History List Section */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-pink-200/80/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                সংরক্ষিত পপআপ বার্তার ইতিহাস তালিকা ({popupsList.length})
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                যেকোনো সংরক্ষিত পপআপ মেসেজে ১-ক্লিক করে লাইভ অন করুন অথবা সম্পাদনা করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateNewPopup}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন পপআপ লিখুন</span>
          </button>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700/60 border-t border-pink-200/80 dark:border-slate-700/60 pt-2">
          {popupsList.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">কোনো সংরক্ষিত পপআপ বার্তা নেই।</p>
          ) : (
            popupsList.map((item) => (
              <div
                key={item.id}
                className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.isActive ? 'bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 my-1' : ''
                }`}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {item.badge || 'স্বাগতম বার্তা'}
                    </span>
                    {item.isActive ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        বর্তমানে লাইভ অন আছে
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        নিষ্ক্রিয় (অফ)
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{item.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!item.isActive ? (
                    <button
                      type="button"
                      onClick={() => handleMakePopupLive(item)}
                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center gap-1 active:scale-95"
                    >
                      <Radio className="w-3.5 h-3.5 text-amber-300" />
                      <span>লাইভ অন করুন</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      লাইভ সক্রিয়
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEditPopup(item)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-pink-200/80 dark:border-slate-700 hover:bg-slate-100"
                  >
                    সম্পাদনা
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePopup(item.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
