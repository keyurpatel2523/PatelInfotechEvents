/**
 * GET  /api/categories — list all categories ordered by level → order
 * POST /api/categories — create a new category
 *
 * Graceful degradation: when Firebase Admin is not configured, returns 503.
 * The client falls back to ADMIN_CATEGORIES mock data in that case.
 */

import { NextResponse } from "next/server";
import { FieldValue }   from "firebase-admin/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  slugify,
  buildPath,
  serializeCategory,
  deserializeCategory,
} from "@/lib/categories-firestore";
import type { AdminCategory } from "@/lib/mock-admin";

const COL = "categories";

/* ── GET ─────────────────────────────────────────────────────── */
export async function GET() {
  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const snap = await db
      .collection(COL)
      .orderBy("level",  "asc")
      .orderBy("order",  "asc")
      .get();

    const categories = snap.docs.map((doc) =>
      deserializeCategory(doc.id, doc.data() as Record<string, unknown>),
    );

    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

/* ── POST ────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  let body: { name?: string; icon?: string; parentId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, icon = "📁", parentId = null } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  try {
    /* Determine level and sibling count */
    let level = 0;
    let parentPath: string[] = [];

    if (parentId) {
      const parentDoc = await db.collection(COL).doc(parentId).get();
      if (!parentDoc.exists) {
        return NextResponse.json({ error: "Parent not found" }, { status: 404 });
      }
      const parentData = parentDoc.data() as Record<string, unknown>;
      level      = Number(parentData.level ?? 0) + 1;
      parentPath = Array.isArray(parentData.path) ? (parentData.path as string[]) : [parentId];
    }

    /* Count existing siblings to determine order */
    const siblingsSnap = await db
      .collection(COL)
      .where("parentId", "==", parentId)
      .get();
    const order = siblingsSnap.size;

    /* Generate id and path */
    const id   = `cat-${Date.now()}`;
    const path = [...parentPath, id];

    const newCat: AdminCategory = {
      id,
      name:         name.trim(),
      slug:         slugify(name.trim()),
      icon,
      parentId,
      path,
      level,
      order,
      serviceCount: 0,
      isActive:     true,
    };

    await db.collection(COL).doc(id).set({
      ...serializeCategory(newCat),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ category: newCat }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
