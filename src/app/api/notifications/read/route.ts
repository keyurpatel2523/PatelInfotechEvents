import { CollectionName } from "@/lib/firebase/collections";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

/**
 * PATCH /api/notifications/read
 * Body: { userId: string }
 * Marks all unread notifications for userId as read (server-side Admin SDK).
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await req.json() as { userId?: string };

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ updated: 0, mock: true });
    }

    const snap = await db
      .collection(CollectionName.NOTIFICATIONS)
      .where("userId", "==", userId)
      .where("read",   "==", false)
      .get();

    if (snap.empty) {
      return NextResponse.json({ updated: 0 });
    }

    const BATCH_SIZE = 500;
    let updated = 0;

    for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
      const batch = db.batch();
      snap.docs.slice(i, i + BATCH_SIZE).forEach((d) => {
        batch.update(d.ref, { read: true });
        updated++;
      });
      await batch.commit();
    }

    return NextResponse.json({ updated });
  } catch (err) {
    console.error("[PATCH /api/notifications/read]", err);
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
