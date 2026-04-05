import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import type { BookingPayload, BookingRecord, CreateBookingResponse } from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();

    /* Basic validation */
    if (!body.serviceId || !body.details?.date || !body.pricing?.total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingId = `BK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const now       = new Date().toISOString();

    const record: BookingRecord = {
      ...body,
      id:             bookingId,
      status:         "pending",
      paymentStatus:  "unpaid",
      createdAt:      now,
      updatedAt:      now,
    };

    if (db) {
      await db.collection("bookings").doc(bookingId).set(record);
    }
    /* If Firebase isn't configured the booking only lives in memory for this
       request — that's fine for demo / development.                         */

    const response: CreateBookingResponse = { bookingId, createdAt: now };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/bookings/create]", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
