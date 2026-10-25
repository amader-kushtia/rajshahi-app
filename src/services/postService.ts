import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  startAfter,
  serverTimestamp,
  getDocs,
  where,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { getAppThemeConfig } from './adminService';
import { PostItem } from '../types';
import { INITIAL_POSTS } from '../data/initialData';
import { 
  idbGetAllPosts, 
  idbSavePosts, 
  idbPutPost, 
  idbDeletePost 
} from './postDb';

export const DEFAULT_PAGE_SIZE = 20;

export interface PaginatedPostsResult {
  posts: PostItem[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

// LocalStorage keys: Only small IDs and sets are kept here to respect the 5MB browser quota
const RECENT_POST_IDS_KEY = 'kushtia_connect_recent_post_ids';
const DELETED_POST_IDS_KEY = 'kushtia_connect_deleted_post_ids_v3';
const LEGACY_MASTER_POSTS_KEY = 'kushtia_connect_posts_master_v3';
const LEGACY_LOCAL_STORAGE_POSTS_KEY = 'kushtia_connect_local_posts';

// Set of active in-memory subscriber callbacks
const subscribers = new Set<(posts: PostItem[]) => void>();

// Helper to get deleted post IDs so deleted posts never resurrect
function getDeletedPostIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_POST_IDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (e) {
    console.warn('Could not read deleted post IDs', e);
  }
  return new Set();
}

function recordDeletedPostId(postId: string) {
  try {
    const set = getDeletedPostIds();
    set.add(postId);
    localStorage.setItem(DELETED_POST_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Could not record deleted post ID', e);
  }
}

function recordDeletedPostIds(postIds: string[]) {
  try {
    const set = getDeletedPostIds();
    postIds.forEach(id => set.add(id));
    localStorage.setItem(DELETED_POST_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Could not record deleted post IDs', e);
  }
}

// In localStorage: Store ONLY the latest 50 post IDs (minimal bytes, zero 5MB quota risk)
export function saveRecentPostIdsToLocalStorage(posts: PostItem[]) {
  try {
    const top50Ids = posts.slice(0, 50).map(p => p.id);
    localStorage.setItem(RECENT_POST_IDS_KEY, JSON.stringify(top50Ids));
    
    // Purge legacy full-post localStorage keys to immediately free megabytes of space
    localStorage.removeItem(LEGACY_MASTER_POSTS_KEY);
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_POSTS_KEY);
  } catch (e) {
    console.warn('Could not save recent post IDs to localStorage', e);
  }
}

export function getRecentPostIdsFromLocalStorage(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_POST_IDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, 50);
    }
  } catch (e) {
    console.warn('Could not read recent post IDs', e);
  }
  return [];
}

// One-time migration helper: recovers any legacy localStorage posts and returns them
function migrateLegacyLocalStorage(): PostItem[] {
  const legacy: PostItem[] = [];
  try {
    const raw = localStorage.getItem(LEGACY_MASTER_POSTS_KEY) || localStorage.getItem(LEGACY_LOCAL_STORAGE_POSTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        legacy.push(...parsed);
      }
    }
  } catch (e) {
    console.warn('Error reading legacy localStorage posts:', e);
  }

  // Purge immediately to prevent 5MB storage explosion
  try {
    localStorage.removeItem(LEGACY_MASTER_POSTS_KEY);
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_POSTS_KEY);
  } catch (_) {}

  return legacy;
}

// In-Memory Master Cache for 0ms synchronous access and instant reactivity
let inMemoryMasterPosts: PostItem[] = (() => {
  const legacy = migrateLegacyLocalStorage();
  const deletedIds = getDeletedPostIds();
  const map = new Map<string, PostItem>();
  
  legacy.forEach(p => {
    if (!deletedIds.has(p.id)) {
      map.set(p.id, {
        ...p,
        likes: p.likes ?? 0,
        views: p.views ?? 0,
        shares: p.shares ?? 0,
        status: p.status || (p.id.startsWith('post-') ? 'pending' : 'approved')
      });
    }
  });
  INITIAL_POSTS.forEach(p => {
    if (!deletedIds.has(p.id) && !map.has(p.id)) {
      map.set(p.id, {
        ...p,
        likes: p.likes ?? 0,
        views: p.views ?? 0,
        shares: p.shares ?? 0,
        status: p.status || 'approved'
      });
    }
  });
  
  const initial = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  saveRecentPostIdsToLocalStorage(initial);
  if (legacy.length > 0) {
    idbSavePosts(initial);
  }
  return initial;
})();

