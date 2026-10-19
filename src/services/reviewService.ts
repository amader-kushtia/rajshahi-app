import { 
  collection, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { ServiceReview, TechnicianService } from '../types';
import { TECHNICIANS_LIST } from '../data/initialData';

const REVIEWS_STORAGE_KEY = 'rajshahi_connect_reviews_v1';
const TECHNICIANS_STORAGE_KEY = 'rajshahi_connect_technicians_v1';

// Initial sample reviews to make the platform immediately rich and lively with member IDs and feedback
const INITIAL_REVIEWS: ServiceReview[] = [
  {
    id: 'rev-1',
    targetId: 'tech-1',
    targetType: 'technician',
    userId: 'user_spd_83921',
    userName: 'আবুল কালাম আজাদ',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kalam839',
    rating: 5,
    comment: 'আনোয়ার ওস্তাদের কাজের ফিনিশিং অত্যন্ত নিখুঁত। আমাদের নতুন বাড়ির প্লাস্টার ও টাইলসের কাজ খুব সুন্দরভাবে সময়মতো শেষ করে দিয়েছেন।',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'rev-2',
    targetId: 'tech-1',
    targetType: 'technician',
    userId: 'user_spd_10294',
    userName: 'মোঃ রাশেদুল ইসলাম',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rashedul10',
    rating: 5,
    comment: 'অভিজ্ঞ মানুষ, কোনো বাড়তি কথা নেই। কাজের মান সেরা। ৫ স্টার ছাড়া উপায় নেই!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'rev-3',
    targetId: 'tech-2',
    targetType: 'technician',
    userId: 'user_spd_59281',
    userName: 'ইঞ্জিঃ মোস্তাফিজুর রহমান',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mostafiz59',
    rating: 5,
    comment: 'শফিকুল ভাইয়ের হাউজ ওয়্যারিং এর কাজ অনেক পরিষ্কার। সার্কিট ব্রেকার ও আইপিএস কানেকশনে খুব দক্ষ।',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'rev-4',
    targetId: 'tech-2',
    targetType: 'technician',
    userId: 'user_spd_77210',
    userName: 'হাসিবুল হাসান শুভ',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hasibul77',
    rating: 5,
    comment: 'রাত ৯ টায় ফোন দেওয়ার পর দ্রুত এসে বাসার মেইন লাইনের শর্ট সার্কিট ফিক্স করে দিয়েছেন। ধন্যবাদ!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'rev-5',
    targetId: 'tech-4',
    targetType: 'technician',
    userId: 'user_spd_44912',
    userName: 'তানভীর আহমেদ চৌধুরী',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanvir44',
    rating: 5,
    comment: 'এসি কুলিং এর সমস্যা হচ্ছিল। আরিফুল ভাই এসে গ্যাস প্রেশার চেক করে সঠিকভাবে গ্যাস চার্জ করে দিয়েছেন। এখন চমৎকার ঠাণ্ডা হচ্ছে।',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: 'rev-6',
    targetId: 'tech-4',
    targetType: 'technician',
    userId: 'user_spd_99302',
    userName: 'ডাঃ ফারহানা ইয়াসমিন',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farhana99',
    rating: 5,
    comment: 'ইনভার্টার ফ্রিজের জটিল সমস্যা কুষ্টিয়াে কেউ ধরতে পারছিল না, উনি মাত্র ১ ঘণ্টায় সমাধান করেছেন। রিকমেন্ডেড!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'rev-7',
    targetId: 'tech-3',
    targetType: 'technician',
    userId: 'user_spd_33819',
    userName: 'খলিলুর রহমান',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=khalil33',
    rating: 5,
    comment: 'মোটর ও পাইপলাইনের লিকেজ দ্রুত ঠিক করেছেন। রতন বাবুর ব্যবহার ও কাজ দুটোই ভালো।',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: 'rev-8',
    targetId: 'tech-6',
    targetType: 'technician',
    userId: 'user_spd_66201',
    userName: 'সালমা বেগম',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=salma66',
    rating: 5,
    comment: 'আমার ৮ম শ্রেণি পড়ুয়া মেয়েকে গণিত ও ইংরেজি পড়াচ্ছেন। আপুর পড়ানোর কৌশল ও ধৈর্য প্রশংসনীয়।',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: 'rev-9',
    targetId: 'tech-7',
    targetType: 'technician',
    userId: 'user_spd_12093',
    userName: 'মেজর (অবঃ) শওকত আলী',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shawkat12',
    rating: 5,
    comment: 'কুষ্টিয়া থেকে ঢাকা যাওয়ার জন্য জাহিদ ভাইয়ের গাড়ি নিয়েছিলাম। অত্যন্ত নিরাপদ ও স্মুথ ড্রাইভিং।',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'rev-post-rent-1',
    targetId: 'rent-1',
    targetType: 'post',
    userId: 'user_spd_90112',
    userName: 'তাহমিদ হাসান',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tahmid90',
    rating: 5,
    comment: 'ভদ্রা এলাকায় চমৎকার পরিবেশ। বাড়িওয়ালা হাফিজুর কাকা অত্যন্ত সজ্জন ব্যক্তি। আলো-বাতাস দারুণ।',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'rev-post-buysell-1',
    targetId: 'buysell-1',
    targetType: 'post',
    userId: 'user_spd_44102',
    userName: 'মোঃ রাশেদ কবীর',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rashed44',
    rating: 5,
    comment: 'বাইকটি সরেজমিনে দেখেছি, ইঞ্জিন কন্ডিশন আসলেই একদম নতুনের মতো। দামও সাধ্যের মধ্যে।',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'rev-post-blood-1',
    targetId: 'blood-post-1',
    targetType: 'post',
    userId: 'user_spd_77192',
    userName: 'ডাঃ সজিব আহমেদ (RMCH)',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drsojib77',
    rating: 5,
    comment: 'তানজিম ভাইদের ব্লাড ডোনার টিম খুব দ্রুত এগিয়ে এসেছে। রোগীর রক্তের ব্যবস্থা সময়মতো হয়ে গেছে। মহান উদ্যোগ!',
    createdAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: 'rev-post-crime-1',
    targetId: 'crime-1',
    targetType: 'post',
    userId: 'user_spd_33891',
    userName: 'কুষ্টিয়া সচেতন নাগরিক ফোরাম',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=citizenforum33',
    rating: 5,
    comment: 'টি-বাঁধ এলাকার এই রিপোর্টটি অত্যন্ত সত্য ও দরকারি ছিল। বিষয়টি পুলিশ ফাঁড়িতে জানানো হয়েছে। সবাইকে সজাগ থাকতে হবে।',
    createdAt: Date.now() - 1000 * 60 * 60 * 9,
  },
  {
    id: 'rev-post-food-1',
    targetId: 'food-1',
    targetType: 'post',
    userId: 'user_spd_55102',
    userName: 'আরিফুল ইসলাম জয়',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ariful55',
    rating: 5,
    comment: 'পদ্মা পাড়ের এই কালাই রুটি আর হাঁসের মাংস কুষ্টিয়ার অহংকার! খাঁটি ও সুস্বাদু খাবার।',
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 'rev-post-job-1',
    targetId: 'job-post-1',
    targetType: 'post',
    userId: 'user_spd_88291',
    userName: 'শাকিল আহমেদ',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shakil88',
    rating: 5,
    comment: 'আল-মদিনা ফ্যাশন হাউজের কাজের পরিবেশ চমৎকার ও কর্তৃপক্ষ খুব সময়নিষ্ঠ বেতন দিয়ে থাকেন।',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'rev-post-driver-1',
    targetId: 'driver-post-1',
    targetType: 'post',
    userId: 'user_spd_66190',
    userName: 'ইঞ্জিঃ রফিকুল ইসলাম',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rafiqul66',
    rating: 5,
    comment: 'জাহিদ ভাই অত্যন্ত দক্ষ ও মার্জিত ড্রাইভার। পরিবার নিয়ে কুষ্টিয়ার সব দর্শনীয় জায়গায় নিরাপদে ঘুরিয়েছেন।',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'rev-post-tutor-1',
    targetId: 'tutor-post-1',
    targetType: 'post',
    userId: 'user_spd_11928',
    userName: 'অধ্যক্ষ মোশাররফ হোসেন',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mosharraf11',
    rating: 5,
    comment: 'আসিফ মাহমুদ রুয়েটের মেধাবী ছাত্র। আমার ছেলেকে ফিজিক্স ও হায়ার ম্যাথ খুব দারুণভাবে বুঝিয়ে পড়াচ্ছে।',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  }
];

const subscribers = new Set<(reviews: ServiceReview[]) => void>();

// Get all stored reviews
export function getAllReviews(): ServiceReview[] {
  try {
    const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (saved) {
      const parsed: ServiceReview[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading reviews from storage', e);
  }

  // Seed default reviews
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
  } catch (e) {
    console.warn('Error seeding reviews', e);
  }
  return INITIAL_REVIEWS;
}

// Save reviews and notify listeners
export function saveReviews(reviews: ServiceReview[], dispatchGlobal = true) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn('Error saving reviews to storage', e);
  }

  subscribers.forEach(cb => {
    try {
      cb(reviews);
    } catch (err) {
      console.warn('Error in review subscriber', err);
    }
  });

  if (dispatchGlobal && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rajshahi-reviews-updated', { detail: reviews }));
  }
}

