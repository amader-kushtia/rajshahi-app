import React, { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThanaProvider } from './context/ThanaContext';
import { useAdminConfig } from './context/AdminConfigContext';
import { Header } from './components/Header';
import { GreetingBanner } from './components/GreetingBanner';
import { CitizenCard } from './components/CitizenCard';
import { CategoryGrid } from './components/CategoryGrid';
import { FoodHighlights } from './components/FoodHighlights';
import { BottomNavigation } from './components/BottomNavigation';
import { SearchModal } from './components/SearchModal';
import { BannerAds } from './components/BannerAds';
import { LiveWeatherWidget } from './components/LiveWeatherWidget';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SideDrawer } from './components/SideDrawer';
import { ShareAppModal } from './components/ShareAppModal';
import { EmergencyFlashBanner } from './components/EmergencyFlashBanner';
import { DemoNoticeModal } from './components/DemoNoticeModal';
import { AppWelcomePopupModal } from './components/AppWelcomePopupModal';
import { PremiumSplashScreen } from './components/PremiumSplashScreen';
import { PostReviewModal } from './components/PostReviewModal';
import { VolunteerJoinPopup } from './components/VolunteerJoinPopup';
import { KushtiaDashboard } from './components/KushtiaDashboard';
import { FooterSocialSection } from './components/FooterSocialSection';