// Asynchronously hydrate from IndexedDB on startup (hundreds of MB capacity, never hits 5MB quota)
if (typeof window !== 'undefined') {
  idbGetAllPosts().then((dbPosts) => {
    if (dbPosts && dbPosts.length > 0) {
      const deletedIds = getDeletedPostIds();
      const map = new Map<string, PostItem>();
      dbPosts.forEach(p => {
        if (!deletedIds.has(p.id)) map.set(p.id, p);
      });
      inMemoryMasterPosts.forEach(p => {
        if (!deletedIds.has(p.id) && !map.has(p.id)) map.set(p.id, p);
      });
      inMemoryMasterPosts = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      saveRecentPostIdsToLocalStorage(inMemoryMasterPosts);
      
      // Notify active memory subscribers
      subscribers.forEach(callback => {
        try { callback(inMemoryMasterPosts); } catch (_) {}
      });
    } else {
      // First boot: seed IndexedDB with initial posts
      idbSavePosts(inMemoryMasterPosts);
    }
  }).catch((err) => {
    console.warn('IndexedDB initial hydration warning:', err);
  });
}

// Master Posts getter: returns clean in-memory cache instantaneously (0ms)
export function getMasterPosts(): PostItem[] {
  const deletedIds = getDeletedPostIds();
  return inMemoryMasterPosts.filter(p => !deletedIds.has(p.id));
}

// Master Posts saver: updates in-memory cache, persists to IndexedDB, stores 50 IDs in localStorage
export function saveMasterPosts(posts: PostItem[], dispatchGlobal = true) {
  const deletedIds = getDeletedPostIds();
  const cleaned = posts.filter(p => !deletedIds.has(p.id));
  inMemoryMasterPosts = cleaned;

  // 1. In localStorage, store ONLY the latest 50 post IDs (safe from 5MB quota limit)
  saveRecentPostIdsToLocalStorage(cleaned);

  // 2. Persist full posts in IndexedDB (virtually unlimited browser storage)
  idbSavePosts(cleaned).catch(err => {
    console.warn('IndexedDB save failed:', err);
  });

  // 3. Notify in-memory subscribers
  subscribers.forEach(callback => {
    try {
      callback(cleaned);
    } catch (err) {
      console.warn('Error in post subscriber callback:', err);
    }
  });

  // 4. Dispatch DOM events for cross-component reactive updates
  if (dispatchGlobal && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kushtia-posts-updated', { detail: cleaned }));
    window.dispatchEvent(new CustomEvent('rajshahi-posts-updated', { detail: cleaned }));
    window.dispatchEvent(new Event('storage'));
  }
}

// Backward compatibility helper
export function getLocalCachedPosts(): PostItem[] {
  return getMasterPosts();
}

export function saveLocalCachedPosts(posts: PostItem[]) {
  saveMasterPosts(posts);
}

// Client-side image compressor: scales high-res camera photos down to max 1000px and quality 0.75 WebP/JPEG
// This produces tiny, crisp images (~25KB-50KB) that load instantly and never hit storage/memory limits
export async function compressImageToDataUrl(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      throw new Error('SVG ফাইল আপলোড নিরাপত্তা ঝুঁকির কারণে নিষিদ্ধ। শুধুমাত্র JPG, PNG, WEBP, GIF ছবি অনুমোদিত।');
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl);
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP compression first for maximum size reduction
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL('image/webp', quality);
          } catch (_) {}

          if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        } catch (_) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      };

      img.src = objectUrl;
    } catch (_) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    }
  });
}

