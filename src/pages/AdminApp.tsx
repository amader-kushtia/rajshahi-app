import React, { useState, useEffect } from 'react';
import { Bell, 
  ShieldCheck, 
  Search,
  Lock, 
  Unlock, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Sparkles, 
  Clock, 
  Trash2, 
  LogOut, 
  Plus, 
  Eye, 
  KeyRound,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Menu,
  Radio,
  Stethoscope,
  ShieldAlert,
  Droplet,
  Download,
  BarChart3,
  Server,
  Train,
  Smartphone,
  Wallet
} from 'lucide-react';
import { PostItem, CategoryType, AppThemeConfig, ThemeColorKey, ActivityLog, UserProfile } from '../types';
import { 
  getAppThemeConfig, 
  saveAppThemeConfig, 
  applyThemePreset, 
  getActivityLogs, 
  addActivityLog,
  getAdminAccounts,
  getManagedUsers,
  fetchManagedUsersFromFirestore
} from '../services/adminService';
import { pushUserMetricsSummaryToFirestore } from '../services/userMetricsService';
import { postService } from '../services/postService';
import { getAllSponsoredCampaigns, ManagedSponsoredCampaign } from '../services/sponsoredService';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { parseLoginError, LoginDetailedFeedback } from './LoginPage';
import {
  verifyAdminPinWithFirestore,
  isAdminPinSessionVerified,
  setAdminPinSessionVerified,
  DEFAULT_ADMIN_PIN
} from '../utils/adminPinSecurity';

// Admin Sub-components
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebarDrawer, AdminTabType } from '../components/admin/AdminSidebarDrawer';
import { OverviewAnalyticsTab } from '../components/admin/OverviewAnalyticsTab';
import { PostManagementTab } from '../components/admin/PostManagementTab';
import { SponsoredManagementTab } from '../components/admin/SponsoredManagementTab';
import { SystemSettingsTab } from '../components/admin/SystemSettingsTab';
import { UserManagementTab } from '../components/admin/UserManagementTab';
import { AdminEditPostModal } from '../components/admin/AdminEditPostModal';
import { CreatePostPage } from './CreatePostPage';
import { CitizenAppPreviewModal } from '../components/admin/CitizenAppPreviewModal';
import { BroadcastAlertTab } from '../components/admin/BroadcastAlertTab';
import { PushNotificationTab } from '../components/admin/PushNotificationTab';
import { DirectoryManagementTab } from '../components/admin/DirectoryManagementTab';
import { AdminSchedulesTab } from '../components/admin/AdminSchedulesTab';
import { GrievanceDeskTab } from '../components/admin/GrievanceDeskTab';
import { BloodManagementTab } from '../components/admin/BloodManagementTab';
import { DataExportTab } from '../components/admin/DataExportTab';
import { SecretReportsTab } from '../components/admin/SecretReportsTab';
import { AnalyticsTab } from '../components/admin/AnalyticsTab';
import { SystemHealthTab } from '../components/admin/SystemHealthTab';
import { SupportHelplineTab } from '../components/admin/SupportHelplineTab';
import { SystemAuditLogTab } from '../components/admin/SystemAuditLogTab';
import { AdminSearchTab } from '../components/admin/AdminSearchTab';
import { VolunteerManagementTab } from '../components/admin/VolunteerManagementTab';
import { PaymentHistoryTab } from '../components/admin/PaymentHistoryTab';
import { AdminHomeBannerTab } from '../components/admin/AdminHomeBannerTab';

const ADMIN_SESSION_KEY = 'kushtia_connect_admin_session_unlocked';

