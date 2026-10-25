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
import { isUserAdmin, verifyCustomClaimsAdmin, isPhoneAdminHash } from '../utils/adminAuth';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginAsDemoUser: (name?: string) => void;
  loginWithCredentials: (phoneOrEmail: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'kushtia_admin_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<Record<string, any> | null>(null);
  const updateUserProfile = (profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem('kushtia_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Error persisting user profile to localStorage', e);
    }
  };

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const demo = sessionStorage.getItem('kushtia_demo_user');
      if (demo) return JSON.parse(demo);

      const persisted = localStorage.getItem('kushtia_user_profile');
      if (persisted) return JSON.parse(persisted);
    } catch (e) {
      console.warn('Error reading stored user', e);
    }
    return null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        sessionStorage.removeItem('kushtia_demo_user');
        
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

          const fbPhone = (extraData.phone || fbUser.phoneNumber || fbUser.email?.split('@')[0] || '').trim();
          const isPhoneAdmin = await isPhoneAdminHash(fbPhone);
          const isAdminAccount = verifyCustomClaimsAdmin(claims) || isPhoneAdmin || extraData.role === 'admin';

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
            banReason: extraData.banReason,
            bloodGroup: extraData.bloodGroup,
            profession: extraData.profession,
            upazila: extraData.upazila,
            dob: extraData.dob,
          };

          if (isAdminAccount && extraData.role !== 'admin' && fbUser.uid) {
            setDoc(userRef, { role: 'admin' }, { merge: true }).catch(err => {
              console.warn('Could not sync admin role to document:', err);
            });
          }

          setUser(profile);
          try {
            localStorage.setItem('kushtia_user_profile', JSON.stringify(profile));
          } catch (e) {}
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user status:", error);
          setLoading(false);
        });

        return () => unsubUser();
      } else {
        setCustomClaims(null);
        const stored = sessionStorage.getItem('kushtia_demo_user');
        const persisted = localStorage.getItem('kushtia_user_profile');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else if (persisted) {
          try {
            setUser(JSON.parse(persisted));
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

  const [loading, setLoading] = useState<boolean>(true);

  const loginWithCredentials = async (phoneOrEmail: string, passInput: string) => {
    let cleanInput = phoneOrEmail.trim();
    if (!cleanInput.includes('@')) {
      const normalizedPhone = cleanInput.replace(/^(\+880|880)/, '0');
      cleanInput = `${normalizedPhone}@kushtiaconnect.local`;
    } else {
      cleanInput = cleanInput.toLowerCase();
    }

    const phonePart = cleanInput.split('@')[0];
    const isMatchedAdminPhone = await isPhoneAdminHash(phonePart);

    try {
      await signInWithEmailAndPassword(auth, cleanInput, passInput);
    } catch (err: any) {
      // If user account is not registered yet in Firebase Auth, auto-create it for authorized admin
      if ((err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') && isMatchedAdminPhone) {
        try {
          await createUserWithEmailAndPassword(auth, cleanInput, passInput);
        } catch (createErr: any) {
          // If creation fails because user already exists or weak password, rethrow error
          throw err;
        }
      } else {
        // ALWAYS rethrow password or authentication errors
        throw err;
      }
    }
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
      localStorage.removeItem('kushtia_user_profile');
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


  const isAdmin = isUserAdmin(user, customClaims);

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
