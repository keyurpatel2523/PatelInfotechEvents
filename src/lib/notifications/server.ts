import { CollectionName } from "@/lib/firebase/collections";
/**
 * Server-only notification helpers (Firebase Admin SDK).
 * Import ONLY from API routes and server actions.
 */

import { db } from "@/lib/firebase";
import type { CreateNotificationPayload } from "@/types/notification";
import {
  sendBookingConfirmationEmail,
  sendNewBookingEmail,
  sendPaymentSuccessEmail,
} from "./email";

export async function createNotification(payload: CreateNotificationPayload): Promise<void> {
  if (!db) return;
  await db.collection(CollectionName.NOTIFICATIONS).add({
    ...payload,
    read:      false,
    createdAt: new Date().toISOString(),
  });
}

/** Fired after a booking is created — notifies both the customer and supplier. */
export async function createBookingNotifications(booking: {
  id:            string;
  customerId:    string;
  customerName?: string;
  supplierId:    string;
  supplierName:  string;
  customerEmail?: string;
  supplierEmail?: string;
  serviceTitle:  string;
  details:       { date: string };
  pricing:       { total: number };
}): Promise<void> {
  const customerName = booking.customerName ?? "Customer";

  await Promise.allSettled([
    /* Notify customer: booking received */
    createNotification({
      userId:   booking.customerId,
      type:     "booking",
      title:    "Booking request submitted",
      message:  `Your booking for ${booking.serviceTitle} on ${booking.details.date} has been sent to the supplier.`,
      link:     `/dashboard/bookings/${booking.id}`,
      metadata: { bookingId: booking.id, serviceTitle: booking.serviceTitle },
    }),
    /* Notify supplier: new booking incoming */
    createNotification({
      userId:   booking.supplierId,
      type:     "booking",
      title:    "New booking request",
      message:  `${customerName} requested ${booking.serviceTitle} on ${booking.details.date}.`,
      link:     `/supplier/bookings/${booking.id}`,
      metadata: { bookingId: booking.id, serviceTitle: booking.serviceTitle },
    }),
    /* Emails — skipped if address not present */
    ...(booking.customerEmail ? [sendBookingConfirmationEmail({
      to:           booking.customerEmail,
      customerName,
      bookingId:    booking.id,
      serviceTitle: booking.serviceTitle,
      date:         booking.details.date,
      total:        booking.pricing.total,
    })] : []),
    ...(booking.supplierEmail ? [sendNewBookingEmail({
      to:           booking.supplierEmail,
      supplierName: booking.supplierName,
      bookingId:    booking.id,
      serviceTitle: booking.serviceTitle,
      customerName,
      date:         booking.details.date,
      total:        booking.pricing.total,
    })] : []),
  ]);
}

/** Fired after Stripe payment_intent.succeeded — notifies both parties. */
export async function createPaymentNotifications(
  bookingId: string,
  paymentIntentId: string,
): Promise<void> {
  if (!db) return;

  const snap = await db.collection(CollectionName.BOOKINGS).doc(bookingId).get();
  if (!snap.exists) return;

  const booking = snap.data() as {
    customerId:    string;
    customerName:  string;
    customerEmail: string;
    supplierId:    string;
    serviceTitle:  string;
    pricing:       { total: number };
  };

  const amount = booking.pricing?.total ?? 0;

  await Promise.allSettled([
    createNotification({
      userId:   booking.customerId,
      type:     "payment",
      title:    `Payment confirmed — £${amount.toLocaleString("en-GB")}`,
      message:  `Your payment of £${amount.toLocaleString("en-GB")} for ${booking.serviceTitle} was successful. Booking ${bookingId} is now confirmed.`,
      link:     `/dashboard/bookings/${bookingId}`,
      metadata: { bookingId, paymentIntentId },
    }),
    createNotification({
      userId:   booking.supplierId,
      type:     "payment",
      title:    `Payment received — £${amount.toLocaleString("en-GB")}`,
      message:  `Payment of £${amount.toLocaleString("en-GB")} received for ${booking.serviceTitle}. Booking ${bookingId} is now confirmed.`,
      link:     `/supplier/bookings/${bookingId}`,
      metadata: { bookingId, paymentIntentId },
    }),
    sendPaymentSuccessEmail({
      to:           booking.customerEmail,
      customerName: booking.customerName,
      bookingId,
      serviceTitle: booking.serviceTitle,
      amount,
    }),
  ]);
}

/** Fired when a chat message is sent — notifies the recipient. */
export async function createChatNotification(opts: {
  recipientId:   string;
  senderName:    string;
  conversationId: string;
  messagePreview: string;
}): Promise<void> {
  await createNotification({
    userId:   opts.recipientId,
    type:     "chat",
    title:    `New message from ${opts.senderName}`,
    message:  opts.messagePreview.length > 100
      ? opts.messagePreview.slice(0, 97) + "…"
      : opts.messagePreview,
    link:     "/messages",
    metadata: { conversationId: opts.conversationId, senderName: opts.senderName },
  });
}

/** Fired when a review is submitted — notifies the supplier. */
export async function createReviewNotification(opts: {
  supplierId:   string;
  reviewerName: string;
  serviceTitle: string;
  rating:       number;
  reviewId:     string;
}): Promise<void> {
  await createNotification({
    userId:   opts.supplierId,
    type:     "review",
    title:    `New ${opts.rating}★ review received`,
    message:  `${opts.reviewerName} left a ${opts.rating}-star review for your ${opts.serviceTitle} service.`,
    link:     "/supplier/reviews",
    metadata: { reviewId: opts.reviewId, serviceTitle: opts.serviceTitle, rating: String(opts.rating) },
  });
}
