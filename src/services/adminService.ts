import { collection, getDocs, doc, setDoc, getDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, ActivityLog, AdminStats, AppThemeConfig, ThemeColorKey, Volunteer } from '../types';
import { postService } from './postService';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export type { AppThemeConfig };

export const ADMIN_CONFIG_KEY = 'kushtia_connect_app_config';
export const ADMIN_LOGS_KEY = 'kushtia_connect_activity_logs';
export const ADMIN_USERS_KEY = 'kushtia_connect_managed_users';

// Default App Theme Configuration
export const DEFAULT_APP_THEME: AppThemeConfig = {
  themeKey: 'emerald',
  primaryColor: '#059669', // emerald-600
  primaryHover: '#047857', // emerald-700
  primaryLight: '#ecfdf5', // emerald-50
  primaryGradient: 'from-emerald-700 via-teal-600 to-emerald-800',
  accentBadge: '#10b981',
  appName: '(আমার কুষ্টিয়া)',
  tagline: 'কুষ্টিয়া জেলার আধুনিক ডিজিটাল সিটিজেন পোর্টাল',
  marqueeAnnouncement: 'স্বাগতম আমার কুষ্টিয়ায়! বাউল সম্রাট লালন ও বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের স্মৃতিধন্য কুষ্টিয়ার নাগরিক সেবা, বাসা ভাড়া, কেনাবেচা বা জরুরি সাহায্যে আমরা আপনার পাশে।',
  isMarqueeActive: true,
  emergencyAlert: 'জরুরি সেবা ২৪ ঘণ্টা চালু আছে। পুলিশ, অ্যাম্বুলেন্স বা ফায়ার সার্ভিসের জন্য হেল্পলাইনে যোগাযোগ করুন।',
  isEmergencyAlertActive: true,
  isMemberPostingAllowed: false,
  cityName: 'কুষ্টিয়া, বাংলাদেশ',
  policePhone: '01320146000',
  fireServicePhone: '01716123456',
  hospitalPhone: '071-62402',
  ambulancePhone: '01711224455',
  electricityPhone: '16117',
  bloodHelplinePhone: '01711-224455',
  isWelcomePopupActive: true,
  welcomePopupTitle: 'আমার কুষ্টিয়ায় আপনাকে স্বাগতম!',
  welcomePopupMessage: 'বাউল সম্রাট লালন ও বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের পুণ্যভূমি কুষ্টিয়ার সব প্রয়োজনীয় জরুরি সেবা, দর্শনীয় স্থান, ডাক্তার ডিরেক্টরি, রক্তের ডাক ও কেনাবেচা-বাসা ভাড়ার তথ্য এখন এক অ্যাপে।',
  welcomePopupButtonText: 'শুরু করুন',
  welcomePopupBadge: 'স্বাগতম বার্তা',
  welcomePopupActionText: 'জরুরি সেবা',
  welcomePopupActionUrl: 'emergency',
  supportPhone: '01700000000',
  isSupportActive: true,
  supportLabel: 'এডমিন ও সাপোর্ট হেল্পলাইন',
  isWhatsAppSupportActive: true,
  supportFacebookUrl: '',
  isFacebookSupportActive: false,
  supportFacebookLabel: 'ফেসবুক পেজ / আইডি সাপোর্ট',
  adminProfilePic: '',
  volunteerPopupActive: true,
  volunteerPopupMessage: 'কুষ্টিয়া জেলার সেবায় আপনি কি সেচ্ছাসেবী হিসেবে আমাদের সঙ্গে কাজ করতে চান? আপনার সামান্য সহযোগিতা অনেকের উপকারে আসতে পারে।',
  volunteerContactNumber: '01700000000',
  showBalanceCard: true,
  isEmergencyNoticeActive: true,
  emergencyNoticeTitle: 'জরুরি নোটিশ',
  emergencyNoticeMessage: 'আপনার এলাকার যেকোনো জরুরি তথ্য এখানে দেখা যাবে।',
  isEmergencyBloodDonorActive: true,
  emergencyBloodDonorMessage: 'জরুরি রক্তের প্রয়োজন? এখানে ক্লিক করে রক্তদাতার খোঁজ করুন।',
  isPatientBloodRequestActive: false,
  patientName: '',
  patientBloodGroup: '',
  patientAge: '',
  patientContactNumber: '',
  showDemoData: true,
  homeBannerUrl: '',
  autoApprove: true
};

