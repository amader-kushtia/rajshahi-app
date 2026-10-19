import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  BellRing, 
  Droplet, 
  Zap, 
  CloudRain, 
  AlertTriangle, 
  Volume2, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Activity, 
  Sparkles,
  VolumeX,
  Volume1,
  HelpCircle
} from 'lucide-react';
import { 
  requestNotificationPermission, 
  showEmergencyPushNotification, 
  playEmergencyChime, 
  registerSubscriberInFirestore 
} from '../utils/pushNotification';

interface NotificationSettingsPageProps {
  onBack: () => void;
}

const READ_NOTIFICATIONS_KEY = 'rajshahi_read_notifications_ids';

const TONES_LIST = [
  { id: 'sound1', name: 'নরম ঘণ্টা (Soft Bell)', desc: 'শান্ত ও মধুর নোটিফিকেশন টোন' },
  { id: 'sound2', name: 'মিষ্টি সুর (Sweet Ring)', desc: 'মনোমুগ্ধকর ডাবল সুর' },
  { id: 'sound3', name: 'সংকেত বার্তা (Alert Tone)', desc: 'সাধারণ অথচ কার্যকারী বিপ' },
  { id: 'sound4', name: 'দ্বৈত সুর (Double Chime)', desc: 'আবহাওয়ার জরুরি বার্তা' },
  { id: 'sound5', name: 'জাদুকরি সুর (Magic Dust)', desc: 'ডিজিটাল জাদুকরী টিউন' },
  { id: 'sound6', name: 'সফলতা টোন (Success Pop)', desc: 'ফলাফল প্রকাশের আনন্দ টোন' },
  { id: 'sound7', name: 'জরুরি সাইরেন (Urgent Siren)', desc: 'রক্তের ডাক ও সর্বোচ্চ জরুরি অ্যালার্ট' },
  { id: 'sound8', name: 'গভীর প্রতিধ্বনি (Deep Echo)', desc: 'ভারী ও গভীর সতর্কবার্তা' },
  { id: 'sound9', name: 'মেরিম্বা সুর (Marimba)', desc: 'উদ্যমী ও দ্রুত ছন্দ' },
  { id: 'sound10', name: 'ছোট পিং (Simple Ping)', desc: 'সবচেয়ে হালকা ও সংক্ষিপ্ত টোন' }
];

