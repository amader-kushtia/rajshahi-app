import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, CheckCircle2, AlertCircle, Info, ShieldAlert, Settings, Radio } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { getFlashAlerts } from '../services/adminFeaturesService';

interface NotificationsPageProps {
  onBack: () => void;
  onNavigateToPost?: (categoryId: string) => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  isRead: boolean;
  linkCategory?: string;
  createdAt?: number;
}

const READ_NOTIFICATIONS_KEY = 'rajshahi_read_notifications_ids';

function getReadNotificationIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadNotificationIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(ids)));
  } catch {}
}

function formatRelativeTimeBangla(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'এইমাত্র';
  if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
  if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
  if (diffDays < 7) return `${diffDays} দিন আগে`;
  return new Date(timestamp).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack, onNavigateToPost }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time broadcasts from Firestore and local flash alerts
  useEffect(() => {
    const readIds = getReadNotificationIds();

    // 1. Initial baseline: Flash alerts from admin service
    const localAlerts = getFlashAlerts().map(fa => ({
      id: fa.id,
      title: fa.title,
      message: fa.message,
      timestamp: formatRelativeTimeBangla(fa.createdAt),
      type: (fa.type === 'emergency' ? 'alert' : fa.type === 'electricity' || fa.type === 'weather' ? 'warning' : 'info') as NotificationItem['type'],
      isRead: readIds.has(fa.id),
      linkCategory: fa.actionLink || (fa.type === 'emergency' ? 'emergency' : undefined),
      createdAt: fa.createdAt
    }));

    // 2. Real-time Firestore listener for emergency_broadcasts (sent from admin panel)
    let unsubscribeFirestore = () => {};

    try {
      const broadcastsQuery = query(
        collection(db, 'emergency_broadcasts'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      unsubscribeFirestore = onSnapshot(
        broadcastsQuery,
        (snapshot) => {
          const currentReadIds = getReadNotificationIds();
          const firestoreItems: NotificationItem[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const createdAt = data.createdAt || Date.now();
            const broadcastType = data.type || 'info';

            let uiType: NotificationItem['type'] = 'info';
            if (broadcastType === 'emergency' || broadcastType === 'blood') {
              uiType = 'alert';
            } else if (broadcastType === 'electricity' || broadcastType === 'weather' || broadcastType === 'warning') {
              uiType = 'warning';
            }

            let linkCat = data.actionUrl;
            if (!linkCat) {
              if (broadcastType === 'blood') linkCat = 'blood';
              else if (broadcastType === 'emergency') linkCat = 'emergency';
            }

            firestoreItems.push({
              id,
              title: data.title || 'জরুরি বিজ্ঞপ্তি',
              message: data.body || data.message || '',
              timestamp: formatRelativeTimeBangla(createdAt),
              type: uiType,
              isRead: currentReadIds.has(id),
              linkCategory: linkCat,
              createdAt
            });
          });

          // Merge Firestore broadcasts with local flash alerts, avoid duplicates
          const seenIds = new Set<string>();
          const combined: NotificationItem[] = [];

          firestoreItems.forEach(item => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              combined.push(item);
            }
          });

          localAlerts.forEach(item => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              combined.push(item);
            }
          });

          // Sort descending by creation date
          combined.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

          setNotifications(combined);
          setLoading(false);
        },
        (err) => {
          console.warn('NotificationsPage Firestore listener warning:', err);
          // Fallback to local alerts
          setNotifications(localAlerts);
          setLoading(false);
        }
      );
    } catch (e) {
      console.warn('Could not connect to emergency_broadcasts:', e);
      setNotifications(localAlerts);
      setLoading(false);
    }

    // Also listen for flash alert updates dispatched in window
    const handleFlashUpdate = () => {
      const updatedReadIds = getReadNotificationIds();
      const updatedLocalAlerts = getFlashAlerts().map(fa => ({
        id: fa.id,
        title: fa.title,
        message: fa.message,
        timestamp: formatRelativeTimeBangla(fa.createdAt),
        type: (fa.type === 'emergency' ? 'alert' : fa.type === 'electricity' || fa.type === 'weather' ? 'warning' : 'info') as NotificationItem['type'],
        isRead: updatedReadIds.has(fa.id),
        linkCategory: fa.actionLink || (fa.type === 'emergency' ? 'emergency' : undefined),
        createdAt: fa.createdAt
      }));

      setNotifications(prev => {
        const seen = new Set<string>();
        const merged: NotificationItem[] = [];
        prev.forEach(p => {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            merged.push(p);
          }
        });
        updatedLocalAlerts.forEach(u => {
          const existingIndex = merged.findIndex(m => m.id === u.id);
          if (existingIndex >= 0) {
            merged[existingIndex] = { ...merged[existingIndex], ...u };
          } else {
            merged.unshift(u);
          }
        });
        merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        return [...merged];
      });
    };

    window.addEventListener('rajshahi-flash-alert-updated', handleFlashUpdate);
    window.addEventListener('rajshahi-broadcast-updated', handleFlashUpdate);

    return () => {
      unsubscribeFirestore();
      window.removeEventListener('rajshahi-flash-alert-updated', handleFlashUpdate);
      window.removeEventListener('rajshahi-broadcast-updated', handleFlashUpdate);
    };
  }, []);

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const readIds = getReadNotificationIds();
    readIds.add(id);
    saveReadNotificationIds(readIds);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    window.dispatchEvent(new Event('rajshahi-notification-read-updated'));
  };

  const handleMarkAllAsRead = () => {
    const readIds = getReadNotificationIds();
    notifications.forEach(n => readIds.add(n.id));
    saveReadNotificationIds(readIds);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    window.dispatchEvent(new Event('rajshahi-notification-read-updated'));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    if (notif.linkCategory && onNavigateToPost) {
      onNavigateToPost(notif.linkCategory);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warning': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800">শহরের বিজ্ঞপ্তি</h1>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} নতুন
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              সব পঠিত করুন
            </button>
          )}
          <button 
            onClick={() => onNavigateToPost?.('notification-settings')}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Emergency Push Notification Activation Banner */}
      <div className="p-3 pb-0">
        <div 
          onClick={() => onNavigateToPost?.('notification-settings')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between gap-3 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xs font-black">🚨 জরুরি নোটিফিকেশন সচল করুন</h3>
              <p className="text-[11px] text-emerald-100">রক্তের ডাক, বিদ্যুৎ বিভ্রাট ও বন্যার সংকেত ফোনে রিং হবে</p>
            </div>
          </div>
          <button 
            type="button"
            className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-extrabold shrink-0 shadow-xs"
          >
            সেটিংস
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-3 space-y-2.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">বিজ্ঞপ্তি লোড হচ্ছে...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">কোনো নোটিফিকেশন নেই</h3>
            <p className="text-xs text-slate-400 mt-1">শহরের নতুন কোনো আপডেট থাকলে এখানে দেখতে পাবেন।</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.isRead 
                  ? 'bg-white border-pink-100 hover:bg-slate-50' 
                  : 'bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50/60 shadow-sm'
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-500"></div>
              )}
              
              <div className="flex gap-3.5">
                <div className={`mt-0.5 shrink-0 ${notif.isRead ? 'opacity-60' : 'opacity-100'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 pr-6">
                  <h4 className={`text-sm mb-1 ${notif.isRead ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                    {notif.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {notif.timestamp}
                    </span>
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        পঠিত মার্ক করুন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
