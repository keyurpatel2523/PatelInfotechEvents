import { CollectionName } from "@/lib/firebase/collections";
/**
 * PATCH /api/categories/[id]
 *   Body variants:
 *     { name, icon }             — rename/re-icon a category
 *     { reorder: [{id, order}] } — batch-update sibling order after a drag
 *
 * DELETE /api/categories/[id]
 *   Deletes the category AND every descendant (queried via path array-contains).
 *   Uses a batched write (Firestore limit: 500 ops per batch).
 */

import { NextResponse }  from "next/server";
import { FieldValue }    from "firebase-admin/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { slugify }       from "@/lib/categories-firestore";

const COL = CollectionName.CATEGORIES;

/* ── PATCH ───────────────────────────────────────────────────── */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const { id } = await params;

  let body: {
    name?:    string;
    icon?:    string;
    reorder?: { id: string; order: number }[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    /* ── Rename / re-icon ─────────────────────────────────────── */
    if (body.name !== undefined || body.icon !== undefined) {
      const docRef = db.collection(COL).doc(id);
      const snap   = await docRef.get();
      if (!snap.exists) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
      if (body.name !== undefined) {
        updates.name = body.name.trim();
        updates.slug = slugify(body.name.trim());
      }
      if (body.icon !== undefined) {
        updates.icon = body.icon;
      }

      await docRef.update(updates);
      return NextResponse.json({ ok: true });
    }

    /* ── Sibling reorder (batch) ──────────────────────────────── */
    if (Array.isArray(body.reorder) && body.reorder.length > 0) {
      const batch = db.batch();
      for (const { id: sibId, order } of body.reorder) {
        batch.update(db.collection(COL).doc(sibId), {
          order,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  } catch (err) {
    console.error("[PATCH /api/categories/:id]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ── DELETE ──────────────────────────────────────────────────── */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const { id } = await params;

  try {
    /*
     * Find all descendants: any doc whose `path` array contains `id`
     * (includes the node itself because path always contains own id).
     *
     * Firestore batch limit = 500 ops. For very large trees use a loop;
     * a typical category tree is well under that limit.
     */
    const snap = await db
      .collection(COL)
      .where("path", "array-contains", id)
      .get();

    if (snap.empty) {
      /* Already gone — treat as success */
      return NextResponse.json({ ok: true, deleted: 0 });
    }

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({ ok: true, deleted: snap.size });
  } catch (err) {
    console.error("[DELETE /api/categories/:id]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