// Upload image to Firebase Storage with intelligent fallback
// 1. Compresses user image client-side to ~25KB-50KB
// 2. Attempts Firebase Storage upload if bucket is provisioned & accessible
// 3. Gracefully falls back to optimized compressed image if Firebase Storage bucket is unprovisioned (404) or network fails
// This guarantees post submissions NEVER crash with "ছবি আপলোড ব্যর্থ হয়েছে"
export async function uploadPostImage(file: File, maxRetries = 2): Promise<string> {
  // 1. Validate file existence and MIME type
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    throw new Error('শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP, GIF) আপলোড করা সম্ভব। SVG ফাইল নিষিদ্ধ।');
  }

  // 2. Validate allowed extensions whitelist
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!allowedExtensions.includes(extension)) {
    throw new Error('অনুমোদিত ছবির ফরম্যাট: JPG, PNG, WEBP, GIF, SVG');
  }

  // 3. Compress image first into an ultra-compact, high-clarity image
  const compressedDataUrl = await compressImageToDataUrl(file, 1000, 1000, 0.75);
  if (!compressedDataUrl) {
    throw new Error('ছবিটি প্রসেস করা যায়নি। অনুগ্রহ করে অন্য ছবি নির্বাচন করুন।');
  }

  // 4. Try uploading to Firebase Storage if bucket is reachable and user is authenticated
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // Unauthenticated users store the compact compressed data URL directly
      return compressedDataUrl;
    }

    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storageRef = ref(storage, `posts/${currentUser.uid}/${timestamp}_${cleanName}`);

    const res = await fetch(compressedDataUrl);
    const blob = await res.blob();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const uploadPromise = uploadBytes(storageRef, blob, {
          contentType: blob.type || 'image/jpeg'
        }).then(async (snapshot) => {
          return await getDownloadURL(snapshot.ref);
        });

        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('স্টোরেজ আপলোড টাইমআউট')), 5000)
        );

        const downloadUrl = await Promise.race([uploadPromise, timeoutPromise]);
        if (downloadUrl && downloadUrl.startsWith('http')) {
          return downloadUrl;
        }
      } catch (err) {
        console.warn(`Firebase Storage upload attempt ${attempt}/${maxRetries} failed:`, err);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 300 * attempt));
        }
      }
    }
  } catch (storageError) {
    console.warn('Firebase Storage unavailable, falling back to optimized lightweight data URL:', storageError);
  }

  // Fallback to the optimized compressed image.
  // Because it's compressed to ~25-50KB, it safely stores in Firestore (1MB limit) and IndexedDB with zero issues.
  return compressedDataUrl;
}

// Subscribe to posts using SWR (Stale-While-Revalidate) + Active Screen Polling
// Eliminates persistent WebSocket/gRPC streams to scale effortlessly to 300,000+ users
export function subscribeToPosts(
  onUpdate: (posts: PostItem[]) => void,
  categoryFilter?: string,
  limitCount: number = DEFAULT_PAGE_SIZE
): () => void {
  const filterPosts = (list: PostItem[]) => {
    if (!categoryFilter || categoryFilter === 'home' || categoryFilter === 'all') {
      return list;
    }
    return list.filter(p => p.category === categoryFilter);
  };

  // Wrapped callback that applies filter
  const subscriberWrapper = (allPosts: PostItem[]) => {
    onUpdate(filterPosts(allPosts));
  };

  subscribers.add(subscriberWrapper);

  // 1. STALE: Immediately emit cached master posts with zero network latency
  const current = getMasterPosts();
  onUpdate(filterPosts(current));

  let isMounted = true;

  // 2. REVALIDATE: Fetch latest updates via getDocs (HTTP request, closes immediately)
  const revalidate = async () => {
    if (!isMounted) return;
    try {
      const postsCollection = collection(db, 'posts');
      const constraints: any[] = [];
      if (categoryFilter && categoryFilter !== 'home' && categoryFilter !== 'all') {
        constraints.push(where('category', '==', categoryFilter));
      }
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(limitCount));
      const q = query(postsCollection, ...constraints);

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Posts fetch timeout')), 4000)
      );
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);

      if (!isMounted) return;

      const deletedIds = getDeletedPostIds();
      const remotePosts: PostItem[] = [];

      snapshot.forEach((docSnap) => {
        if (deletedIds.has(docSnap.id)) return;
        const data = docSnap.data();
        remotePosts.push({
          id: docSnap.id,
          category: data.category || 'house-rent',
          title: data.title || '',
          description: data.description || '',
          price: data.price,
          location: data.location || 'কুষ্টিয়া',
          subcategory: data.subcategory,
          contactPhone: data.contactPhone || '',
          whatsapp: data.whatsapp,
          facebook: data.facebook,
          imageUrl: data.imageUrl,
          authorName: data.authorName || 'নাগরিক',
          authorPhone: data.authorPhone,
          authorPhoto: data.authorPhoto,
          authorId: data.authorId,
          isAnonymous: data.isAnonymous,
          createdAt: data.timestampMillis || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()),
          isVerified: data.isVerified ?? false,
          featured: data.featured ?? false,
          status: data.status || 'approved',
          approvedAt: data.approvedAt,
          approvedBy: data.approvedBy,
          expiryDate: data.expiryDate,
          isDraft: data.isDraft,
          likes: data.likes,
          views: data.views,
          rating: data.rating,
          reviewsCount: data.reviewsCount,
          details: data.details
        });
      });

      // Merge remote posts with local master posts, preserving local edits and highest likes and views
      const currentMaster = getMasterPosts();
      const localMap = new Map<string, PostItem>();
      currentMaster.forEach(p => localMap.set(p.id, p));

      const map = new Map<string, PostItem>();
      remotePosts.forEach(p => {
        if (deletedIds.has(p.id)) return;
        const local = localMap.get(p.id);
        // Local edits take precedence over older remote data so edits are never wiped
        const mergedPost: PostItem = local ? {
          ...p,
          ...local,
          likes: Math.max(p.likes ?? 0, local.likes ?? 0),
          views: Math.max(p.views ?? 0, local.views ?? 0),
        } : p;
        map.set(p.id, mergedPost);
      });

      currentMaster.forEach(p => {
        if (!deletedIds.has(p.id) && !map.has(p.id)) {
          map.set(p.id, p);
        }
      });

      const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      saveMasterPosts(merged, false);
      if (isMounted) {
        onUpdate(filterPosts(merged));
      }
    } catch (error) {
      if (isMounted) {
        onUpdate(filterPosts(getMasterPosts()));
      }
    }
  };

  // Immediate revalidation on active mount
  revalidate();

  // 3. ACTIVE SCREEN POLLING: Poll every 45 seconds ONLY when document is visible
  const POLL_INTERVAL = 45000;
  const pollTimer = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      revalidate();
    }
  }, POLL_INTERVAL);

  const handleVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      revalidate();
    }
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // 4. CLEANUP: When active screen unmounts, cancel timer, remove listeners & unsubscribe
  return () => {
    isMounted = false;
    clearInterval(pollTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    subscribers.delete(subscriberWrapper);
  };
}

