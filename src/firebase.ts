import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { initializeFirestore, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfigJson from "../firebase-applet-config.json";

// Suppress Firestore transient offline/connection retry console messages
setLogLevel('silent');

const getEffectiveConfig = () => {
  if (firebaseConfigJson && firebaseConfigJson.apiKey && !firebaseConfigJson.apiKey.includes('YOUR_')) {
    return {
      apiKey: firebaseConfigJson.apiKey,
      authDomain: firebaseConfigJson.authDomain,
      projectId: firebaseConfigJson.projectId,
      storageBucket: firebaseConfigJson.storageBucket,
      messagingSenderId: firebaseConfigJson.messagingSenderId,
      appId: firebaseConfigJson.appId,
      measurementId: firebaseConfigJson.measurementId || '',
    };
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  };
};

const config = getEffectiveConfig();
const app = getApps().length === 0 ? initializeApp(config) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

const configJsonAny = firebaseConfigJson as any;
const databaseId = (configJsonAny && configJsonAny.firestoreDatabaseId && configJsonAny.firestoreDatabaseId !== '(default)')
  ? configJsonAny.firestoreDatabaseId
  : undefined;

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, databaseId);

export const storage = getStorage(app);
export default app;
