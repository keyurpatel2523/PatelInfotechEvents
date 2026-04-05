import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import type { CreateIntentResponse } from "@/types/booking";

export async function POST(req: NextRequest) {
  try {
    const { bookingId, amount, currency = "gbp" } = await req.json();

    if (!bookingId || !amount) {
      return NextResponse.json({ error: "bookingId and amount are required" }, { status: 400 });
    }

    /* ── Demo mode ────────────────────────────────────────────── */
    if (!isStripeConfigured || !stripe) {
      const response: CreateIntentResponse = {
        clientSecret: `pi_demo_${bookingId}_secret_demo`,
        demo: true,
      };
      return NextResponse.json(response);
    }

    /* ── Live Stripe payment intent ───────────────────────────── */
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100), // convert £ → pence
      currency,
      metadata: { bookingId },
      automatic_payment_methods: { enabled: true },
    });

    /* Update Firestore booking with payment intent ID */
    if (db) {
      await db.collection("bookings").doc(bookingId).update({
        paymentIntentId: paymentIntent.id,
        updatedAt:       new Date().toISOString(),
      });
    }

    const response: CreateIntentResponse = {
      clientSecret: paymentIntent.client_secret!,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/payments/create-intent]", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
