import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { collection, getCountFromServer, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { postService } from '../services/postService';
import { 
  AppThemeConfig, 
  ThemeColorKey, 
  UserProfile, 
  ActivityLog, 
  AdminStats 
} from '../types';
import { 
  getAppThemeConfig, 
  saveAppThemeConfig, 
  THEME_PRESETS, 
  DEFAULT_APP_THEME,
  ADMIN_CONFIG_KEY,
  getManagedUsers,
  saveManagedUsers,
  toggleUserVerified,
  toggleUserBlocked,
  deleteUser,
  addNewManualUser,
  getActivityLogs,
  addActivityLog,
  getAdminStats,
  fetchVolunteersFromFirestore,
  addVolunteer,
  updateVolunteer,
  deleteVolunteer
} from '../services/adminService';
import {
  verifyAdminPinWithFirestore,
  changeAdminPinInFirestore,
  setAdminPinInFirestore,
  isAdminPinSessionVerified,
  setAdminPinSessionVerified
} from '../utils/adminPinSecurity';

interface AdminConfigContextType {
  themeConfig: AppThemeConfig;
  updateThemeConfig: (newConfig: Partial<AppThemeConfig>) => void;
  setThemeKey: (key: ThemeColorKey) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updatePin: (newPin: string) => Promise<boolean>;
  users: UserProfile[];
  toggleVerifyUser: (uid: string) => void;
  toggleBlockUser: (uid: string) => void;
  deleteUserById: (uid: string) => void;
  addUser: (data: Omit<UserProfile, 'uid' | 'joinedAt'>) => void;
  logs: ActivityLog[];
  refreshLogs: () => void;
  stats: AdminStats;
  refreshStats: (postsCount?: number) => void;
  themePreset: typeof THEME_PRESETS[ThemeColorKey];

  // Helper properties & state aliases for convenient access across components
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  themeColor: ThemeColorKey;
  setThemeColor: (key: ThemeColorKey) => void;
  marqueeNotice: string;
  updateMarqueeNotice: (notice: string) => void;
  isAdmin: boolean;
  verifyPin: (pin: string) => Promise<boolean>;
  adminLogout: () => void;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
  analytics: {
    totalUsers: number;
    activeUsers: number;
    totalPosts: number;
  };
  volunteers: any[];
  refreshVolunteers: () => Promise<void>;
  addNewVolunteer: (v: any) => Promise<void>;
  editVolunteer: (id: string, v: any) => Promise<void>;
  removeVolunteer: (id: string) => Promise<void>;
}

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

export const AdminConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>(() => {
    const initial = getAppThemeConfig();
    if (!initial.appName || initial.appName === 'আমার কুষ্টিয়া' || initial.appName === 'কুষ্টিয়া জেলা' || initial.appName === 'আমার কুষ্টিয়া') {
      return { ...initial, appName: '(আমার কুষ্টিয়া)' };
    }
    return initial;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('kushtia_admin_auth') === 'true' && isAdminPinSessionVerified();
    } catch {
      return false;
    }
  });

  const [users, setUsers] = useState<UserProfile[]>(() => getManagedUsers());
  const [logs, setLogs] = useState<ActivityLog[]>(() => getActivityLogs());
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats>(() => getAdminStats(postService.getMasterPosts().length));
  const [firestoreUserCount, setFirestoreUserCount] = useState<number | null>(null);
  const [firestoreActiveUserCount, setFirestoreActiveUserCount] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const adminConfigUnsubRef = useRef<(() => void) | null>(null);

  // Fetch real user count from Firestore using efficient aggregation query (getCountFromServer);
  // Never downloads the full collection to maintain extreme performance and scalability with 200,000+ users.
  const fetchRealUserCount = async () => {
    try {
      const usersCol = collection(db, 'users');
      const countSnap = await getCountFromServer(usersCol);
      const count = countSnap.data().count;
      setFirestoreUserCount(count);
      setFirestoreActiveUserCount(count);
      setStats(prev => ({
        ...prev,
        totalMembers: count,
        activeCitizens: count
      }));
    } catch (err) {
      console.warn('Count aggregation notice from Firestore:', err);
      // If getCountFromServer fails, gracefully retain existing state or managed users cache without downloading full collection
      const cachedUsers = getManagedUsers();
      const cachedCount = cachedUsers.length;
      setFirestoreUserCount(prev => (prev !== null ? prev : cachedCount));
      setFirestoreActiveUserCount(prev => (prev !== null ? prev : cachedCount));
      setStats(prev => ({
        ...prev,
        totalMembers: prev.totalMembers || cachedCount,
        activeCitizens: prev.activeCitizens || cachedCount
      }));
    }
  };

  useEffect(() => {
    // Sync AppThemeConfig from Firestore so it affects all citizens in real time
    const unsub = onSnapshot(doc(db, 'admin_config', 'global'), (snap) => {
      if (snap.exists()) {
        const remoteData = snap.data() as Partial<AppThemeConfig>;
        if (!remoteData.appName || remoteData.appName === 'আমার কুষ্টিয়া' || remoteData.appName === 'কুষ্টিয়া জেলা') {
          remoteData.appName = 'আমার কুষ্টিয়া';
        }
        setThemeConfig(prev => {
          const merged = { ...prev, ...remoteData };
          try {
            localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('Error saving remote config to localStorage:', e);
          }
          return merged;
        });

        // Notify other components of the remote update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('kushtia-app-config-updated', { detail: remoteData }));
        }
      }
    }, (err) => {
      console.warn('Admin config sync notice:', err);
    });

    adminConfigUnsubRef.current = unsub;

    fetchRealUserCount();

    const handleUsersUpdated = () => {
      fetchRealUserCount();
      setUsers(getManagedUsers());
    };

    const handleLocalConfigUpdated = (e: any) => {
      if (e?.detail) {
        setThemeConfig(prev => ({ ...prev, ...e.detail }));
      } else {
        setThemeConfig(getAppThemeConfig());
      }
    };

    window.addEventListener('kushtia-users-updated', handleUsersUpdated);
    window.addEventListener('kushtia-app-config-updated', handleLocalConfigUpdated);
    window.addEventListener('storage', handleUsersUpdated);
    window.addEventListener('storage', handleLocalConfigUpdated);
    
    fetchVolunteersFromFirestore().then(v => setVolunteers(v));

    return () => {
      // Proper cleanup — listener বন্ধ হবে component unmount-এ
      if (adminConfigUnsubRef.current) {
        adminConfigUnsubRef.current();
        adminConfigUnsubRef.current = null;
      }
      window.removeEventListener('kushtia-users-updated', handleUsersUpdated);
      window.removeEventListener('kushtia-app-config-updated', handleLocalConfigUpdated);
      window.removeEventListener('storage', handleUsersUpdated);
      window.removeEventListener('storage', handleLocalConfigUpdated);
    };
  }, []);

  // Current Theme Preset based on themeKey
  const themePreset = THEME_PRESETS[themeConfig.themeKey] || THEME_PRESETS.emerald;

  const updateThemeConfig = (newConfig: Partial<AppThemeConfig>) => {
    const updated = saveAppThemeConfig(newConfig);
    setThemeConfig(updated);
    setLogs(getActivityLogs());
  };

  const setThemeKey = (key: ThemeColorKey) => {
    const preset = THEME_PRESETS[key];
    if (preset) {
      updateThemeConfig({
        themeKey: key,
        primaryColor: preset.primary,
        primaryHover: preset.hover,
        primaryLight: preset.light,
        primaryGradient: preset.gradient
      });
    }
  };

  const updateMarqueeNotice = (notice: string) => {
    updateThemeConfig({
      marqueeAnnouncement: notice,
      isMarqueeActive: true
    });
  };

  const changePin = async (oldPin: string, newPin: string): Promise<boolean> => {
    const res = await changeAdminPinInFirestore(oldPin, newPin);
    return res.success;
  };

  const loginAdmin = async (pin: string): Promise<boolean> => {
    const res = await verifyAdminPinWithFirestore(pin);
    if (res.success) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('kushtia_admin_auth', 'true');
        setAdminPinSessionVerified(true);
      } catch (e) {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('kushtia_admin_auth');
      setAdminPinSessionVerified(false);
    } catch (e) {}
  };

  const updatePin = async (newPin: string): Promise<boolean> => {
    const res = await setAdminPinInFirestore(newPin);
    return res.success;
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    const res = await verifyAdminPinWithFirestore(pin);
    if (res.success) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('kushtia_admin_auth', 'true');
        setAdminPinSessionVerified(true);
      } catch (e) {}
      return true;
    }
    return false;
  };

  const toggleVerifyUser = (uid: string) => {
    const updated = toggleUserVerified(uid);
    setUsers(updated);
    setLogs(getActivityLogs());
  };

  const toggleBlockUser = (uid: string) => {
    const updated = toggleUserBlocked(uid);
    setUsers(updated);
    setLogs(getActivityLogs());
    setStats(getAdminStats(stats.totalPosts));
  };

  const deleteUserById = (uid: string) => {
    const updated = deleteUser(uid);
    setUsers(updated);
    setLogs(getActivityLogs());
    setStats(getAdminStats(stats.totalPosts));
  };

  const addUser = (data: Omit<UserProfile, 'uid' | 'joinedAt'>) => {
    const updated = addNewManualUser(data);
    setUsers(updated);
    setLogs(getActivityLogs());
    setStats(getAdminStats(stats.totalPosts));
  };

  const refreshLogs = () => {
    setLogs(getActivityLogs());
  };

  const refreshStats = (postsCount?: number) => {
    const pCount = typeof postsCount === 'number' ? postsCount : postService.getMasterPosts().length;
    setStats(getAdminStats(pCount));
    fetchRealUserCount();
  };

  const refreshVolunteers = async () => {
    const v = await fetchVolunteersFromFirestore();
    setVolunteers(v);
  };

  const addNewVolunteer = async (v: any) => {
    await addVolunteer(v);
    await refreshVolunteers();
  };

  const editVolunteer = async (id: string, v: any) => {
    await updateVolunteer(id, v);
    await refreshVolunteers();
  };

  const removeVolunteer = async (id: string) => {
    await deleteVolunteer(id);
    await refreshVolunteers();
  };

  return (
    <AdminConfigContext.Provider
      value={{
        themeConfig,
        updateThemeConfig,
        setThemeKey,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updatePin,
        users,
        toggleVerifyUser,
        toggleBlockUser,
        deleteUserById,
        addUser,
        logs,
        refreshLogs,
        stats,
        refreshStats,
        themePreset,
        isDrawerOpen,
        setIsDrawerOpen,
        themeColor: themeConfig.themeKey,
        setThemeColor: setThemeKey,
        marqueeNotice: themeConfig.marqueeAnnouncement,
        updateMarqueeNotice,
        isAdmin: isAdminAuthenticated,
        verifyPin: verifyPin,
        adminLogout: logoutAdmin,
        changePin,
        analytics: {
          totalUsers: firestoreUserCount !== null ? firestoreUserCount : 0,
          activeUsers: firestoreActiveUserCount !== null ? firestoreActiveUserCount : 0,
          totalPosts: stats.totalPosts || postService.getMasterPosts().length || 0
        },
        volunteers,
        refreshVolunteers,
        addNewVolunteer,
        editVolunteer,
        removeVolunteer
      }}
    >
      {children}
    </AdminConfigContext.Provider>
  );
};

export const useAdminConfig = () => {
  const context = useContext(AdminConfigContext);
  if (!context) {
    throw new Error('useAdminConfig must be used within an AdminConfigProvider');
  }
  return context;
};
