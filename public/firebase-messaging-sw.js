/**
 * Amar Kushtia - Background Service Worker for Push Notifications
 * Handles emergency alerts (blood emergency, power outage, flood/storm alert)
 * even when the browser is closed or the phone screen is locked.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Handle Web Push Events (FCM or Standard Web Push Server)
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: '🚨 আমার কুষ্টিয়া জরুরি বার্তা', 
        body: event.data.text() 
      };
    }
  }

  // Handle Firebase FCM payload structure or direct custom structure
  const notification = data.notification || data;
  const title = notification.title || '🚨 জরুরি সতর্কতা — আমার কুষ্টিয়া';
  const body = notification.body || 'জেলায় একটি নতুন জরুরি নোটিশ প্রকাশিত হয়েছে। অবিলম্বে চেক করুন।';
  const alertType = data.data?.type || notification.type || 'emergency';

  // Different vibration patterns depending on urgency
  // Emergency (blood / flood): intense triple pulse to wake user
  let vibratePattern = [400, 150, 400, 150, 400];
  if (alertType === 'blood') {
    vibratePattern = [500, 100, 500, 100, 500, 100, 500];
  } else if (alertType === 'weather' || alertType === 'warning') {
    vibratePattern = [300, 200, 300];
  }

  const options = {
    body: body,
    icon: notification.icon || '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: vibratePattern,
    tag: notification.tag || `kushtia-alert-${Date.now()}`,
    renotify: true,
    requireInteraction: true, // Keep on screen until acknowledged
    data: {
      url: data.data?.url || notification.url || '/',
      type: alertType,
      receivedAt: Date.now()
    },
    actions: [
      { action: 'view', title: '🚨 বিস্তারিত দেখুন' },
      { action: 'close', title: 'বন্ধ করুন' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 2. Handle Notification Clicks (User taps notification from lock screen or notification tray)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client && client.url !== targetUrl) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      // If no window is open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
