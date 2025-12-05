import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Helpful developer check: if storageBucket is not set in env, log a clear message.
if (!firebaseConfig.storageBucket) {
  // Use console.error so it stands out in the browser console when the app loads.
  console.error(
    "Firebase Storage bucket is not configured.\n" +
      "Please set REACT_APP_FIREBASE_STORAGE_BUCKET in your .env (e.g. your-project-id.appspot.com) " +
      "and restart the dev server. Without this the app cannot upload KYC documents."
  );
}

// Export storage only when the storageBucket is configured. If missing, export null so callers
// can handle the condition and show a clearer error in the UI instead of a low-level SDK error.
export const storage = firebaseConfig.storageBucket ? getStorage(app) : null;
export const HAS_STORAGE_BUCKET = !!firebaseConfig.storageBucket;