import { doc, setDoc, collection, addDoc, onSnapshot, query, where, orderBy, limit, getDocs, deleteDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';

export interface PushSubscriber {
  id: string;
  endpoint?: string;
  bloodGroup?: string;
  categories?: string[];
  userAgent: string;
  updatedAt: number;
}

export interface EmergencyBroadcastPayload {
  title: string;
  body: string;
  type: 'emergency' | 'blood' | 'weather' | 'electricity' | 'warning' | 'info';
  bloodGroup?: string;
  actionUrl?: string;
  hospital?: string;
  contactNumber?: string;
  tag?: string;
  soundType?: string;
}

/**
 * Register Service Worker for background notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    return registration;
  } catch (error) {
    console.warn('Service Worker registration notice:', error);
    return null;
  }
}

/**
 * Plays an audible emergency alert chime using Web Audio API
 * Generates clear, attention-grabbing sound without needing external MP3 dependencies
 */
export function playEmergencyChime(type: EmergencyBroadcastPayload['type'] | string = 'emergency', customSound?: string) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    const soundToPlay = customSound || type;

    if (soundToPlay === 'sound1') {
      // 1. Soft Bell
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now); // G5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc1.start(now);
      osc1.stop(now + 1.2);
    } else if (soundToPlay === 'sound2') {
      // 2. Sweet Ring
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1046.50, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
      gain.gain.setValueAtTime(0.3, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc1.start(now);
      osc1.stop(now + 0.8);
    } else if (soundToPlay === 'sound3') {
      // 3. Alert Tone
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.setValueAtTime(440, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      gain.gain.setValueAtTime(0.15, now + 0.15);
      gain.gain.linearRampToValueAtTime(0, now + 0.25);
      osc1.start(now);
      osc1.stop(now + 0.25);
    } else if (soundToPlay === 'sound4') {
      // 4. Double Chime (Weather/Electricity)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.18); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.36); // G5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc1.start(now);
      osc1.stop(now + 0.7);
    } else if (soundToPlay === 'sound5') {
      // 5. Magic Dust
      osc1.type = 'sine';
      [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, i) => {
        osc1.frequency.setValueAtTime(freq, now + i * 0.08);
      });
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc1.start(now);
      osc1.stop(now + 0.5);
    } else if (soundToPlay === 'sound6') {
      // 6. Success Pop
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc1.start(now);
      osc1.stop(now + 0.2);
    } else if (soundToPlay === 'sound7') {
      // 7. Urgent Siren
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.36);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.54);
      osc2.frequency.setValueAtTime(587, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } else if (soundToPlay === 'sound8') {
      // 8. Deep Echo
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, now); // E4
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc1.start(now);
      osc1.stop(now + 1.5);
    } else if (soundToPlay === 'sound9') {
      // 9. Marimba
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.start(now);
      osc1.stop(now + 0.15);
    } else if (soundToPlay === 'sound10') {
      // 10. Simple Ping
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.50, now); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc1.start(now);
      osc1.stop(now + 0.3);
    } else if (soundToPlay === 'blood' || soundToPlay === 'emergency') {
      // Legacy fallback
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.36);
      osc2.frequency.setValueAtTime(587, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } else if (soundToPlay === 'electricity' || soundToPlay === 'weather') {
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.18);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      osc1.start(now);
      osc1.stop(now + 0.55);
    } else {
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.start(now);
      osc1.stop(now + 0.4);
    }
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(bloodGroup?: string): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notification API not supported by this browser');
    return false;
  }

  try {
    let permission = Notification.permission;

    if (permission !== 'granted' && permission !== 'denied') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      // Register Service Worker
      const reg = await registerServiceWorker();
      
      // Save subscription info to Firestore
      let subscriberId = localStorage.getItem('rajshahi_subscriber_id');
      if (!subscriberId) {
        subscriberId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('rajshahi_subscriber_id', subscriberId);
      }

      await registerSubscriberInFirestore(subscriberId, bloodGroup);

      // Play soft confirmation chime
      playEmergencyChime('info');

      // Show welcome notification
      if (reg) {
        (reg as any).showNotification('আমার কুষ্টিয়া — নোটিফিকেশন সচল হয়েছে', {
          body: 'শহরের জরুরি রক্তের ডাক, বিদ্যুৎ বিভ্রাট ও দুর্যোগ সতর্কতা এখন আপনার ফোনে বাজবে।',
          icon: '/pwa-192x192.png',
          vibrate: [200, 100, 200],
          tag: 'welcome-notification'
        });
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Save device / subscriber to Firestore
 */
export async function registerSubscriberInFirestore(subscriberId: string, bloodGroup?: string, categories?: string[]) {
  try {
    const subscriberRef = doc(db, 'fcm_tokens', subscriberId);
    const data: PushSubscriber = {
      id: subscriberId,
      bloodGroup: bloodGroup || localStorage.getItem('rajshahi_blood_group_pref') || 'O+',
      categories: categories || ['blood', 'electricity', 'weather', 'emergency'],
      userAgent: navigator.userAgent,
      updatedAt: Date.now()
    };
    await setDoc(subscriberRef, data, { merge: true });
    localStorage.setItem('rajshahi_notifications_enabled', 'true');
    if (bloodGroup) {
      localStorage.setItem('rajshahi_blood_group_pref', bloodGroup);
    }
  } catch (err) {
    console.warn('Could not save subscriber to Firestore:', err);
  }
}

/**
 * Dispatch an emergency push notification to the device
 * Uses Service Worker notification with vibration and audio chime
 */
export async function showEmergencyPushNotification(payload: EmergencyBroadcastPayload) {
  // 1. Play audible alarm chime
  playEmergencyChime(payload.type, payload.soundType);

  // 2. Check if notifications are permitted
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Intense vibration pattern for emergencies
  const vibratePattern = payload.type === 'blood' 
    ? [500, 100, 500, 100, 500, 100, 500] 
    : [400, 150, 400, 150, 400];

  const notificationOptions: any = {
    body: payload.body,
    icon: 'https://placehold.co/192x192/059669/ffffff.png?text=SC',
    badge: 'https://placehold.co/96x96/059669/ffffff.png?text=SC',
    vibrate: vibratePattern,
    tag: payload.tag || `rajshahi-${payload.type}-${Date.now()}`,
    renotify: true,
    requireInteraction: true,
    data: {
      url: payload.actionUrl || '/',
      type: payload.type,
      time: Date.now()
    }
  };

  try {
    // Prefer Service Worker registration (wakes up mobile phone from sleep/lock screen)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(payload.title, notificationOptions);
        return;
      }
    }

    // Fallback for standalone window
    new Notification(payload.title, notificationOptions);
  } catch (err) {
    console.warn('Error showing push notification:', err);
    try {
      new Notification(payload.title, { body: payload.body });
    } catch {}
  }
}