export const THEME_PRESETS: Record<ThemeColorKey, { name: string; primary: string; hover: string; light: string; gradient: string; previewClass: string }> = {
  pink: {
    name: 'গোলাপী রাজকীয় (Royal Pink)',
    primary: '#db2777',
    hover: '#be185d',
    light: '#fdf2f8',
    gradient: 'from-pink-700 via-rose-600 to-pink-800',
    previewClass: 'bg-pink-600'
  },
  emerald: {
    name: 'মর্যাদাপূর্ণ শ্যামল (Emerald Classic)',
    primary: '#047857',
    hover: '#065f46',
    light: '#ecfdf5',
    gradient: 'from-emerald-800 via-emerald-700 to-teal-800',
    previewClass: 'bg-emerald-700'
  },
  blue: {
    name: 'রয়েল ব্লু (Royal Blue)',
    primary: '#1d4ed8',
    hover: '#1e40af',
    light: '#eff6ff',
    gradient: 'from-blue-800 via-blue-700 to-indigo-800',
    previewClass: 'bg-blue-600'
  },
  indigo: {
    name: 'অভিজাত নীল (Deep Indigo)',
    primary: '#4338ca',
    hover: '#3730a3',
    light: '#eef2ff',
    gradient: 'from-indigo-900 via-indigo-700 to-purple-800',
    previewClass: 'bg-indigo-700'
  },
  rose: {
    name: 'রক্তিম লাল (Ruby Rose)',
    primary: '#be123c',
    hover: '#9f1239',
    light: '#fff1f2',
    gradient: 'from-rose-800 via-rose-700 to-red-800',
    previewClass: 'bg-rose-600'
  },
  amber: {
    name: 'সোনালী সূর্য (Golden Amber)',
    primary: '#b45309',
    hover: '#92400e',
    light: '#fffbeb',
    gradient: 'from-amber-700 via-amber-600 to-orange-700',
    previewClass: 'bg-amber-600'
  },
  teal: {
    name: 'সাগর শান্ত টিল (Nordic Teal)',
    primary: '#0f766e',
    hover: '#115e59',
    light: '#f0fdfa',
    gradient: 'from-teal-800 via-teal-700 to-cyan-800',
    previewClass: 'bg-teal-700'
  },
  purple: {
    name: 'রাজকীয় বেগুনী (Imperial Purple)',
    primary: '#6b21a8',
    hover: '#581c87',
    light: '#faf5ff',
    gradient: 'from-purple-800 via-purple-700 to-fuchsia-800',
    previewClass: 'bg-purple-700'
  }
};

const DAY_MS = 1000 * 60 * 60 * 24;

