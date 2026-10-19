import { PostDraftItem, PostItem, CategoryType } from '../types';
import { createNewPost } from './postService';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const DRAFTS_STORAGE_KEY = 'kushtia_local_post_drafts_v1';
const AUTOSAVE_DRAFT_KEY = 'kushtia_post_autosave_draft_v1';

export function getLocalDrafts(authorId?: string): PostDraftItem[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const list: PostDraftItem[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    if (authorId) {
      return list.filter(d => !d.authorId || d.authorId === authorId || d.authorId === 'guest-citizen');
    }
    return list;
  } catch (e) {
    console.warn('Failed to load local drafts:', e);
    return [];
  }
}

export function saveLocalDraft(draftData: Partial<PostDraftItem> & { title?: string; category: CategoryType }): PostDraftItem {
  const existingList = getLocalDrafts();
  const id = draftData.id || `draft-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  const draft: PostDraftItem = {
    id,
    category: draftData.category || 'house-rent',
    title: draftData.title || 'শিরোনামহীন খসড়া',
    description: draftData.description || '',
    price: draftData.price || '',
    location: draftData.location || 'কুষ্টিয়া',
    customLocation: draftData.customLocation || '',
    subcategory: draftData.subcategory || '',
    contactPhone: draftData.contactPhone || '',
    whatsapp: draftData.whatsapp || '',
    isAnonymous: !!draftData.isAnonymous,
    imagePreview: draftData.imagePreview || null,
    details: draftData.details || {},
    savedAt: draftData.savedAt || now,
    updatedAt: now,
    authorId: draftData.authorId || 'guest-citizen',
    authorName: draftData.authorName || 'নাগরিক',
    isAutoSaved: !!draftData.isAutoSaved
  };

  const filtered = existingList.filter(d => d.id !== id);
  const updatedList = [draft, ...filtered];

  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent('kushtia-drafts-updated'));
  } catch (e) {
    console.warn('LocalStorage save error, trimming oldest drafts:', e);
    // If quota exceeded, keep only top 5 recent drafts
    const trimmed = updatedList.slice(0, 5);
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(trimmed));
      window.dispatchEvent(new CustomEvent('kushtia-drafts-updated'));
    } catch (inner) {
      console.error('Failed to save draft to storage:', inner);
    }
  }

  // Also sync draft to Firestore as a draft post so Admins can see and publish it
  syncDraftToFirestore(draft).catch(err => {
    console.warn('Firestore draft sync warning (stored locally):', err);
  });

  return draft;
}

export function deleteLocalDraft(draftId: string): void {
  try {
    const existingList = getLocalDrafts();
    const updated = existingList.filter(d => d.id !== draftId);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('kushtia-drafts-updated'));

    // Also attempt delete from Firestore drafts if exists
    try {
      deleteDoc(doc(db, 'posts', draftId)).catch(() => {});
    } catch {}
  } catch (e) {
    console.warn('Failed to delete draft:', e);
  }
}

export function autoSaveDraftProgress(draftData: Partial<PostDraftItem>): void {
  try {
    const payload = {
      ...draftData,
      updatedAt: Date.now()
    };
    localStorage.setItem(AUTOSAVE_DRAFT_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('kushtia-autosave-updated', { detail: payload }));
  } catch (e) {
    console.warn('Failed to auto-save draft progress:', e);
  }
}

export function getAutoSavedProgress(): Partial<PostDraftItem> | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Auto-save expires after 7 days
    if (parsed.updatedAt && Date.now() - parsed.updatedAt > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(AUTOSAVE_DRAFT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearAutoSavedProgress(): void {
  try {
    localStorage.removeItem(AUTOSAVE_DRAFT_KEY);
  } catch {}
}

/**
 * Saves a draft copy to Firestore with status: 'draft' & isDraft: true
 * This allows admins to view all drafts and publish them directly!
 */
export async function syncDraftToFirestore(draft: PostDraftItem): Promise<void> {
  try {
    const postRef = doc(db, 'posts', draft.id);
    await setDoc(postRef, {
      category: draft.category,
      title: draft.title,
      description: draft.description,
      price: draft.price || '',
      location: draft.customLocation ? `${draft.customLocation}, কুষ্টিয়া` : draft.location,
      subcategory: draft.subcategory || '',
      contactPhone: draft.contactPhone || '',
      whatsapp: draft.whatsapp || draft.contactPhone || '',
      imageUrl: draft.imagePreview || '',
      authorName: draft.authorName || 'কুষ্টিয়া নাগরিক',
      authorId: draft.authorId || 'guest-citizen',
      isAnonymous: !!draft.isAnonymous,
      isVerified: false,
      status: 'draft',
      isDraft: true,
      createdAt: serverTimestamp(),
      timestampMillis: draft.savedAt,
      details: draft.details || {},
      updatedAt: draft.updatedAt
    }, { merge: true });
  } catch (err) {
    // Offline or network error - draft is safely saved locally
    console.warn('Draft Firestore sync note (offline safe):', err);
  }
}

/**
 * Publishes a draft directly (by Admin or Citizen)
 */
export async function publishDraftPost(draft: PostDraftItem, asAdmin: boolean = false): Promise<PostItem> {
  // Format post data
  const finalLocation = draft.customLocation?.trim() 
    ? `${draft.customLocation.trim()}, কুষ্টিয়া` 
    : `${draft.location}, কুষ্টিয়া`;

  const newPostData: Omit<PostItem, 'id' | 'createdAt'> = {
    category: draft.category,
    title: draft.title,
    description: draft.description,
    price: draft.price,
    location: finalLocation,
    subcategory: draft.subcategory,
    contactPhone: draft.contactPhone || '',
    whatsapp: draft.whatsapp || draft.contactPhone || '',
    imageUrl: draft.imagePreview || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    authorName: draft.authorName || 'কুষ্টিয়া নাগরিক',
    authorId: draft.authorId || 'guest-citizen',
    isAnonymous: !!draft.isAnonymous,
    isVerified: asAdmin,
    isDraft: false,
    status: asAdmin ? 'approved' : 'pending',
    approvedAt: asAdmin ? Date.now() : undefined,
    approvedBy: asAdmin ? 'Admin' : undefined,
    details: draft.details
  };

  // If the draft already has an ID in Firestore, update it, else create new
  const postRef = doc(db, 'posts', draft.id);
  await setDoc(postRef, {
    ...newPostData,
    status: asAdmin ? 'approved' : 'pending',
    isDraft: false,
    createdAt: serverTimestamp(),
    timestampMillis: Date.now(),
    approvedAt: asAdmin ? Date.now() : null
  }, { merge: true });

  // Remove from local drafts and autosave
  deleteLocalDraft(draft.id);
  clearAutoSavedProgress();

  const publishedPost: PostItem = {
    id: draft.id,
    ...newPostData,
    createdAt: Date.now()
  };

  return publishedPost;
}
