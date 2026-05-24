import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/lib/firebase";
import { deserializeAvailability, emptyRecord } from "@/lib/availability-firestore";
import { createBookingNotifications } from "@/lib/notifications/server";
import type { BookingPayload, BookingRecord, CreateBookingResponse } from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();

    if (!body.serviceId || !body.details?.date || !body.pricing?.total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingDate = body.details.date; // "yyyy-MM-dd"
    const bookingId   = `BK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const now         = new Date().toISOString();

    if (db) {
      /*
       * Use a Firestore transaction to atomically:
       *   1. Check the date is still available (not booked or supplier-blocked)
       *   2. Write the booking record
       *   3. Add the date to bookedDates on the availability doc
       *
       * This is the only safe way to prevent double bookings under concurrent requests.
       */
      const availRef  = db.collection("availability").doc(body.supplierId);
      const bookingRef = db.collection("bookings").doc(bookingId);

      await db.runTransaction(async (tx) => {
        const availSnap = await tx.get(availRef);

        const record = availSnap.exists
          ? deserializeAvailability(body.supplierId, availSnap.data() as Record<string, unknown>)
          : emptyRecord(body.supplierId);

        /* Hard gate — abort the whole transaction if unavailable */
        if (record.bookedDates.includes(bookingDate)) {
          throw Object.assign(new Error("DATE_BOOKED"), { code: "DATE_BOOKED" });
        }
        if (record.unavailableDates.includes(bookingDate)) {
          throw Object.assign(new Error("DATE_UNAVAILABLE"), { code: "DATE_UNAVAILABLE" });
        }

        /* Write booking */
        const record_: BookingRecord = {
          ...body,
          id:            bookingId,
          status:        "pending",
          paymentStatus: "unpaid",
          createdAt:     now,
          updatedAt:     now,
        };
        tx.set(bookingRef, record_);

        /* Reserve the date atomically */
        tx.set(
          availRef,
          {
            supplierId:  body.supplierId,
            bookedDates: FieldValue.arrayUnion(bookingDate),
            updatedAt:   FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      });

      /* Fire notifications after the transaction commits — non-blocking */
      createBookingNotifications({
        id:           bookingId,
        customerId:   body.customerId,
        supplierId:   body.supplierId,
        supplierName: body.supplierName,
        serviceTitle: body.serviceTitle,
        details:      body.details,
        pricing:      body.pricing,
      }).catch((err) => console.error("[notifications] createBookingNotifications failed:", err));
    }
    /* If Firebase isn't configured (dev/demo) skip the transaction — booking lives in memory */

    const response: CreateBookingResponse = { bookingId, createdAt: now };
    return NextResponse.json(response);
  } catch (err) {
    const code = (err as { code?: string }).code;

    if (code === "DATE_BOOKED" || code === "DATE_UNAVAILABLE") {
      return NextResponse.json(
        {
          error: "This date is no longer available. Please choose another date.",
          code,
        },
        { status: 409 }, // Conflict
      );
    }

    console.error("[POST /api/bookings/create]", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