const SEED_USERS: UserProfile[] = [
  {
    uid: 'user-demo-admin',
    displayName: 'কুষ্টিয়া সিটিজেন অ্যাডমিন',
    email: 'admin@kushtiaconnect.org',
    phone: '01700000001',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    role: 'admin',
    status: 'active',
    address: 'রেলওয়ে কলোনি, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৫',
    joinedAt: Date.now() - DAY_MS * 30,
    lastActiveAt: Date.now() - 1000 * 60 * 5
  },
  {
    uid: 'user-citizen-1',
    displayName: 'তানজিমুল হক',
    email: 'tanzimul@kushtiaconnect.org',
    phone: '01712000011',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanzimul',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'কুন্দল মোড়, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৩',
    joinedAt: Date.now() - DAY_MS * 6,
    lastActiveAt: Date.now() - 1000 * 60 * 25
  },
  {
    uid: 'user-citizen-2',
    displayName: 'হাফিজুর রহমান',
    email: 'hafizur@gmail.com',
    phone: '01712345678',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hafizur',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'রেলওয়ে অফিসার্স কলোনি',
    ward: 'ওয়ার্ড নং ৫',
    joinedAt: Date.now() - DAY_MS * 5,
    lastActiveAt: Date.now() - 1000 * 60 * 60 * 2
  },
  {
    uid: 'user-citizen-3',
    displayName: 'ফারজানা আক্তার ইতি',
    email: 'farzana.iti@gmail.com',
    phone: '01723456789',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farzana',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'নতুন বাবুপাড়া, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৭',
    joinedAt: Date.now() - DAY_MS * 5,
    lastActiveAt: Date.now() - 1000 * 60 * 45
  },
  {
    uid: 'user-citizen-4',
    displayName: 'তানভীর আহমেদ',
    email: 'tanveer.bd@gmail.com',
    phone: '01745678901',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanveer',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'নয়া বাজার, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ২',
    joinedAt: Date.now() - DAY_MS * 4,
    lastActiveAt: Date.now() - 1000 * 60 * 90
  },
  {
    uid: 'user-citizen-5',
    displayName: 'ডা. কামরুল হাসান',
    email: 'dr.kamrul@hospital.org',
    phone: '01756789012',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamrul',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'শহীদ ডা. জিকরুল হক রোড',
    ward: 'ওয়ার্ড নং ৪',
    joinedAt: Date.now() - DAY_MS * 4,
    lastActiveAt: Date.now() - 1000 * 60 * 15
  },
  {
    uid: 'user-citizen-6',
    displayName: 'মোছাঃ নাসরিন আক্তার',
    email: 'nasrin.kushtia@gmail.com',
    phone: '01309876543',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin',
    isVerified: false,
    role: 'citizen',
    status: 'active',
    address: 'মুন্সিপাড়া মাদ্রাসা রোড',
    ward: 'ওয়ার্ড নং ১',
    joinedAt: Date.now() - DAY_MS * 3,
    lastActiveAt: Date.now() - 1000 * 60 * 120
  },
  {
    uid: 'user-citizen-7',
    displayName: 'সেলিম রেজা',
    email: 'selim.reza@gmail.com',
    phone: '01767890123',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selim',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'স্টেশন মোড়, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ২',
    joinedAt: Date.now() - DAY_MS * 3,
    lastActiveAt: Date.now() - 1000 * 60 * 30
  },
  {
    uid: 'user-citizen-8',
    displayName: 'শারমিন সুলতানা',
    email: 'sharmin.sultana@gmail.com',
    phone: '01778901234',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sharmin',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'গোয়ালপাড়া, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৮',
    joinedAt: Date.now() - DAY_MS * 2,
    lastActiveAt: Date.now() - 1000 * 60 * 10
  },
  {
    uid: 'user-citizen-9',
    displayName: 'ইঞ্জিঃ আশরাফুল আলম',
    email: 'ashraful.alam@eng.org',
    phone: '01789012345',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashraful',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'ক্যান্টনমেন্ট রোড, কুন্দল',
    ward: 'ওয়ার্ড নং ৩',
    joinedAt: Date.now() - DAY_MS * 2,
    lastActiveAt: Date.now() - 1000 * 60 * 50
  },
  {
    uid: 'user-citizen-10',
    displayName: 'মোস্তফা কামাল',
    email: 'mostofa.kamal@yahoo.com',
    phone: '01790123456',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mostofa',
    isVerified: false,
    role: 'citizen',
    status: 'active',
    address: 'পলিটেকনিক রোড, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৯',
    joinedAt: Date.now() - DAY_MS * 1,
    lastActiveAt: Date.now() - 1000 * 60 * 20
  },
  {
    uid: 'user-citizen-11',
    displayName: 'মাহফুজুর রহমান',
    email: 'mahfuz.kushtia@gmail.com',
    phone: '01812345670',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahfuz',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'বোতলার মোড়, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৬',
    joinedAt: Date.now() - DAY_MS * 1,
    lastActiveAt: Date.now() - 1000 * 60 * 8
  },
  {
    uid: 'user-citizen-12',
    displayName: 'সুরাইয়া জান্নাত',
    email: 'suraiya.jannat@gmail.com',
    phone: '01823456781',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suraiya',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'কলেজ রোড, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৪',
    joinedAt: Date.now() - 1000 * 60 * 60 * 4,
    lastActiveAt: Date.now() - 1000 * 60 * 12
  },
  {
    uid: 'user-citizen-13',
    displayName: 'রাকিবুল হাসান রনি',
    email: 'rakibul.roni@gmail.com',
    phone: '01834567892',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rakibul',
    isVerified: true,
    role: 'citizen',
    status: 'active',
    address: 'বাঙালিয়ার মোড়, কুষ্টিয়া',
    ward: 'ওয়ার্ড নং ৭',
    joinedAt: Date.now() - 1000 * 60 * 60 * 2,
    lastActiveAt: Date.now() - 1000 * 60 * 4
  }
];

const SEED_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    type: 'user_registered',
    title: 'নতুন ইউজার জয়েন করেছেন',
    description: 'আহমেদ তানভীর (কলেজ রোড) অ্যাকাউন্ট খুলেছেন।',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    actor: 'সিস্টেম'
  }
];

// 1. PIN Security & Admin Account Management
export interface AdminAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'super_admin' | 'sub_admin';
  status: 'active' | 'blocked';
  createdAt: number;
}

