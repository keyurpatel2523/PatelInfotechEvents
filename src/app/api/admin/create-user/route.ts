import { CollectionName } from "@/lib/firebase/collections";
import { NextResponse } from "next/server";
import { adminAuth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { UserRole, UserProfile } from "@/types/auth";

export interface CreateUserBody {
  email:        string;
  password:     string;
  displayName:  string;
  role:         UserRole;
  companyName?: string;
  approved?:    boolean;
}

const AVATAR_COLORS = [
  "#6366f1","#8b5cf6","#22c55e","#f59e0b",
  "#ef4444","#3b82f6","#ec4899","#14b8a6",
];

function initials(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function pickColor(uid: string): string {
  const sum = uid.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export async function POST(req: Request) {
  if (!isFirebaseConfigured || !adminAuth || !db) {
    return NextResponse.json(
      { error: "Firebase Admin SDK not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to .env.local" },
      { status: 503 },
    );
  }

  let body: CreateUserBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, displayName, role, companyName, approved } = body;

  if (!email || !password || !displayName || !role) {
    return NextResponse.json({ error: "email, password, displayName, role are required" }, { status: 400 });
  }

  try {
    /* 1. Create Firebase Auth account */
    const authUser = await adminAuth.createUser({
      email:        email.trim(),
      password,
      displayName:  displayName.trim(),
      emailVerified: false,
    });

    /* 2. Build Firestore profile */
    const profile: UserProfile = {
      uid:         authUser.uid,
      email:       email.trim(),
      displayName: displayName.trim(),
      initials:    initials(displayName),
      avatarColor: pickColor(authUser.uid),
      role,
      createdAt:   new Date().toISOString(),
      ...(companyName ? { companyName: companyName.trim() } : {}),
      ...(role === "supplier" ? { approved: approved ?? false } : {}),
    };

    /* 3. Write to Firestore users/{uid} */
    await db.collection(CollectionName.USERS).doc(authUser.uid).set(profile);

    return NextResponse.json({ uid: authUser.uid, profile }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    /* Firebase already-exists error */
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "auth/email-already-exists") {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }
    console.error("[create-user]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
