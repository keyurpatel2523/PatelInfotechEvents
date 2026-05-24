/**
 * Firebase CLIENT SDK — browser-only.
 * Used exclusively for real-time Firestore listeners (onSnapshot).
 *
 * Required env vars (NEXT_PUBLIC_ prefix so they're available in the browser):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * When vars are absent the module exports null values and
 * the app falls back to static mock data gracefully.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isClientFirebaseConfigured = !!(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let clientApp: FirebaseApp | null = null;
let clientDb:  Firestore   | null = null;

if (isClientFirebaseConfigured) {
  try {
    clientApp = getApps().find((a) => a.name === "client-app")
      ?? initializeApp(firebaseConfig, "client-app");
    clientDb = getFirestore(clientApp);
  } catch (e) {
    console.error("[Firebase Client] Initialization failed:", e);
  }
}

export { clientApp, clientDb };