const ADMIN_EMAIL_PRIMARY = import.meta.env.VITE_ADMIN_EMAIL || 'mh7539019@gmail.com';
const ADMIN_EMAIL_SECONDARY = import.meta.env.VITE_ADMIN_EMAIL_2 || 'habiburrahman962540@gmail.com';

export const INITIAL_ADMINS: AdminAccount[] = ([
  {
    id: 'admin-super-1',
    email: ADMIN_EMAIL_PRIMARY,
    name: 'আমার কুষ্টিয়া — প্রধান অ্যাডমিন',
    role: 'super_admin' as const,
    status: 'active' as const,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30
  },
  {
    id: 'admin-super-2',
    email: ADMIN_EMAIL_SECONDARY,
    name: 'আমার কুষ্টিয়া — সহকারী অ্যাডমিন',
    role: 'super_admin' as const,
    status: 'active' as const,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30
  }
] as AdminAccount[]).filter((admin, index, self) => index === self.findIndex(a => a.email.toLowerCase() === admin.email.toLowerCase()));

export function deduplicateAdminAccounts(accounts: AdminAccount[]): AdminAccount[] {
  if (!Array.isArray(accounts)) return [];
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  const result: AdminAccount[] = [];

  for (const acc of accounts) {
    if (!acc || typeof acc !== 'object') continue;
    let cleanId = (acc.id || '').trim();
    const cleanEmail = (acc.email || '').trim().toLowerCase();

    if (cleanEmail && seenEmails.has(cleanEmail)) continue;

    if (!cleanId || seenIds.has(cleanId)) {
      cleanId = `admin-${cleanEmail.replace(/[^a-z0-9]/g, '_') || Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    }

    seenIds.add(cleanId);
    if (cleanEmail) seenEmails.add(cleanEmail);

    result.push({ ...acc, id: cleanId, email: cleanEmail || acc.email });
  }

  return result;
}

export async function fetchAdminAccountsFromFirestore(): Promise<AdminAccount[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'admin_accounts'));
    const rawAccounts: AdminAccount[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<AdminAccount>;
      rawAccounts.push({ ...data, id: data.id || docSnap.id } as AdminAccount);
    });

    let merged = deduplicateAdminAccounts(rawAccounts);
    INITIAL_ADMINS.forEach(ia => {
      const foundByEmail = merged.find(a => a.email.toLowerCase() === ia.email.toLowerCase());
      const foundById = merged.find(a => a.id === ia.id);

      if (!foundByEmail && !foundById) merged.push(ia);
      else if (foundById && !foundByEmail) { foundById.email = ia.email; foundById.role = 'super_admin'; }
    });

    return deduplicateAdminAccounts(merged);
  } catch (e) {
    console.error('Error fetching admin accounts from Firestore:', e);
    return deduplicateAdminAccounts(INITIAL_ADMINS);
  }
}

export function getAdminAccounts(): AdminAccount[] {
  return deduplicateAdminAccounts(INITIAL_ADMINS);
}

export async function saveAdminAccountsAsync(admins: AdminAccount[]) {
  try {
    const cleanAdmins = deduplicateAdminAccounts(admins).map(({ password, ...rest }) => rest);
    for (const admin of cleanAdmins) {
      await setDoc(doc(db, 'admin_accounts', admin.id), admin);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kushtia-admins-updated', { detail: cleanAdmins }));
    }
  } catch (e) {
    console.warn('Error saving admin accounts to Firestore:', e);
  }
}

export async function addAdminAccount(email: string, _password?: string, name?: string): Promise<{ success: boolean; error?: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'সঠিক ইমেইল ঠিকানা দিন।' };
  }
  const admins = getAdminAccounts();
  if (admins.some(a => a.email.toLowerCase() === email.toLowerCase().trim())) {
    return { success: false, error: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি এডমিন অ্যাকাউন্ট রয়েছে।' };
  }
  const newAdmin: AdminAccount = {
    id: 'admin-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    email: email.trim().toLowerCase(),
    name: (name || 'সাব-এডমিন').trim(),
    role: 'sub_admin',
    status: 'active',
    createdAt: Date.now()
  };
  const updated = [newAdmin, ...admins];
  await saveAdminAccountsAsync(updated);
  addActivityLog({
    type: 'user_registered',
    title: 'নতুন সাব-এডমিন যুক্ত হয়েছে (Firestore)',
    description: `নতুন এডমিন অ্যাকাউন্ট (${email}) সফলভাবে ফায়ারস্টোরে তৈরি ও সংরক্ষিত হয়েছে।`,
    actor: 'মাস্টার এডমিন'
  });
  return { success: true };
}

export async function toggleAdminBlock(id: string): Promise<AdminAccount[]> {
  const admins = getAdminAccounts();
  const updated = admins.map(a => {
    if (a.id === id) {
      if (a.role === 'super_admin') return a;
      const newStatus = a.status === 'blocked' ? 'active' : 'blocked';
      addActivityLog({
        type: 'user_status_changed',
        title: `এডমিন স্ট্যাটাস পরিবর্তন: ${newStatus === 'blocked' ? 'ব্লক' : 'সক্রিয়'}`,
        description: `এডমিন (${a.email}) কে ${newStatus === 'blocked' ? 'ব্লক' : 'আনব্লক'} করা হয়েছে।`,
        actor: 'মাস্টার এডমিন'
      });
      return { ...a, status: newStatus as 'active' | 'blocked' };
    }
    return a;
  });
  await saveAdminAccountsAsync(updated);
  return updated;
}

// Secure 6-Digit Admin PIN storage & verification (Firestore Hashed)
export {
  verifyAdminPinWithFirestore,
  changeAdminPinInFirestore,
  setAdminPinInFirestore,
  isAdminPinSessionVerified,
  setAdminPinSessionVerified,
  DEFAULT_ADMIN_PIN
} from '../utils/adminPinSecurity';

export function getAdminPin(): string {
  return '';
}

export function setAdminPin(_newPin: string): boolean {
  return false;
}

export const updateAdminPin = setAdminPin;

export function verifyAdminPin(_enteredPin: string): boolean {
  return false;
}

// 2. Theme & Configuration Management
export function getAppThemeConfig(): AppThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_APP_THEME;
  try {
    const stored = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_APP_THEME, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading app theme config from localStorage', e);
  }
  return DEFAULT_APP_THEME;
}

export function saveAppThemeConfig(config: Partial<AppThemeConfig>): AppThemeConfig {
  const current = getAppThemeConfig();
  const updated: AppThemeConfig = { ...current, ...config };
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('kushtia-app-config-updated', { detail: updated }));
      window.dispatchEvent(new Event('storage'));
    }
    setDoc(doc(db, 'admin_config', 'global'), updated, { merge: true }).catch(err => console.warn('Firestore theme sync note:', err));
    addActivityLog({
      type: 'theme_updated',
      title: 'অ্যাপ কনফিগারেশন ও থিম পরিবর্তন',
      description: `মেইন থিম: ${updated.themeKey}`,
      actor: 'এডমিন'
    });
  } catch (e) {
    console.warn('Could not save admin theme config', e);
  }
  return updated;
}

export function applyThemePreset(themeKey: ThemeColorKey): AppThemeConfig {
  const preset = THEME_PRESETS[themeKey];
  return saveAppThemeConfig({
    themeKey,
    primaryColor: preset.primary,
    primaryGradient: preset.gradient
  });
}

// 3. User Management
let cachedManagedUsers: UserProfile[] | null = null;

export function getManagedUsers(): UserProfile[] {
  if (cachedManagedUsers && cachedManagedUsers.length > 0) {
    return cachedManagedUsers;
  }
  try {
    const stored = localStorage.getItem(ADMIN_USERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const now = Date.now();
        const hasRecent = parsed.some(u => (now - (u.joinedAt || 0)) < 1000 * 60 * 60 * 24 * 7);
        // If all timestamps are older than 14 days and this is the seed dataset, refresh relative timestamps
        if (!hasRecent && parsed.length <= SEED_USERS.length) {
          const refreshed = parsed.map((u, idx) => ({
            ...u,
            joinedAt: now - (idx % 7) * DAY_MS - (idx * 1000 * 60 * 60 * 2),
            lastActiveAt: now - (idx * 1000 * 60 * 35)
          }));
          cachedManagedUsers = refreshed;
          saveManagedUsers(refreshed);
          return refreshed;
        }
        cachedManagedUsers = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored managed users', e);
  }
  return SEED_USERS;
}

export function saveManagedUsers(users: UserProfile[]) {
  cachedManagedUsers = users;
  try {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kushtia-users-updated', { detail: users }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    console.warn('Error saving managed users', e);
  }
}

export async function fetchManagedUsersFromFirestore(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const firestoreUsers: UserProfile[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      firestoreUsers.push({
        uid: docSnap.id,
        citizenId: data.citizenId || undefined,
        displayName: data.displayName || 'সম্মানিত নাগরিক',
        email: data.email || undefined,
        phone: data.phone || data.contactPhone || undefined,
        photoURL: data.photoURL || undefined,
        isVerified: data.isVerified ?? false,
        role: data.role || 'citizen',
        status: data.status || 'active',
        joinedAt: data.joinedAt || (data.createdAt ? (typeof data.createdAt === 'number' ? data.createdAt : Date.now()) : Date.now() - 1000 * 60 * 60 * 24),
        lastActiveAt: data.lastActiveAt || Date.now(),
        isFlagged: data.isFlagged || false,
        flagReason: data.flagReason || undefined,
        banExpiresAt: data.banExpiresAt || undefined,
        banReason: data.banReason || undefined
      });
    });

    // Also include unique authors from postService master posts
    const posts = postService.getMasterPosts();
    const existingUids = new Set(firestoreUsers.map(u => u.uid));
    
    posts.forEach(p => {
      const authorId = p.authorId || (p.contactPhone ? `phone-${p.contactPhone}` : null);
      if (authorId && !existingUids.has(authorId)) {
        existingUids.add(authorId);
        firestoreUsers.push({
          uid: authorId,
          displayName: p.authorName || 'কুষ্টিয়া নাগরিক',
          phone: p.contactPhone,
          isVerified: p.isVerified || false,
          role: 'citizen',
          status: 'active',
          joinedAt: p.createdAt || (Date.now() - 1000 * 60 * 60 * 48),
          lastActiveAt: p.createdAt || Date.now()
        });
      }
    });

    const result = firestoreUsers.length > 0 ? firestoreUsers : SEED_USERS;
    saveManagedUsers(result);
    return result;
  } catch (err) {
    console.warn('Error fetching managed users from Firestore:', err);
    return getManagedUsers();
  }
}

export function toggleUserVerified(uid: string): UserProfile[] {
  const users = getManagedUsers();
  const updated = users.map(u => {
    if (u.uid === uid) {
      const newStatus = !u.isVerified;
      updateDoc(doc(db, 'users', uid), { isVerified: newStatus }).catch(err => console.warn(err));
      addActivityLog({
        type: 'user_status_changed',
        title: `ইউজার ভেরিফিকেশন ${newStatus ? 'অনুমোদিত' : 'প্রত্যাহার'}`,
        description: `${u.displayName}-এর জন্য ব্লু ব্যাজ ${newStatus ? 'যুক্ত' : 'বাদ'} করা হয়েছে।`,
        actor: 'এডমিন'
      });
      return { ...u, isVerified: newStatus };
    }
    return u;
  });
  saveManagedUsers(updated);
  return updated;
}

export function toggleUserBlocked(uid: string): UserProfile[] {
  const users = getManagedUsers();
  const updated = users.map(u => {
    if (u.uid === uid) {
      const newStatus = u.status === 'blocked' ? 'active' : 'blocked';
      updateDoc(doc(db, 'users', uid), { status: newStatus }).catch(err => console.warn(err));
      addActivityLog({
        type: 'user_status_changed',
        title: `ইউজার স্ট্যাটাস: ${newStatus === 'blocked' ? 'ব্লক' : 'আনব্লক'}`,
        description: `${u.displayName} কে ${newStatus === 'blocked' ? 'সাময়িকভাবে ব্যান' : 'পুনরায় সক্রিয়'} করা হয়েছে।`,
        actor: 'এডমিন'
      });
      return { ...u, status: newStatus as 'active' | 'blocked' };
    }
    return u;
  });
  saveManagedUsers(updated);
  return updated;
}

export function applyBulkTemporaryBan(uids: string[], durationHours: number, reason: string = 'কমিউনিটি নির্দেশিকা লঙ্ঘন ও ফ্ল্যাগড অ্যাকাউন্ট'): UserProfile[] {
  const users = getManagedUsers();
  const banExpiresAt = Date.now() + durationHours * 3600 * 1000;
  const now = Date.now();
  const targetUidsSet = new Set(uids);

  const updated = users.map(u => {
    if (targetUidsSet.has(u.uid)) {
      updateDoc(doc(db, 'users', u.uid), {
        status: 'temporary_ban',
        banExpiresAt,
        banReason: reason,
        bannedAt: now
      }).catch(err => console.warn(err));
      return {
        ...u,
        status: 'temporary_ban' as const,
        banExpiresAt,
        banReason: reason,
        bannedAt: now
      };
    }
    return u;
  });

  saveManagedUsers(updated);
  addActivityLog({
    type: 'user_status_changed',
    title: `বাল্ক সাময়িক ব্যান কার্যকর (${uids.length} জন)`,
    description: `${uids.length} জন ইউজারকে ব্যান করা হয়েছে। কারণ: ${reason}`,
    actor: 'এডমিন'
  });
  return updated;
}

export function applyBulkUnban(uids: string[]): UserProfile[] {
  const users = getManagedUsers();
  const targetUidsSet = new Set(uids);

  const updated = users.map(u => {
    if (targetUidsSet.has(u.uid)) {
      updateDoc(doc(db, 'users', u.uid), {
        status: 'active',
        banExpiresAt: null,
        banReason: null,
        bannedAt: null
      }).catch(err => console.warn(err));
      return {
        ...u,
        status: 'active' as const,
        banExpiresAt: undefined,
        banReason: undefined,
        bannedAt: undefined
      };
    }
    return u;
  });

  saveManagedUsers(updated);
  addActivityLog({
    type: 'user_status_changed',
    title: `বাল্ক সক্রিয়করণ/আনব্যান (${uids.length} জন)`,
    description: `ইউজারদের পুনরায় সক্রিয় করা হয়েছে।`,
    actor: 'এডমিন'
  });
  return updated;
}

export function applyBulkPermanentBlock(uids: string[]): UserProfile[] {
  const users = getManagedUsers();
  const targetUidsSet = new Set(uids);

  const updated = users.map(u => {
    if (targetUidsSet.has(u.uid)) {
      updateDoc(doc(db, 'users', u.uid), { status: 'blocked' }).catch(err => console.warn(err));
      return {
        ...u,
        status: 'blocked' as const,
        banExpiresAt: undefined,
        banReason: 'স্থায়ী ব্লক করা হয়েছে'
      };
    }
    return u;
  });

  saveManagedUsers(updated);
  addActivityLog({
    type: 'user_status_changed',
    title: `বাল্ক স্থায়ী ব্লক (${uids.length} জন)`,
    description: `ইউজারদের স্থায়ীভাবে ব্লক করা হয়েছে।`,
    actor: 'এডমিন'
  });
  return updated;
}

export function toggleUserFlag(uid: string, reason?: string): UserProfile[] {
  const users = getManagedUsers();
  let targetName = '';
  let newFlag = false;

  const updated = users.map(u => {
    if (u.uid === uid) {
      newFlag = !u.isFlagged;
      targetName = u.displayName;
      updateDoc(doc(db, 'users', uid), {
        isFlagged: newFlag,
        flagReason: newFlag ? (reason || 'সন্দেহজনক পোস্ট বা আচরণ পর্যালোচনাধীন') : null,
        flagCount: newFlag ? ((u.flagCount || 0) + 1) : u.flagCount
      }).catch(err => console.warn(err));
      return {
        ...u,
        isFlagged: newFlag,
        flagReason: newFlag ? (reason || 'সন্দেহজনক পোস্ট বা আচরণ পর্যালোচনাধীন') : undefined,
        flagCount: newFlag ? (u.flagCount ? u.flagCount + 1 : 1) : u.flagCount
      };
    }
    return u;
  });

  saveManagedUsers(updated);
  addActivityLog({
    type: 'user_status_changed',
    title: `ইউজার ফ্ল্যাগ ${newFlag ? 'যুক্ত' : 'প্রত্যাহার'}`,
    description: `${targetName} কে ${newFlag ? 'ফ্ল্যাগড' : 'আন-ফ্ল্যাগ'} করা হয়েছে।`,
    actor: 'এডমিন'
  });
  return updated;
}

export function deleteUser(uid: string): UserProfile[] {
  const users = getManagedUsers();
  const updated = users.filter(u => u.uid !== uid);
  saveManagedUsers(updated);
  updateDoc(doc(db, 'users', uid), { status: 'deleted' }).catch(err => console.warn(err));
  addActivityLog({
    type: 'user_status_changed',
    title: 'ইউজার অপসারণ করা হয়েছে',
    description: `ইউজার ডাটাবেজ থেকে বাদ দেওয়া হয়েছে।`,
    actor: 'এডমিন'
  });
  return updated;
}

export function addNewManualUser(userData: Omit<UserProfile, 'uid' | 'joinedAt'>): UserProfile[] {
  const uid = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const citizenId = Math.floor(10000000 + Math.random() * 90000000).toString();
  const newUser: UserProfile = {
    ...userData,
    uid,
    citizenId,
    joinedAt: Date.now(),
    lastActiveAt: Date.now(),
    status: userData.status || 'active',
    isVerified: userData.isVerified !== undefined ? userData.isVerified : true,
    role: userData.role || 'citizen'
  };
  setDoc(doc(db, 'users', uid), newUser).catch(err => console.warn(err));
  const current = getManagedUsers();
  const updated = [newUser, ...current];
  saveManagedUsers(updated);
  addActivityLog({
    type: 'user_registered',
    title: 'নতুন ইউজার তৈরি করা হয়েছে',
    description: `${newUser.displayName} (${newUser.phone || newUser.email || 'নাগরিক'}) এডমিন দ্বারা যুক্ত হয়েছেন।`,
    actor: 'এডমিন'
  });
  return updated;
}

// 4. Activity Logs
export function getActivityLogs(): ActivityLog[] {
  return SEED_LOGS;
}

export async function addActivityLog(logData: Omit<ActivityLog, 'id' | 'timestamp'>) {
  try {
    const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const timestamp = Date.now();
    await setDoc(doc(db, 'logs', logId), {
      ...logData,
      timestamp,
      actor: logData.actor || 'এডমিন'
    });
  } catch (e) {
    console.warn('Error writing log', e);
  }
}

export async function fetchActivityLogsFromFirestore(): Promise<ActivityLog[]> {
  try {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(150));
    const querySnapshot = await getDocs(q);
    const logs: ActivityLog[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        type: data.type || 'post_created',
        title: data.title || '',
        description: data.description || '',
        timestamp: data.timestamp || Date.now(),
        actor: data.actor || 'অজ্ঞাত'
      });
    });
    return logs.length > 0 ? logs : SEED_LOGS;
  } catch (error) {
    console.error('Error fetching logs', error);
    return SEED_LOGS;
  }
}

// 5. Admin Stats Calculation
export function getAdminStats(postsCount: number): AdminStats {
  const users = getManagedUsers();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayMillis = todayStart.getTime();

  const joinedToday = users.filter(u => (u.joinedAt || 0) >= todayMillis).length;
  const activeCitizens = users.filter(u => u.status !== 'blocked').length;

  return {
    totalMembers: users.length,
    joinedToday: joinedToday,
    totalPosts: postsCount,
    totalCategories: 18,
    activeCitizens,
    pendingReports: 0
  };
}

// 6. Volunteer Management
export async function fetchVolunteersFromFirestore(): Promise<Volunteer[]> {
  try {
    const q = query(collection(db, 'volunteers'), orderBy('joinedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const volunteers: Volunteer[] = [];
    querySnapshot.forEach((docSnap) => {
      volunteers.push({ id: docSnap.id, ...docSnap.data() } as Volunteer);
    });
    return volunteers;
  } catch (err) {
    console.warn('Error fetching volunteers:', err);
    return [];
  }
}

export async function addVolunteer(volunteer: Omit<Volunteer, 'id' | 'joinedAt'>): Promise<string> {
  try {
    const vRef = doc(collection(db, 'volunteers'));
    const newVolunteer = {
      ...volunteer,
      joinedAt: Date.now()
    };
    await setDoc(vRef, newVolunteer);
    addActivityLog({
      type: 'user_registered',
      title: 'নতুন স্বেচ্ছাসেবী যুক্ত হয়েছে',
      description: `${volunteer.name} কে সেচ্ছাসেবী হিসেবে যুক্ত করা হয়েছে।`,
      actor: 'এডমিন'
    });
    return vRef.id;
  } catch (err) {
    console.error('Error adding volunteer:', err);
    throw err;
  }
}

export async function updateVolunteer(id: string, volunteer: Partial<Volunteer>) {
  try {
    await updateDoc(doc(db, 'volunteers', id), volunteer);
    addActivityLog({
      type: 'user_status_changed',
      title: 'স্বেচ্ছাসেবী তথ্য আপডেট',
      description: `স্বেচ্ছাসেবী (${id}) এর তথ্য আপডেট করা হয়েছে।`,
      actor: 'এডমিন'
    });
  } catch (err) {
    console.error('Error updating volunteer:', err);
    throw err;
  }
}

export async function deleteVolunteer(id: string) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'volunteers', id));
    addActivityLog({
      type: 'user_status_changed',
      title: 'স্বেচ্ছাসেবী অপসারণ',
      description: `স্বেচ্ছাসেবী (${id}) কে অপসারণ করা হয়েছে।`,
      actor: 'এডমিন'
    });
  } catch (err) {
    console.error('Error deleting volunteer:', err);
    throw err;
  }
}
