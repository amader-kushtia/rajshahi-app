import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  limit,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { FundDonation, FundExpense } from '../types';
import { INITIAL_DONATIONS, INITIAL_FUND_EXPENSES } from '../data/initialData';
import { createNewPost } from './postService';

const LOCAL_STORAGE_DONATIONS_KEY = 'rajshahi_connect_fund_donations';
const LOCAL_STORAGE_EXPENSES_KEY = 'rajshahi_connect_fund_expenses';

// Cache helpers
function getCachedDonations(): FundDonation[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_DONATIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading cached donations', e);
  }
  return [];
}

function saveCachedDonations(donations: FundDonation[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_DONATIONS_KEY, JSON.stringify(donations));
  } catch (e) {
    console.warn('Error saving cached donations', e);
  }
}

function getCachedExpenses(): FundExpense[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading cached expenses', e);
  }
  return [];
}

function saveCachedExpenses(expenses: FundExpense[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.warn('Error saving cached expenses', e);
  }
}

// 1. Subscribe to Donations using SWR + Active Screen Polling
// Eliminates persistent WebSocket stream for 300,000+ users
export function subscribeToDonations(onUpdate: (donations: FundDonation[]) => void): () => void {
  // 1. STALE: Emit initial combined data immediately (0ms)
  const cached = getCachedDonations();
  const initialCombined: FundDonation[] = [...cached];
  INITIAL_DONATIONS.forEach(init => {
    if (!initialCombined.some(d => d.id === init.id)) {
      initialCombined.push(init);
    }
  });
  onUpdate(initialCombined);

  let isMounted = true;

  // 2. REVALIDATE: Fetch recent donations using getDocs with limit
  const revalidate = async () => {
    if (!isMounted) return;
    try {
      const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(50));
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Donations fetch timeout')), 4000)
      );
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);

      if (!isMounted) return;

      const liveDonations: FundDonation[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        liveDonations.push({
          id: d.id,
          donorName: data.donorName || (data.isAnonymous ? 'সুহৃদ নাগরিক' : 'নাম প্রকাশে অনিচ্ছুক'),
          donorPhone: data.donorPhone || '',
          amount: Number(data.amount) || 0,
          paymentMethod: data.paymentMethod || 'bKash',
          transactionId: data.transactionId || '',
          isAnonymous: !!data.isAnonymous,
          status: data.status || 'pending',
          note: data.note || '',
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
          approvedAt: data.approvedAt || undefined,
          approvedBy: data.approvedBy || undefined,
        });
      });

      // Merge with initial sample donations
      const combined = [...liveDonations];
      INITIAL_DONATIONS.forEach(init => {
        if (!combined.some(d => d.id === init.id)) {
          combined.push(init);
        }
      });

      saveCachedDonations(combined);
      if (isMounted) {
        onUpdate(combined);
      }
    } catch (_err) {
      // Retain local cached donations on network timeout
    }
  };

  // Immediate revalidation on active screen
  revalidate();

  // 3. ACTIVE SCREEN POLLING: Poll every 60s only when screen is visible
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

  // 4. CLEANUP: When screen unmounts, cancel timers & remove listeners
  return () => {
    isMounted = false;
    clearInterval(pollTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };
}

// 2. Subscribe to Expenses using SWR + Active Screen Polling
// Eliminates persistent WebSocket stream for 300,000+ users
export function subscribeToExpenses(onUpdate: (expenses: FundExpense[]) => void): () => void {
  // 1. STALE: Emit cached expenses immediately (0ms)
  const cached = getCachedExpenses();
  const initialCombined: FundExpense[] = [...cached];
  INITIAL_FUND_EXPENSES.forEach(init => {
    if (!initialCombined.some(e => e.id === init.id)) {
      initialCombined.push(init);
    }
  });
  onUpdate(initialCombined);

  let isMounted = true;

  // 2. REVALIDATE: Fetch recent expenses via getDocs with limit
  const revalidate = async () => {
    if (!isMounted) return;
    try {
      const q = query(collection(db, 'fund_expenses'), orderBy('createdAt', 'desc'), limit(50));
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Expenses fetch timeout')), 4000)
      );
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);

      if (!isMounted) return;

      const liveExpenses: FundExpense[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        liveExpenses.push({
          id: d.id,
          title: data.title || '',
          description: data.description || '',
          amount: Number(data.amount) || 0,
          date: data.date || '',
          category: data.category || 'অন্যান্য',
          receiptUrl: data.receiptUrl || '',
          spendingProofUrl: data.spendingProofUrl || '',
          location: data.location || 'কুষ্টিয়া',
          verifiedBy: data.verifiedBy || 'তহবিল তদারকি পরিষদ',
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now())
        });
      });

      const combined = [...liveExpenses];
      INITIAL_FUND_EXPENSES.forEach(init => {
        if (!combined.some(e => e.id === init.id)) {
          combined.push(init);
        }
      });

      saveCachedExpenses(combined);
      if (isMounted) {
        onUpdate(combined);
      }
    } catch (_err) {
      // Retain local cache on network timeout
    }
  };

  // Immediate revalidation on active screen
  revalidate();

  // 3. ACTIVE SCREEN POLLING: Poll every 60s only when screen is visible
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

  // 4. CLEANUP: When screen unmounts, cancel timers & remove listeners
  return () => {
    isMounted = false;
    clearInterval(pollTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };
}