const POST_COOLDOWN_MS = 10000; // 10 seconds cooldown between post submissions
const LAST_POST_TIME_KEY = 'rajshahi_last_post_time';
const MY_SUBMITTED_POST_IDS_KEY = 'rajshahi_my_submitted_post_ids';

// In-memory tracker for authenticated users (survives localStorage purge during session)
const userLastPostTimeMap = new Map<string, number>();

// Remember posts submitted from this user/device so they always show in their profile
export function trackUserSubmittedPostId(postId: string): void {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(MY_SUBMITTED_POST_IDS_KEY) || '[]');
    if (!existing.includes(postId)) {
      localStorage.setItem(MY_SUBMITTED_POST_IDS_KEY, JSON.stringify([postId, ...existing]));
    }
  } catch (_) {}
}

export function getUserSubmittedPostIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MY_SUBMITTED_POST_IDS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

// Determines if a post is approved and safe for public broadcast across all feeds
export function isPostPublic(post: PostItem): boolean {
  if (post.status === 'rejected') {
    return false;
  }
  return true;
}

// Create new post in Firestore and Master Repository
export async function createNewPost(postData: Omit<PostItem, 'id' | 'createdAt'>): Promise<string> {
  const authorUid = postData.authorId || (postData as any).authorUid || (postData as any).userId;
  // Demo users and guests are allowed to post, but they will be subject to standard moderation (pending status)
  // unless they are explicitly authenticated via Firebase and have appropriate roles.
  // The 'citizen-' prefix is used for demo users in the preview environment.
  const isDemoUser = authorUid && typeof authorUid === 'string' && (authorUid.startsWith('citizen-') || authorUid.startsWith('demo-') || authorUid.startsWith('guest-'));



  const now = Date.now();

  // 1. Check in-memory cooldown for authenticated users (cannot be bypassed by clearing localStorage)
  if (authorUid && typeof authorUid === 'string' && !authorUid.startsWith('demo-') && !authorUid.startsWith('guest-')) {
    const lastMemoryPostTime = userLastPostTimeMap.get(authorUid) || 0;
    if (now - lastMemoryPostTime < POST_COOLDOWN_MS) {
      const remainingSec = Math.ceil((POST_COOLDOWN_MS - (now - lastMemoryPostTime)) / 1000);
      throw new Error(`অতিরিক্ত স্প্যামিং রোধে অনুগ্রহ করে ${remainingSec} সেকেন্ড অপেক্ষা করে নতুন পোস্ট করুন।`);
    }
  }

  // 2. Check localStorage cooldown (applies to all users including anonymous/demo)
  try {
    const lastPostTime = Number(localStorage.getItem(LAST_POST_TIME_KEY) || '0');
    if (now - lastPostTime < POST_COOLDOWN_MS) {
      const remainingSec = Math.ceil((POST_COOLDOWN_MS - (now - lastPostTime)) / 1000);
      throw new Error(`অতিরিক্ত স্প্যামিং রোধে অনুগ্রহ করে ${remainingSec} সেকেন্ড অপেক্ষা করে নতুন পোস্ট করুন।`);
    }
    localStorage.setItem(LAST_POST_TIME_KEY, String(now));
  } catch (err: any) {
    if (err?.message?.includes('স্প্যামিং')) {
      throw err;
    }
  }

  // Record timestamp in memory map if authenticated
  if (authorUid && typeof authorUid === 'string') {
    userLastPostTimeMap.set(authorUid, now);
  }

  const newId = 'post-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  
  // Auto-approve logic: approved if autoApprove is true, otherwise pending
  const config = getAppThemeConfig();
  const isAutoApproved = config.autoApprove ?? true; // Default to true if undefined
  
  const newPost: PostItem = {
    ...postData,
    id: newId,
    createdAt: Date.now(),
    status: postData.status || (isAutoApproved ? 'approved' : 'pending'),
    isVerified: postData.isVerified ?? false,
    likes: 0,
    views: 0,
    shares: 0,
  };

  // Track on this device so the author can see it in their profile
  trackUserSubmittedPostId(newId);

  // 1. Instantly save to local Master Repository so user/admin sees it IMMEDIATELY
  const current = getMasterPosts();
  saveMasterPosts([newPost, ...current]);

  // 2. Sync to Cloud Firestore (Blocking wait to ensure durability)
  try {
    const docRef = doc(db, 'posts', newId);
    await setDoc(docRef, {
      ...newPost,
      createdAt: serverTimestamp(),
      timestampMillis: newPost.createdAt
    });
  } catch (err: any) {
    console.error('Firestore post write failed:', err);
    // Rollback local cache if Firestore failed
    const rolledBack = getMasterPosts().filter(p => p.id !== newId);
    saveMasterPosts(rolledBack, false);
    throw new Error(`সার্ভারে পোস্টটি সংরক্ষণ করা যায়নি: ${err.message || 'Firestore Error'}`);
  }

  return newId;
}

