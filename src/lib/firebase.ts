/**
 * Server-only Firebase Admin SDK.
 * Import ONLY from API Route Handlers or Server Actions.
 *
 * Required env vars:
 *   FIREBASE_PROJECT_ID=your-project-id
 *   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
 *   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *
 * Firestore collection: "bookings"
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

let app: App | null = null;
let db:  Firestore | null = null;

if (projectId && clientEmail && privateKey) {
  try {
    app = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    db = getFirestore(app);
  } catch (e) {
    console.error("[Firebase] Initialization failed:", e);
  }
}

export { db };
export const isFirebaseConfigured = !!(projectId && clientEmail && privateKey);
