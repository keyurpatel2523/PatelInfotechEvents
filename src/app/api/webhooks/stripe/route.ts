/**
 * Stripe webhook handler.
 *
 * Configure in Stripe Dashboard → Webhooks:
 *   Endpoint URL: https://yourdomain.com/api/webhooks/stripe
 *   Events: payment_intent.succeeded, payment_intent.payment_failed
 *
 * Required env var:
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *
 * IMPORTANT: This route must receive the raw body (not JSON-parsed).
 * Next.js App Router sends the raw body by default for POST handlers
 * that consume `req.text()` or `req.arrayBuffer()`.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { createPaymentNotifications } from "@/lib/notifications/server";

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret    = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[Stripe webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  /* ── Handle events ────────────────────────────────────────── */
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi        = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId && db) {
          await db.collection("bookings").doc(bookingId).update({
            status:          "confirmed",
            paymentStatus:   "paid",
            paymentIntentId: pi.id,
            updatedAt:       new Date().toISOString(),
          });
          createPaymentNotifications(bookingId, pi.id)
            .catch((err) => console.error("[notifications] createPaymentNotifications failed:", err));
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi        = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId && db) {
          await db.collection("bookings").doc(bookingId).update({
            status:    "cancelled",
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      default:
        /* Unhandled event type — log and ignore */
        console.log(`[Stripe webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[Stripe webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
