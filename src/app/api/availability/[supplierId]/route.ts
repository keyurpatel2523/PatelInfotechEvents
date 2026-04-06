/**
 * GET  /api/availability/[supplierId]
 *   Returns the supplier's full availability record.
 *   Used by the customer BookingDatePicker on page load.
 *
 * PATCH /api/availability/[supplierId]
 *   Body: { unavailableDates: string[] }
 *   Replaces the supplier-managed block list.
 *   bookedDates is always managed by the booking system — never overwritten here.
 */

import { NextResponse }  from "next/server";
import { FieldValue }    from "firebase-admin/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  emptyRecord,
  deserializeAvailability,
} from "@/lib/availability-firestore";

const COL = "availability";

/* ── GET ─────────────────────────────────────────────────────── */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ supplierId: string }> },
) {
  const { supplierId } = await params;

  if (!isFirebaseConfigured || !db) {
    /* Return empty (all available) — client will show default state */
    return NextResponse.json({ availability: emptyRecord(supplierId) });
  }

  try {
    const snap = await db.collection(COL).doc(supplierId).get();
    const availability = snap.exists
      ? deserializeAvailability(supplierId, snap.data() as Record<string, unknown>)
      : emptyRecord(supplierId);

    return NextResponse.json({ availability });
  } catch (err) {
    console.error("[GET /api/availability]", err);
    return NextResponse.json(
      { availability: emptyRecord(supplierId) },
      { status: 200 }, // degrade gracefully — show all available
    );
  }
}

/* ── PATCH ───────────────────────────────────────────────────── */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ supplierId: string }> },
) {
  const { supplierId } = await params;

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  let body: { unavailableDates?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.unavailableDates)) {
    return NextResponse.json({ error: "unavailableDates must be an array" }, { status: 400 });
  }

  /* Validate all entries are "yyyy-MM-dd" strings */
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const invalid = body.unavailableDates.find((d) => !dateRe.test(d));
  if (invalid) {
    return NextResponse.json(
      { error: `Invalid date format: ${invalid}. Use yyyy-MM-dd` },
      { status: 400 },
    );
  }

  try {
    await db.collection(COL).doc(supplierId).set(
      {
        supplierId,
        unavailableDates: body.unavailableDates,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }, // preserves bookedDates managed by booking system
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/availability]", err);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }
}