// 3. Submit a new donation (Pending status)
export async function submitDonation(
  data: Omit<FundDonation, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  const newDonation: FundDonation = {
    id: `don-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    donorName: data.donorName.trim() || (data.isAnonymous ? 'সুহৃদ নাগরিক' : 'নামহীন দাতা'),
    donorPhone: data.donorPhone.trim(),
    amount: Number(data.amount) || 0,
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId.trim().toUpperCase(),
    isAnonymous: !!data.isAnonymous,
    status: 'pending',
    note: data.note?.trim() || '',
    createdAt: Date.now()
  };

  // Add to local cache immediately
  const cached = getCachedDonations();
  saveCachedDonations([newDonation, ...cached]);

  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      donorName: newDonation.donorName,
      donorPhone: newDonation.donorPhone,
      amount: newDonation.amount,
      paymentMethod: newDonation.paymentMethod,
      transactionId: newDonation.transactionId,
      isAnonymous: newDonation.isAnonymous,
      status: 'pending',
      note: newDonation.note,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Saved donation locally due to network restriction:', error);
    return newDonation.id;
  }
}

// 4. Admin Approve Donation: Updates donation to approved & Creates live feed post!
export async function approveDonation(
  donation: FundDonation, 
  adminName: string = 'অ্যাডমিন হাবিবুর রহমান'
): Promise<void> {
  const approvedAt = Date.now();

  // 1. Update local cache
  const cached = getCachedDonations();
  const updated = cached.map(d => 
    d.id === donation.id 
      ? { ...d, status: 'approved' as const, approvedAt, approvedBy: adminName }
      : d
  );
  saveCachedDonations(updated);

  // 2. Update Firestore document
  try {
    await updateDoc(doc(db, 'donations', donation.id), {
      status: 'approved',
      approvedAt,
      approvedBy: adminName
    });
  } catch (err) {
    console.warn('Could not update Firestore document, saved locally:', err);
  }

  // 3. Automatically generate the live feed thank-you post!
  try {
    const displayName = donation.isAnonymous ? 'একজন সুহৃদ নাগরিক' : donation.donorName;
    const amountStr = Number(donation.amount).toLocaleString('bn-BD');

    await createNewPost({
      category: 'citizen-fund',
      title: `ধন্যবাদ! ${displayName} 'নাগরিক ফান্ডে' ৳${amountStr} অনুদান দিয়েছেন।`,
      description: `কুষ্টিয়া নাগরিক ফান্ড ও জরুরি সাহায্য তহবিলে অনুদান জমা হয়েছে। ট্রানজেকশন আইডি: ${donation.transactionId}। আপনার এই আন্তরিক সহায়তা কুষ্টিয়াের অসহায় ও শীতার্ত মানুষের সহায়তায় স্বচ্ছতার সাথে ব্যবহৃত হবে। আল্লাহ আপনার দান উত্তমভাবে কবুল করুন।`,
      price: `৳ ${amountStr}`,
      location: 'কুষ্টিয়া পৌরসভা',
      subcategory: 'নাগরিক ফান্ড',
      contactPhone: donation.isAnonymous ? 'গোপনীয়' : (donation.donorPhone || '01700000000'),
      authorName: donation.isAnonymous ? 'সুহৃদ নাগরিক (গোপন)' : donation.donorName,
      isAnonymous: donation.isAnonymous,
      isVerified: true,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop&q=80',
      details: {
        condition: 'নতুন'
      }
    });
  } catch (postErr) {
    console.warn('Failed to publish automated feed post:', postErr);
  }
}

// 5. Admin Reject Donation
export async function rejectDonation(donationId: string): Promise<void> {
  const cached = getCachedDonations();
  const updated = cached.map(d => 
    d.id === donationId ? { ...d, status: 'rejected' as const } : d
  );
  saveCachedDonations(updated);

  try {
    await updateDoc(doc(db, 'donations', donationId), {
      status: 'rejected'
    });
  } catch (err) {
    console.warn('Could not update rejection in Firestore:', err);
  }
}

// 6. Admin Add Fund Expense
export async function addFundExpense(
  data: Omit<FundExpense, 'id' | 'createdAt'>
): Promise<string> {
  const newExpense: FundExpense = {
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: data.title.trim(),
    description: data.description.trim(),
    amount: Number(data.amount) || 0,
    date: data.date.trim(),
    category: data.category,
    receiptUrl: data.receiptUrl?.trim() || '',
    spendingProofUrl: data.spendingProofUrl?.trim() || '',
    location: data.location?.trim() || 'কুষ্টিয়া',
    verifiedBy: data.verifiedBy?.trim() || 'তহবিল তদারকি পরিষদ',
    createdAt: Date.now()
  };

  const cached = getCachedExpenses();
  saveCachedExpenses([newExpense, ...cached]);

  try {
    const docRef = await addDoc(collection(db, 'fund_expenses'), {
      title: newExpense.title,
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date,
      category: newExpense.category,
      receiptUrl: newExpense.receiptUrl,
      spendingProofUrl: newExpense.spendingProofUrl,
      location: newExpense.location,
      verifiedBy: newExpense.verifiedBy,
      createdAt: Date.now()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Saved expense locally due to network restriction:', err);
    return newExpense.id;
  }
}

// 7. Calculate Fund Summary Metrics
export function calculateFundSummary(
  donations: FundDonation[], 
  expenses: FundExpense[]
) {
  // Only APPROVED donations count toward total raised
  const approvedDonations = donations.filter(d => d.status === 'approved');
  const pendingDonations = donations.filter(d => d.status === 'pending');

  const totalRaised = approvedDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const currentBalance = totalRaised - totalSpent;

  return {
    totalRaised,
    totalSpent,
    currentBalance,
    approvedCount: approvedDonations.length,
    pendingCount: pendingDonations.length,
    expenseCount: expenses.length
  };
}
