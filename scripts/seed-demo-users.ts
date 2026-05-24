// @ts-nocheck
import dotenv from "dotenv";

dotenv.config({ path: [".env", ".env.local"] });

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore, WriteBatch } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { CollectionName } from "../src/lib/firebase/collections";

/* ── Admin init ───────────────────────────────────────────── */
const ADMIN_APP_NAME = "firebase-admin-eventsphere";

const app = getApps().some((a) => a.name === ADMIN_APP_NAME)
  ? getApp(ADMIN_APP_NAME)
  : initializeApp(
      {
        credential: cert({
          projectId:   process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
      },
      ADMIN_APP_NAME,
    );

const db        = getFirestore(app);
const adminAuth = getAuth(app);

/* ── Demo users ───────────────────────────────────────────── */
const DEMO_USERS = [
  {
    uid:         "super-admin-001",
    email:       "superadmin@eventsphere.co.uk",
    password:    "super123",
    displayName: "Keyur Patel",
    initials:    "KP",
    avatarColor: "#6366f1",
    role:        "super_admin",
    createdAt:   "2024-01-01T00:00:00Z",
  },
  {
    uid:         "admin-001",
    email:       "admin@eventsphere.co.uk",
    password:    "admin123",
    displayName: "Sarah Mitchell",
    initials:    "SM",
    avatarColor: "#8b5cf6",
    role:        "admin",
    createdAt:   "2024-01-01T00:00:00Z",
  },
  {
    uid:         "supplier-001",
    email:       "supplier@goldentouchevents.co.uk",
    password:    "supplier123",
    displayName: "Sophie Clarke",
    initials:    "SC",
    avatarColor: "#22c55e",
    role:        "supplier",
    companyName: "Golden Touch Events",
    approved:    true,
    createdAt:   "2024-01-01T00:00:00Z",
  },
  {
    uid:         "customer-001",
    email:       "james@example.co.uk",
    password:    "customer123",
    displayName: "James Thompson",
    initials:    "JT",
    avatarColor: "#f59e0b",
    role:        "customer",
    createdAt:   "2024-01-01T00:00:00Z",
  },
];

/* ── Migration ────────────────────────────────────────────── */
async function migrate() {
  console.log(`\nSeeding ${DEMO_USERS.length} demo users into Firebase...\n`);

  const batch: WriteBatch = db.batch();

  for (const user of DEMO_USERS) {
    const { password, uid: _staticUid, ...rest } = user;

    /* 1. Create Firebase Auth user — let Firebase generate the UID */
    let authUid: string;
    try {
      const authUser = await adminAuth.createUser({
        email:         rest.email,
        password,
        displayName:   rest.displayName,
        emailVerified: true,
      });
      authUid = authUser.uid;
      console.log(`  ✓  Created auth user: ${rest.email}  (uid: ${authUid})`);
    } catch (err) {
      const code = err?.errorInfo?.code ?? err?.code ?? "";
      if (code === "auth/email-already-exists") {
        /* Already exists — look up their real UID so we can update the Firestore doc */
        const existing = await adminAuth.getUserByEmail(rest.email);
        authUid = existing.uid;
        console.log(`  ~  Already exists:   ${rest.email}  (uid: ${authUid})`);
      } else {
        throw err;
      }
    }

    /* 2. Queue Firestore profile write using the Firebase-generated UID as doc ID */
    const profile = { ...rest, uid: authUid };
    batch.set(
      db.collection(CollectionName.USERS).doc(authUid),
      profile,
      { merge: true },
    );
  }

  /* 3. Commit all Firestore writes in one round trip */
  await batch.commit();
  console.log(`\n✅  Firestore profiles written.\n`);
}

migrate().catch((err) => {
  const code = err.code ?? err.errorInfo?.code ?? "";
  console.error("\n❌  Migration failed:", err.message ?? err);

  if (code === "auth/configuration-not-found") {
    console.error("\n   Fix: Firebase Authentication is not enabled.");
    console.error("   → Firebase Console → Authentication → Get started");
    console.error("   → Sign-in method → Email/Password → Enable → Save\n");
  }

  process.exit(1);
});