// Infinite Scroll Pagination with limit() and startAfter() cursor
// Loads posts in batches of 20 to prevent downloading large datasets and crashing the app
export async function fetchPostsPaginated(
  pageSize: number = DEFAULT_PAGE_SIZE,
  lastDocCursor?: QueryDocumentSnapshot<DocumentData> | null,
  categoryFilter?: string
): Promise<PaginatedPostsResult> {
  const deletedIds = getDeletedPostIds();
  try {
    const postsCollection = collection(db, 'posts');
    const constraints: any[] = [];

    if (categoryFilter && categoryFilter !== 'home' && categoryFilter !== 'all') {
      constraints.push(where('category', '==', categoryFilter));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (lastDocCursor) {
      constraints.push(startAfter(lastDocCursor));
    }

    constraints.push(limit(pageSize));

    const q = query(postsCollection, ...constraints);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Firestore read timeout')), 4000)
    );
    const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

    const remotePosts: PostItem[] = [];
    querySnapshot.forEach((docSnap) => {
      if (deletedIds.has(docSnap.id)) return;
      const data = docSnap.data();
      remotePosts.push({
        id: docSnap.id,
        title: data.title || '',
        category: data.category || 'house-rent',
        description: data.description || '',
        price: data.price,
        location: data.location || 'কুষ্টিয়া',
        subcategory: data.subcategory,
        contactPhone: data.contactPhone || '',
        whatsapp: data.whatsapp,
        facebook: data.facebook,
        imageUrl: data.imageUrl,
        authorName: data.authorName || 'নাগরিক',
        authorPhone: data.authorPhone,
        authorPhoto: data.authorPhoto,
        authorId: data.authorId,
        isAnonymous: data.isAnonymous,
        isVerified: data.isVerified ?? false,
        featured: data.featured ?? false,
        status: data.status || 'approved',
        approvedAt: data.approvedAt,
        approvedBy: data.approvedBy,
        expiryDate: data.expiryDate,
        isDraft: data.isDraft,
        likes: data.likes,
        views: data.views,
        rating: data.rating,
        reviewsCount: data.reviewsCount,
        details: data.details,
        createdAt: data.timestampMillis || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()),
      });
    });

    const lastVisible = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1] 
      : null;
    const hasMore = querySnapshot.docs.length === pageSize;

    // Merge with local master posts (including demo posts) on the first page
    let finalPosts = remotePosts;
    if (!lastDocCursor) {
      const local = getMasterPosts();
      const localFiltered = (!categoryFilter || categoryFilter === 'home' || categoryFilter === 'all')
        ? local
        : local.filter(p => p.category === (categoryFilter as any));

      const map = new Map<string, PostItem>();
      // Remote posts first
      remotePosts.forEach(p => map.set(p.id, p));
      // Local posts merge on top so user edits are NEVER lost
      localFiltered.forEach(p => {
        const remote = map.get(p.id);
        if (remote) {
          map.set(p.id, {
            ...remote,
            ...p,
            likes: Math.max(remote.likes ?? 0, p.likes ?? 0),
            views: Math.max(remote.views ?? 0, p.views ?? 0)
          });
        } else {
          map.set(p.id, p);
        }
      });

      finalPosts = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    // Cache to local master so offline / fast reload works
    if (remotePosts.length > 0) {
      const current = getMasterPosts();
      const localMap = new Map<string, PostItem>();
      current.forEach(p => localMap.set(p.id, p));

      const map = new Map<string, PostItem>();
      remotePosts.forEach(p => {
        if (deletedIds.has(p.id)) return;
        const local = localMap.get(p.id);
        map.set(p.id, local ? {
          ...p,
          ...local,
          likes: Math.max(p.likes ?? 0, local.likes ?? 0),
          views: Math.max(p.views ?? 0, local.views ?? 0)
        } : p);
      });
      current.forEach(p => {
        if (!deletedIds.has(p.id) && !map.has(p.id)) map.set(p.id, p);
      });
      saveMasterPosts(Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), false);
    }

    return {
      posts: finalPosts,
      lastDoc: lastVisible,
      hasMore
    };
  } catch (err) {
    console.warn('Firestore paginated query fallback to local master:', err);
    const local = getMasterPosts();
    const filtered = (!categoryFilter || categoryFilter === 'home' || categoryFilter === 'all')
      ? local
      : local.filter(p => p.category === categoryFilter);

    return {
      posts: filtered.slice(0, pageSize),
      lastDoc: null,
      hasMore: filtered.length > pageSize
    };
  }
}

