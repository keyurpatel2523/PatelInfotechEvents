import { CollectionName } from "@/lib/firebase/collections";
/**
 * POST /api/availability/[supplierId]/check
 *
 * Atomically checks whether a date is still available for a supplier.
 * Uses a Firestore transaction to prevent race conditions.
 *
 * Body:  { date: "yyyy-MM-dd" }
 * Returns:
 *   200 { available: true }               — date is free
 *   200 { available: false, reason: string } — date is taken
 *   400 bad request
 *   503 Firebase not configured
 */

import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { deserializeAvailability, emptyRecord } from "@/lib/availability-firestore";

const COL = CollectionName.AVAILABILITY;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ supplierId: string }> },
) {
  const { supplierId } = await params;

  let body: { date?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  if (!body.date || !dateRe.test(body.date)) {
    return NextResponse.json({ error: "date must be yyyy-MM-dd" }, { status: 400 });
  }

  const { date } = body;

  /* When Firebase isn't configured, allow all dates (dev/demo mode) */
  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ available: true, demo: true });
  }

  try {
    const available = await db.runTransaction(async (tx) => {
      const ref  = db!.collection(COL).doc(supplierId);
      const snap = await tx.get(ref);

      const record = snap.exists
        ? deserializeAvailability(supplierId, snap.data() as Record<string, unknown>)
        : emptyRecord(supplierId);

      if (record.bookedDates.includes(date)) return false;
      if (record.unavailableDates.includes(date)) return false;
      return true;
    });

    if (!available) {
      return NextResponse.json({
        available: false,
        reason: "This date is no longer available. Please choose another date.",
      });
    }

    return NextResponse.json({ available: true });
  } catch (err) {
    console.error("[POST /api/availability/check]", err);
    return NextResponse.json({ error: "Availability check failed" }, { status: 500 });
  }
}