/**
 * Get the real count of registered subscribers/tokens from Firestore
 */
export async function getRealSubscriberCount(): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(db, 'fcm_tokens'));
    const count = snap.data().count;
    // If fcm_tokens has subscribers, return that count
    if (count > 0) {
      return count;
    }
    // Fallback: check users collection
    const userSnap = await getCountFromServer(collection(db, 'users'));
    return Math.max(1, userSnap.data().count);
  } catch (err) {
    console.warn('Could not fetch subscriber count from Firestore:', err);
    return 1;
  }
}

/**
 * Delete an emergency broadcast from Firestore
 */
export async function deleteEmergencyBroadcast(broadcastId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'emergency_broadcasts', broadcastId));
    return true;
  } catch (err) {
    console.error('Failed to delete broadcast:', err);
    return false;
  }
}

/**
 * Publish emergency broadcast to Firestore (reaches all citizens)
 */
export async function publishEmergencyBroadcast(payload: EmergencyBroadcastPayload): Promise<{ success: boolean; id?: string; deliveredCount: number }> {
  try {
    const subscriberCount = await getRealSubscriberCount();
    const colRef = collection(db, 'emergency_broadcasts');
    const docRef = await addDoc(colRef, {
      ...payload,
      createdAt: Date.now(),
      isActive: true,
      sender: 'Admin Console',
      deliveredCount: subscriberCount,
      openedCount: 0
    });

    // Also trigger on current client immediately
    showEmergencyPushNotification(payload);
    return { success: true, id: docRef.id, deliveredCount: subscriberCount };
  } catch (err) {
    console.error('Failed to publish emergency broadcast to Firestore:', err);
    // Local fallback
    showEmergencyPushNotification(payload);
    return { success: false, deliveredCount: 1 };
  }
}

/**
 * Initialize real-time listener for incoming emergency broadcasts
 * Listens for new emergency broadcasts created in the last 15 minutes
 */
export function listenForEmergencyBroadcasts(onAlertReceived: (alert: EmergencyBroadcastPayload) => void) {
  try {
    const startTime = Date.now() - 1000 * 60 * 15; // only recent alerts
    const q = query(
      collection(db, 'emergency_broadcasts'),
      where('createdAt', '>=', startTime),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const handledIds = new Set<string>();

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const id = change.doc.id;
          if (!handledIds.has(id)) {
            handledIds.add(id);
            const data = change.doc.data() as EmergencyBroadcastPayload & { createdAt: number };
            // Check user blood group filter if applicable
            const myBlood = localStorage.getItem('rajshahi_blood_group_pref');
            if (data.type === 'blood' && data.bloodGroup && myBlood && data.bloodGroup !== myBlood) {
              // Not matching blood group preference, skip loud alert unless generic
              return;
            }

            // Only notify if notification permission is granted
            showEmergencyPushNotification(data);
            onAlertReceived(data);
          }
        }
      });
    }, (err) => {
      console.warn('Emergency broadcasts listener notice:', err);
    });
  } catch (err) {
    console.warn('Could not setup emergency broadcast listener:', err);
    return () => {};
  }
}