interface AdminAppProps {
  onExitToCitizenApp?: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onExitToCitizenApp }) => {
  const { user, isAdmin, loginWithCredentials } = useAuth();

  // Authentication & Security Barrier: Unlocked if admin is logged in
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (isAdmin) return true;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  // Secondary Security Barrier: 6-Digit PIN stored & hashed in Firestore
  const [isPinVerified, setIsPinVerified] = useState<boolean>(() => isAdminPinSessionVerified());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const [adminRole, setAdminRole] = useState<'super_admin' | 'sub_admin'>(() => {
    return (sessionStorage.getItem('kushtia_connect_admin_role') as 'super_admin' | 'sub_admin') || 'super_admin';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFeedback, setLoginFeedback] = useState<LoginDetailedFeedback | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);
    setResetSuccess(null);
    const email = loginEmail.trim();
    try {
      await loginWithCredentials(email, loginPassword.trim());
      setIsUnlocked(true);
      setAdminRole('super_admin');
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      sessionStorage.setItem('kushtia_connect_admin_role', 'super_admin');
      
      // Chronological system audit log for successful admin login
      addActivityLog({
        type: 'login_attempt',
        title: 'অ্যাডমিন লগইন সফল',
        description: `অ্যাডমিন অ্যাকাউন্ট (${email}) সফলভাবে কানেক্টেড এবং প্যানেলে লগইন সম্পন্ন হয়েছে।`,
        actor: email
      });
    } catch (err: any) {
      const fb = parseLoginError(err, email);
      setLoginFeedback(fb);
      
      // Chronological system audit log for failed admin login
      addActivityLog({
        type: 'login_attempt',
        title: 'অ্যাডমিন লগইন ব্যর্থ',
        description: `অ্যাডমিন অ্যাকাউন্ট (${email}) দিয়ে প্যানেলে অননুমোদিত লগইনের চেষ্টা করা হয়েছে। কারণ: ${fb.title || 'পাসওয়ার্ড ভুল'} (${fb.message || 'ক্রিডেনশিয়াল সঠিক নয়'})`,
        actor: email || 'অজ্ঞাত ব্যক্তি'
      });
    }
  };

  const handlePinVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (!pinInput || pinInput.length !== 6 || !/^\d{6}$/.test(pinInput)) {
      setPinError('অনুগ্রহ করে সঠিক ৬-সংখ্যার পিন প্রদান করুন (যেমন: 123456)');
      return;
    }
    setIsVerifyingPin(true);
    try {
      const res = await verifyAdminPinWithFirestore(pinInput);
      if (res.success) {
        setIsPinVerified(true);
        setPinInput('');
        addActivityLog({
          type: 'login_attempt',
          title: 'এডমিন পিন ভেরিফিকেশন সফল',
          description: '৬-সংখ্যার সিকিউরিটি পিন ফায়ারস্টোর থেকে সফলভাবে যাচাই হয়েছে।',
          actor: user?.email || loginEmail || 'এডমিন'
        });
      } else {
        setPinError(res.error || 'ভুল পিন কোড! সঠিক ৬-সংখ্যার পিন দিন।');
      }
    } catch (err: any) {
      setPinError('পিন যাচাইকরণে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleAdminResetPassword = async () => {
    const targetEmail = loginEmail.trim() || import.meta.env.VITE_ADMIN_EMAIL;
    setIsResetting(true);
    setLoginFeedback(null);
    setResetSuccess(null);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setResetSuccess(`পাসওয়ার্ড রিসেট লিংক (${targetEmail}) ঠিকানায় পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার দেখুন।`);
    } catch (err: any) {
      setLoginFeedback(parseLoginError(err, targetEmail));
    } finally {
      setIsResetting(false);
    }
  };

  // Auto-redirect if not the specific admin user
  useEffect(() => {
    if (!isAdmin && onExitToCitizenApp) {
      const timer = setTimeout(() => {
        onExitToCitizenApp();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, onExitToCitizenApp]);

  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  // Core Data: Initialize with master posts cache for instant 0ms render
  const [posts, setPosts] = useState<PostItem[]>(() => postService.getMasterPosts());
  const [managedUsers, setManagedUsers] = useState<UserProfile[]>(() => getManagedUsers());
  const [campaigns, setCampaigns] = useState<ManagedSponsoredCampaign[]>(() => getAllSponsoredCampaigns());
  const [appTheme, setAppTheme] = useState<AppThemeConfig>(() => getAppThemeConfig());
  const [logs, setLogs] = useState<ActivityLog[]>(() => getActivityLogs());
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [lastPostDoc, setLastPostDoc] = useState<any>(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);

  // Separate Secret Crime Reports from Standard Posts
  const secretReports = posts.filter(p => p.category === 'crime-reporter');
  const pendingSecretReportsCount = secretReports.filter(p => p.status === 'pending').length;
  const standardPosts = posts.filter(p => p.category !== 'crime-reporter');

  // Modals
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCitizenPreviewOpen, setIsCitizenPreviewOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [crimeToast, setCrimeToast] = useState<{ title: string; description: string; id: string } | null>(null);

  // Global Admin Search Shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab(prev => prev === 'search' ? 'overview' : 'search');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchAdminPosts = async (pageSize = 300) => {
    try {
      const all = await postService.getAllPosts(pageSize);
      if (all && all.length > 0) {
        setPosts(all);
      } else {
        const master = postService.getMasterPosts();
        if (master && master.length > 0) {
          setPosts(master);
        }
      }
    } catch (err) {
      console.warn('Error loading posts in AdminApp:', err);
      const master = postService.getMasterPosts();
      if (master && master.length > 0) {
        setPosts(master);
      }
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleLoadMorePosts = async () => {
    if (!hasMorePosts || isLoadingMorePosts || !lastPostDoc) return;
    try {
      setIsLoadingMorePosts(true);
      const result = await postService.fetchPostsPaginated(50, lastPostDoc);
      if (result.posts && result.posts.length > 0) {
        setPosts(prev => {
          const map = new Map<string, PostItem>();
          prev.forEach(p => map.set(p.id, p));
          result.posts.forEach(p => map.set(p.id, p));
          return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        });
        setLastPostDoc(result.lastDoc);
        setHasMorePosts(result.hasMore);
      } else {
        setHasMorePosts(false);
      }
    } catch (err) {
      console.warn('Error loading more posts in AdminApp:', err);
    } finally {
      setIsLoadingMorePosts(false);
    }
  };

  // Load and Subscribe to Posts in Real-Time from postService
  useEffect(() => {
    let isInitial = true;
    const knownIds = new Set<string>();

    const unsubscribe = postService.subscribeToPosts((updatedPosts) => {
      if (!isInitial && updatedPosts && updatedPosts.length > 0) {
        const newCrime = updatedPosts.find(p => p.category === 'crime-reporter' && !knownIds.has(p.id));
        if (newCrime) {
          setCrimeToast({
            title: '🚨 নতুন জরুরি গোপন তথ্য ও ক্রাইম রিপোর্ট!',
            description: newCrime.title || 'একটি নতুন জরুরি ক্রাইম রিপোর্ট জমা হয়েছে।',
            id: newCrime.id
          });
          setTimeout(() => setCrimeToast(null), 9000);
        }
      }

      updatedPosts?.forEach(p => knownIds.add(p.id));
      isInitial = false;

      if (updatedPosts && updatedPosts.length > 0) {
        setPosts(updatedPosts);
      } else {
        const master = postService.getMasterPosts();
        if (master && master.length > 0) {
          setPosts(master);
        }
      }
      setIsLoadingPosts(false);
    }, 'all', 300);

    // Initial paginated fetch to capture initial cursor
    fetchAdminPosts(50);

    // Initial fetch of real managed users from Firestore to update summary metrics
    fetchManagedUsersFromFirestore().then(realUsers => {
      if (realUsers && realUsers.length > 0) {
        setManagedUsers(realUsers);
        pushUserMetricsSummaryToFirestore(realUsers, 'background_sync_listener').catch(() => {});
      }
    });

    const handleUsersUpdate = (e: any) => {
      const updated = e.detail || getManagedUsers();
      if (updated && updated.length > 0) {
        setManagedUsers(updated);
      }
    };
    window.addEventListener('kushtia-users-updated', handleUsersUpdate);

    // Listen to updates across the applet
    const handlePostUpdate = () => {
      postService.fetchPostsPaginated(50).then(res => {
        setPosts(res.posts || []);
        setLastPostDoc(res.lastDoc);
        setHasMorePosts(res.hasMore);
      });
    };
    window.addEventListener('kushtia-posts-updated', handlePostUpdate);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      window.removeEventListener('kushtia-users-updated', handleUsersUpdate);
      window.removeEventListener('kushtia-posts-updated', handlePostUpdate);
    };
  }, []);

  // Sync logs and campaigns on tab switch
  useEffect(() => {
    setLogs(getActivityLogs());
    setCampaigns(getAllSponsoredCampaigns());
  }, [activeTab]);

  // Handle Logout / Lock
  const handleLockAdmin = () => {
    setIsUnlocked(false);
    setIsPinVerified(false);
    setAdminPinSessionVerified(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setLoginPassword('');
    setPinInput('');
  };

  // 1. POST REMOVAL / DELETION FUNCTIONALITY
  const handleDeletePost = async (postId: string) => {
    try {
      const target = posts.find(p => p.id === postId);
      await postService.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));

      addActivityLog({
        type: 'post_deleted',
        title: 'পোস্ট মুছে ফেলা হয়েছে',
        description: `"${target?.title || postId}" বিজ্ঞাপনটি এডমিন প্যানেল থেকে সফলভাবে রিমুভ করা হয়েছে।`,
        actor: 'এডমিন'
      });
      setLogs(getActivityLogs());
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('পোস্ট ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  // 1.1. BULK / DATE-BASED POST REMOVAL
  const handleBulkDeletePosts = async (postIds: string[], reasonTitle?: string) => {
    if (!postIds || postIds.length === 0) return;
    try {
      await postService.deletePostsBatch(postIds);
      setPosts(prev => prev.filter(p => !postIds.includes(p.id)));

      addActivityLog({
        type: 'post_deleted',
        title: reasonTitle || 'বাল্ক পোস্ট ডিলিট সম্পন্ন',
        description: `একসাথে ${postIds.length}টি বিজ্ঞাপন এডমিন প্যানেল থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।`,
        actor: 'এডমিন'
      });
      setLogs(getActivityLogs());
    } catch (err) {
      console.error('Error bulk deleting posts:', err);
      alert('বাল্ক পোস্ট ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  // 2. TOGGLE POST VERIFICATION
  const handleToggleVerifyPost = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;
    const newStatus = !target.isVerified;

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isVerified: newStatus } : p));
    await postService.updatePost(postId, { isVerified: newStatus });

    addActivityLog({
      type: 'post_updated',
      title: `পোস্ট ভেরিফিকেশন ${newStatus ? 'অনুমোদিত' : 'প্রত্যাহার'}`,
      description: `"${target.title}" পোস্টে ভেরিফায়েড ব্যাজ ${newStatus ? 'যুক্ত' : 'বাদ'} হয়েছে।`,
      actor: 'এডমিন'
    });
    setLogs(getActivityLogs());
  };

  // 2.1. BULK TOGGLE POST VERIFICATION (BULK MODERATE)
  const handleBulkToggleVerifyPost = async (postIds: string[], targetVerifiedState?: boolean) => {
    if (!postIds || postIds.length === 0) return;

    setPosts(prev => prev.map(p => {
      if (postIds.includes(p.id)) {
        const nextStatus = targetVerifiedState !== undefined ? targetVerifiedState : !p.isVerified;
        return { ...p, isVerified: nextStatus };
      }
      return p;
    }));

    await Promise.all(
      postIds.map(id => {
        const target = posts.find(p => p.id === id);
        const nextStatus = targetVerifiedState !== undefined ? targetVerifiedState : !(target?.isVerified);
        return postService.updatePost(id, { isVerified: nextStatus });
      })
    );

    addActivityLog({
      type: 'post_updated',
      title: 'বাল্ক মডারেশন: ভেরিফিকেশন স্ট্যাটাস আপডেট',
      description: `একসাথে ${postIds.length}টি বিজ্ঞাপনের ভেরিফিকেশন স্ট্যাটাস ${
        targetVerifiedState === true
          ? 'অনুমোদিত/ভেরিফাইড'
          : targetVerifiedState === false
          ? 'প্রত্যাহার/আনভেরিফাইড'
          : 'পরিবর্তন'
      } করা হয়েছে।`,
      actor: 'এডমিন'
    });
    setLogs(getActivityLogs());
  };

  // 3. CREATE OR EDIT POST
  const handleSavePost = async (postData: Partial<PostItem>) => {
    if (editingPost) {
      // Update
      await postService.updatePost(editingPost.id, postData);
      setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...postData } : p));
      addActivityLog({
        type: 'post_updated',
        title: 'পোস্ট সম্পাদনা সম্পন্ন',
        description: `"${postData.title || editingPost.title}" এর বিবরণ আপডেট করা হয়েছে।`,
        actor: 'এডমিন'
      });
    } else {
      // Create New
      const newPost = await postService.createPost({
        title: postData.title || 'নতুন পোস্ট',
        category: (postData.category as PostItem['category']) || 'house-rent',
        description: postData.description || '',
        price: postData.price,
        location: postData.location || 'কুষ্টিয়া',
        contactPhone: postData.contactPhone || '01712000000',
        whatsapp: postData.whatsapp,
        imageUrl: postData.imageUrl,
        authorName: postData.authorName || 'এডমিন মডারেশন',
        isVerified: postData.isVerified ?? true
      });
      setPosts(prev => [newPost, ...prev]);
      addActivityLog({
        type: 'post_created',
        title: 'নতুন পোস্ট যুক্ত হয়েছে',
        description: `"${newPost.title}" সরাসরি এডমিন প্যানেল থেকে তৈরি করা হয়েছে।`,
        actor: 'এডমিন'
      });
    }
    setLogs(getActivityLogs());
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  // 4. THEME & SETTINGS UPDATE
  const handleUpdateTheme = (updated: Partial<AppThemeConfig>) => {
    const saved = saveAppThemeConfig(updated);
    setAppTheme(saved);
  };

  const handleThemePresetChange = (key: ThemeColorKey) => {
    const updated = applyThemePreset(key);
    setAppTheme(updated);
  };

  // NON-ADMIN PROTECTION BARRIER
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center max-w-sm w-full space-y-4">
          <p className="text-sm font-bold text-slate-300">এই পোর্টালে প্রবেশের অনুমতি নেই।</p>
          {onExitToCitizenApp && (
            <button
              onClick={onExitToCitizenApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              মূল অ্যাপে ফিরে যান
            </button>
          )}
        </div>
      </div>
    );
  }

  // LOCKED STATE: PIN LOGIN SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center space-y-2 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">আমার কুষ্টিয়া — অ্যাডমিন অ্যাপ</h2>
            <p className="text-xs text-slate-400">
              প্ল্যাটফর্ম পরিচালনা ও পোস্ট মডারেশন পোর্টালে প্রবেশ করতে সিকিউর এডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।
            </p>
          </div>

          {resetSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {loginFeedback && (
            <div className="p-4 bg-rose-950/80 border border-rose-800/80 rounded-2xl text-rose-200 text-xs space-y-2.5 animate-in shake">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginFeedback.title}</span>
                {loginFeedback.errorCode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-900/60 rounded text-rose-300 ml-auto">
                    {loginFeedback.errorCode}
                  </span>
                )}
              </div>
              
              <p className="text-rose-200 text-[11px] leading-relaxed">
                {loginFeedback.message}
              </p>

              {loginFeedback.checklist && loginFeedback.checklist.length > 0 && (
                <div className="bg-slate-900/80 rounded-xl p-2.5 border border-rose-900/40 space-y-1">
                  <span className="text-[10px] font-bold text-slate-300 block">সমাধানের টিপস:</span>
                  {loginFeedback.checklist.map((c, i) => (
                    <div key={i} className="text-[10px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-rose-900/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">পাসওয়ার্ড ভুলে গেছেন?</span>
                <button
                  type="button"
                  onClick={handleAdminResetPassword}
                  disabled={isResetting}
                  className="px-2.5 py-1 bg-rose-900/70 hover:bg-rose-800 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{isResetting ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleEmailLoginSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">ইমেইল ঠিকানা</label>
              <input
                type="email"
                required
                autoFocus
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={import.meta.env.VITE_ADMIN_EMAIL}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>এডমিন লগইন করুন</span>
            </button>

            {onExitToCitizenApp && (
              <button
                type="button"
                onClick={onExitToCitizenApp}
                className="w-full py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all border border-slate-700/60 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>← সিটিজেন অ্যাপে ফিরে যান</span>
              </button>
            )}
          </form>

          <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-slate-800/80">
            আমার কুষ্টিয়া অফিশিয়াল অ্যাডমিন সিস্টেম • ভার্সন ২.১
          </div>
        </div>
      </div>
    );
  }

  // LOCKED STATE: 6-DIGIT PIN VERIFICATION (FIRESTORE HASHED SECURITY BARRIER)
  if (!isPinVerified) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center space-y-2 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">৬-সংখ্যার এডমিন সিকিউরিটি পিন</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              অননুমোদিত প্রবেশ রোধে এবং সর্বোচ্চ নিরাপত্তার খাতিরে (ইমেইল/পাসওয়ার্ড ফাঁস হলেও) ফায়ারস্টোরে সংরক্ষিত ৬-সংখ্যার সিকিউরিটি পিন যাচাই করা আবশ্যক।
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-slate-400">লগইনকৃত অ্যাকাউন্ট:</span>
            <span className="font-mono text-emerald-400 font-bold truncate max-w-[200px]">
              {user?.email || loginEmail || import.meta.env.VITE_ADMIN_EMAIL}
            </span>
          </div>

          {pinError && (
            <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-2xl text-rose-200 text-xs font-semibold flex items-center gap-2 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handlePinVerifySubmit} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 text-center">
                গোপন ৬-সংখ্যার পিন প্রদান করুন
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPinInput(val);
                    if (pinError) setPinError(null);
                  }}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-white text-center text-xl font-mono tracking-[0.5em] font-black focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>
              <div className="text-[11px] text-slate-500 text-center mt-2">
                প্রাথমিক পিন: <span className="font-mono font-bold text-emerald-400">{DEFAULT_ADMIN_PIN}</span> (সেটিংস থেকে পরিবর্তনযোগ্য)
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingPin || pinInput.length !== 6}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifyingPin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ফায়ারস্টোর থেকে যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>পিন যাচাই করে প্যানেলে প্রবেশ করুন</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleLockAdmin}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[11px] font-bold transition-all border border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট করুন</span>
              </button>

              {onExitToCitizenApp && (
                <button
                  type="button"
                  onClick={onExitToCitizenApp}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl text-[11px] font-bold transition-all border border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>সিটিজেন অ্যাপ</span>
                </button>
              )}
            </div>
          </form>

          <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-slate-800/80">
            🔒 ফায়ারস্টোর এন্ড-টু-এন্ড হ্যাশড ভেরিফিকেশন দ্বারা সুরক্ষিত
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE: STANDALONE ADMIN APPLICATION
  return (
    <div className="min-h-screen bg-[#F4F6F4] text-slate-800 flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Header with Three-Line Menu Button & Global Search Bar */}
      <AdminHeader
        appTheme={appTheme}
        activeTab={activeTab}
        onToggleMenu={() => setIsSidebarOpen(true)}
        onOpenSearch={() => {
          setActiveTab('search');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAppPreview={() => setIsCitizenPreviewOpen(true)}
        onOpenSponsoredPictureUpload={() => {
          setActiveTab('sponsored');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSwitchToCitizenApp={onExitToCitizenApp}
      />

      {/* Main Container */}
      <div className="max-w-[1680px] w-full mx-auto p-3 sm:p-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* DESKTOP PERSISTENT CATEGORIZED SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[310px] shrink-0 bg-white border border-pink-200/80/80 rounded-[24px] p-5 space-y-5 sticky top-[77px] h-[calc(100vh-110px)] overflow-y-auto no-scrollbar shadow-xs">
          
          {/* Admin User Info Banner */}
          <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/60 border border-pink-200/80/80 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              SC
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 truncate">এডমিন প্যানেল</div>
              <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{adminRole === 'super_admin' ? 'মাস্টার এডমিন' : 'সাব-এডমিন'}</span>
              </div>
            </div>
          </div>

          {/* Categorized Menu */}
          <div className="flex-1 space-y-5">
            {/* Category: ড্যাশবোর্ড ও অ্যানালিটিক্স */}
            <div className="space-y-1">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2.5 pb-1">
                ড্যাশবোর্ড ও রিপোর্টস
              </div>
              
              {/* Overview */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>ওভারভিউ ও ড্যাশবোর্ড</span>
                </div>
              </button>

              {/* Global Search Page */}
              <button
                onClick={() => setActiveTab('search')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                  activeTab === 'search'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Search className={`w-4 h-4 ${activeTab === 'search' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>গ্লোবাল সার্চ ও এক্সপ্লোরার</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'search' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  Ctrl+K
                </span>
              </button>

              {/* Analytics */}
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>অ্যানালিটিক্স ও চার্ট</span>
                </div>
              </button>

              {/* System Health */}
              <button
                onClick={() => setActiveTab('system-health')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'system-health'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server className={`w-4 h-4 ${activeTab === 'system-health' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>সিস্টেম হেলথ ও সার্ভার</span>
                </div>
              </button>

              {/* Payment History */}
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'payment'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className={`w-4 h-4 ${activeTab === 'payment' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>পেমেন্ট ও ট্রানজেকশন হিস্ট্রি</span>
                </div>
              </button>
            </div>

            {/* Category: কোর মডারেশন */}
            <div className="space-y-1">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2.5 pb-1">
                মডারেশন ও আইন-শৃঙ্খলা
              </div>

              {/* Posts & Ads */}
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'posts'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${activeTab === 'posts' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>পোস্ট ও বিজ্ঞাপন মডারেশন</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'posts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-pink-200/80'}`}>
                  {standardPosts.length}
                </span>
              </button>

              {/* Secret Crime Reports */}
              <button
                onClick={() => setActiveTab('secret-reports')}
                className={`w-full p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${
                  activeTab === 'secret-reports'
                    ? 'bg-red-950 text-white shadow-xs border border-red-800'
                    : 'text-slate-700 hover:bg-red-50/60 hover:text-red-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className={`w-4 h-4 ${activeTab === 'secret-reports' ? 'text-red-400' : 'text-red-600 group-hover:text-red-700'}`} />
                  <span>গোপন তথ্য ও ক্রাইম ডেস্ক</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingSecretReportsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'secret-reports' ? 'bg-white/10 text-white' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    {secretReports.length}
                  </span>
                </div>
              </button>

              {/* Grievance Desk */}
              <button
                onClick={() => setActiveTab('grievance')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'grievance'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className={`w-4 h-4 ${activeTab === 'grievance' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>নাগরিক অভিযোগ ডেস্ক</span>
                </div>
              </button>
            </div>

            {/* Category: সিটিজেন ও লাইভ সার্ভিস */}
            <div className="space-y-1">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2.5 pb-1">
                সিটিজেন ও লাইভ সার্ভিস
              </div>

              {/* Sirens/Broadcast */}
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'broadcast'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Radio className={`w-4 h-4 ${activeTab === 'broadcast' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>জরুরি সাইরেন ব্রডকাস্ট</span>
                </div>
              </button>

              {/* Push Notification */}
              <button
                onClick={() => setActiveTab('push')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'push'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className={`w-4 h-4 ${activeTab === 'push' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>তাত্ক্ষণিক পুশ নোটিফিকেশন</span>
                </div>
              </button>

              {/* Blood Management */}
              <button
                onClick={() => setActiveTab('blood')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'blood'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Droplet className={`w-4 h-4 ${activeTab === 'blood' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>রক্তদাতা ও রক্তের ডাক</span>
                </div>
              </button>

              {/* Transport */}
              <button
                onClick={() => setActiveTab('transport')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'transport'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Train className={`w-4 h-4 ${activeTab === 'transport' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>যাতায়াত ও সময়সূচী (Schedules)</span>
                </div>
              </button>

              {/* Directory */}
              <button
                onClick={() => setActiveTab('directory')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'directory'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className={`w-4 h-4 ${activeTab === 'directory' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>ডাক্তার ও হেল্পলাইন ডিরেক্টরি</span>
                </div>
              </button>
            </div>

            {/* Category: বিপণন ও মেম্বারস */}
            <div className="space-y-1">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2.5 pb-1">
                বিজ্ঞাপন ও মেম্বারস
              </div>

              {/* Sponsored */}
              <button
                onClick={() => setActiveTab('sponsored')}
                className={`w-full p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${
                  activeTab === 'sponsored'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${activeTab === 'sponsored' ? 'text-slate-950' : 'text-amber-500'}`} />
                  <span>স্পন্সরড বিজ্ঞাপন ও ছবি</span>
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'sponsored' ? 'bg-slate-950/10 text-slate-950' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                  {campaigns.length}
                </span>
              </button>

              {/* Users */}
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'users'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>ইউজার ও নাগরিক মেম্বারস</span>
                </div>
              </button>
            </div>

            {/* Category: সিস্টেম ও সেটিংস */}
            <div className="space-y-1">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2.5 pb-1">
                সিস্টেম ও কনফিগারেশন
              </div>

              {/* Data Export */}
              <button
                onClick={() => setActiveTab('export')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'export'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Download className={`w-4 h-4 ${activeTab === 'export' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>ডেটা এক্সপোর্ট ও ব্যাকআপ</span>
                </div>
              </button>

              {/* Security */}
              <button
                onClick={() => setActiveTab('admins')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'admins'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className={`w-4 h-4 ${activeTab === 'admins' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>এডমিন অ্যাকাউন্ট ও সিকিউরিটি</span>
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                  <span>সিস্টেম সেটিংস ও থিম</span>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={onExitToCitizenApp}
            className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-colors border border-emerald-100 mb-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>ইউজার অ্যাপে ফিরে যান</span>
          </button>

          {/* Quick Exit */}
          <button
            onClick={handleLockAdmin}
            className="w-full p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-colors border border-rose-100"
          >
            <LogOut className="w-4 h-4" />
            <span>এডমিন প্যানেল লক করুন</span>
          </button>
        </aside>

        {/* Content Wrapper */}
        <div className="flex-1 min-w-0 space-y-4">
          
          {/* MOBILE QUICK SCROLL TABS BAR */}
          <div className="lg:hidden bg-white rounded-2xl p-2 border border-pink-200/80/80 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition-all shrink-0"
            >
              <Menu className="w-3.5 h-3.5 text-emerald-400" />
              <span>মেনু</span>
            </button>

            <button
              onClick={onExitToCitizenApp}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[11px] font-black flex items-center gap-1 border border-emerald-100 transition-all shrink-0"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ইউজার অ্যাপ</span>
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            {/* Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ওভারভিউ
            </button>

            {/* Global Search Tab */}
            <button
              onClick={() => {
                setActiveTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                activeTab === 'search' ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>সার্চ পেজ</span>
            </button>

            {/* Posts */}
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                activeTab === 'posts' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              মডারেশন ({standardPosts.length})
            </button>

            {/* Secret Crime Reports */}
            <button
              onClick={() => setActiveTab('secret-reports')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap ${
                activeTab === 'secret-reports' ? 'bg-red-950 text-white shadow-xs border border-red-900' : 'text-red-700 bg-red-50 hover:bg-red-100'
              }`}
            >
              ক্রাইম ডেস্ক ({secretReports.length})
            </button>

            {/* Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              অ্যানালিটিক্স
            </button>

            {/* Emergency Notice */}
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                activeTab === 'broadcast' ? 'bg-red-600 text-white shadow-xs' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              জরুরি সাইরেন
            </button>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-slate-500 bg-slate-50 border border-pink-200/80 hover:bg-slate-100 whitespace-nowrap shrink-0"
            >
              আরও দেখুন...
            </button>
          </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <OverviewAnalyticsTab
            posts={posts}
            campaigns={campaigns}
            logs={logs}
            users={managedUsers}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Dedicated Full-Page Global Search Page */}
        {activeTab === 'search' && (
          <AdminSearchTab
            posts={posts}
            users={managedUsers}
            campaigns={campaigns}
            logs={logs}
            onSelectTab={setActiveTab}
            onEditPost={(post) => {
              setEditingPost(post);
              setIsPostModalOpen(true);
            }}
            onBackToOverview={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'posts' && (
          <PostManagementTab
            posts={posts}
            onDeletePost={handleDeletePost}
            onBulkDeletePosts={handleBulkDeletePosts}
            onToggleVerify={handleToggleVerifyPost}
            onBulkToggleVerify={handleBulkToggleVerifyPost}
            onStartEdit={(post) => {
              setEditingPost(post);
              setIsPostModalOpen(true);
            }}
            onStartCreate={() => {
              setEditingPost(null);
              setIsPostModalOpen(true);
            }}
            onNavigateToSecretReports={() => setActiveTab('secret-reports')}
            onLoadMorePosts={handleLoadMorePosts}
            hasMorePosts={hasMorePosts}
            isLoadingMorePosts={isLoadingMorePosts}
          />
        )}

        {/* Dedicated Secret Reports & Crime Desk */}
        {activeTab === 'secret-reports' && (
          <SecretReportsTab
            posts={posts}
            onDeletePost={handleDeletePost}
            onRefreshPosts={fetchAdminPosts}
          />
        )}

        {/* Analytics & System Health Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsTab posts={posts} />
        )}

        {activeTab === 'system-health' && (
          <SystemHealthTab posts={posts} />
        )}

        {activeTab === 'broadcast' && (
          <BroadcastAlertTab 
            appTheme={appTheme}
            onUpdateTheme={handleUpdateTheme}
          />
        )}
        {activeTab === 'push' && (
          <PushNotificationTab />
        )}

        {activeTab === 'directory' && (
          <DirectoryManagementTab />
        )}

        {activeTab === 'transport' && (
          <AdminSchedulesTab />
        )}

        {activeTab === 'grievance' && (
          <GrievanceDeskTab />
        )}

        {activeTab === 'blood' && (
          <BloodManagementTab />
        )}

        {activeTab === 'payment' && (
          <PaymentHistoryTab />
        )}

        {activeTab === 'export' && (
          <DataExportTab posts={posts} />
        )}

        {activeTab === 'sponsored' && (
          <SponsoredManagementTab />
        )}

        {activeTab === 'home-banner' && (
          <AdminHomeBannerTab />
        )}

        {activeTab === 'settings' && (
          <SystemSettingsTab
            appTheme={appTheme}
            onUpdateTheme={handleUpdateTheme}
            onThemePresetChange={handleThemePresetChange}
            currentAdminRole={adminRole}
          />
        )}

        {activeTab === 'support' && (
          <SupportHelplineTab
            appTheme={appTheme}
            onUpdateTheme={handleUpdateTheme}
          />
        )}

        {activeTab === 'admins' && (
          <SystemSettingsTab
            appTheme={appTheme}
            onUpdateTheme={handleUpdateTheme}
            onThemePresetChange={handleThemePresetChange}
            currentAdminRole={adminRole}
            defaultSubTab="security"
          />
        )}

        {activeTab === 'users' && (
          <UserManagementTab />
        )}

        {activeTab === 'logs' && (
          <SystemAuditLogTab />
        )}

        {activeTab === 'volunteers' && (
          <VolunteerManagementTab />
        )}
      </div> {/* Closes Content Wrapper */}
    </div> {/* Closes Main Container */}

      {/* THREE-LINE DRAWER SIDEBAR MENU */}
      <AdminSidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCitizenPreview={() => setIsCitizenPreviewOpen(true)}
        onOpenCreatePost={() => {
          setEditingPost(null);
          setIsPostModalOpen(true);
        }}
        onOpenSponsoredPictureUpload={() => {
          setActiveTab('sponsored');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLockAdmin}
        postsCount={standardPosts.length}
        secretReportsCount={secretReports.length}
        pendingSecretReportsCount={pendingSecretReportsCount}
        sponsoredCount={campaigns.length}
        activeSponsoredCount={campaigns.filter(c => c.isActive).length}
        usersCount={14}
        appTheme={appTheme}
        onExitToCitizenApp={onExitToCitizenApp}
      />

      {/* MODAL: EDIT OR ADD POST */}
      {isPostModalOpen && !editingPost && (
        <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto">
          <CreatePostPage
            onBack={() => {
              setIsPostModalOpen(false);
            }}
            onSuccess={() => {
              setIsPostModalOpen(false);
              // Simply refetch the posts using postService
              postService.getAllPosts().then(data => {
                setPosts(data || []);
              }).catch(console.warn);
            }}
            appTheme={appTheme}
          />
        </div>
      )}

      {isPostModalOpen && editingPost && (
        <AdminEditPostModal
          post={editingPost}
          onClose={() => {
            setIsPostModalOpen(false);
            setEditingPost(null);
          }}
          onSave={handleSavePost}
          onApprove={async () => {
            if (editingPost) {
              await postService.updatePost(editingPost.id, { status: 'approved', approvedAt: Date.now(), approvedBy: 'Admin' });
              setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, status: 'approved' } : p));
              setIsPostModalOpen(false);
              setEditingPost(null);
            }
          }}
          onReject={async () => {
            if (editingPost) {
              await postService.updatePost(editingPost.id, { status: 'rejected' });
              setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, status: 'rejected' } : p));
              setIsPostModalOpen(false);
              setEditingPost(null);
            }
          }}
        />
      )}

      {/* MODAL: LIVE CITIZEN APP PREVIEW */}
      {isCitizenPreviewOpen && (
        <CitizenAppPreviewModal
          appTheme={appTheme}
          posts={posts}
          onClose={() => setIsCitizenPreviewOpen(false)}
        />
      )}

      {/* REAL-TIME CRIME REPORT TOAST ALERT */}
      {crimeToast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-red-950 text-white border-2 border-red-600 rounded-3xl p-4 shadow-2xl max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/50 animate-pulse">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">{crimeToast.title}</h4>
                <p className="text-[11px] text-red-200 mt-0.5 line-clamp-2">{crimeToast.description}</p>
              </div>
            </div>
            <button
              onClick={() => setCrimeToast(null)}
              className="text-red-300 hover:text-white p-1 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-red-900">
            <button
              onClick={() => {
                setActiveTab('secret-reports');
                setCrimeToast(null);
              }}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black transition-colors shadow-md"
            >
              গোপন তথ্য ও ক্রাইম ডেস্কে দেখুন →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