// Get reviews for a specific technician or post
export function getReviewsForTarget(targetId: string): ServiceReview[] {
  const all = getAllReviews();
  return all
    .filter(r => r.targetId === targetId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// Check if a member has already submitted a review
export function getUserReview(targetId: string, userId: string): ServiceReview | undefined {
  if (!userId) return undefined;
  const all = getAllReviews();
  return all.find(r => r.targetId === targetId && r.userId === userId);
}

// Subscribe to review updates using SWR (Stale-While-Revalidate) + Active Screen Polling
// Eliminates open streaming connections to scale to 300,000+ users effortlessly
export function subscribeToReviews(onUpdate: (reviews: ServiceReview[]) => void): () => void {
  subscribers.add(onUpdate);

  // 1. STALE: Emit cached reviews immediately (0ms latency)
  onUpdate(getAllReviews());

  let isMounted = true;

  // 2. REVALIDATE: Asynchronously query recent reviews with limit to save bandwidth
  const revalidate = async () => {
    if (!isMounted) return;
    try {
      const q = query(collection(db, 'service_reviews'), orderBy('createdAt', 'desc'), limit(50));
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Reviews fetch timeout')), 4000)
      );
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);

      if (!isMounted) return;

      const remoteReviews: ServiceReview[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        remoteReviews.push({
          id: docSnap.id,
          targetId: data.targetId,
          targetType: data.targetType || 'technician',
          userId: data.userId,
          userName: data.userName || 'কুষ্টিয়া মেম্বার',
          userPhoto: data.userPhoto,
          userEmail: data.userEmail,
          rating: Number(data.rating) || 5,
          comment: data.comment || '',
          createdAt: data.timestampMillis || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()),
          updatedAt: data.updatedAt
        });
      });

      if (remoteReviews.length > 0) {
        const current = getAllReviews();
        const map = new Map<string, ServiceReview>();
        remoteReviews.forEach(r => map.set(r.id, r));
        current.forEach(r => {
          if (!map.has(r.id)) map.set(r.id, r);
        });
        const merged = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        saveReviews(merged, false);
        if (isMounted) {
          onUpdate(merged);
        }
      }
    } catch (_err) {
      // Gracefully continue with local cache
    }
  };

  // Immediate revalidation
  revalidate();

  // 3. ACTIVE SCREEN POLLING: Poll every 60 seconds ONLY when screen/tab is active
  const POLL_INTERVAL = 60000;
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

  // 4. CLEANUP: When screen unmounts, cancel timers, listeners & unsubscribe
  return () => {
    isMounted = false;
    clearInterval(pollTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    subscribers.delete(onUpdate);
  };
}