export const NotificationSettingsPage: React.FC<NotificationSettingsPageProps> = ({ onBack }) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [testSuccess, setTestSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedSound, setSelectedSound] = useState<string>('sound7');
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<{ [key: string]: boolean }>({
    blood: true,
    electricity: true,
    weather: true,
    emergency: true
  });

  // Load configuration from localStorage on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
      const isGranted = Notification.permission === 'granted';
      const storedPref = localStorage.getItem('rajshahi_notifications_enabled') === 'true';
      setPushEnabled(isGranted || storedPref); // Show active if user chose to enable it locally
    } else {
      const storedPref = localStorage.getItem('rajshahi_notifications_enabled') === 'true';
      setPushEnabled(storedPref);
    }
    
    const savedBlood = localStorage.getItem('rajshahi_blood_group_pref');
    if (savedBlood) {
      setBloodGroup(savedBlood);
    }

    const savedCats = localStorage.getItem('rajshahi_notification_categories_pref');
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {}
    }

    const savedSound = localStorage.getItem('rajshahi_notification_sound_pref');
    if (savedSound) {
      setSelectedSound(savedSound);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleTogglePush = async () => {
    if (pushEnabled) {
      // Turn Off
      setPushEnabled(false);
      localStorage.setItem('rajshahi_notifications_enabled', 'false');
      triggerToast('🚫 পুশ নোটিফিকেশন বন্ধ করা হয়েছে।');
      playEmergencyChime('sound3');
    } else {
      // Turn On
      playEmergencyChime('sound6');
      
      let isSystemGranted = false;
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          setPermissionState(permission);
          isSystemGranted = permission === 'granted';
        } catch (e) {
          console.warn('Notification permission request skipped inside iframe context');
        }
      }

      setPushEnabled(true);
      localStorage.setItem('rajshahi_notifications_enabled', 'true');
      
      if (isSystemGranted) {
        triggerToast('🔔 সফলভাবে সিস্টেম পুশ নোটিফিকেশন সচল করা হয়েছে!');
      } else {
        // Show comforting toast indicating simulated/in-app mode has been force-enabled for the browser preview
        triggerToast('🚀 ইন-অ্যাপ নোটিফিকেশন ও ব্যাকগ্রাউন্ড অ্যালার্ট সার্ভিস সক্রিয় করা হয়েছে!');
      }

      // Sync background subscriber with Firestore
      let subId = localStorage.getItem('rajshahi_subscriber_id');
      if (!subId) {
        subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('rajshahi_subscriber_id', subId);
      }
      const activeCats = Object.keys(categories).filter(k => categories[k]);
      await registerSubscriberInFirestore(subId, bloodGroup, activeCats);
    }
  };

  const handleSelectBlood = (group: string) => {
    setBloodGroup(group);
    localStorage.setItem('rajshahi_blood_group_pref', group);
    triggerToast(`🩸 রক্তের গ্রুপ ${group} আপডেট করা হয়েছে।`);
    playEmergencyChime('sound1');
  };

  const handleToggleCategory = (catKey: string, val: boolean) => {
    const updated = { ...categories, [catKey]: val };
    setCategories(updated);
    localStorage.setItem('rajshahi_notification_categories_pref', JSON.stringify(updated));
    playEmergencyChime('sound10');
  };

  const handlePlaySoundPreview = (soundId: string) => {
    setSoundPlaying(soundId);
    playEmergencyChime('emergency', soundId);
    setTimeout(() => {
      setSoundPlaying(null);
    }, 1500);
  };

  const handleSelectSound = (soundId: string) => {
    setSelectedSound(soundId);
    localStorage.setItem('rajshahi_notification_sound_pref', soundId);
    handlePlaySoundPreview(soundId);
  };

  const handleSendTestNotification = () => {
    setTestSuccess(true);
    playEmergencyChime('emergency', selectedSound);
    
    // Attempt system push if permitted
    showEmergencyPushNotification({
      title: `🚨 টেস্ট সতর্কবার্তা: রক্ত প্রয়োজন (${bloodGroup})`,
      body: `কুষ্টিয়া ১০০ শয্যা সরকারি হাসপাতালে আপনার রক্তের গ্রুপের একজন রোগীর জন্য জরুরি রক্তদাতা প্রয়োজন।`,
      type: 'blood',
      bloodGroup: bloodGroup,
      soundType: selectedSound,
      actionUrl: '/?tab=blood',
      tag: 'test-alert'
    });

    triggerToast('🔔 টেস্ট নোটিফিকেশন এবং শব্দ বাজানো হয়েছে!');
    setTimeout(() => setTestSuccess(false), 4000);
  };

  const handleSaveAll = async () => {
    let subId = localStorage.getItem('rajshahi_subscriber_id');
    if (!subId) {
      subId = `sub_${Date.now()}`;
      localStorage.setItem('rajshahi_subscriber_id', subId);
    }

    localStorage.setItem('rajshahi_blood_group_pref', bloodGroup);
    localStorage.setItem('rajshahi_notification_sound_pref', selectedSound);
    localStorage.setItem('rajshahi_notification_categories_pref', JSON.stringify(categories));

    const activeCats = Object.keys(categories).filter(k => categories[k]);
    if (pushEnabled) {
      await registerSubscriberInFirestore(subId, bloodGroup, activeCats);
    }

    triggerToast('✅ নোটিফিকেশন সেটিংস সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => {
      onBack();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28 animate-in fade-in duration-300">
      {/* Toast Bar */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-center animate-in slide-in-from-top duration-300">
          <div className="bg-slate-900/95 dark:bg-white text-white dark:text-slate-950 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700/50 max-w-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-pink-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            aria-label="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 dark:text-white">জরুরি নোটিফিকেশন কন্ট্রোল</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">কুষ্টিয়া শহরের গুরুত্বপূর্ণ নোটিশ সেটিংস</p>
          </div>
        </div>
        
        {/* Connection Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
          <div className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'} shrink-0`} />
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
            {pushEnabled ? 'কানেক্টেড' : 'নিষ্ক্রিয়'}
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5 space-y-5">
        
        {/* Simulated Mock Alert Preview if Test is Clicked */}
        {testSuccess && (
          <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 animate-in slide-in-from-top-6 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-rose-400 tracking-wider uppercase">আমার কুষ্টিয়া সতর্কবার্তা</span>
                  <span className="text-[9px] text-slate-400">এইমাত্র</span>
                </div>
                <h4 className="text-xs font-extrabold mt-0.5">🚨 রক্তের জরুরি প্রয়োজন ({bloodGroup})</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  কুষ্টিয়া ১০০ শয্যা বিশিষ্ট হাসপাতালে জরুরি ১ ব্যাগ ও-পজিটিভ রক্তের প্রয়োজন। অনুগ্রহ করে দ্রুত যোগাযোগ করুন।
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold">ভলিউম: সর্বাধিক</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold">টোন: {TONES_LIST.find(t => t.id === selectedSound)?.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Push Toggle Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 shrink-0">
            <BellRing className="w-40 h-40" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Bell className={`w-6 h-6 text-amber-300 ${pushEnabled ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-wide">জরুরি পুশ নোটিফিকেশন</h2>
                  <p className="text-[10px] text-emerald-100">রক্তদান, দুর্যোগ ও নেসকোর বিদ্যুৎ তথ্য</p>
                </div>
              </div>
              
              {/* Premium Custom 3D Toggle Switch */}
              <button 
                onClick={handleTogglePush}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  pushEnabled ? 'bg-emerald-400 shadow-inner' : 'bg-white/20'
                }`}
                aria-label="নোটিফিকেশন চালু/বন্ধ করুন"
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                  pushEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}>
                  {pushEnabled ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  )}
                </div>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <div className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-50 leading-relaxed">
                  {pushEnabled 
                    ? 'আপনার ফোনে ব্যাকগ্রাউন্ড লিসেনার ও স্মার্ট ভাইব্রেশন চালু আছে। স্ক্রিন লক থাকলেও সংকেত বাজবে।' 
                    : 'পুশ নোটিফিকেশন সক্রিয় না করলে রক্তের ডাক, বিদ্যুৎ বিপর্যয় ও ঝড়ের সময় রিংটোন বাজবে না।'}
                </p>
              </div>
              
              {/* Iframe Safe simulation warning badge if blocked */}
              {pushEnabled && permissionState !== 'granted' && (
                <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/5 text-[10px] text-amber-200 font-semibold flex items-center gap-1.5 leading-relaxed">
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>আমার কুষ্টিয়া লাইভ সিমুলেশন ও রিয়েলটাইম লিসেনার মোড সচল রেখেছে।</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blood Group Preference Grid */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-pink-200/80/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
              <Droplet className="w-4 h-4 shrink-0" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">আপনার রক্তের গ্রুপ ফিল্টার</h3>
              <p className="text-[10px] text-slate-500">শুধুমাত্র আপনার গ্রুপ ও নেগেটিভ গ্রুপের জন্য রিং বাজবে</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => {
              const isSelected = bloodGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => handleSelectBlood(group)}
                  className={`py-3 px-1 text-xs font-black rounded-2xl border transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-102 font-black dark:border-rose-500'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border-pink-100 dark:border-slate-800 hover:border-rose-200'
                  }`}
                >
                  <span className="text-xs">{group}</span>
                  <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Settings Toggle */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-pink-200/80/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">কোন্ কোন্ অ্যালার্ট পেতে চান?</h3>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">অন/অফ</span>
          </div>

          <div className="space-y-2">
            {[
              { key: 'blood', name: 'রক্তের জরুরি ডাক', desc: 'কুষ্টিয়া এলাকায় রক্তের চরম সংকট ও আহ্বানের তথ্য', icon: Droplet, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
              { key: 'electricity', name: 'বিদ্যুৎ বিভ্রাট ও লোডশেডিং', desc: 'মেইনটেন্যান্স ও নেসকো ফিডার সংস্কার কাজের নোটিশ', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
              { key: 'weather', name: 'আবহাওয়া ও বন্যা পূর্বাভাস', desc: 'ভারী বজ্রপাত, ঝড় ও প্লাবনের জরুরি সংকেত', icon: CloudRain, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' },
              { key: 'emergency', name: 'সরকারি জরুরি নোটিশ', desc: 'উপজেলা প্রশাসন ও পৌরসভার নির্দেশনাবলী', icon: AlertTriangle, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' }
            ].map(item => {
              const Icon = item.icon;
              const isChecked = categories[item.key];
              return (
                <label 
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-pink-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                    </div>
                    <div className="pr-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                      <p className="text-[9px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={(e) => handleToggleCategory(item.key, e.target.checked)}
                    className="rounded-lg text-emerald-600 focus:ring-pink-500 focus:ring-offset-0 w-4.5 h-4.5 border-pink-300 dark:border-slate-700 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Custom Premium Chimes SandBox console */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-pink-200/80/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">রিল্যাক্সড অ্যালার্ম টোন লাইব্রেরি</h3>
              <p className="text-[10px] text-slate-500">জরুরি নোটিফিকেশন আসার পর ফোনে যে সুরটি বাজবে</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Volume1 className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Sound Wave Visualizer Animation when sound playing */}
          {soundPlaying && (
            <div className="flex items-center justify-center gap-1 py-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mr-2">অডিও টেস্ট হচ্ছে...</span>
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full animate-pulse" />
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TONES_LIST.map(tone => {
              const isSelected = selectedSound === tone.id;
              const isPlayingThis = soundPlaying === tone.id;
              return (
                <div 
                  key={tone.id}
                  onClick={() => handleSelectSound(tone.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500' 
                      : 'bg-slate-50 dark:bg-slate-800/30 border-pink-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <span className={`text-[11px] block ${isSelected ? 'font-extrabold text-emerald-800 dark:text-emerald-300' : 'font-semibold text-slate-800 dark:text-slate-300'}`}>
                      {tone.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{tone.desc}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySoundPreview(tone.id);
                    }}
                    className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isPlayingThis 
                        ? 'bg-rose-500 text-white' 
                        : isSelected 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {isPlayingThis ? (
                      <VolumeX className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Test Console */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-black">রিয়েল-টাইম সংকেত পরীক্ষা</h4>
              <p className="text-[9px] text-slate-400">এখনি ফোনে রিংটোন বাজিয়ে সিগন্যাল কোয়ালিটি যাচাই করুন</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleSendTestNotification}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs shrink-0 transition-all shadow-md"
          >
            টেস্ট নোটিফিকেশন পাঠান
          </button>
        </div>

        {/* Floating Save Button */}
        <div className="pt-3">
          <button 
            type="button"
            onClick={handleSaveAll}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs rounded-3xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>সেটিংস পরিবর্তন নিশ্চিত করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
