import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc,
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: 'bKash' | 'Nagad';
  senderNumber: string;
  transactionId: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

const LOCAL_STORAGE_TXS_KEY = 'kushtia_connect_wallet_txs_v1';
const LOCAL_STORAGE_BALANCES_KEY = 'kushtia_connect_user_balances_v1';

export function getCachedTransactions(): WalletTransaction[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_TXS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading cached wallet txs', e);
  }
  return [];
}

export function saveCachedTransactions(txs: WalletTransaction[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TXS_KEY, JSON.stringify(txs));
    window.dispatchEvent(new CustomEvent('kushtia-wallet-updated'));
  } catch (e) {
    console.warn('Error saving cached wallet txs', e);
  }
}

export function getUserBalances(): Record<string, number> {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_BALANCES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading user balances', e);
  }
  return {};
}

export function saveUserBalances(balances: Record<string, number>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_BALANCES_KEY, JSON.stringify(balances));
    window.dispatchEvent(new CustomEvent('kushtia-wallet-updated'));
  } catch (e) {
    console.warn('Error saving user balances', e);
  }
}

export function getUserWalletBalance(userId: string): number {
  if (!userId) return 0;
  const balances = getUserBalances();
  return Number(balances[userId]) || 0;
}

export function setUserWalletBalance(userId: string, balance: number) {
  if (!userId) return;
  const balances = getUserBalances();
  balances[userId] = Math.max(0, balance);
  saveUserBalances(balances);
}

export async function submitWalletTopUp(data: {
  userId: string;
  userName: string;
  userPhone: string;
  method: 'bKash' | 'Nagad';
  senderNumber: string;
  transactionId: string;
  amount: number;
}): Promise<string> {
  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: data.userId,
    userName: data.userName || 'নামহীন নাগরিক',
    userPhone: data.userPhone || '',
    method: data.method,
    senderNumber: data.senderNumber,
    transactionId: data.transactionId,
    amount: Number(data.amount) || 0,
    status: 'pending',
    createdAt: Date.now()
  };

  const txs = getCachedTransactions();
  const updated = [newTx, ...txs];
  saveCachedTransactions(updated);

  try {
    await setDoc(doc(db, 'wallet_transactions', newTx.id), {
      ...newTx,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('Firestore sync notice for wallet tx:', e);
  }

  return newTx.id;
}

export async function confirmWalletTransaction(txId: string, adminName: string = 'Admin'): Promise<boolean> {
  const txs = getCachedTransactions();
  const tx = txs.find(t => t.id === txId);
  if (!tx || tx.status !== 'pending') return false;

  tx.status = 'confirmed';
  tx.reviewedAt = Date.now();
  tx.reviewedBy = adminName;
  saveCachedTransactions([...txs]);

  const currentBalance = getUserWalletBalance(tx.userId);
  setUserWalletBalance(tx.userId, currentBalance + tx.amount);

  try {
    // Directly update the document using the ID if it matches
    const docRef = doc(db, 'wallet_transactions', txId);
    await updateDoc(docRef, {
      status: 'confirmed',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminName
    });
  } catch (e) {
    console.warn('Firestore confirm sync notice:', e);
  }

  return true;
}

export async function rejectWalletTransaction(txId: string, adminName: string = 'Admin'): Promise<boolean> {
  const txs = getCachedTransactions();
  const tx = txs.find(t => t.id === txId);
  if (!tx || tx.status !== 'pending') return false;

  tx.status = 'rejected';
  tx.reviewedAt = Date.now();
  tx.reviewedBy = adminName;
  saveCachedTransactions([...txs]);

  try {
    // Directly update the document using the ID if it matches
    const docRef = doc(db, 'wallet_transactions', txId);
    await updateDoc(docRef, {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminName
    });
  } catch (e) {
    console.warn('Firestore reject sync notice:', e);
  }

  return true;
}

export function getAllWalletTransactions(): WalletTransaction[] {
  return getCachedTransactions();
}