// Submit or Update a 5-Star Review
// RULE: 1 member can only have 1 review per person/post
export async function submitServiceReview(params: {
  targetId: string;
  targetType?: 'technician' | 'post';
  userId: string;
  userName: string;
  userPhoto?: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment?: string;
}): Promise<{
  review: ServiceReview;
  averageRating: number;
  totalReviews: number;
  isUpdate: boolean;
}> {
  const { targetId, targetType = 'technician', userId, userName, userPhoto, userEmail, rating, comment } = params;

  const effectiveUserId = userId || `user_citizen_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const effectiveUserName = userName || 'কুষ্টিয়া সম্মানিত নাগরিক';

  if (rating < 1 || rating > 5) {
    throw new Error('অনুগ্রহ করে ১ থেকে ৫ স্টার নির্বাচন করুন।');
  }

  const allReviews = getAllReviews();
  const existingIndex = allReviews.findIndex(r => r.targetId === targetId && r.userId === effectiveUserId);
  const isUpdate = existingIndex >= 0;

  let reviewId: string;
  let newReview: ServiceReview;

  if (isUpdate) {
    // Update existing review (enforcing 1 member = 1 review)
    reviewId = allReviews[existingIndex].id;
    newReview = {
      ...allReviews[existingIndex],
      rating,
      comment: comment !== undefined ? comment : allReviews[existingIndex].comment,
      userName: effectiveUserName,
      userPhoto: userPhoto || allReviews[existingIndex].userPhoto,
      userEmail: userEmail || allReviews[existingIndex].userEmail,
      updatedAt: Date.now()
    };
    allReviews[existingIndex] = newReview;
  } else {
    // Create fresh review for this member
    reviewId = 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    newReview = {
      id: reviewId,
      targetId,
      targetType,
      userId: effectiveUserId,
      userName: effectiveUserName,
      userPhoto: userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${effectiveUserId}`,
      userEmail,
      rating,
      comment: comment || '',
      createdAt: Date.now()
    };
    allReviews.unshift(newReview);
  }

  // Save to local master storage
  saveReviews(allReviews, true);

  // Sync to Firestore asynchronously
  try {
    const docRef = doc(db, 'service_reviews', reviewId);
    await setDoc(docRef, {
      ...newReview,
      createdAt: serverTimestamp(),
      timestampMillis: newReview.createdAt,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.warn('Could not sync review to Firestore, local review preserved:', err);
  }

  // Calculate new stats for the target
  const targetReviews = allReviews.filter(r => r.targetId === targetId);
  const totalReviews = targetReviews.length;
  const sumRating = targetReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
  const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 5.0;

  // If target is technician, update technician cached stats
  updateTechnicianStats(targetId, averageRating, totalReviews);

  return {
    review: newReview,
    averageRating,
    totalReviews,
    isUpdate
  };
}

// Get Master Technicians with dynamic review ratings & counts calculated
export function getStoredTechnicians(): TechnicianService[] {
  try {
    const saved = localStorage.getItem(TECHNICIANS_STORAGE_KEY);
    if (saved) {
      const parsed: TechnicianService[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read technicians from storage', e);
  }

  return TECHNICIANS_LIST;
}

// Save technicians
export function saveStoredTechnicians(list: TechnicianService[]) {
  try {
    localStorage.setItem(TECHNICIANS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save technicians to storage', e);
  }
}

// Helper to update technician stats
function updateTechnicianStats(techId: string, rating: number, reviewsCount: number) {
  const list = getStoredTechnicians();
  const updated = list.map(t => {
    if (t.id === techId) {
      return {
        ...t,
        rating,
        reviewsCount
      };
    }
    return t;
  });
  saveStoredTechnicians(updated);
}

// Get technicians with up-to-date review counts, dynamic rating, and reviews array attached
export function getTechniciansWithReviews(): TechnicianService[] {
  const technicians = getStoredTechnicians();
  const allReviews = getAllReviews();

  return technicians.map(tech => {
    const techReviews = allReviews.filter(r => r.targetId === tech.id);
    const reviewsCount = Math.max(tech.reviewsCount || 0, techReviews.length);
    
    let calculatedRating = tech.rating;
    if (techReviews.length > 0) {
      const sum = techReviews.reduce((acc, r) => acc + r.rating, 0);
      calculatedRating = Number((sum / techReviews.length).toFixed(1));
    }

    return {
      ...tech,
      rating: calculatedRating,
      reviewsCount,
      reviews: techReviews
    };
  });
}

// Format reviewer ID for clear display (e.g. #USR-83921 or clean short ID)
export function formatReviewerId(userId: string): string {
  if (!userId) return 'ID: #USR-00000';
  if (userId.startsWith('user_spd_')) {
    return `#ID-${userId.replace('user_spd_', '').toUpperCase()}`;
  }
  if (userId.length > 12) {
    return `#ID-${userId.substring(0, 8).toUpperCase()}`;
  }
  return `#ID-${userId.toUpperCase()}`;
}
