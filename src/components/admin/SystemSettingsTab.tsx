import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Palette, 
  Lock, 
  Bell, 
  PhoneCall, 
  Save, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  Upload, 
  RefreshCw,
  Sparkles,
  Layers,
  KeyRound,
  FileJson,
  Users,
  ShieldCheck,
  Plus,
  Share2
} from 'lucide-react';
import { AppThemeConfig, ThemeColorKey } from '../../types';
import { 
  THEME_PRESETS, 
  addActivityLog, 
  getAdminAccounts, 
  fetchAdminAccountsFromFirestore,
  addAdminAccount, 
  toggleAdminBlock, 
  deduplicateAdminAccounts,
  AdminAccount 
} from '../../services/adminService';
import { postService } from '../../services/postService';
import { WelcomePopupManagerCard } from './WelcomePopupManagerCard';
import { AdminProfilePhotoUploader } from './AdminProfilePhotoUploader';
import { changeAdminPinInFirestore, DEFAULT_ADMIN_PIN } from '../../utils/adminPinSecurity';

interface SystemSettingsTabProps {
  appTheme: AppThemeConfig;
  onUpdateTheme: (updated: Partial<AppThemeConfig>) => void;
  onThemePresetChange: (key: ThemeColorKey) => void;
  currentAdminRole: 'super_admin' | 'sub_admin';
  defaultSubTab?: 'general' | 'notice' | 'helpline' | 'theme' | 'security' | 'backup';
}

