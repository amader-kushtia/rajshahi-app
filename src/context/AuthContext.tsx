import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  getIdTokenResult,
  IdTokenResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';
import { isUserAdmin, verifyCustomClaimsAdmin } from '../utils/adminAuth';

// ... (keep interface and imports)
// Remove ADMIN_EMAIL everywhere it's used inside AuthContext.tsx

// In useEffect:
// const isEmailAdmin = fbEmail === ADMIN_EMAIL.toLowerCase(); // REMOVE
// const isAdminAccount = isCustomClaimAdmin; // UPDATE

// In loginWithCredentials:
// const isAdminEmail = cleanEmail === ADMIN_EMAIL.toLowerCase() || ... // REMOVE
// If you want to keep admin login, it must be handled via custom claims, not email.

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginAsDemoUser: (name?: string) => void;
  loginWithCredentials: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'kushtia_admin_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<Record<string, any> | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const demo = sessionStorage.getItem('kushtia_demo_user');
      if (demo) {
        return JSON.parse(demo);
      }
    } catch (e) {
      console.warn('Error reading stored demo user', e);
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        sessionStorage.removeItem('kushtia_demo_user');
        
        // Listen to user document in real-time to detect ban/block status changes instantly
        const userRef = doc(db, 'users', fbUser.uid);
        const unsubUser = onSnapshot(userRef, async (docSnap) => {
          let claims: Record<string, any> | null = null;
          try {
            const idTokenResult: IdTokenResult = await getIdTokenResult(fbUser, true);
            claims = idTokenResult.claims;
            setCustomClaims(claims);
          } catch (claimsErr) {
            console.warn('Could not fetch custom claims:', claimsErr);
          }

          let extraData: Partial<UserProfile> = {};
          if (docSnap.exists()) {
            extraData = docSnap.data() as Partial<UserProfile>;
          }

          const fbEmail = (fbUser.email || extraData.email || '').trim().toLowerCase();
          // Check if current user is admin
          const envAdmin1 = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
          const envAdmin2 = (import.meta.env.VITE_ADMIN_EMAIL_2 || '').toLowerCase();
          const allowedAdminEmails = ['habiburrahman962540@gmail.com', 'mh7539019@gmail.com', envAdmin1, envAdmin2].filter(Boolean);
          const isHardcodedAdmin = Boolean(fbEmail && allowedAdminEmails.includes(fbEmail));
          const isAdminAccount = verifyCustomClaimsAdmin(claims) || isHardcodedAdmin || extraData.role === 'admin';

          const profile: UserProfile = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || extraData.displayName || (isAdminAccount ? 'আমার কুষ্টিয়া অ্যাডমিন' : 'সম্মানিত নাগরিক'),
            email: fbUser.email || extraData.email,
            photoURL: fbUser.photoURL || extraData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            isVerified: fbUser.emailVerified,
            phone: extraData.phone || fbUser.phoneNumber || undefined,
            ward: extraData.ward,
            address: extraData.address,
            citizenId: extraData.citizenId,
            role: isAdminAccount ? 'admin' : (extraData.role || 'citizen'),
            status: extraData.status || 'active',
            banExpiresAt: extraData.banExpiresAt,
            banReason: extraData.banReason
          };

          setUser(profile);
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user status:", error);
          setLoading(false);
        });

        return () => unsubUser();
      } else {
        setCustomClaims(null);
        const stored = sessionStorage.getItem('kushtia_demo_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithCredentials = async (emailInput: string, passInput: string) => {
    let cleanInput = emailInput.trim();
    if (!cleanInput.includes('@')) {
      const normalizedPhone = cleanInput.replace(/^(\+880|880)/, '0');
      cleanInput = `${normalizedPhone}@kushtiaconnect.local`;
    } else {
      cleanInput = cleanInput.toLowerCase();
    }
    await signInWithEmailAndPassword(auth, cleanInput, passInput);
    window.dispatchEvent(new CustomEvent("require-auth-close"));
  };
  const loginAsDemoUser = (name?: string) => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    const demoProfile: UserProfile = {
      uid: 'citizen-' + Math.random().toString(36).substring(2, 9),
      displayName: name || 'কুষ্টিয়া সম্মানিত নাগরিক',
      email: 'citizen@kushtia.gov.bd',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'citizen'
    };
    sessionStorage.setItem('kushtia_demo_user', JSON.stringify(demoProfile));
    setUser(demoProfile);
    window.dispatchEvent(new CustomEvent('require-auth-close'));
  };

  const logOut = async () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      sessionStorage.removeItem('kushtia_demo_user');
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error', e);
    }
    setUser(null);
    setCustomClaims(null);
    window.dispatchEvent(new CustomEvent('require-auth'));
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUser(profile);
  };

  const isAdmin = isUserAdmin(user, customClaims, firebaseUser?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        isAuthModalOpen: false, // Deprecated
        openAuthModal: () => window.dispatchEvent(new CustomEvent('require-auth')),
        closeAuthModal: () => window.dispatchEvent(new CustomEvent('require-auth-close')),
        loginAsDemoUser,
        loginWithCredentials,
        logOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
