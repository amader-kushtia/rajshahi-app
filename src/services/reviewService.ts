import { 
  collection, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  where,
  onSnapshot,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { ServiceReview, TechnicianService } from '../types';
import { TECHNICIANS_LIST } from '../data/initialData';

// Memory cache for active session
let inMemoryReviews: ServiceReview[] = [];
const subscribers = new Set<(reviews: ServiceReview[]) => void>();

// Get reviews for a specific target - now uses Firestore directly for scalability
export async function fetchReviewsForTarget(targetId: string, maxLimit = 50): Promise<ServiceReview[]> {
  try {
    const q = query(
      collection(db, 'service_reviews'), 
      where('targetId', '==', targetId),
      orderBy('createdAt', 'desc'),
      limit(maxLimit)
    );
    const snap = await getDocs(q);
    const results: ServiceReview[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        ...data,
        createdAt: data.timestampMillis || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now())
      } as ServiceReview);
    });
    return results;
  } catch (err) {
    console.warn('Error fetching reviews:', err);
    return [];
  }
}

// Global subscription for real-time updates (limited to most recent 50 across app)
export function subscribeToReviews(onUpdate: (reviews: ServiceReview[]) => void): () => void {
  const q = query(collection(db, 'service_reviews'), orderBy('createdAt', 'desc'), limit(50));
  
  const unsub = onSnapshot(q, (snapshot) => {
    const remoteReviews: ServiceReview[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      remoteReviews.push({
        id: docSnap.id,
        ...data,
        createdAt: data.timestampMillis || (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now())
      } as ServiceReview);
    });
    inMemoryReviews = remoteReviews;
    onUpdate(remoteReviews);
  }, (err) => {
    console.warn('Review subscription error:', err);
    onUpdate([]);
  });

  return unsub;
}

// Get reviews from memory (stale-while-revalidate helper)
export function getReviewsForTarget(targetId: string): ServiceReview[] {
  return inMemoryReviews.filter(r => r.targetId === targetId);
}

export function getUserReview(targetId: string, userId: string): ServiceReview | undefined {
  return inMemoryReviews.find(r => r.targetId === targetId && r.userId === userId);
}

// Submit or Update a 5-Star Review
export async function submitServiceReview(params: {
  targetId: string;
  targetType?: 'technician' | 'post';
  userId: string;
  userName: string;
  userPhoto?: string;
  userEmail?: string;
  rating: number;
  comment?: string;
}): Promise<{
  review: ServiceReview;
  isUpdate: boolean;
}> {
  const { targetId, targetType = 'technician', userId, userName, userPhoto, userEmail, rating, comment } = params;

  if (rating < 1 || rating > 5) throw new Error('১-৫ স্টার রেটিং দিন।');

  const reviewId = `${targetId}_${userId}`;
  const now = Date.now();
  
  const newReview: ServiceReview = {
    id: reviewId,
    targetId,
    targetType,
    userId,
    userName: userName || 'সম্মানিত নাগরিক',
    userPhoto: userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    userEmail,
    rating,
    comment: comment || '',
    createdAt: now,
    updatedAt: now
  };

  // Sync to Firestore
  const docRef = doc(db, 'service_reviews', reviewId);
  const existingDoc = await getDoc(docRef);
  const isUpdate = existingDoc.exists();

  await setDoc(docRef, {
    ...newReview,
    createdAt: serverTimestamp(),
    timestampMillis: now
  }, { merge: true });

  // Update stats on target post
  if (targetType === 'post') {
    try {
      const postRef = doc(db, 'posts', targetId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        const currentCount = postData.reviewsCount || 0;
        const currentRating = postData.rating || 5.0;
        
        let newCount = currentCount;
        let newRating = currentRating;

        if (!isUpdate) {
          newCount = currentCount + 1;
          newRating = ((currentRating * currentCount) + rating) / newCount;
        } else {
          const oldRating = existingDoc.data()?.rating || 5;
          newRating = ((currentRating * currentCount) - oldRating + rating) / currentCount;
        }

        await updateDoc(postRef, {
          reviewsCount: newCount,
          rating: Number(newRating.toFixed(1))
        });
      }
    } catch (err) {
      console.warn('Post stats update failed:', err);
    }
  }

  return {
    review: newReview,
    isUpdate
  };
}

const TECHNICIANS_STORAGE_KEY = 'rajshahi_connect_technicians_v1';

export function getStoredTechnicians(): TechnicianService[] {
  try {
    const saved = localStorage.getItem(TECHNICIANS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return TECHNICIANS_LIST;
}

export function saveStoredTechnicians(list: TechnicianService[]) {
  try {
    localStorage.setItem(TECHNICIANS_STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
}

export function formatReviewerId(userId: string): string {
  if (!userId) return 'ID: #USR-00000';
  return `#ID-${userId.substring(0, 8).toUpperCase()}`;
}

export function getAllReviews(): ServiceReview[] {
  return inMemoryReviews;
}

export function saveReviews(reviews: ServiceReview[], dispatchGlobal = true) {
  inMemoryReviews = reviews;
  if (dispatchGlobal && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kushtia-reviews-updated', { detail: reviews }));
  }
}

export function getTechniciansWithReviews(): TechnicianService[] {
  const technicians = getStoredTechnicians();
  return technicians.map(tech => {
    const techReviews = inMemoryReviews.filter(r => r.targetId === tech.id);
    return {
      ...tech,
      reviews: techReviews
    };
  });
}