export const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({
  appTheme,
  onUpdateTheme,
  onThemePresetChange,
  currentAdminRole,
  defaultSubTab = 'general'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'features' | 'notice' | 'helpline' | 'theme' | 'security' | 'backup' | 'social'>(defaultSubTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [generalForm, setGeneralForm] = useState({
    appName: 'আমার কুষ্টিয়া',
    tagline: appTheme.tagline || 'কুষ্টিয়া শহরের ডিজিটাল সিটিজেন পোর্টাল',
    cityName: (appTheme.cityName && !appTheme.cityName.includes('নীলফামারী') && !appTheme.cityName.includes('সৈয়দ') && !appTheme.cityName.includes('সৈয়দ')) ? appTheme.cityName : 'কুষ্টিয়া, বাংলাদেশ',
    isMemberPostingAllowed: appTheme.isMemberPostingAllowed ?? false,
    adminProfilePic: appTheme.adminProfilePic || '',
    showBalanceCard: appTheme.showBalanceCard ?? true,
    showDemoData: (appTheme as any).showDemoData ?? true,
    autoApprove: appTheme.autoApprove ?? true
  });

  // Features Form
  const [featuresForm, setFeaturesForm] = useState<string[]>(appTheme.disabledFeatures || []);

  // Notice Form
  const [noticeForm, setNoticeForm] = useState({
    isMarqueeActive: appTheme.isMarqueeActive ?? true,
    marqueeAnnouncement: appTheme.marqueeAnnouncement || '',
    isEmergencyAlertActive: appTheme.isEmergencyAlertActive ?? true,
    emergencyAlert: appTheme.emergencyAlert || '',
    isEmergencyNoticeActive: appTheme.isEmergencyNoticeActive ?? false,
    emergencyNoticeTitle: appTheme.emergencyNoticeTitle || 'জরুরি নোটিশ',
    emergencyNoticeMessage: appTheme.emergencyNoticeMessage || '',
    isEmergencyBloodDonorActive: appTheme.isEmergencyBloodDonorActive ?? false,
    emergencyBloodDonorMessage: appTheme.emergencyBloodDonorMessage || 'জরুরি রক্তের প্রয়োজন? এখানে ক্লিক করে রক্তদাতার খোঁজ করুন।',
    isPatientBloodRequestActive: appTheme.isPatientBloodRequestActive ?? false,
    patientName: appTheme.patientName || '',
    patientBloodGroup: appTheme.patientBloodGroup || '',
    patientAge: appTheme.patientAge || '',
    patientContactNumber: appTheme.patientContactNumber || ''
  });

  // Helpline Form
  const [helplineForm, setHelplineForm] = useState({
    policePhone: appTheme.policePhone || '01320-136502',
    fireServicePhone: appTheme.fireServicePhone || '01715-464875',
    hospitalPhone: appTheme.hospitalPhone || '05526-72233',
    ambulancePhone: appTheme.ambulancePhone || '01712-334455',
    electricityPhone: appTheme.electricityPhone || '16116',
    bloodHelplinePhone: appTheme.bloodHelplinePhone || '01711-224455'
  });

  // Admin Accounts State
  const [adminList, setAdminList] = useState<AdminAccount[]>(() => deduplicateAdminAccounts(getAdminAccounts()));
  const [newAdminForm, setNewAdminForm] = useState({ email: '', password: '', name: '' });
  const [newAdminError, setNewAdminError] = useState<string | null>(null);

  // 6-Digit Admin PIN State (Firestore Hashed)
  const [pinChangeForm, setPinChangeForm] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [pinChangeStatus, setPinChangeStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingPin, setIsSavingPin] = useState(false);

  const handleUpdatePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeStatus(null);
    if (pinChangeForm.newPin !== pinChangeForm.confirmPin) {
      setPinChangeStatus({ type: 'error', text: 'নতুন পিন এবং নিশ্চিতকরণ পিন মেলেনি!' });
      return;
    }
    if (pinChangeForm.newPin.length !== 6 || !/^\d{6}$/.test(pinChangeForm.newPin)) {
      setPinChangeStatus({ type: 'error', text: 'পিন অবশ্যই ৬ সংখ্যার (digits) হতে হবে!' });
      return;
    }
    setIsSavingPin(true);
    try {
      const res = await changeAdminPinInFirestore(pinChangeForm.oldPin, pinChangeForm.newPin);
      if (res.success) {
        setPinChangeStatus({ type: 'success', text: 'এডমিন সিকিউরিটি পিন ফায়ারস্টোরে সফলভাবে পরিবর্তিত হয়েছে!' });
        setPinChangeForm({ oldPin: '', newPin: '', confirmPin: '' });
        showToast('এডমিন ৬-সংখ্যার পিন সফলভাবে আপডেট হয়েছে!');
        addActivityLog({
          type: 'pin_changed',
          title: 'এডমিন পিন পরিবর্তন',
          description: 'ফায়ারস্টোরে এডমিন অ্যাপের ৬-সংখ্যার সিকিউরিটি পিন সফলভাবে পরিবর্তন করা হয়েছে।',
          actor: 'মাস্টার এডমিন'
        });
      } else {
        setPinChangeStatus({ type: 'error', text: res.error || 'বর্তমান পিন ভুল দেওয়া হয়েছে!' });
      }
    } catch (err: any) {
      setPinChangeStatus({ type: 'error', text: 'পিন পরিবর্তন করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSavingPin(false);
    }
  };

  useEffect(() => {
    fetchAdminAccountsFromFirestore().then(accounts => {
      if (accounts && accounts.length > 0) {
        setAdminList(deduplicateAdminAccounts(accounts));
      }
    });

    const handleAdminsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAdminList(deduplicateAdminAccounts(e.detail));
      } else {
        setAdminList(deduplicateAdminAccounts(getAdminAccounts()));
      }
    };
    window.addEventListener('kushtia-admins-updated', handleAdminsUpdated);
    return () => {
      window.removeEventListener('kushtia-admins-updated', handleAdminsUpdated);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTheme(generalForm);
    addActivityLog({
      type: 'theme_updated',
      title: 'অ্যাপ সাধারণ সেটিংস আপডেট',
      description: `অ্যাপের নাম "${generalForm.appName}" এবং লোকেশন আপডেট করা হয়েছে।`,
      actor: 'এডমিন'
    });
    showToast('সাধারণ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTheme(noticeForm);
    addActivityLog({
      type: 'theme_updated',
      title: 'নোটিশ ও অ্যালার্ট সেটিংস আপডেট',
      description: 'স্ক্রলিং নোটিশ বার ও জরুরি বার্তা কনফিগারেশন সেভ হয়েছে।',
      actor: 'এডমিন'
    });
    showToast('নোটিশ সেটিংস সফলভাবে আপডেট হয়েছে!');
  };

  useEffect(() => {
    setGeneralForm({
      appName: 'আমার কুষ্টিয়া',
      tagline: appTheme.tagline || 'কুষ্টিয়া শহরের ডিজিটাল সিটিজেন পোর্টাল',
      cityName: (appTheme.cityName && !appTheme.cityName.includes('নীলফামারী') && !appTheme.cityName.includes('সৈয়দ') && !appTheme.cityName.includes('সৈয়দ')) ? appTheme.cityName : 'কুষ্টিয়া, বাংলাদেশ',
      isMemberPostingAllowed: appTheme.isMemberPostingAllowed ?? false,
      adminProfilePic: appTheme.adminProfilePic || '',
      showBalanceCard: appTheme.showBalanceCard ?? true,
      showDemoData: (appTheme as any).showDemoData ?? true,
      autoApprove: appTheme.autoApprove ?? true
    });
  }, [appTheme.appName, appTheme.tagline, appTheme.cityName, appTheme.isMemberPostingAllowed, appTheme.adminProfilePic, appTheme.showBalanceCard, (appTheme as any).showDemoData, appTheme.autoApprove]);


  // ... (handleSaveNotice update later)

  useEffect(() => {
    setNoticeForm({
      isMarqueeActive: appTheme.isMarqueeActive ?? true,
      marqueeAnnouncement: appTheme.marqueeAnnouncement || '',
      isEmergencyAlertActive: appTheme.isEmergencyAlertActive ?? true,
      emergencyAlert: appTheme.emergencyAlert || '',
      isEmergencyNoticeActive: appTheme.isEmergencyNoticeActive ?? false,
      emergencyNoticeTitle: appTheme.emergencyNoticeTitle || 'জরুরি নোটিশ',
      emergencyNoticeMessage: appTheme.emergencyNoticeMessage || '',
      isEmergencyBloodDonorActive: appTheme.isEmergencyBloodDonorActive ?? false,
      emergencyBloodDonorMessage: appTheme.emergencyBloodDonorMessage || 'জরুরি রক্তের প্রয়োজন? এখানে ক্লিক করে রক্তদাতার খোঁজ করুন।',
      isPatientBloodRequestActive: appTheme.isPatientBloodRequestActive ?? false,
      patientName: appTheme.patientName || '',
      patientBloodGroup: appTheme.patientBloodGroup || '',
      patientAge: appTheme.patientAge || '',
      patientContactNumber: appTheme.patientContactNumber || ''
    });
  }, [
    appTheme.isMarqueeActive, 
    appTheme.marqueeAnnouncement, 
    appTheme.isEmergencyAlertActive, 
    appTheme.emergencyAlert,
    appTheme.isEmergencyNoticeActive,
    appTheme.emergencyNoticeTitle,
    appTheme.emergencyNoticeMessage,
    appTheme.isEmergencyBloodDonorActive,
    appTheme.emergencyBloodDonorMessage,
    appTheme.isPatientBloodRequestActive,
    appTheme.patientName,
    appTheme.patientBloodGroup,
    appTheme.patientAge,
    appTheme.patientContactNumber
  ]);

  useEffect(() => {
    setHelplineForm({
      policePhone: appTheme.policePhone || '01320-136502',
      fireServicePhone: appTheme.fireServicePhone || '01715-464875',
      hospitalPhone: appTheme.hospitalPhone || '05526-72233',
      ambulancePhone: appTheme.ambulancePhone || '01712-334455',
      electricityPhone: appTheme.electricityPhone || '16116',
      bloodHelplinePhone: appTheme.bloodHelplinePhone || '01711-224455'
    });
  }, [
    appTheme.policePhone,
    appTheme.fireServicePhone,
    appTheme.hospitalPhone,
    appTheme.ambulancePhone,
    appTheme.electricityPhone,
    appTheme.bloodHelplinePhone
  ]);

  useEffect(() => {
    setFeaturesForm(appTheme.disabledFeatures || []);
  }, [appTheme.disabledFeatures]);

  const handleSaveFeatures = (e: React.FormEvent) => {

    e.preventDefault();
    onUpdateTheme({ disabledFeatures: featuresForm });
    addActivityLog({
      type: 'category_updated',
      title: 'ফিচার কন্ট্রোল আপডেট',
      description: 'অ্যাপের কোন কোন ফিচার অন/অফ থাকবে তা আপডেট করা হয়েছে।',
      actor: 'এডমিন'
    });
    showToast('ফিচার সেটিংস সফলভাবে আপডেট হয়েছে!');
  };
  const handleSaveHelplines = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTheme(helplineForm);
    addActivityLog({
      type: 'theme_updated',
      title: 'জরুরি হেল্পলাইন নম্বর আপডেট',
      description: 'পুলিশ, ফায়ার সার্ভিস ও হাসপাতাল হেল্পলাইন নম্বর সংরক্ষণ করা হয়েছে।',
      actor: 'এডমিন'
    });
    showToast('জরুরি হেল্পলাইন নম্বরসমূহ সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const [socialForm, setSocialForm] = useState({
    socialFacebookPageUrl: appTheme.socialFacebookPageUrl || '',
    isSocialFacebookPageActive: appTheme.isSocialFacebookPageActive ?? true,
    socialFacebookGroupUrl: appTheme.socialFacebookGroupUrl || '',
    isSocialFacebookGroupActive: appTheme.isSocialFacebookGroupActive ?? true,
    socialYoutubeUrl: appTheme.socialYoutubeUrl || '',
    isSocialYoutubeActive: appTheme.isSocialYoutubeActive ?? true,
    socialTiktokUrl: appTheme.socialTiktokUrl || '',
    isSocialTiktokActive: appTheme.isSocialTiktokActive ?? false,
    socialInstagramUrl: appTheme.socialInstagramUrl || '',
    isSocialInstagramActive: appTheme.isSocialInstagramActive ?? false,
    socialTwitterUrl: appTheme.socialTwitterUrl || '',
    isSocialTwitterActive: appTheme.isSocialTwitterActive ?? false,
    socialWebsiteUrl: appTheme.socialWebsiteUrl || '',
    isSocialWebsiteActive: appTheme.isSocialWebsiteActive ?? false,
  });

  useEffect(() => {
    setSocialForm({
      socialFacebookPageUrl: appTheme.socialFacebookPageUrl || '',
      isSocialFacebookPageActive: appTheme.isSocialFacebookPageActive ?? true,
      socialFacebookGroupUrl: appTheme.socialFacebookGroupUrl || '',
      isSocialFacebookGroupActive: appTheme.isSocialFacebookGroupActive ?? true,
      socialYoutubeUrl: appTheme.socialYoutubeUrl || '',
      isSocialYoutubeActive: appTheme.isSocialYoutubeActive ?? true,
      socialTiktokUrl: appTheme.socialTiktokUrl || '',
      isSocialTiktokActive: appTheme.isSocialTiktokActive ?? false,
      socialInstagramUrl: appTheme.socialInstagramUrl || '',
      isSocialInstagramActive: appTheme.isSocialInstagramActive ?? false,
      socialTwitterUrl: appTheme.socialTwitterUrl || '',
      isSocialTwitterActive: appTheme.isSocialTwitterActive ?? false,
      socialWebsiteUrl: appTheme.socialWebsiteUrl || '',
      isSocialWebsiteActive: appTheme.isSocialWebsiteActive ?? false,
    });
  }, [
    appTheme.socialFacebookPageUrl,
    appTheme.isSocialFacebookPageActive,
    appTheme.socialFacebookGroupUrl,
    appTheme.isSocialFacebookGroupActive,
    appTheme.socialYoutubeUrl,
    appTheme.isSocialYoutubeActive,
    appTheme.socialTiktokUrl,
    appTheme.isSocialTiktokActive,
    appTheme.socialInstagramUrl,
    appTheme.isSocialInstagramActive,
    appTheme.socialTwitterUrl,
    appTheme.isSocialTwitterActive,
    appTheme.socialWebsiteUrl,
    appTheme.isSocialWebsiteActive,
  ]);

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTheme(socialForm);
    addActivityLog({
      type: 'theme_updated',
      title: 'সোশ্যাল মিডিয়া লিংক ও ফুটার আপডেট',
      description: 'সোশ্যাল মিডিয়া লিংক এবং অন/অফ স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।',
      actor: 'এডমিন'
    });
    showToast('সোশ্যাল মিডিয়া সেটিংস সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!');
  };


  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminRole === 'sub_admin') {
      setNewAdminError('সাব-এডমিন হিসেবে নতুন এডমিন যোগ করার অনুমতি নেই।');
      return;
    }
    setNewAdminError(null);
    const res = await addAdminAccount(newAdminForm.email, newAdminForm.password, newAdminForm.name);
    if (!res.success) {
      setNewAdminError(res.error || 'এডমিন যোগ করতে সমস্যা হয়েছে।');
      return;
    }
    setAdminList(getAdminAccounts());
    setNewAdminForm({ email: '', password: '', name: '' });
    showToast('নতুন সাব-এডমিন সফলভাবে ফায়ারস্টোরে যুক্ত হয়েছে!');
  };

  const handleToggleBlockAdmin = async (id: string) => {
    if (currentAdminRole === 'sub_admin') {
      alert('সাব-এডমিন হিসেবে অন্য এডমিন ব্লক করার অনুমতি নেই।');
      return;
    }
    const updated = await toggleAdminBlock(id);
    setAdminList(updated);
    showToast('এডমিন স্ট্যাটাস ফায়ারস্টোরে আপডেট হয়েছে!');
  };

  const handleExportData = async () => {
    try {
      const allPosts = await postService.getAllPosts();
      const exportObject = {
        exportDate: new Date().toISOString(),
        version: '2.0',
        appTheme,
        posts: allPosts,
        helplines: helplineForm
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `kushtia_connect_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('সকল ডাটা ও সেটিংস ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে!');
    } catch (e) {
      alert('ব্যাকআপ তৈরিতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>সাধারণ সেটিংস</span>
        </button>


        <button
          onClick={() => setActiveSubTab('features')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'features'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ফিচার কন্ট্রোল</span>
        </button>
        <button
          onClick={() => setActiveSubTab('notice')}

          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'notice'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>নোটিশ ও অ্যালার্ট</span>
        </button>

        <button
          onClick={() => setActiveSubTab('helpline')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'helpline'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>জরুরি হেল্পলাইন নম্বর</span>
        </button>

        <button
          onClick={() => setActiveSubTab('theme')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'theme'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>থিম ও কালার</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>সিকিউরিটি পিন</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'backup'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>ব্যাকআপ ও রিস্টোর</span>
        </button>

        <button
          onClick={() => setActiveSubTab('social')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'social'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-pink-200/80/80'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>সোশ্যাল মিডিয়া</span>
        </button>
      </div>


      {/* 1.1 FEATURES SETTINGS */}
      {activeSubTab === 'features' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">ফিচার কন্ট্রোল (Feature Toggles)</h3>
              <p className="text-xs text-slate-500">
                যেকোনো সার্ভিস বা ক্যাটাগরি যেকোনো সময় অন বা অফ করুন। অফ করা ফিচার ইউজাররা দেখতে পারবে না।
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveFeatures} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'house-rent', label: 'বাসা ভাড়া' },
                { id: 'buy-sell', label: 'বাই-সেল' },
                { id: 'doctor', label: 'ডাক্তার' },
                { id: 'blood', label: 'রক্তদাতা' },
                { id: 'crime-reporter', label: 'গোপন তথ্য' },
                { id: 'food', label: 'রেস্টুরেন্ট ও খাবার' },
                { id: 'transport', label: 'বাস ও ট্রেন' },
                { id: 'jobs', label: 'চাকরি ও নিয়োগ' },
                { id: 'lost-found', label: 'হারানো ও প্রাপ্তি' },
                { id: 'legal', label: 'আইনি সহায়তা' },
                { id: 'events', label: 'অনুষ্ঠান ও ডেকোর' },
                { id: 'electrician', label: 'ইলেকট্রিশিয়ান' },
                { id: 'plumber', label: 'প্লাম্বার' },
                { id: 'ac-mechanic', label: 'এসি/ফ্রিজ' },
                { id: 'driver', label: 'ড্রাইভার' },
                { id: 'tutor', label: 'টিউশন/শিক্ষক' },
                { id: 'vet', label: 'পশু চিকিৎসক' },
                { id: 'mason', label: 'রাজমিস্ত্রি' },
                { id: 'mobile-maker', label: 'মোবাইল মেকার' },
              ].map(feature => {
                const isEnabled = !featuresForm.includes(feature.id);
                return (
                  <div key={feature.id} className="flex items-center justify-between p-3 rounded-xl border border-pink-200/80 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700">{feature.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isEnabled) {
                          setFeaturesForm([...featuresForm, feature.id]); // Add to disabled
                        } else {
                          setFeaturesForm(featuresForm.filter(f => f !== feature.id)); // Remove from disabled
                        }
                      }}
                      className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-pink-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 1. GENERAL SETTINGS */}

      {activeSubTab === 'general' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">প্ল্যাটফর্ম সাধারণ কনফিগারেশন</h3>
            <p className="text-xs text-slate-500">
              অ্যাপের প্রধান নাম, পরিচিতি ও অবস্থান পরিবর্তন করুন যা সমগ্র অ্যাপে প্রতিফলিত হবে।
            </p>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অ্যাপের নাম (Platform Name)
              </label>
              <input
                type="text"
                value={generalForm.appName}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, appName: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ট্যাগলাইন বা স্লোগান (Tagline)
              </label>
              <input
                type="text"
                value={generalForm.tagline}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, tagline: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                শহর ও জেলা (City & Region)
              </label>
              <input
                type="text"
                value={generalForm.cityName}
                onChange={(e) => setGeneralForm(prev => ({ ...prev, cityName: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                এডমিন প্রোফাইল ছবি (Image URL)
              </label>
              <div className="flex gap-2 items-center mb-3">
                <input
                  type="text"
                  value={generalForm.adminProfilePic}
                  onChange={(e) => setGeneralForm(prev => ({ ...prev, adminProfilePic: e.target.value }))}
                  placeholder="https://example.com/admin-photo.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                />
                {generalForm.adminProfilePic && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-emerald-500 shadow-sm">
                    <img src={generalForm.adminProfilePic} alt="Admin preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Firebase Storage Uploader Component */}
              <AdminProfilePhotoUploader
                currentPhotoUrl={generalForm.adminProfilePic}
                onPhotoUploaded={(url) => setGeneralForm(prev => ({ ...prev, adminProfilePic: url }))}
              />
            </div>

            {/* Member Direct Posting Control Toggle */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${generalForm.isMemberPostingAllowed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                    {generalForm.isMemberPostingAllowed ? 'ON' : 'OFF'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      মেম্বারদের সরাসরি পোস্ট করার অনুমতি (Member Direct Posting)
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      {generalForm.isMemberPostingAllowed 
                        ? 'অন থাকলে: সাধারণ সদস্যরা অ্যাপে নিজে থেকেই সব ক্যাটাগরিতে পোস্ট প্রকাশ করতে পারবেন।' 
                        : 'অফ থাকলে: গোপন তথ্য বাদে অন্য ক্যাটাগরিতে পোস্ট করতে এডমিনকে হোয়াটসঅ্যাপ/ফেসবুকে ফ্রি মেসেজ পাঠাবে।'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={generalForm.isMemberPostingAllowed}
                    onChange={(e) => setGeneralForm(prev => ({ ...prev, isMemberPostingAllowed: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {!generalForm.isMemberPostingAllowed && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 font-medium">
                  🔒 বর্তমানে সাধারণ সদস্যের সরাসরি পোস্টিং <strong>বন্ধ (OFF)</strong> রয়েছে। মেম্বারদের কাছে এডমিন হোয়াটসঅ্যাপ বাটন প্রদর্শিত হবে। তবে মেম্বাররা প্রমাণ সহ <strong>'গোপন তথ্য'</strong> সরাসরি পেন্ডিং হিসেবে পোস্ট করতে পারবেন।
                </div>
              )}
            </div>

            {/* Post Auto-Approve Control Toggle */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${generalForm.autoApprove ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                    {generalForm.autoApprove ? 'ON' : 'OFF'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      পোস্ট অটো-অনুমোদন (Auto-Approve Posts)
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      {generalForm.autoApprove 
                        ? 'সক্রিয়: ইউজার পোস্ট করার সাথে সাথে তা অটো-এপরুভ হয়ে যাবে।' 
                        : 'বন্ধ: ইউজার পোস্ট করার পর এডমিনের অনুমোদনের জন্য পেন্ডিং থাকবে।'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={generalForm.autoApprove}
                    onChange={(e) => setGeneralForm(prev => ({ ...prev, autoApprove: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            {/* Demo Data Visibility Toggle */}
            <div className="p-4 bg-amber-900 text-white rounded-2xl space-y-3 shadow-md border border-amber-800 mb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${generalForm.showDemoData ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                    {generalForm.showDemoData ? 'ON' : 'OFF'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      নমুনা ডাটা প্রদর্শন (Show Seed Data)
                    </h4>
                    <p className="text-[11px] text-amber-200">
                      {generalForm.showDemoData 
                        ? 'অন থাকলে: অ্যাপে স্যাম্পল/নমুনা ডাটাগুলো প্রদর্শিত হবে।' 
                        : 'অফ থাকলে: শুধুমাত্র ফায়ারবেস থেকে আসা রিয়েল ডাটা প্রদর্শিত হবে।'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={generalForm.showDemoData}
                    onChange={(e) => setGeneralForm(prev => ({ ...prev, showDemoData: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            {/* Balance Card Visibility Toggle (USER REQUIREMENT) */}
            <div className="p-4 bg-emerald-950 text-white rounded-2xl space-y-3 shadow-md border border-emerald-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${generalForm.showBalanceCard ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                    {generalForm.showBalanceCard ? 'ON' : 'OFF'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      অ্যাপে ব্যালেন্স কার্ড প্রদর্শন (User Balance Card Display)
                    </h4>
                    <p className="text-[11px] text-emerald-200">
                      {generalForm.showBalanceCard 
                        ? 'অন থাকলে: ব্যবহারকারীরা হোম স্ক্রিনে তাদের ওয়ালেট ব্যালেন্স ও এড ব্যালেন্স কার্ড দেখতে পাবেন।' 
                        : 'অফ থাকলে: ব্যবহারকারী অ্যাপে ব্যালেন্স কার্ডটি দেখতে পাবেন না।'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={generalForm.showBalanceCard}
                    onChange={(e) => setGeneralForm(prev => ({ ...prev, showBalanceCard: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>সাধারণ সেটিংস সংরক্ষণ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. NOTICE & ALERTS */}
      {activeSubTab === 'notice' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">স্ক্রলিং নোটিশ ও জরুরি অ্যালার্ট</h3>
            <p className="text-xs text-slate-500">
              মূল অ্যাপের শীর্ষে চলমান স্ক্রলিং বার্তা এবং রেড অ্যালার্ট নোটিফিকেশন নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <form onSubmit={handleSaveNotice} className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-pink-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">স্ক্রলিং নোটিশ বার (Marquee) সক্রিয় রাখুন</span>
                <input
                  type="checkbox"
                  checked={noticeForm.isMarqueeActive}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, isMarqueeActive: e.target.checked }))}
                  className="w-5 h-5 text-emerald-600 rounded-md focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">নোটিশের টেক্সট বার্তা</label>
                <textarea
                  rows={2}
                  value={noticeForm.marqueeAnnouncement}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, marqueeAnnouncement: e.target.value }))}
                  placeholder="স্বাগতম আমার কুষ্টিয়াে..."
                  className="w-full px-3 py-2 bg-white border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600"
                />
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900">জরুরি রেড অ্যালার্ট নোটিশ প্রদর্শন করুন</span>
                <input
                  type="checkbox"
                  checked={noticeForm.isEmergencyAlertActive}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, isEmergencyAlertActive: e.target.checked }))}
                  className="w-5 h-5 text-rose-600 rounded-md focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-rose-800 block mb-1">জরুরি সতর্কবার্তা</label>
                <input
                  type="text"
                  value={noticeForm.emergencyAlert}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, emergencyAlert: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-600 text-rose-950"
                />
              </div>
            </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-4">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  জরুরি ফিচার কন্ট্রোল
                </h4>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-700">জরুরি নোটিশ সক্রিয়</label>
                    <input type="checkbox" checked={noticeForm.isEmergencyNoticeActive} onChange={(e) => setNoticeForm({...noticeForm, isEmergencyNoticeActive: e.target.checked})} className="toggle toggle-emerald" />
                  </div>
                  <input type="text" value={noticeForm.emergencyNoticeTitle} onChange={(e) => setNoticeForm({...noticeForm, emergencyNoticeTitle: e.target.value})} className="w-full p-2 border rounded-lg mb-2" placeholder="নোটিশ শিরোনাম" />
                  <textarea value={noticeForm.emergencyNoticeMessage} onChange={(e) => setNoticeForm({...noticeForm, emergencyNoticeMessage: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="নোটিশের বিস্তারিত..." />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-700">রক্তদাতার খোঁজ সক্রিয়</label>
                    <input type="checkbox" checked={noticeForm.isEmergencyBloodDonorActive} onChange={(e) => setNoticeForm({...noticeForm, isEmergencyBloodDonorActive: e.target.checked})} className="toggle toggle-emerald" />
                  </div>
                  <input type="text" value={noticeForm.emergencyBloodDonorMessage} onChange={(e) => setNoticeForm({...noticeForm, emergencyBloodDonorMessage: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="রক্তদাতার খোঁজ বাটন টেক্সট" />
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-700">রক্তের জরুরি প্রয়োজন (কার্ড) সক্রিয়</label>
                    <input type="checkbox" checked={noticeForm.isPatientBloodRequestActive} onChange={(e) => setNoticeForm({...noticeForm, isPatientBloodRequestActive: e.target.checked})} className="toggle toggle-emerald" />
                  </div>
                  <input type="text" value={noticeForm.patientName} onChange={(e) => setNoticeForm({...noticeForm, patientName: e.target.value})} className="w-full p-2 border rounded-lg mb-2" placeholder="রোগীর নাম" />
                  <input type="text" value={noticeForm.patientBloodGroup} onChange={(e) => setNoticeForm({...noticeForm, patientBloodGroup: e.target.value})} className="w-full p-2 border rounded-lg mb-2" placeholder="রক্তের গ্রুপ (যেমন: O+)" />
                  <input type="text" value={noticeForm.patientAge} onChange={(e) => setNoticeForm({...noticeForm, patientAge: e.target.value})} className="w-full p-2 border rounded-lg mb-2" placeholder="রোগীর বয়স" />
                  <input type="text" value={noticeForm.patientContactNumber} onChange={(e) => setNoticeForm({...noticeForm, patientContactNumber: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="যোগাযোগের নম্বর" />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
              <Save className="w-4 h-4" />
              <span>নোটিশ সেটিংস সংরক্ষণ করুন</span>
            </button>
          </form>

          {/* Dedicated Welcome Popup Modal Manager */}
          <div className="pt-2">
            <WelcomePopupManagerCard
              appTheme={appTheme}
              onUpdateTheme={onUpdateTheme}
              onShowToast={(msg) => alert(msg)}
            />
          </div>
        </div>
      )}

      {/* 3. HELPLINE NUMBERS */}
      {activeSubTab === 'helpline' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">জরুরি সেবা হটলাইন নম্বরসমূহ</h3>
            <p className="text-xs text-slate-500">
              কুষ্টিয়া শহরের জরুরি পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স ও হাসপাতালের নম্বর আপডেট করুন।
            </p>
          </div>

          <form onSubmit={handleSaveHelplines} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  👮 কুষ্টিয়া থানা পুলিশ হটলাইন
                </label>
                <input
                  type="text"
                  value={helplineForm.policePhone}
                  onChange={(e) => setHelplineForm(prev => ({ ...prev, policePhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  🚒 ফায়ার সার্ভিস ও সিভিল ডিফেন্স
                </label>
                <input
                  type="text"
                  value={helplineForm.fireServicePhone}
                  onChange={(e) => setHelplineForm(prev => ({ ...prev, fireServicePhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  🏥 ১০০ শয্যা হাসপাতাল ও জরুরি বিভাগ
                </label>
                <input
                  type="text"
                  value={helplineForm.hospitalPhone}
                  onChange={(e) => setHelplineForm(prev => ({ ...prev, hospitalPhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  🚑 ২৪ ঘণ্টা অ্যাম্বুলেন্স হেল্পলাইন
                </label>
                <input
                  type="text"
                  value={helplineForm.ambulancePhone}
                  onChange={(e) => setHelplineForm(prev => ({ ...prev, ambulancePhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ⚡ বিদ্যুৎ অভিযোগ কেন্দ্র (নেসকো)
                </label>
                <input
                  type="text"
                  value={helplineForm.electricityPhone}
                  onChange={(e) => setHelplineForm(prev => ({ ...prev, electricityPhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  🩸 জরুরি রক্তদান হেল্পলাইন
                </label>
                <input
                  type="text"
                  value={helplineForm.bloodHelplinePhone}
                  onChange={(e) => setHelplineForm(prev => ({ ...prev, bloodHelplinePhone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>হেল্পলাইন নম্বর সংরক্ষণ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. THEME & COLORS */}
      {activeSubTab === 'theme' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">থিম ও কালার প্যালেট নির্বাচন</h3>
            <p className="text-xs text-slate-500">
              অ্যাপের কালার স্কিম নির্বাচন করুন। এটি হেডার, বাটন এবং মূল ইন্টারফেসে তাৎক্ষণিকভাবে কার্যকর হবে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(THEME_PRESETS) as ThemeColorKey[]).map((key) => {
              const preset = THEME_PRESETS[key];
              const isSelected = appTheme.themeKey === key;

              return (
                <div
                  key={key}
                  onClick={() => {
                    onThemePresetChange(key);
                    showToast(`"${preset.name}" থিমটি সক্রিয় করা হয়েছে।`);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-pink-200/80 hover:border-pink-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <div className={`h-8 rounded-xl bg-gradient-to-r ${preset.gradient} shadow-inner`}></div>

                  <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-500 font-mono">
                    <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }}></span>
                    <span>{preset.primary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SECURITY & ADMIN ACCOUNTS */}
      {activeSubTab === 'security' && (
        <div className="space-y-6 max-w-2xl">
          {currentAdminRole === 'sub_admin' ? (
            <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 text-amber-950 space-y-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-amber-800">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black">সীমাবদ্ধ অ্যাক্সেস (Sub-Admin Restrictions)</h3>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                আপনি বর্তমানে একজন সাব-এডমিন হিসেবে লগইন আছেন। সিস্টেমের নিয়ম অনুযায়ী সাব-এডমিনরা পাসওয়ার্ড পরিবর্তন করতে পারবেন না এবং নতুন কোনো এডমিন অ্যাকাউন্ট যুক্ত বা ব্লক করতে পারবেন না। এই বিশেষ অধিকার শুধুমাত্র মাস্টার এডমিনের জন্য সংরক্ষিত।
              </p>
            </div>
          ) : (
            <>
              {/* 6-Digit Admin Security PIN Management Card */}
              <div className="bg-white rounded-3xl p-5 border border-pink-200/80/90 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-emerald-700" />
                    <span>এডমিন অ্যাপের ৬-সংখ্যার সিকিউরিটি পিন পরিবর্তন</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    ইমেইল ও পাসওয়ার্ড ফাঁস হলেও অননুমোদিত অ্যাক্সেস রোধ করতে এই ৬-সংখ্যার পিন ফায়ারস্টোরে হ্যাশড অবস্থায় সুরক্ষিত থাকে।
                  </p>
                </div>

                {pinChangeStatus && (
                  <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    pinChangeStatus.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}>
                    {pinChangeStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{pinChangeStatus.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePinSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">বর্তমান পিন *</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        value={pinChangeForm.oldPin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setPinChangeForm(prev => ({ ...prev, oldPin: val }));
                        }}
                        placeholder="যেমন: 123456"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">নতুন ৬-সংখ্যার পিন *</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        value={pinChangeForm.newPin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setPinChangeForm(prev => ({ ...prev, newPin: val }));
                        }}
                        placeholder="••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">নতুন পিন নিশ্চিত করুন *</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        value={pinChangeForm.confirmPin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setPinChangeForm(prev => ({ ...prev, confirmPin: val }));
                        }}
                        placeholder="••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-mono font-bold focus:outline-none focus:border-pink-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingPin || !pinChangeForm.oldPin || pinChangeForm.newPin.length !== 6}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingPin ? 'ফায়ারস্টোরে সংরক্ষণ হচ্ছে...' : 'নতুন পিন সংরক্ষণ করুন'}</span>
                  </button>
                </form>
              </div>

              {/* Add New Admin Card */}
              <div className="bg-white rounded-3xl p-5 border border-pink-200/80/90 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-700" />
                    <span>নতুন সাব-এডমিন যুক্ত করুন (Add Admin)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    যেকোনো নতুন ব্যক্তির ইমেইল ও পাসওয়ার্ড দিয়ে তাকে সাব-এডমিন হিসেবে পোর্টালে যুক্ত করুন।
                  </p>
                </div>

                {newAdminError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{newAdminError}</span>
                  </div>
                )}

                <form onSubmit={handleAddAdminSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">এডমিনের নাম *</label>
                      <input
                        type="text"
                        required
                        value={newAdminForm.name}
                        onChange={(e) => setNewAdminForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="যেমন: তানজিমুল হক"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">ইমেইল ঠিকানা *</label>
                      <input
                        type="email"
                        required
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@kushtia.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">পাসওয়ার্ড (কমপক্ষে ৪ ডিজিট) *</label>
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={newAdminForm.password}
                      onChange={(e) => setNewAdminForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>সাব-এডমিন অ্যাকাউন্ট তৈরি করুন</span>
                  </button>
                </form>
              </div>

              {/* Registered Admins List & Block Management */}
              <div className="bg-white rounded-3xl p-5 border border-pink-200/80/90 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <span>নিবন্ধিত এডমিন তালিকা ও ব্লক ম্যানেজমেন্ট</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    যেকোনো সাব-এডমিনকে প্রয়োজনে এক ক্লিকে ব্লক বা সক্রিয় করতে পারবেন।
                  </p>
                </div>

                <div className="space-y-2.5">
                  {deduplicateAdminAccounts(adminList).map((admin, idx) => (
                    <div key={`${admin.id}-${idx}`} className="p-3.5 bg-slate-50 border border-pink-200/80/80 rounded-2xl flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{admin.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            admin.role === 'super_admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {admin.role === 'super_admin' ? 'মাস্টার এডমিন' : 'সাব-এডমিন'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            admin.status === 'blocked' ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                          }`}>
                            {admin.status === 'blocked' ? 'ব্লকড' : 'সক্রিয়'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{admin.email}</p>
                      </div>

                      {admin.role !== 'super_admin' && (
                        <button
                          onClick={() => handleToggleBlockAdmin(admin.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                            admin.status === 'blocked'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                        >
                          {admin.status === 'blocked' ? 'আনব্লক করুন' : 'ব্লক করুন'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Status Info Card */}
              <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h3 className="text-sm font-black">নিরাপদ এডমিন অথেন্টিকেশন সংক্রিয়</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  এডমিন প্যানেলে এক্সেস সিকিউরিটির জন্য লোকাল পিন উঠিয়ে সরাসরি **Firebase Authentication** এবং **Custom Claims** সংক্রিয় করা হয়েছে। কোন প্লেইনটেক্সট পিন লোকাল স্টোরেজে সেভ হবে না।
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* 7. SOCIAL MEDIA & FOOTER SETTINGS */}
      {activeSubTab === 'social' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-600" />
              <span>সোশ্যাল মিডিয়া লিংক ও ফুটার ম্যানেজমেন্ট</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              অ্যাপের ফুটার অংশে প্রদর্শিত সোশ্যাল মিডিয়া লিংকগুলো সেট করুন এবং অন/অফ টগল দিয়ে নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <form onSubmit={handleSaveSocial} className="space-y-4">
            {[
              {
                id: 'facebookPage',
                label: 'অফিসিয়াল ফেসবুক পেজ (Facebook Page URL)',
                urlKey: 'socialFacebookPageUrl',
                activeKey: 'isSocialFacebookPageActive',
                placeholder: 'https://facebook.com/amarkushtia.official',
                color: 'bg-blue-50 text-blue-900 border-blue-200'
              },
              {
                id: 'facebookGroup',
                label: 'নাগরিক ফেসবুক গ্রুপ (Facebook Group URL)',
                urlKey: 'socialFacebookGroupUrl',
                activeKey: 'isSocialFacebookGroupActive',
                placeholder: 'https://facebook.com/groups/amarkushtia',
                color: 'bg-sky-50 text-sky-900 border-sky-200'
              },
              {
                id: 'youtube',
                label: 'ইউটিউব চ্যানেল (YouTube Channel URL)',
                urlKey: 'socialYoutubeUrl',
                activeKey: 'isSocialYoutubeActive',
                placeholder: 'https://youtube.com/@amarkushtia',
                color: 'bg-rose-50 text-rose-900 border-rose-200'
              },
              {
                id: 'tiktok',
                label: 'টিকটক একাউন্ট (TikTok URL)',
                urlKey: 'socialTiktokUrl',
                activeKey: 'isSocialTiktokActive',
                placeholder: 'https://tiktok.com/@your-profile',
                color: 'bg-slate-100 text-slate-900 border-slate-300'
              },
              {
                id: 'instagram',
                label: 'ইনস্টাগ্রাম (Instagram URL)',
                urlKey: 'socialInstagramUrl',
                activeKey: 'isSocialInstagramActive',
                placeholder: 'https://instagram.com/your-profile',
                color: 'bg-purple-50 text-purple-900 border-purple-200'
              },
              {
                id: 'website',
                label: 'অফিসিয়াল ওয়েবসাইট (Website URL)',
                urlKey: 'socialWebsiteUrl',
                activeKey: 'isSocialWebsiteActive',
                placeholder: 'https://your-website.com',
                color: 'bg-emerald-50 text-emerald-900 border-emerald-200'
              },
            ].map((item) => {
              const urlVal = (socialForm as any)[item.urlKey];
              const activeVal = (socialForm as any)[item.activeKey];

              return (
                <div key={item.id} className={`p-4 rounded-2xl border ${item.color} space-y-2 shadow-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeVal ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>
                        {activeVal ? 'ON (সক্রিয়)' : 'OFF (নিষ্ক্রিয়)'}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={activeVal}
                          onChange={(e) => setSocialForm(prev => ({ ...prev, [item.activeKey]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={urlVal}
                    onChange={(e) => setSocialForm(prev => ({ ...prev, [item.urlKey]: e.target.value }))}
                    placeholder={item.placeholder}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              );
            })}

            <button
              type="submit"
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>সোশ্যাল মিডিয়া সেটিংস সংরক্ষণ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* 6. DATA BACKUP & RESTORE */}
      {activeSubTab === 'backup' && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">ডাটা ব্যাকআপ ও সিস্টেম রিস্টোর</h3>
            <p className="text-xs text-slate-500">
              অ্যাপের সকল বিজ্ঞাপন, কনফিগারেশন ও হিস্ট্রি সুরক্ষিত রাখুন অথবা নতুন ডিভাইসে এক্সপোর্ট করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-pink-200/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900">ডাটাবেজ এক্সপোর্ট (Backup Download)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                সকল পোস্ট, ক্যাটাগরি, স্পন্সরড ক্যাম্পেইন ও সেটিংস একটি JSON ফাইলে সেভ করুন।
              </p>
              <button
                onClick={handleExportData}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ব্যাকআপ ডাউনলোড করুন</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-pink-200/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-bold text-slate-900">ডাটাবেজ ক্যাশ সিঙ্ক (Sync Cache)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                রিয়েলটাইম লোকাল ক্যাশ ও ফায়ারস্টোর ক্লাউড কানেকশন রিফ্রেশ করুন।
              </p>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিফ্রেশ ও সিঙ্ক করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
