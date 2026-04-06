import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import type { BookingStatus } from "@/lib/mock-supplier";

/* Allowed state machine transitions */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending:   ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id }              = await params;
    const body                = await req.json();
    const next: BookingStatus = body?.status;

    if (!next) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    if (db) {
      const ref  = db.collection("bookings").doc(id);
      const snap = await ref.get();

      if (!snap.exists) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      const current = snap.data()?.status as BookingStatus;
      const allowed = TRANSITIONS[current] ?? [];

      if (!allowed.includes(next)) {
        return NextResponse.json(
          { error: `Cannot transition from "${current}" to "${next}"` },
          { status: 422 },
        );
      }

      await ref.update({ status: next, updatedAt: new Date().toISOString() });
    }
    /* Demo / Firebase-unconfigured mode:
       Optimistic update already applied on the client; just confirm. */

    return NextResponse.json({ id, status: next });
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]/status]", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
