import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Rajshahi coordinates: 23.9000° N, 89.1200° E
const KUSHTIA_LAT = 23.9000;
const KUSHTIA_LON = 89.1200;

export interface WeatherRecord {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number; // km/h
  pressure: number;
  visibility: number; // km
  condition: string;
  description: string;
  iconCode: string;
  sunrise?: number;
  sunset?: number;
  lastUpdated: string;
  updatedAt: number;
  source: string;
}

/**
 * Fetch latest weather data from OpenWeather and save to Firestore
 */
async function fetchAndStoreKushtiaWeather(): Promise<WeatherRecord> {
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    const errorMsg = "OPENWEATHER_API_KEY environment variable is not configured in Firebase Functions.";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${KUSHTIA_LAT}&lon=${KUSHTIA_LON}&units=metric&lang=bn&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errText = await response.text();
    logger.error("OpenWeather API call failed", { status: response.status, body: errText });
    throw new Error(`OpenWeather API failed with status ${response.status}: ${errText}`);
  }

  const data: any = await response.json();

  const weatherRecord: WeatherRecord = {
    temp: Math.round(data.main?.temp ?? 28),
    feelsLike: Math.round(data.main?.feels_like ?? 30),
    tempMin: Math.round(data.main?.temp_min ?? 24),
    tempMax: Math.round(data.main?.temp_max ?? 31),
    humidity: data.main?.humidity ?? 68,
    windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // convert m/s to km/h
    pressure: data.main?.pressure ?? 1012,
    visibility: Math.round((data.visibility || 8000) / 1000), // meters to km
    condition: data.weather?.[0]?.main || "Clouds",
    description: data.weather?.[0]?.description || "স্বাভাবিক আবহাওয়া",
    iconCode: data.weather?.[0]?.icon || "02d",
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    lastUpdated: new Date().toLocaleTimeString("bn-BD", { 
      timeZone: "Asia/Dhaka", 
      hour: "2-digit", 
      minute: "2-digit" 
    }),
    updatedAt: Date.now(),
    source: "openweathermap_cloud_function"
  };

  // Cache to Firestore in the single centralized document "weather_cache/kushtia"
  // All 300,000 users will read this single document!
  const docRef = db.collection("weather_cache").doc("kushtia");
  await docRef.set(weatherRecord, { merge: true });

  // Also sync to "weather_cache/current" for convenience
  await db.collection("weather_cache").doc("current").set(weatherRecord, { merge: true });

  logger.info("Successfully fetched and saved Rajshahi weather to Firestore weather_cache", {
    temp: weatherRecord.temp,
    condition: weatherRecord.condition,
    time: weatherRecord.lastUpdated
  });

  return weatherRecord;
}

/**
 * One-time setup: Promote a user to admin via custom claims.
 * Trigger via HTTPS with the ADMIN_SECRET_KEY.
 * Usage: POST /setAdminClaim?email=user@example.com&token=YOUR_SECRET_KEY
 */
export const setAdminClaim = onRequest({ cors: true }, async (req, res) => {
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (!secretKey || req.query.token !== secretKey) {
    res.status(403).send("Forbidden");
    return;
  }

  const email = req.query.email as string;
  if (!email) {
    res.status(400).send("Email required");
    return;
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true, role: 'admin' });
    res.status(200).send(`Successfully promoted ${email} to admin.`);
  } catch (error: any) {
    logger.error("Error setting admin claim:", error);
    res.status(500).send(error.message);
  }
});

/**
 * Scheduled Cloud Function (Runs every 15 minutes)
 * Scalability: 1 API call every 15 minutes = 96 calls/day total.
 * Zero client-side OpenWeather API calls for 300,000 users.
 */
export const updateWeatherEvery15Minutes = onSchedule("every 15 minutes", async (event) => {
  logger.info("Triggered scheduled weather sync job for Rajshahi", { timestamp: event.scheduleTime });
  try {
    const result = await fetchAndStoreKushtiaWeather();
    logger.info("Weather cache updated successfully", { lastUpdated: result.lastUpdated });
  } catch (error: any) {
    logger.error("Failed to execute scheduled weather synchronization:", error);
  }
});

/**
 * On-Demand HTTP Trigger
 * Endpoint: /syncWeatherNow
 * Allows admin or manual triggers to immediately refresh the cache without waiting 15 mins.
 * Protected by secret header / admin token or Firebase ID Token verification.
 */
