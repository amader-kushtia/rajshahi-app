import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Megaphone, 
  AlertTriangle, 
  Zap, 
  CloudRain, 
  Info, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Send,
  Eye,
  RefreshCw,
  Bell,
  Clock,
  Power,
  Save,
  Sparkles
} from 'lucide-react';
import { FlashAlert, AppThemeConfig } from '../../types';
import { 
  getFlashAlerts, 
  saveFlashAlert, 
  toggleFlashAlertActive, 
  deleteFlashAlert 
} from '../../services/adminFeaturesService';
import { publishEmergencyBroadcast } from '../../utils/pushNotification';
import { WelcomePopupManagerCard } from './WelcomePopupManagerCard';

interface BroadcastAlertTabProps {
  appTheme?: AppThemeConfig;
  onUpdateTheme?: (updated: Partial<AppThemeConfig>) => void;
}

export const BroadcastAlertTab: React.FC<BroadcastAlertTabProps> = ({
  appTheme,
  onUpdateTheme
}) => {
  const [alerts, setAlerts] = useState<FlashAlert[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  
  // Emergency Red Banner Form State
  const [emergencyText, setEmergencyText] = useState(appTheme?.emergencyAlert || 'জরুরি সেবা ২৪ ঘণ্টা চালু আছে। পুলিশ, অ্যাম্বুলেন্স বা ফায়ার সার্ভিস এর জন্য হেল্পলাইনে যোগাযোগ করুন।');
  const [isEmergencyActive, setIsEmergencyActive] = useState(appTheme?.isEmergencyAlertActive ?? true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State for Flash Alert
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FlashAlert['type']>('emergency');
  const [actionText, setActionText] = useState('');
  const [actionLink, setActionLink] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadAlerts = () => {
    setAlerts(getFlashAlerts());
  };

  useEffect(() => {
    if (appTheme) {
      setEmergencyText(appTheme.emergencyAlert || 'জরুরি সেবা ২৪ ঘণ্টা চালু আছে। পুলিশ, অ্যাম্বুলেন্স বা ফায়ার সার্ভিস এর জন্য হেল্পলাইনে যোগাযোগ করুন।');
      setIsEmergencyActive(appTheme.isEmergencyAlertActive ?? true);
    }
  }, [appTheme]);

  useEffect(() => {
    loadAlerts();
    const handleUpdate = () => loadAlerts();
    window.addEventListener('kushtia-flash-alert-updated', handleUpdate);
    return () => window.removeEventListener('kushtia-flash-alert-updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveEmergencyBanner = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onUpdateTheme) {
      onUpdateTheme({
        emergencyAlert: emergencyText,
        isEmergencyAlertActive: isEmergencyActive
      });

      if (isEmergencyActive && emergencyText.trim()) {
        publishEmergencyBroadcast({
          title: '🚨 জরুরি নাগরিক সতর্কতা — কুষ্টিয়া',
          body: emergencyText.trim(),
          type: 'emergency',
          actionUrl: '/'
        });
      }

      showToast('জরুরি সতর্কতা সেভ হয়েছে এবং নাগরিকদের ফোনে পুশ অ্যালার্ট পাঠানো হয়েছে!');
    }
  };

  const handleToggleEmergencyActive = (newStatus: boolean) => {
    setIsEmergencyActive(newStatus);
    if (onUpdateTheme) {
      onUpdateTheme({
        isEmergencyAlertActive: newStatus
      });
      showToast(newStatus ? 'জরুরি সতর্কতা ব্যানারে অন করা হয়েছে!' : 'জরুরি সতর্কতা ব্যানার অফ করা হয়েছে!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    saveFlashAlert({
      id: editingId || undefined,
      title: title.trim(),
      message: message.trim(),
      type,
      actionText: actionText.trim() || undefined,
      actionLink: actionLink.trim() || undefined,
      isActive: true
    });

    // Send push notification & sound alert to all devices
    publishEmergencyBroadcast({
      title: `🚨 ${title.trim()}`,
      body: message.trim(),
      type: type as any,
      actionUrl: actionLink.trim() || '/'
    });

    showToast('নোটিশটি প্রকাশিত হয়েছে এবং ফোনে পুশ নোটিফিকেশন পাঠানো হয়েছে!');

    // Reset
    setTitle('');
    setMessage('');
    setActionText('');
    setActionLink('');
    setEditingId(null);
    setIsComposing(false);
  };

  const handleEdit = (alert: FlashAlert) => {
    setEditingId(alert.id);
    setTitle(alert.title);
    setMessage(alert.message);
    setType(alert.type);
    setActionText(alert.actionText || '');
    setActionLink(alert.actionLink || '');
    setIsComposing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAlertBadge = (alertType: FlashAlert['type']) => {
    switch (alertType) {
      case 'emergency':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'জরুরি লাল'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: 'সতর্কতা'
        };
      case 'electricity':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <Zap className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'বিদ্যুৎ'
        };
      case 'weather':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: <CloudRain className="w-3.5 h-3.5 text-sky-600" />,
          label: 'আবহাওয়া'
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Info className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'সাধারণ তথ্য'
        };
    }
  };

  const activeAlert = alerts.find(a => a.isActive);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Megaphone className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">
              জরুরি নোটিশ ও ফ্ল্যাশ অ্যালার্ট ব্রডকাস্ট
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              লাইভ পুশ
            </span>
          </div>
          <p className="text-xs text-slate-500">
            শহরের সকল নাগরিকের কাছে সরাসরি হোমস্ক্রিনে জরুরি লাল সতর্কতা ও চলমান স্ক্রলিং নোটিশ প্রচার করুন।
          </p>
        </div>

        <button
          onClick={() => {
            if (isComposing) {
              setIsComposing(false);
              setEditingId(null);
            } else {
              setIsComposing(true);
            }
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs ${
            isComposing
              ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
          }`}
        >
          {isComposing ? (
            'বাতিল করুন'
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>নতুন নোটিশ লিখুন</span>
            </>
          )}
        </button>
      </div>

      {/* Feature: Entry / Welcome Popup Modal Manager (অ্যাপে ঢোকার সময় সুন্দর কার্ড পপআপ মেসেজ ও অন/অফ) */}
      <WelcomePopupManagerCard
        appTheme={appTheme}
        onUpdateTheme={onUpdateTheme}
        onShowToast={showToast}
      />

      {/* Red Emergency Alert Control Panel (জরুরি সতর্কতা অন/অফ ও এডিট) */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-5 shadow-lg border border-red-500 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-xs">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>মেইন হোমস্ক্রিন "জরুরি সতর্কতা" (Red Banner)</span>
                {isEmergencyActive ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-400 text-slate-950 uppercase">
                    অন আছে (Active)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white/30 text-white uppercase">
                    অফ আছে (Disabled)
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-rose-100">
                এডমিন প্যানেল থেকে যখন ইচ্ছে ১-ক্লিকে অন/অফ করুন এবং নতুন সতর্কতা প্রকাশ করুন।
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 bg-black/20 px-3.5 py-1.5 rounded-2xl border border-white/20">
            <span className="text-xs font-extrabold text-white">ব্যানার স্ট্যাটাস:</span>
            <button
              type="button"
              onClick={() => handleToggleEmergencyActive(!isEmergencyActive)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                isEmergencyActive
                  ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isEmergencyActive ? 'অন (ON)' : 'অফ (OFF)'}</span>
            </button>
          </div>
        </div>

        {/* Edit & Add New Emergency Text */}
        <form onSubmit={handleSaveEmergencyBanner} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-rose-100 mb-1">
              জরুরি সতর্কবার্তা লিখুন (হোমস্ক্রিনের লাল বারে চলমান হিসেবে দেখাবে) *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={emergencyText}
                onChange={(e) => setEmergencyText(e.target.value)}
                placeholder="যেমন: জরুরি সেবা ২৪ ঘণ্টা চালু আছে। পুলিশ বা ফায়ার সার্ভিসের জন্য হেল্পলাইনে যোগাযোগ করুন..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold focus:ring-2 focus:ring-amber-400 outline-none border-none shadow-inner"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>সতর্কতা সেভ ও অন করুন</span>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-[11px]">
            <span className="text-rose-200 font-bold shrink-0">দ্রুত টেমপ্লেট:</span>
            <button
              type="button"
              onClick={() => {
                setEmergencyText('জরুরি সেবা ২৪ ঘণ্টা চালু আছে। পুলিশ, অ্যাম্বুলেন্স বা ফায়ার সার্ভিস এর জন্য হেল্পলাইনে যোগাযোগ করুন।');
                setIsEmergencyActive(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 border border-white/20"
            >
              ১. সরকারি হেল্পলাইন
            </button>
            <button
              type="button"
              onClick={() => {
                setEmergencyText('জরুরি আবহাওয়া বার্তা: কুষ্টিয়া এলাকায় ভারী বৃষ্টিপাত ও দমকা হাওয়া অব্যাহত থাকবে। নিরাপদে থাকুন।');
                setIsEmergencyActive(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 border border-white/20"
            >
              ২. আবহাওয়া সতর্কতা
            </button>
            <button
              type="button"
              onClick={() => {
                setEmergencyText('জরুরি ব্লাড রিকোয়েস্ট: কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতালে আজই O+ এবং B+ রক্তের প্রয়োজন।');
                setIsEmergencyActive(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 border border-white/20"
            >
              ৩. জরুরি রক্ত
            </button>
          </div>
        </form>
      </div>

      {/* Active Broadcast Indicator */}
      {activeAlert ? (
        <div className="bg-gradient-to-r from-rose-900 to-red-800 text-white rounded-3xl p-5 shadow-md border border-rose-700/60 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
                  <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                  বর্তমানে লাইভ প্রচারিত হচ্ছে
                </span>
                <span className="text-[11px] text-rose-200">
                  {new Date(activeAlert.createdAt).toLocaleDateString('bn-BD')}
                </span>
              </div>
              <h3 className="text-base font-black text-white">{activeAlert.title}</h3>
              <p className="text-xs text-rose-100 leading-relaxed max-w-3xl">
                {activeAlert.message}
              </p>
            </div>

            <button
              onClick={() => toggleFlashAlertActive(activeAlert.id)}
              className="px-3.5 py-2 bg-white text-rose-900 hover:bg-rose-50 text-xs font-black rounded-xl transition-all shadow-xs shrink-0 active:scale-95"
            >
              এখনই বন্ধ করুন
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 rounded-3xl p-4 border border-dashed border-pink-300 text-center text-xs text-slate-500 font-medium">
          বর্তমানে কোনো সক্রিয় ফ্ল্যাশ অ্যালার্ট নেই। প্রয়োজনে নতুন অ্যালার্ট ব্রডকাস্ট করুন।
        </div>
      )}

      {/* Composer Form */}
      {isComposing && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-rose-600" />
              <span>{editingId ? 'নোটিশ সম্পাদনা করুন' : 'নতুন ফ্ল্যাশ অ্যালার্ট প্রচার করুন'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">হোম স্ক্রিনের শীর্ষে দেখাবে</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                নোটিশের শিরোনাম *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: আগামীকাল বিদ্যুৎ বন্ধ থাকার বিজ্ঞপ্তি"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                নোটিশের ধরন / ক্যাটাগরি *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FlashAlert['type'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden bg-white"
              >
                <option value="emergency">জরুরি লাল (Emergency Alert)</option>
                <option value="electricity">বিদ্যুৎ সেবা (Power & Electricity)</option>
                <option value="weather">আবহাওয়া সতর্কতা (Weather Warning)</option>
                <option value="warning">সতর্কতামূলক বার্তা (Cautionary Notice)</option>
                <option value="info">সাধারণ তথ্য ও ঘোষণা (General Info)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিস্তারিত বার্তা বিবরণ *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="স্পষ্ট ও নির্ভুল ভাষায় নাগরিকদের প্রয়োজনীয় তথ্য লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অ্যাকশন বাটন লেবেল (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="যেমন: জরুরি হেল্পলাইন"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বাটনের গন্তব্য পেজ (ঐচ্ছিক)
              </label>
              <select
                value={actionLink}
                onChange={(e) => setActionLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden bg-white"
              >
                <option value="">কোনো পেজ নয়</option>
                <option value="emergency">জরুরি সেবা পেজ (Emergency)</option>
                <option value="doctor">ডাক্তার ডিরেক্টরি (Doctor)</option>
                <option value="blood">ব্লাড ব্যাংক (Blood)</option>
                <option value="transport">যানবাহন সময়সূচি (Transport)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsComposing(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{editingId ? 'আপডেট করুন' : 'এখনই ব্রডকাস্ট করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Broadcast History & Saved Notices */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>সংরক্ষিত ও পূর্ববর্তী নোটিশের তালিকা ({alerts.length})</span>
          </h3>
          <button
            onClick={loadAlerts}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {alerts.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">কোনো সংরক্ষিত নোটিশ নেই।</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => {
              const badge = getAlertBadge(alert.type);
              return (
                <div 
                  key={alert.id}
                  className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    alert.isActive ? 'bg-rose-50/40 -mx-3 px-3 rounded-2xl' : ''
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      {alert.isActive ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                          সক্রিয় (Active)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                          নিষ্ক্রিয়
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {new Date(alert.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{alert.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{alert.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleFlashAlertActive(alert.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                        alert.isActive
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {alert.isActive ? 'বন্ধ করুন' : 'প্রচার করুন'}
                    </button>

                    <button
                      onClick={() => handleEdit(alert)}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      সম্পাদনা
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?')) {
                          deleteFlashAlert(alert.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
