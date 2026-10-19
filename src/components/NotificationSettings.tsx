import React, { useState, useEffect } from 'react';
import { X, Bell, Droplet, Zap, CloudRain, AlertTriangle, Volume2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { requestNotificationPermission, showEmergencyPushNotification, playEmergencyChime, registerSubscriberInFirestore } from '../utils/pushNotification';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [testSuccess, setTestSuccess] = useState(false);
  const [categories, setCategories] = useState<{ [key: string]: boolean }>({
    blood: true,
    electricity: true,
    weather: true,
    emergency: true
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
      const isGranted = Notification.permission === 'granted';
      const storedPref = localStorage.getItem('kushtia_notifications_enabled') === 'true';
      setPushEnabled(isGranted && storedPref);
    }
    const savedBlood = localStorage.getItem('kushtia_blood_group_pref');
    if (savedBlood) {
      setBloodGroup(savedBlood);
    }
  }, [isOpen]);

  const handleTogglePush = async () => {
    if (!('Notification' in window)) {
      alert('আপনার ব্রাউজারে পুশ নোটিফিকেশন প্রযুক্তি সমর্থন করে না।');
      return;
    }

    if (!pushEnabled) {
      const granted = await requestNotificationPermission(bloodGroup);
      if (granted) {
        setPushEnabled(true);
        setPermissionState('granted');
        localStorage.setItem('kushtia_notifications_enabled', 'true');
      } else {
        setPermissionState(Notification.permission);
        if (Notification.permission === 'denied') {
          alert('ব্রাউজারে নোটিফিকেশন ব্লক করা রয়েছে। দয়া করে ব্রাউজার সাইট সেটিংসে গিয়ে Notification "Allow" করুন।');
        }
      }
    } else {
      setPushEnabled(false);
      localStorage.setItem('kushtia_notifications_enabled', 'false');
    }
  };

  const handleSendTestNotification = async () => {
    playEmergencyChime('blood');
    showEmergencyPushNotification({
      title: '🚨 টেস্ট নোটিফিকেশন: রক্ত প্রয়োজন (O+)',
      body: 'কুষ্টিয়া ২৫০ শয্যা সরকারি হাসপাতালে জরুরি ও-পজিটিভ রক্তদাতা প্রয়োজন। ফোন: ০১৭৮৯৩৪৪৫১৭',
      type: 'blood',
      bloodGroup: bloodGroup,
      actionUrl: '/?tab=blood',
      tag: 'test-alert'
    });
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 4000);
  };

  const handleSave = async () => {
    let subId = localStorage.getItem('kushtia_subscriber_id');
    if (!subId) {
      subId = `sub_${Date.now()}`;
      localStorage.setItem('kushtia_subscriber_id', subId);
    }

    localStorage.setItem('kushtia_blood_group_pref', bloodGroup);
    const activeCats = Object.keys(categories).filter(k => categories[k]);

    if (pushEnabled) {
      await registerSubscriberInFirestore(subId, bloodGroup, activeCats);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-200/80 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-pink-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                জরুরি পুশ নোটিফিকেশন
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                জরুরি খবর ও সতর্কবার্তা ফোনে সাথে সাথে রিং হবে
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="mb-5 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  {pushEnabled ? 'পুশ নোটিফিকেশন সক্রিয় আছে' : 'পুশ নোটিফিকেশন চালু করুন'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400 leading-relaxed">
                {pushEnabled 
                  ? 'আপনার ফোনে ব্যাকগ্রাউন্ড সার্ভিস ও জরুরি সতর্কতার রিংটোন সচল রয়েছে।' 
                  : 'জরুরি রক্তের আবেদন, বিদ্যুৎ বিভ্রাট ও দুর্যোগের খবর স্ক্রিন লক থাকলেও বাজবে।'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={pushEnabled} 
                onChange={handleTogglePush} 
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {/* Blood Group Filter */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                আপনার রক্তের গ্রুপ (জরুরি রক্তদাতার অ্যালার্ট)
              </h3>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5 leading-relaxed">
              কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল বা ক্লিনিকে এই গ্রুপের রক্তের ডাক এলে আপনাকে অগ্রাধিকার নোটিফিকেশন দেওয়া হবে।
            </p>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setBloodGroup(group)}
                  className={`py-2 px-1 text-xs font-black rounded-xl border transition-all ${
                    bloodGroup === group
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-102'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-pink-200/80 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Toggle */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
              কোন ধরনের নোটিফিকেশন পেতে চান:
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-pink-200/80/80 dark:border-slate-700/80 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">জরুরি রক্তের আবেদন</span>
                    <p className="text-[10px] text-slate-500">রোগীর অপারেশনের জন্য রক্তদাতার আহ্বান</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={categories.blood} 
                  onChange={(e) => setCategories(c => ({ ...c, blood: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-pink-500 w-4 h-4" 
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-pink-200/80/80 dark:border-slate-700/80 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">বিদ্যুৎ বিভ্রাট ও মেরামত</span>
                    <p className="text-[10px] text-slate-500">নেসকো/ফিডার মেইনটেন্যান্স ও লোডশেডিং নোটিশ</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={categories.electricity} 
                  onChange={(e) => setCategories(c => ({ ...c, electricity: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-pink-500 w-4 h-4" 
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-pink-200/80/80 dark:border-slate-700/80 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">আবহাওয়া ও বন্যা সতর্কতা</span>
                    <p className="text-[10px] text-slate-500">ভারী বৃষ্টি, বজ্রপাত ও নদী তীরবর্তী সতর্কতা</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={categories.weather} 
                  onChange={(e) => setCategories(c => ({ ...c, weather: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-pink-500 w-4 h-4" 
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-pink-200/80/80 dark:border-slate-700/80 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">শহরের সাধারণ জরুরি নোটিশ</span>
                    <p className="text-[10px] text-slate-500">প্রশাসন ও জরুরি হেল্পলাইনের নির্দেশনা</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={categories.emergency} 
                  onChange={(e) => setCategories(c => ({ ...c, emergency: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-pink-500 w-4 h-4" 
                />
              </label>
            </div>
          </div>

          {/* Test Sound & Notification Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSendTestNotification}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-pink-300 dark:border-slate-700"
            >
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>🔔 নোটিফিকেশন রিংটোন ও ভাইব্রেশন টেস্ট করুন</span>
            </button>
            {testSuccess && (
              <p className="mt-1.5 text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                টেস্ট নোটিফিকেশন ও অ্যালার্ম শব্দ বাজানো হয়েছে!
              </p>
            )}
          </div>
        </div>

        {/* Save button */}
        <button 
          onClick={handleSave}
          className="w-full mt-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-98"
        >
          সেটিংস সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
};