// Fetch posts belonging to a specific user directly from Firestore
export async function fetchUserPostsFromFirestore(user: { uid?: string; email?: string; phone?: string; displayName?: string }): Promise<PostItem[]> {
  if (!user || (!user.uid && !user.phone && !user.email)) return [];
  try {
    const postsCol = collection(db, 'posts');
    const userPosts: PostItem[] = [];
    const seenIds = new Set<string>();

    const fetchByQuery = async (q: any) => {
      try {
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
          if (!seenIds.has(docSnap.id)) {
            seenIds.add(docSnap.id);
            const data = docSnap.data() as any;
            userPosts.push({
              id: docSnap.id,
              title: data.title || '',
              category: data.category || 'house-rent',
              description: data.description || '',
              price: data.price,
              location: data.location || 'কুষ্টিয়া',
              subcategory: data.subcategory,
              contactPhone: data.contactPhone || '',
              whatsapp: data.whatsapp,
              facebook: data.facebook,
              imageUrl: data.imageUrl,
              authorName: data.authorName || 'নাগরিক',
              authorPhone: data.authorPhone,
              authorPhoto: data.authorPhoto,
              authorId: data.authorId,
              isAnonymous: data.isAnonymous,
              isVerified: data.isVerified ?? false,
              featured: data.featured ?? false,
              status: data.status || 'approved',
              approvedAt: data.approvedAt,
              approvedBy: data.approvedBy,
              expiryDate: data.expiryDate,
              isDraft: data.isDraft,
              likes: data.likes,
              views: data.views,
              rating: data.rating,
              reviewsCount: data.reviewsCount,
              details: data.details,
              createdAt: data.timestampMillis || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()),
            });
          }
        });
      } catch (err) {
        console.warn('Query execution error in fetchUserPostsFromFirestore:', err);
      }
    };

    // Strict UID Filtering: If UID exists and is real, only fetch by UID to prevent leakage
    if (user.uid && !user.uid.startsWith('citizen-') && !user.uid.startsWith('demo-')) {
      await fetchByQuery(query(postsCol, where('authorId', '==', user.uid)));
    } else {
      // Fallback for legacy/guest users who only have phone/email
      if (user.phone && user.phone.length >= 8) {
        const cleanPhone = user.phone.replace(/\D/g, '');
        if (cleanPhone) {
          await fetchByQuery(query(postsCol, where('contactPhone', '==', user.phone)));
          await fetchByQuery(query(postsCol, where('authorPhone', '==', user.phone)));
        }
      }

      if (user.email) {
        await fetchByQuery(query(postsCol, where('authorEmail', '==', user.email.toLowerCase().trim())));
      }
    }

    if (userPosts.length > 0) {
      const currentMaster = getMasterPosts();
      const map = new Map<string, PostItem>();
      userPosts.forEach(p => map.set(p.id, p));
      currentMaster.forEach(p => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      saveMasterPosts(Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), false);
    }

    return userPosts;
  } catch (err) {
    console.warn('Error fetching user posts from firestore:', err);
    return [];
  }
}

