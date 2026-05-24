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

import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

const ADMIN_APP_NAME = "firebase-admin-eventsphere";

const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

let db:        Firestore | null = null;
let adminAuth: Auth      | null = null;

if (projectId && clientEmail && privateKey) {
  try {
    /* Use a named app so it never conflicts with other Firebase app instances */
    const app: App = getApps().some((a) => a.name === ADMIN_APP_NAME)
      ? getApp(ADMIN_APP_NAME)
      : initializeApp(
          { credential: cert({ projectId, clientEmail, privateKey }) },
          ADMIN_APP_NAME,
        );

    db        = getFirestore(app);
    adminAuth = getAuth(app);
  } catch (e) {
    console.error("[Firebase Admin] Initialization failed:", e);
  }
}

export { db, adminAuth };
export const isFirebaseConfigured = !!(projectId && clientEmail && privateKey);