export const syncWeatherNow = onRequest({ cors: true }, async (req, res) => {
  try {
    const secretKey = process.env.ADMIN_SECRET_KEY;

    if (!secretKey) {
      logger.error("ADMIN_SECRET_KEY environment variable is not configured in Firebase Functions.");
      res.status(500).json({
        success: false,
        error: "Server misconfigured: ADMIN_SECRET_KEY is not set."
      });
      return;
    }

    const authHeader = req.headers.authorization || req.headers['x-admin-token'] || req.query.token;
    let authorized = false;

    if (authHeader) {
      const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.split('Bearer ')[1]
        : String(authHeader);

      if (token === secretKey) {
        authorized = true;
      } else {
          try {
          const decoded = await admin.auth().verifyIdToken(token);
          if (decoded && (decoded.admin === true || decoded.role === 'admin' || decoded.role === 'super_admin')) {
            authorized = true;
          }
        } catch (e) {
          // invalid token
        }
      }
    }

    if (!authorized) {
      res.status(401).json({ success: false, error: "Unauthorized." });
      return;
    }

    const result = await fetchAndStoreKushtiaWeather();
    res.status(200).json({ success: true, message: "Weather cache updated successfully.", data: result });
  } catch (error: any) {
    logger.error("Manual weather sync failed:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to update weather cache" });
  }
});

/**
 * Triggered automatically when an emergency alert is created in Firestore.
 * Broadcasts Web Push / FCM notifications to all 200,000+ registered citizens instantly
 * using Firebase Cloud Messaging Topic Messaging (unlimited subscribers with single call).
 */
export const onEmergencyBroadcastCreated = onDocumentCreated("emergency_broadcasts/{alertId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.warn("No data associated with emergency broadcast event");
    return;
  }

  const alertData = snapshot.data();
  const title = alertData.title || "🚨 জরুরি নোটিফিকেশন — কুষ্টিয়া কানেক্ট";
  const body = alertData.body || "শহরের একটি নতুন জরুরি সতর্কতা প্রকাশিত হয়েছে।";
  const alertType = alertData.type || "emergency";
  const bloodGroup = alertData.bloodGroup;

  logger.info("New emergency broadcast created, preparing FCM topic dispatch:", { title, alertType, bloodGroup });

  try {
    // 1. Primary Broadcast: Send to 'emergency_alerts' topic (Reaches all 200,000+ citizens instantly)
    const topicMessage: admin.messaging.TopicMessage = {
      topic: "emergency_alerts",
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: alertType,
        url: alertData.actionUrl || "/",
        timestamp: String(Date.now()),
        bloodGroup: bloodGroup || ""
      },
      webpush: {
        headers: {
          Urgency: "high"
        },
        notification: {
          icon: "https://rajshahi-63d2d.web.app/pwa-192x192.png",
          badge: "https://rajshahi-63d2d.web.app/pwa-96x96.png",
          vibrate: [500, 100, 500, 100, 500],
          requireInteraction: true
        }
      }
    };

    const messageId = await admin.messaging().send(topicMessage);
    logger.info("FCM Emergency Topic Broadcast sent successfully:", { messageId, topic: "emergency_alerts" });

    // 2. Specific blood group topic broadcast if applicable
    if (alertType === "blood" && bloodGroup) {
      const cleanBg = String(bloodGroup).replace("+", "pos").replace("-", "neg");
      try {
        const bloodTopicMessage: admin.messaging.TopicMessage = {
          ...topicMessage,
          topic: `emergency_blood_${cleanBg}`
        };
        await admin.messaging().send(bloodTopicMessage);
        logger.info(`FCM targeted blood topic broadcast sent for ${cleanBg}`);
      } catch (bloodErr) {
        logger.warn("Blood topic dispatch notice:", bloodErr);
      }
    }
  } catch (error) {
    logger.error("Error dispatching FCM emergency topic broadcast:", error);
  }
});

/**
 * Automatically subscribes newly registered FCM tokens to emergency topics
 * when added to Firestore fcm_tokens collection.
 */
export const onFCMTokenRegistered = onDocumentCreated("fcm_tokens/{tokenId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  const token = data?.token || (typeof data?.id === "string" && !data.id.startsWith("sub_") ? data.id : undefined);

  if (!token) {
    logger.info(`fcm_tokens document ${event.params.tokenId} does not contain direct push token string.`);
    return;
  }

  try {
    // Subscribe to general emergency topic
    await admin.messaging().subscribeToTopic(token, "emergency_alerts");
    logger.info(`Subscribed token ${event.params.tokenId} to emergency_alerts topic`);

    // Subscribe to blood group topic if provided
    if (data.bloodGroup) {
      const cleanBg = String(data.bloodGroup).replace("+", "pos").replace("-", "neg");
      await admin.messaging().subscribeToTopic(token, `emergency_blood_${cleanBg}`);
      logger.info(`Subscribed token to emergency_blood_${cleanBg} topic`);
    }
  } catch (err) {
    logger.warn(`Could not subscribe token ${event.params.tokenId} to FCM topic:`, err);
  }
});