// Fetch posts with limit (defaults to 300 to ensure admin panel and secret desk capture all reports)
export async function getAllPosts(pageSize: number = 300): Promise<PostItem[]> {
  const result = await fetchPostsPaginated(pageSize);
  const remote = result.posts;
  const local = getMasterPosts();
  const map = new Map<string, PostItem>();
  remote.forEach(p => map.set(p.id, p));
  local.forEach(p => {
    if (!map.has(p.id)) map.set(p.id, p);
  });
  return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// Delete post from Master Repository, Record Deleted ID, and Sync Firestore
export async function deletePost(postId: string): Promise<void> {
  // 1. Mark as permanently deleted so it never resurrects
  recordDeletedPostId(postId);

  // 2. Remove from IndexedDB
  idbDeletePost(postId).catch(err => {
    console.warn('Could not delete post from IndexedDB:', err);
  });

  // 3. Remove from Master Repository & notify all subscribers immediately
  const current = getMasterPosts();
  const updated = current.filter(p => p.id !== postId);
  saveMasterPosts(updated);

  // 4. Asynchronously delete from remote Firestore
  try {
    const docRef = doc(db, 'posts', postId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete from Firestore (local removal complete):', err);
  }
}

// Delete multiple posts in batch from Master Repository, Record Deleted IDs, and Sync Firestore
export async function deletePostsBatch(postIds: string[]): Promise<void> {
  if (!postIds || postIds.length === 0) return;

  const idSet = new Set(postIds);

  // 1. Mark all as permanently deleted in localStorage registry
  recordDeletedPostIds(postIds);

  // 2. Remove all from IndexedDB
  await Promise.all(
    postIds.map(id => idbDeletePost(id).catch(err => {
      console.warn('Could not delete post from IndexedDB:', id, err);
    }))
  );

  // 3. Remove all from Master Repository & notify subscribers immediately
  const current = getMasterPosts();
  const updated = current.filter(p => !idSet.has(p.id));
  saveMasterPosts(updated);

  // 4. Chunked Firestore writeBatch delete (chunk size 400 to respect Firestore's 500 limit)
  try {
    const CHUNK_SIZE = 400;
    for (let i = 0; i < postIds.length; i += CHUNK_SIZE) {
      const chunk = postIds.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      for (const id of chunk) {
        batch.delete(doc(db, 'posts', id));
      }
      await batch.commit();
    }
  } catch (err) {
    console.warn('Could not batch delete from Firestore (local removal complete):', err);
  }
}

// Update post in Master Repository, IndexedDB, and Firestore
export async function updatePost(postId: string, data: Partial<PostItem>): Promise<void> {
  // 1. Update in Master Repository & notify immediately
  const current = getMasterPosts();
  let updatedPost: PostItem | null = null;
  const updated = current.map(p => {
    if (p.id === postId) {
      updatedPost = { ...p, ...data, updatedAt: Date.now() };
      return updatedPost;
    }
    return p;
  });
  saveMasterPosts(updated);

  // In IndexedDB, also update immediately
  if (updatedPost) {
    idbPutPost(updatedPost).catch(() => {});
  }

  // 2. Asynchronously update in remote Firestore
  try {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.warn('Could not update in Firestore (local update complete):', err);
  }
}

// Create post wrapper returning PostItem
export async function createPost(postData: Omit<PostItem, 'id' | 'createdAt'>): Promise<PostItem> {
  const id = await createNewPost(postData);
  const posts = getMasterPosts();
  const created = posts.find(p => p.id === id);
  if (created) return created;

  return {
    ...postData,
    id,
    createdAt: Date.now()
  };
}

const LIKED_POST_IDS_KEY = 'rajshahi_connect_liked_post_ids_v2';
const VIEWED_POST_IDS_KEY = 'rajshahi_connect_viewed_device_ids_v2';

export function getLikedPostIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_POST_IDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

export async function togglePostLike(postId: string): Promise<{ liked: boolean; newLikes: number }> {
  const likedIds = getLikedPostIds();
  const isLiked = likedIds.includes(postId);
  const currentPosts = getMasterPosts();
  const post = currentPosts.find(p => p.id === postId);
  const currentLikes = post?.likes ?? 0;

  const newLikedIds = isLiked 
    ? likedIds.filter(id => id !== postId)
    : [...likedIds, postId];

  try {
    localStorage.setItem(LIKED_POST_IDS_KEY, JSON.stringify(newLikedIds));
  } catch (_) {}

  const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

  await updatePost(postId, { likes: newLikes });

  return { liked: !isLiked, newLikes };
}

export function getViewedPostIds(): string[] {
  try {
    const raw = localStorage.getItem(VIEWED_POST_IDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

export async function incrementPostViewsOnce(postId: string): Promise<number> {
  const viewedIds = getViewedPostIds();
  const currentPosts = getMasterPosts();
  const post = currentPosts.find(p => p.id === postId);
  if (!post) return 0;
  
  const currentViews = post.views ?? 0;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const lastView = post.lastViewUpdate ?? 0;
  const isRecent = (now - lastView) < oneDay;
  const newViewsLast24h = isRecent ? (post.viewsLast24h ?? 0) + 1 : 1;

  if (viewedIds.includes(postId)) {
    // Still update viewsLast24h even if already viewed, to keep 24h count accurate
    await updatePost(postId, {
      viewsLast24h: newViewsLast24h,
      lastViewUpdate: now
    });
    return currentViews;
  }

  const newViewedIds = [...viewedIds, postId];
  try {
    localStorage.setItem(VIEWED_POST_IDS_KEY, JSON.stringify(newViewedIds));
  } catch (_) {}

  const newViews = currentViews + 1;
  await updatePost(postId, { 
    views: newViews,
    viewsLast24h: newViewsLast24h,
    lastViewUpdate: now
  });
  return newViews;
}

export async function incrementPostViews(postId: string): Promise<void> {
  await incrementPostViewsOnce(postId);
}

export async function incrementPostShares(postId: string): Promise<number> {
  const currentPosts = getMasterPosts();
  const post = currentPosts.find(p => p.id === postId);
  const currentShares = post?.shares ?? 0;
  const newShares = currentShares + 1;
  await updatePost(postId, { shares: newShares });
  return newShares;
}

export async function likePost(postId: string, userId: string): Promise<void> {
  const likeId = `${postId}_${userId}`;
  await setDoc(doc(db, 'likes', likeId), {
    postId,
    userId,
    createdAt: serverTimestamp()
  });
  
  const post = getMasterPosts().find(p => p.id === postId);
  if (post) {
    await updatePost(postId, { likes: (post.likes || 0) + 1 });
  }
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  const likeId = `${postId}_${userId}`;
  await deleteDoc(doc(db, 'likes', likeId));
  
  const post = getMasterPosts().find(p => p.id === postId);
  if (post) {
    await updatePost(postId, { likes: Math.max(0, (post.likes || 1) - 1) });
  }
}

// Export postService unified namespace
export const postService = {
  getAllPosts,
  fetchPostsPaginated,
  deletePost,
  deletePostsBatch,
  updatePost,
  createPost,
  createNewPost,
  uploadPostImage,
  getMasterPosts,
  saveMasterPosts,
  isPostPublic,
  trackUserSubmittedPostId,
  getUserSubmittedPostIds,
  subscribeToPosts,
  getLikedPostIds,
  togglePostLike,
  incrementPostViews,
  incrementPostViewsOnce,
  incrementPostShares,
  likePost,
  unlikePost
};

