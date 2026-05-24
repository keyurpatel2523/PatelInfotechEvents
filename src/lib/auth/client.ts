import { CollectionName } from "@/lib/firebase/collections";
import { DEMO_USERS } from "./demo-users";
import type { UserProfile } from "@/types/auth";

/* Simulate network latency in demo mode */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function signIn(
  email: string,
  password: string,
): Promise<UserProfile> {
  const { isClientFirebaseConfigured } = await import("@/lib/firebase-client");

  if (!isClientFirebaseConfigured) {
    return demoSignIn(email, password);
  }

  return firebaseSignIn(email, password);
}

async function demoSignIn(
  email: string,
  password: string,
): Promise<UserProfile> {
  await delay(700);
  const match = DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password,
  );
  if (!match) throw new Error("Invalid email or password.");
  const { password: _, ...profile } = match;
  return profile;
}

async function firebaseSignIn(
  email: string,
  password: string,
): Promise<UserProfile> {
  const { clientApp, clientDb } = await import("@/lib/firebase-client");
  const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
  const { doc, getDoc } = await import("firebase/firestore");

  if (!clientApp) throw new Error("Firebase not configured.");
  const auth = getAuth(clientApp);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  if (!clientDb) throw new Error("Firestore not configured.");
  const snap = await getDoc(doc(clientDb, CollectionName.USERS, uid));
  if (!snap.exists()) throw new Error("User profile not found.");

  return snap.data() as UserProfile;
}

export async function signOut(): Promise<void> {
  const { isClientFirebaseConfigured, clientApp } = await import("@/lib/firebase-client");
  if (!isClientFirebaseConfigured || !clientApp) return;

  const { getAuth, signOut: fbSignOut } = await import("firebase/auth");
  await fbSignOut(getAuth(clientApp));
}
