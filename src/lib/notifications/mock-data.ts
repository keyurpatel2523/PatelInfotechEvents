/**
 * Mock notifications for offline / demo fallback.
 * All content uses London / UK market context (£ GBP, London venues).
 */

import type { AppNotification } from "@/types/notification";

function ago(days: number, hours = 0, mins = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, d.getMinutes() - mins, 0, 0);
  return d.toISOString();
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id:       "notif-001",
    userId:   "user-current",
    type:     "booking",
    title:    "New booking request",
    message:  "Emma Wilson requested Wedding Photography on 15th June at The Savoy, London.",
    read:     false,
    link:     "/supplier/bookings/BK-12345678",
    metadata: { bookingId: "BK-12345678", serviceTitle: "Wedding Photography" },
    createdAt: ago(0, 0, 8),
  },
  {
    id:       "notif-002",
    userId:   "user-current",
    type:     "payment",
    title:    "Payment confirmed — £1,200",
    message:  "Payment of £1,200 received for Corporate Event Photography. Booking BK-87654321 is now confirmed.",
    read:     false,
    link:     "/supplier/bookings/BK-87654321",
    metadata: { bookingId: "BK-87654321" },
    createdAt: ago(0, 0, 45),
  },
  {
    id:       "notif-003",
    userId:   "user-current",
    type:     "chat",
    title:    "New message from James Thompson",
    message:  "Hi! I've just confirmed my booking. Could you confirm the setup time for the Shoreditch venue?",
    read:     false,
    link:     "/messages",
    metadata: { conversationId: "conv-001", senderName: "James Thompson" },
    createdAt: ago(0, 1, 30),
  },
  {
    id:       "notif-004",
    userId:   "user-current",
    type:     "review",
    title:    "New 5★ review received",
    message:  "Sophie Clarke left a glowing 5-star review for your Wedding Photography service.",
    read:     false,
    link:     "/supplier/reviews",
    metadata: { serviceTitle: "Wedding Photography", rating: "5" },
    createdAt: ago(0, 3, 0),
  },
  {
    id:       "notif-005",
    userId:   "user-current",
    type:     "booking",
    title:    "Booking confirmed",
    message:  "Your DJ Services booking for a birthday party in Shoreditch on 14th August is confirmed.",
    read:     true,
    link:     "/dashboard/bookings/BK-11223344",
    metadata: { bookingId: "BK-11223344", serviceTitle: "DJ Services" },
    createdAt: ago(1, 2, 0),
  },
  {
    id:       "notif-006",
    userId:   "user-current",
    type:     "payment",
    title:    "Payout processed",
    message:  "£840 has been transferred to your Barclays account ending in 4521.",
    read:     true,
    link:     "/supplier/earnings",
    metadata: {},
    createdAt: ago(1, 6, 0),
  },
  {
    id:       "notif-007",
    userId:   "user-current",
    type:     "chat",
    title:    "New message from Golden Touch Catering",
    message:  "Menu proposal has been sent to your email! Let us know if you'd like to schedule a tasting.",
    read:     true,
    link:     "/messages",
    metadata: { conversationId: "conv-002", senderName: "Golden Touch Catering" },
    createdAt: ago(2, 4, 0),
  },
];