// Lazy-loaded Dedicated Pages to drastically cut initial JS payload & boost PageSpeed Insights score
const PostDetailPage = lazy(() => import('./pages/PostDetailPage').then(m => ({ default: m.PostDetailPage })));
const HouseRentPage = lazy(() => import('./pages/HouseRentPage').then(m => ({ default: m.HouseRentPage })));
const BuySellPage = lazy(() => import('./pages/BuySellPage').then(m => ({ default: m.BuySellPage })));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage').then(m => ({ default: m.DoctorsPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TransportPage = lazy(() => import('./pages/TransportPage').then(m => ({ default: m.TransportPage })));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage').then(m => ({ default: m.EmergencyPage })));
const CrimeReporterPage = lazy(() => import('./pages/CrimeReporterPage').then(m => ({ default: m.CrimeReporterPage })));
const CategoriesOverviewPage = lazy(() => import('./pages/CategoriesOverviewPage').then(m => ({ default: m.CategoriesOverviewPage })));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const NotificationSettingsPage = lazy(() => import('./pages/NotificationSettingsPage').then(m => ({ default: m.NotificationSettingsPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const SavedPostsPage = lazy(() => import('./pages/SavedPostsPage').then(m => ({ default: m.SavedPostsPage })));
const DeveloperAdminPage = lazy(() => import('./pages/DeveloperAdminPage').then(m => ({ default: m.DeveloperAdminPage })));
const HelpSupportPage = lazy(() => import('./pages/HelpSupportPage').then(m => ({ default: m.HelpSupportPage })));
const TermsPrivacyPage = lazy(() => import('./pages/TermsPrivacyPage').then(m => ({ default: m.TermsPrivacyPage })));
const SponsoredDetailsPage = lazy(() => import('./pages/SponsoredDetailsPage').then(m => ({ default: m.SponsoredDetailsPage })));
const BloodBankPage = lazy(() => import('./pages/BloodBankPage').then(m => ({ default: m.BloodBankPage })));
const JobsPage = lazy(() => import('./pages/JobsPage').then(m => ({ default: m.JobsPage })));
const LostFoundPage = lazy(() => import('./pages/LostFoundPage').then(m => ({ default: m.LostFoundPage })));
const FoodPage = lazy(() => import('./pages/FoodPage').then(m => ({ default: m.FoodPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then(m => ({ default: m.EventsPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const VolunteersPage = lazy(() => import('./pages/VolunteersPage').then(m => ({ default: m.VolunteersPage })));
const AdminApp = lazy(() => import('./pages/AdminApp').then(m => ({ default: m.AdminApp })));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage').then(m => ({ default: m.CreatePostPage })));
const TourismPage = lazy(() => import('./pages/TourismPage').then(m => ({ default: m.TourismPage })));
const AddBalancePage = lazy(() => import('./pages/AddBalancePage').then(m => ({ default: m.AddBalancePage })));
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage').then(m => ({ default: m.PlaceDetailPage })));
const UpazilaDetailPage = lazy(() => import('./pages/UpazilaDetailPage').then(m => ({ default: m.UpazilaDetailPage })));

import { CategoryType, PostItem, AppThemeConfig } from './types';
import { subscribeToPosts, fetchPostsPaginated, postService, DEFAULT_PAGE_SIZE } from './services/postService';
import { getAppThemeConfig } from './services/adminService';
import { registerServiceWorker, listenForEmergencyBroadcasts } from './utils/pushNotification';
import { INITIAL_POSTS } from './data/initialData';
import { db } from './firebase';
import { collection, getCountFromServer, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Loader2,
  MapPin, 
  CheckCircle2, 
  Phone, 
  ShieldCheck,
  Building,
  TrendingUp,
  Tag,
  Clock,
  Flame,
  Heart,
  Eye,
  Bookmark,
  Users,
  HelpCircle,
  ArrowRight,
  AlertTriangle,
  Lock,
  Share2,
  Ban,
  MessageCircle,
  ShieldAlert
} from 'lucide-react';

const getTimeAgo = (timestamp: number) => {
  const diffMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
  if (diffMinutes < 60) return `${Math.max(1, diffMinutes)} মি. আগে`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} দিন আগে`;
};

function FeedPostCard({
  item,
  handlePostCardClick,
}: {
  item: PostItem;
  handlePostCardClick: (item: PostItem) => void;
  savedPostIds: string[]; // Keep for compatibility but unused
  handleToggleSavePost: (postId: string) => void; // Keep for compatibility but unused
}) {
  return (
    <div
      onClick={() => handlePostCardClick(item)}
      className="mb-6 rounded-none sm:rounded-2xl bg-white shadow-sm border border-pink-200/80 cursor-pointer overflow-hidden transition-transform active:scale-[0.99]"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-400 border border-pink-200/80">
          {item.authorName?.[0] || 'U'}
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">{item.authorName || 'নাম নেই'}</h4>
          <p className="text-sm text-slate-500">{getTimeAgo(item.createdAt || Date.now())}</p>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-4 text-base text-slate-800">
        <h4 className="font-bold text-lg mb-2">{item.title}</h4>
        <p className="whitespace-pre-wrap">{item.description}</p>
      </div>

      {/* Large Image */}
      {item.imageUrl && (
        <div className="w-full bg-slate-100">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full object-contain max-h-[500px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Location/Price */}
      <div className="p-4 bg-slate-50 border-t flex items-center justify-between text-sm text-slate-700 font-bold">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-pink-600" />
          <span>{item.location}</span>
        </div>
        {item.price && (
          <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
            {item.price}
          </span>
        )}
      </div>
    </div>
  );
}

function MainAppContent() {
  const { user, isAdmin, logOut } = useAuth();
  const { themeConfig } = useAdminConfig();
  const disabledFeatures = themeConfig.disabledFeatures || [];
  const [isAdminApp, setIsAdminApp] = useState<boolean>(false);
  const [adminWarning, setAdminWarning] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('home');
  const [posts, setPosts] = useState<PostItem[]>(() => postService.getMasterPosts());
  const [appConfig, setAppConfig] = useState<AppThemeConfig>(() => themeConfig || getAppThemeConfig());
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('kushtia_saved_posts') || '[]');
    } catch {
      return [];
    }
  });

  const [feedSort, setFeedSort] = useState<'newest' | 'popular'>('newest');
  const [postModalCategory, setPostModalCategory] = useState<CategoryType>('house-rent');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareAppModalOpen, setIsShareAppModalOpen] = useState(false);

  // Selected post state for dedicated full page view
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostItem | null>(null);
  const [previousCategory, setPreviousCategory] = useState<CategoryType>('home');
  const [selectedPostForReview, setSelectedPostForReview] = useState<PostItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Selected Place and Upazila states for dedicated full page view
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('puthia-rajbari');
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<string | null>('puthia');

  // Navigation History Stack & Scroll Position Restoration System (Like Facebook/Native Apps)
  interface HistoryEntry {
    category: CategoryType;
    scrollY: number;
    selectedPostForDetail?: PostItem | null;
    selectedPlaceId?: string | null;
    selectedUpazilaId?: string | null;
  }

  const historyStackRef = useRef<HistoryEntry[]>([]);
  const scrollMapRef = useRef<Record<string, number>>({});
  const ignoreNextPopstateRef = useRef(false);

  const restoreScrollPosition = (targetY: number) => {
    window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      }, 30);
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      }, 100);
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      }, 250);
    });
  };

  const popAndRestore = useCallback(() => {
    if (historyStackRef.current.length > 0) {
      const prevEntry = historyStackRef.current.pop()!;
      setCurrentCategory(prevEntry.category);
      if (prevEntry.selectedPostForDetail !== undefined) {
        setSelectedPostForDetail(prevEntry.selectedPostForDetail);
      }
      if (prevEntry.selectedPlaceId !== undefined) {
        setSelectedPlaceId(prevEntry.selectedPlaceId);
      }
      if (prevEntry.selectedUpazilaId !== undefined) {
        setSelectedUpazilaId(prevEntry.selectedUpazilaId);
      }
      restoreScrollPosition(prevEntry.scrollY);
    } else {
      setCurrentCategory('home');
      const savedHomeScroll = scrollMapRef.current['home'] || 0;
      restoreScrollPosition(savedHomeScroll);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (isDrawerOpen) { setIsDrawerOpen(false); return; }
    if (isSearchModalOpen) { setIsSearchModalOpen(false); return; }
    if (isShareAppModalOpen) { setIsShareAppModalOpen(false); return; }
    if (isReviewModalOpen) { setIsReviewModalOpen(false); return; }

    popAndRestore();

    try {
      if (window.history.state && window.history.state.isAppNavigation) {
        ignoreNextPopstateRef.current = true;
        window.history.back();
      }
    } catch {
      // ignore
    }
  }, [isDrawerOpen, isSearchModalOpen, isShareAppModalOpen, isReviewModalOpen, popAndRestore]);

  useEffect(() => {
    try {
      window.history.replaceState({ isAppNavigation: true, category: 'home' }, '');
    } catch {
      // ignore
    }

    const handlePopState = () => {
      if (ignoreNextPopstateRef.current) {
        ignoreNextPopstateRef.current = false;
        return;
      }
      popAndRestore();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [popAndRestore]);

  const handleNavigate = useCallback((category: CategoryType) => {
    if (disabledFeatures.includes(category)) {
      setCurrentCategory('home');
      return;
    }
    if (category === 'admin-panel') {
      if (!isAdmin) {
        setIsAdminApp(false);
        setCurrentCategory('home');
        setAdminWarning('আপনার এই পেইজে (অ্যাডমিন কন্ট্রোল প্যানেল) প্রবেশ করার অনুমতি নেই! শুধুমাত্র অনুমোদিত অ্যাডমিনরা এটি ব্যবহার করতে পারবেন।');
        return;
      }
      setIsAdminApp(true);
      return;
    }
    if (category === 'share-app') {
      setIsShareAppModalOpen(true);
      return;
    }

    // If tapping home while already on home, scroll to top like Facebook
    if (category === 'home' && currentCategory === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Save current scroll position before navigating
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    scrollMapRef.current[currentCategory] = currentScroll;

    // Push previous screen to history stack
    historyStackRef.current.push({
      category: currentCategory,
      scrollY: currentScroll,
      selectedPostForDetail,
      selectedPlaceId,
      selectedUpazilaId,
    });

    try {
      window.history.pushState({ isAppNavigation: true, category }, '');
    } catch {
      // ignore
    }

    setPreviousCategory(currentCategory);
    setCurrentCategory(category);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentCategory, disabledFeatures, isAdmin, selectedPostForDetail, selectedPlaceId, selectedUpazilaId]);

  const handleSelectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
    handleNavigate('place-detail');
  };

  const handleSelectUpazila = (upazilaId: string) => {
    setSelectedUpazilaId(upazilaId);
    handleNavigate('upazila-detail');
  };

  const handlePostCardClick = async (item: PostItem) => {
    await postService.incrementPostViews(item.id);
    setPosts(postService.getMasterPosts());
    setSelectedPostForDetail(item);
    handleNavigate('post-detail');
  };

  const handleOpenCreatePost = (category: CategoryType = 'house-rent') => {
    setPostModalCategory(category);
    handleNavigate('create-post');
  };

  // Real-time synchronization of appConfig and document title whenever themeConfig updates
  useEffect(() => {
    const handleNavigateToPage = (e: any) => {
      const category = e.detail;
      handleNavigate(category);
    };
    window.addEventListener('navigate-to-page', handleNavigateToPage);
    
    if (themeConfig) {
      setAppConfig(themeConfig);
      if (themeConfig.appName) {
        document.title = `${themeConfig.appName} — ${themeConfig.tagline || 'ডিজিটাল সিটিজেন পোর্টাল'}`;
      }
    }
    
    return () => window.removeEventListener('navigate-to-page', handleNavigateToPage);
  }, [themeConfig, handleNavigate]);

  // Real Member Count state
  const [realMemberCount, setRealMemberCount] = useState<number>(145);
  useEffect(() => {
    getCountFromServer(collection(db, 'users')).then(snap => {
      setRealMemberCount(Math.max(snap.data().count, 145));
    }).catch(() => {
      const uniqueAuthors = new Set(posts.map(p => p.authorId).filter(Boolean));
      setRealMemberCount(Math.max(uniqueAuthors.size + 120, 145));
    });
  }, [posts]);

  // Infinite Scroll Pagination State with 20 items batch size
  const [lastDocCursor, setLastDocCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  // Open Admin App via URL hash only if user is the authorized admin
  useEffect(() => {
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      if (isAdmin) {
        setIsAdminApp(true);
      } else {
        setIsAdminApp(false);
        setCurrentCategory('home');
        setAdminWarning('আপনার এই পেইজে (অ্যাডমিন কন্ট্রোল প্যানেল) প্রবেশ করার অনুমতি নেই! শুধুমাত্র অনুমোদিত অ্যাডমিনরা এটি ব্যবহার করতে পারবেন।');
        if (window.location.hash.includes('admin') || window.location.search.includes('admin')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }, [isAdmin]);

  // Strict enforcement: if non-admin user lands on admin app state, redirect to home immediately
  useEffect(() => {
    if ((isAdminApp || currentCategory === 'admin-panel') && !isAdmin) {
      setIsAdminApp(false);
      setCurrentCategory('home');
      setAdminWarning('আপনার এই পেইজে (অ্যাডমিন কন্ট্রোল প্যানেল) প্রবেশ করার অনুমতি নেই! শুধুমাত্র অনুমোদিত অ্যাডমিনরা এটি ব্যবহার করতে পারবেন।');
    }
  }, [isAdmin, isAdminApp, currentCategory]);

  const handleToggleSavePost = (postId: string) => {
    setSavedPostIds(prev => {
      const updated = prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId];
      try {
        localStorage.setItem('kushtia_saved_posts', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  // Subscribe to real-time posts from Master Repository & Cloud Firestore
  useEffect(() => {
    const handleRequireAuth = () => handleNavigate('login');
    const handleRequireAuthClose = () => {
      if (currentCategory === 'login' || currentCategory === 'register') {
        handleNavigate('home');
      }
    };

    const handlePostsUpdated = () => {
      setPosts(postService.getMasterPosts());
    };
    const handleConfigUpdated = () => {
      setAppConfig(getAppThemeConfig());
    };

    window.addEventListener('require-auth', handleRequireAuth);
    window.addEventListener('require-auth-close', handleRequireAuthClose);
    window.addEventListener('kushtia-posts-updated', handlePostsUpdated);
    window.addEventListener('kushtia-posts-updated', handlePostsUpdated);
    window.addEventListener('kushtia-app-config-updated', handleConfigUpdated);
    window.addEventListener('kushtia-app-config-updated', handleConfigUpdated);
    window.addEventListener('storage', handlePostsUpdated);
    window.addEventListener('storage', handleConfigUpdated);

    const unsubscribe = subscribeToPosts((updatedPosts) => {
      setPosts(updatedPosts);
    });

    return () => {
      window.removeEventListener('require-auth', handleRequireAuth);
      window.removeEventListener('require-auth-close', handleRequireAuthClose);
      window.removeEventListener('kushtia-posts-updated', handlePostsUpdated);
      window.removeEventListener('kushtia-posts-updated', handlePostsUpdated);
      window.removeEventListener('kushtia-app-config-updated', handleConfigUpdated);
      window.removeEventListener('kushtia-app-config-updated', handleConfigUpdated);
      window.removeEventListener('storage', handlePostsUpdated);
      window.removeEventListener('storage', handleConfigUpdated);
      unsubscribe();
    };
  }, [currentCategory]);

  // Initialize Background Service Worker & Listen for Real-Time Emergency Broadcasts (Blood, Flood, Electricity)
  useEffect(() => {
    registerServiceWorker().catch(() => {});
    const unsubscribeBroadcasts = listenForEmergencyBroadcasts((alert) => {
      // Emergency alert received with audio chime and vibration
      console.log('🚨 Incoming Kushtia Emergency Alert:', alert.title);
    });

    return () => {
      if (typeof unsubscribeBroadcasts === 'function') {
        unsubscribeBroadcasts();
      }
    };
  }, []);

  // Global Contact Link Protection & Demo Link Interception
  useEffect(() => {
    const handleGlobalContactClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      
      const DEMO_LINKS = [
        // Posts/General
        '01712345678', '01789112233', '01309876543', '01745678901', 
        '01823456789', '01712009988', '01711998811', '01722887766', 
        // Doctors
        '01715889900', '01733667788', '01911224466', '01744119933',
        // Blood Donors
        '01712445566', '01311223344', '01899887766', '01755667788', '01922334455',
        // Technicians
        '01720334455', '01735112233', '01744556677', '01819887766', 
        '01712998877', '01322114455', '01766554433',
        // Transport & Emergency (fake ones)
        '01777777800', '01711223344', '01789112244',
        // Funds/Donors
        '01700000000', '01822334455', '01933445566', '01644556677',
        // Social
        'facebook.com/kushtia'
      ];

      const isDemoLink = DEMO_LINKS.some(demo => href.includes(demo));

      if (isDemoLink) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('show-demo-notice'));
        return;
      }

      if (user) return; // Logged in users can contact directly

      const isContactLink = 
        href.startsWith('tel:') || 
        href.includes('wa.me') || 
        href.includes('whatsapp') || 
        href.includes('facebook.com') || 
        href.includes('m.me') || 
        href.includes('messenger');

      if (isContactLink) {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('require-auth'));
      }
    };

    document.addEventListener('click', handleGlobalContactClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalContactClick, true);
    };
  }, [user]);

  // Infinite scroll load more handler using startAfter cursor
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMorePosts) return;
    setIsLoadingMore(true);
    try {
      const categoryArg = (currentCategory === 'home' || currentCategory === 'categories') ? undefined : currentCategory;
      const result = await fetchPostsPaginated(DEFAULT_PAGE_SIZE, lastDocCursor, categoryArg);
      if (result.posts && result.posts.length > 0) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = result.posts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
        setLastDocCursor(result.lastDoc);
      }
      setHasMorePosts(result.hasMore);
    } catch (err) {
      console.error('Failed to load more posts via cursor pagination:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMorePosts, lastDocCursor, currentCategory]);

  // Setup IntersectionObserver for smooth infinite scrolling
  useEffect(() => {
    if (!hasMorePosts || isLoadingMore) return;
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '250px'
    });

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, hasMorePosts, isLoadingMore]);

  // Publicly visible approved posts (pending or unapproved posts are never public)
  const publicPosts = useMemo(() => {
    return posts.filter(p => p.status === 'approved' || (!p.status && !p.id.startsWith('post-')));
  }, [posts]);

  // Sort feed posts by date (newest) or popularity - strictly filtered to buy-sell and crime-reporter posts (excluding blood posts)
  const sortedFeedPosts = useMemo(() => {
    return [...publicPosts]
      .filter(p => !disabledFeatures.includes(p.category))
      .filter(p => p.category === 'buy-sell' || p.category === 'crime-reporter')
      .sort((a, b) => {
      if (feedSort === 'newest') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      // Popularity score based on engagement (likes, views, featured, verified status)
      const aScore = (a.likes || 0) * 3 + (a.views || 0) + (a.featured ? 150 : 0) + (a.isVerified ? 30 : 0);
      const bScore = (b.likes || 0) * 3 + (b.views || 0) + (b.featured ? 150 : 0) + (b.isVerified ? 30 : 0);
      if (bScore !== aScore) {
        return bScore - aScore;
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [publicPosts, disabledFeatures, feedSort]);





  // STANDALONE ADMIN APP INTERFACE
  if ((isAdminApp || currentCategory === 'admin-panel') && isAdmin) {
    return (
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 animate-pulse flex items-center justify-center text-pink-400">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-300 animate-pulse">অ্যাডমিন কন্ট্রোল প্যানেল লোড হচ্ছে...</p>
          </div>
        }>
          <AdminApp 
            onExitToCitizenApp={() => {
              setIsAdminApp(false);
              setCurrentCategory('home');
              setPosts(postService.getMasterPosts());
              const latestConfig = getAppThemeConfig();
              setAppConfig(latestConfig);
              if (latestConfig.appName) {
                document.title = `${latestConfig.appName} — ${latestConfig.tagline || 'ডিজিটাল সিটিজেন পোর্টাল'}`;
              }
              if (window.location.hash.includes('admin') || window.location.search.includes('admin')) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }} 
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className={`min-h-screen ${currentCategory === 'home' ? 'bg-[#F4F7FC]' : 'bg-[#F3F5F3]'} text-slate-800 pb-24 font-['Hind_Siliguri',sans-serif] transition-colors w-full overflow-x-hidden`}>
        {/* Warning Modal for Non-Admin Access Attempts */}
        {adminWarning && (
          <div className="fixed inset-0 z-[3000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-rose-100 flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 border border-rose-200 shadow-inner">
                <ShieldAlert className="w-7 h-7 animate-bounce" />
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1.5">
                অ্যাক্সেস সংরক্ষিত (Access Restricted)
              </h3>
              
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6 bg-rose-50/80 p-3.5 rounded-2xl border border-rose-100">
                {adminWarning}
              </p>

              <button
                type="button"
                onClick={() => setAdminWarning(null)}
                className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                ঠিক আছে, হোম পেজে ফিরে যান
              </button>
            </div>
          </div>
        )}

        {/* Sticky App Header - displayed on interior pages */}
        {currentCategory !== 'home' && (
          <Header
            currentCategory={currentCategory}
            onNavigate={handleNavigate}
            onSearchClick={() => handleNavigate('search')}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            appConfig={appConfig}
            onBack={handleBack}
          />
        )}

        <SideDrawer 
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={handleNavigate}
          onOpenShareApp={() => setIsShareAppModalOpen(true)}
        />
        
        <ShareAppModal 
          isOpen={isShareAppModalOpen}
          onClose={() => setIsShareAppModalOpen(false)}
        />

        {/* Global Offline Indicator */}
        <OfflineIndicator />

        {/* PWA Install Button (shows if installable) */}
        <PWAInstallButton />

        {/* Main Content Area: Constrained to mobile-first container */}
        <main className={`w-full max-w-2xl mx-auto ${currentCategory === 'home' ? 'px-0 pt-0' : 'px-0 sm:px-1 pt-1'} overflow-x-hidden`}>
          {/* 0. FULL POST DETAIL VIEW */}
          {currentCategory === 'post-detail' && selectedPostForDetail && (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-pink-700" />
                <p className="text-xs font-bold text-slate-500">পোস্ট বিবরণ লোড হচ্ছে...</p>
              </div>
            }>
              <PostDetailPage
                post={selectedPostForDetail}
                user={user}
                savedPostIds={savedPostIds}
                onBack={() => handleNavigate(previousCategory || 'home')}
                onToggleSavePost={handleToggleSavePost}
                onOpenReviewModal={(p) => {
                  setSelectedPostForReview(p);
                  setIsReviewModalOpen(true);
                }}
                onNavigateCategory={handleNavigate}
              />
            </Suspense>
          )}

          {/* 1. HOME VIEW */}
          {currentCategory === 'home' && (
            <KushtiaDashboard 
              onNavigate={handleNavigate} 
              onOpenSearch={() => handleNavigate('search')} 
              onOpenDrawer={() => setIsDrawerOpen(true)} 
              onSelectPlace={handleSelectPlace}
              onSelectUpazila={handleSelectUpazila}
              onPostClick={handlePostCardClick}
              onOpenCreatePost={handleOpenCreatePost}
              currentUser={user}
            />
          )}

          {/* 2. ISOLATED DEDICATED PAGES */}
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-600/15 border border-pink-500/30 animate-pulse flex items-center justify-center text-pink-700">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <p className="text-xs font-bold text-slate-500 animate-pulse">অনুগাতভাবে লোড হচ্ছে...</p>
              </div>
            }>
            {currentCategory === 'house-rent' && (
              <HouseRentPage
                posts={publicPosts}
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('house-rent')}
              />
            )}

            {currentCategory === 'add-balance' && (
              <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-emerald-600" /></div>}>
                <AddBalancePage
                  currentUser={user}
                  onBack={() => handleNavigate('home')}
                  onOpenAuth={() => handleNavigate('login')}
                />
              </Suspense>
            )}

            {(currentCategory === 'buy-sell' || (currentCategory as string) === 'shopping') && (
              <BuySellPage
                posts={publicPosts}
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('buy-sell')}
              />
            )}

            {(currentCategory === 'doctor' || (currentCategory as string) === 'hospital') && (
              <DoctorsPage
                initialTab="doctors"
                onBack={() => handleNavigate('home')}
              />
            )}

            {(currentCategory === 'blood' || currentCategory === 'blood-request') && (
              <BloodBankPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('blood')}
              />
            )}

            {currentCategory === 'jobs' && (
              <JobsPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('jobs')}
              />
            )}

            {currentCategory === 'lost-found' && (
              <LostFoundPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('lost-found')}
              />
            )}

            {currentCategory === 'food' && (
              <FoodPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('food')}
              />
            )}

            {currentCategory === 'legal' && (
              <LegalPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('legal')}
              />
            )}

            {currentCategory === 'events' && (
              <EventsPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={() => handleOpenCreatePost('events')}
              />
            )}

            {(
              [
                'services',
                'mason',
                'mobile-maker',
                'electrician',
                'plumber',
                'ac-mechanic',
                'vet',
                'tutor',
                'driver',
                'police',
                'fire-service',
                'bank-atm',
                'mobile-banking',
                'courier',
                'computer-print',
                'freelancing',
                'car-repair',
                'school-college',
                'car-rental',
                'agriculture',
                'fisheries',
                'hotel',
                'grocery',
                'vegetables',
                'beauty-parlor',
                'laundry',
                'furniture',
                'hardware',
                'internet',
                'eye-care',
                'dental-care',
                'fitness',
                'sports',
                'business-directory',
                'govt-office',
                'birth-death',
                'nid-voter',
                'land-office',
                'municipality',
                'passport-visa',
                'citizen-fund',
                'tourist-spot',
                'bus-train'
              ].includes(currentCategory as string)
            ) && (
              <ServicesPage
                onBack={() => handleNavigate('home')}
                onOpenCreatePost={(target) => handleOpenCreatePost(typeof target === 'string' ? (target as CategoryType) : 'services')}
                onNavigate={handleNavigate}
                initialServiceId={currentCategory !== 'services' ? currentCategory : undefined}
                initialProfession={
                  currentCategory === 'mason' ? 'রাজমিস্ত্রি' :
                  currentCategory === 'mobile-maker' ? 'মোবাইল মেকার' :
                  currentCategory === 'electrician' ? 'ইলেকট্রিশিয়ান' :
                  currentCategory === 'plumber' ? 'প্লাম্বার' :
                  currentCategory === 'ac-mechanic' ? 'এসি/ফ্রিজ' :
                  currentCategory === 'vet' ? 'পশু চিকিৎসক' :
                  currentCategory === 'tutor' ? 'গৃহশিক্ষিকা' :
                  currentCategory === 'driver' ? 'ড্রাইভার' :
                  undefined
                }
              />
            )}

            {currentCategory === 'transport' && (
              <TransportPage onBack={() => handleNavigate('home')} />
            )}

            {currentCategory === 'emergency' && (
              <EmergencyPage onBack={() => handleNavigate('home')} />
            )}

            {(currentCategory === 'crime-reporter' || (currentCategory as string) === 'news' || (currentCategory as string) === 'local-news') && (
              <CrimeReporterPage
                posts={publicPosts}
                onBack={() => handleNavigate('home')}
                onOpenCreateReport={() => handleOpenCreatePost('crime-reporter')}
              />
            )}

            {currentCategory === 'categories' && (
              <CategoriesOverviewPage onSelectCategory={handleNavigate} />
            )}

            {currentCategory === 'profile' && (
              <UserProfilePage
                posts={posts}
                onNavigate={handleNavigate}
                onOpenCreatePost={() => handleOpenCreatePost('house-rent')}
              />
            )}
            
            {currentCategory === 'notifications' && (
              <NotificationsPage 
                onBack={() => handleNavigate('home')} 
                onNavigateToPost={(cat) => handleNavigate(cat as CategoryType)}
              />
            )}
            
            {currentCategory === 'notification-settings' && (
              <NotificationSettingsPage 
                onBack={() => handleNavigate('notifications')}
              />
            )}
            
            {currentCategory === 'search' && (
              <SearchPage
                onBack={() => handleNavigate('home')}
                posts={publicPosts}
                onSelectResult={(cat) => handleNavigate(cat as CategoryType)}
              />
            )}

            {currentCategory === 'volunteers' && (
              <VolunteersPage />
            )}

            {currentCategory === 'saved-posts' && (
              <SavedPostsPage
                posts={posts}
                savedPostIds={savedPostIds}
                onToggleSave={handleToggleSavePost}
                onBack={() => handleNavigate('home')}
                onNavigateToCategory={handleNavigate}
              />
            )}

            {currentCategory === 'developer' && (
              <DeveloperAdminPage 
                onBack={() => handleNavigate('home')} 
                onOpenAdminPanel={() => setIsAdminApp(true)}
              />
            )}

            {currentCategory === 'help-support' && (
              <HelpSupportPage
                onBack={() => handleNavigate('home')}
                onNavigateToEmergency={() => handleNavigate('emergency')}
              />
            )}

            {currentCategory === 'terms-privacy' && (
              <TermsPrivacyPage onBack={() => handleNavigate('home')} />
            )}

            {currentCategory === 'sponsored-details' && (
              <SponsoredDetailsPage onBack={() => handleNavigate('home')} />
            )}

            {currentCategory === 'create-post' && (
              <CreatePostPage
                initialCategory={postModalCategory}
                appTheme={appConfig}
                onBack={() => handleNavigate('home')}
                onSuccess={(targetCategory) => {
                  handleNavigate(targetCategory || 'home');
                }}
              />
            )}

            {currentCategory === 'login' && (
              <LoginPage 
                onBack={() => handleNavigate('home')}
                onNavigate={handleNavigate}
                onOpenAdminPanel={() => setIsAdminApp(true)}
              />
            )}
            
            {currentCategory === 'register' && (
              <RegisterPage 
                onBack={() => handleNavigate('home')}
                onNavigate={handleNavigate}
              />
            )}

            {currentCategory === 'tourism' && (
              <TourismPage
                onBack={() => handleNavigate('home')}
                onSelectPlace={handleSelectPlace}
                onSelectUpazila={handleSelectUpazila}
              />
            )}

            {currentCategory === 'place-detail' && selectedPlaceId && (
              <PlaceDetailPage
                placeId={selectedPlaceId}
                onBack={() => handleNavigate(previousCategory || 'tourism')}
                onSelectUpazila={handleSelectUpazila}
                onSelectNearbyPlace={handleSelectPlace}
              />
            )}

            {currentCategory === 'upazila-detail' && selectedUpazilaId && (
              <UpazilaDetailPage
                upazilaId={selectedUpazilaId}
                onBack={() => handleNavigate(previousCategory || 'tourism')}
                onSelectPlace={handleSelectPlace}
              />
            )}
          </Suspense>
        </ErrorBoundary>
          <FooterSocialSection />
        </main>

        {/* Discreet Floating Admin Quick Launcher - ONLY FOR AUTHENTICATED ADMIN */}
        {user && isAdmin && (
          <button
            id="floating-admin-launcher-btn"
            onClick={() => setIsAdminApp(true)}
            className="fixed bottom-20 left-4 z-40 bg-slate-900/90 hover:bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-lg border border-slate-700/70 backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 hover:border-pink-500/50 cursor-pointer"
            title="অ্যাডমিন প্যানেল"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[11px] hidden sm:inline">অ্যাডমিন প্যানেল</span>
          </button>
        )}

        {/* Bottom Navigation Tabs - Permanently visible on all citizen pages */}
        {(currentCategory as string) !== 'admin-panel' && (
          <BottomNavigation
            currentCategory={currentCategory}
            onNavigate={handleNavigate}
          />
        )}

        {/* Post Review Modal for Ratings & Reviews */}
        <PostReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          post={selectedPostForReview}
          user={user}
          onOpenAuthModal={() => handleNavigate('login')}
          onReviewSubmitted={() => {
            setPosts(postService.getMasterPosts());
          }}
        />

        <DemoNoticeModal />
        <AppWelcomePopupModal 
          appConfig={themeConfig}
          onNavigate={handleNavigate}
        />
        <VolunteerJoinPopup onNavigate={handleNavigate} />

        {/* Real-time Ban Overlay — Blocked citizens cannot access the app content */}
        {user && user.status && (user.status === 'blocked' || user.status === 'temporary_ban') && !isAdmin && (
          <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-300">
            <div className="w-full max-w-[320px] bg-white rounded-[2rem] p-6 text-center shadow-2xl border border-rose-100 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 relative">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center border-2 border-white">
                  <Lock className="w-3 h-3" />
                </div>
              </div>

              <h2 className="text-base font-black text-slate-900 mb-1">অ্যাকাউন্ট স্থগিত করা হয়েছে</h2>
              <div className="px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-widest mb-4">
                {user.status === 'blocked' ? 'স্থায়ীভাবে ব্লক' : 'সাময়িকভাবে ব্যান'}
              </div>

              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-5">
                {user.banReason || 'কমিউনিটি নির্দেশিকা লঙ্ঘনের কারণে আপনার এই অ্যাকাউন্টের অ্যাক্সেস স্থগিত করা হয়েছে।'}
              </p>

              {user.status === 'temporary_ban' && user.banExpiresAt && (
                <div className="w-full p-3 bg-amber-50 rounded-xl border border-amber-100 mb-5">
                  <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-[10px] mb-0.5">
                    <Clock className="w-3 h-3" />
                    <span>পুনরায় সক্রিয় হবে</span>
                  </div>
                  <div className="text-sm font-black text-amber-950">
                    {new Date(user.banExpiresAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}

              <div className="w-full space-y-2">
                <a
                  href={`https://wa.me/88${(themeConfig?.supportPhone || '01700000000').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-pink-700 hover:bg-pink-800 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-700/20 transition-all active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>সাপোর্ট টিমের সাথে কথা বলুন</span>
                </a>

                <button
                  onClick={() => logOut()}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
                >
                  লগ আউট করুন
                </button>
              </div>

              <p className="mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                আমার কুষ্টিয়া — ডিজিটাল নাগরিক নিরাপত্তা
              </p>
            </div>
          </div>
        )}
      </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <ErrorBoundary>
      <ThanaProvider>
        <AuthProvider>
          {showSplash ? (
            <PremiumSplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <MainAppContent />
          )}
        </AuthProvider>
      </ThanaProvider>
    </ErrorBoundary>
  );
}