/**
 * Server-side Rate Limiter and Anti-Spam Cloud Function for Posts.
 * Triggered automatically on every new post created in Firestore (posts/{postId}).
 * Enforces strict server-side rate limiting:
 * If the same author UID attempts to create more than 3 posts within 1 minute,
 * the post is immediately rejected and deleted from Firestore.
 */
export const enforcePostRateLimit = onDocumentCreated("posts/{postId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const postData = snapshot.data();
  const authorUid = postData?.authorId || postData?.authorUid || postData?.userId;
  if (!authorUid) {
    logger.warn(`Post created without author identifier: ${event.params.postId}`);
    return;
  }

  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  try {
    const trackerRef = db.collection("rate_limits").doc(authorUid);

    const shouldDelete = await db.runTransaction(async (transaction) => {
      const trackerDoc = await transaction.get(trackerRef);
      const storedTimestamps: number[] = trackerDoc.exists
        ? (trackerDoc.data()?.timestamps || []).filter(
            (t: number) => typeof t === "number" && t >= oneMinuteAgo
          )
        : [];

      const newCount = storedTimestamps.length + 1;

      if (newCount > 3) {
        // Rate limit exceeded — do NOT update tracker, signal deletion
        return true;
      }

      // Within limit — atomically record this post's timestamp
      storedTimestamps.push(now);
      transaction.set(trackerRef, {
        authorUid,
        timestamps: storedTimestamps,
        lastPostAt: now
      }, { merge: true });

      return false;
    });

    if (shouldDelete) {
      logger.warn(`Rate limit exceeded! User ${authorUid} — Rejecting post ${event.params.postId}.`);
      await snapshot.ref.delete();
      await db.collection("rejected_posts").doc(event.params.postId).set({
        postId: event.params.postId,
        authorUid,
        rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
        rejectedAtMillis: now,
        reason: "Rate limit exceeded: More than 3 posts within 1 minute",
        postTitle: postData?.title || "Untitled",
        category: postData?.category || "general"
      });
    }

  } catch (error) {
    logger.error(`Error enforcing post rate limiter for ${event.params.postId}:`, error);
  }
});

/**
 * Cloud Function Trigger on User Document Writes (Create, Update, Delete)
 * Updates incremental user stats in system_summaries/user_stats
 */
export const onUserDocumentChanged = onDocumentWritten("users/{userId}", async (event) => {
  const change = event.data;
  if (!change) return;

  const statsRef = db.collection("system_summaries").doc("user_stats");

  const before = change.before.data();
  const after = change.after.data();

  const isCreated = !change.before.exists && change.after.exists;
  const isDeleted = change.before.exists && !change.after.exists;

  const batch = db.batch();

  if (isCreated) {
    batch.set(statsRef, {
      totalUsers: admin.firestore.FieldValue.increment(1),
      totalVerified: after?.isVerified ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(0)
    }, { merge: true });
  } else if (isDeleted) {
    batch.set(statsRef, {
      totalUsers: admin.firestore.FieldValue.increment(-1),
      totalVerified: before?.isVerified ? admin.firestore.FieldValue.increment(-1) : admin.firestore.FieldValue.increment(0)
    }, { merge: true });
  } else if (before && after) {
    // Check status changes
    if (before.status !== after.status) {
      if (after.status === "blocked") {
        batch.set(statsRef, { totalActive: admin.firestore.FieldValue.increment(-1), totalBlocked: admin.firestore.FieldValue.increment(1) }, { merge: true });
      } else if (before.status === "blocked" && after.status === "active") {
        batch.set(statsRef, { totalActive: admin.firestore.FieldValue.increment(1), totalBlocked: admin.firestore.FieldValue.increment(-1) }, { merge: true });
      }
    }
    // Check verification changes
    if (before.isVerified !== after.isVerified) {
      batch.set(statsRef, { totalVerified: after.isVerified ? admin.firestore.FieldValue.increment(1) : admin.firestore.FieldValue.increment(-1) }, { merge: true });
    }
  }

  await batch.commit();
});

