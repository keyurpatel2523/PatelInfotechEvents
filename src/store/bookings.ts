/**
 * Zustand store for supplier bookings.
 *
 * Holds the canonical list used by both the Overview and Bookings pages.
 * Populated on first render from mock data; overwritten by the Firestore
 * listener as soon as the real-time connection is established.
 *
 * Optimistic update pattern:
 *   1. call updateBookingStatus(id, next)   → immediate local change
 *   2. fire PATCH /api/bookings/[id]/status
 *   3. on error → call revertBookingStatus(id, prev) + show error toast
 *   4. on success → Firestore listener confirms & overwrites (idempotent)
 */

import { create } from "zustand";
import { SUPPLIER_BOOKINGS, type SupplierBooking, type BookingStatus } from "@/lib/mock-supplier";

export type ConnectionStatus = "connecting" | "live" | "offline";

interface BookingsState {
  bookings:    SupplierBooking[];
  connection:  ConnectionStatus;
  lastUpdated: Date | null;

  /* Called by the Firestore listener */
  setBookings:   (bookings: SupplierBooking[]) => void;
  setConnection: (c: ConnectionStatus) => void;

  /* Optimistic mutations */
  updateBookingStatus: (id: string, next: BookingStatus) => void;
  revertBookingStatus: (id: string, prev: BookingStatus) => void;
}

export const useBookingsStore = create<BookingsState>()((set) => ({
  bookings:    SUPPLIER_BOOKINGS,
  connection:  "offline",
  lastUpdated: null,

  setBookings: (bookings) =>
    set({ bookings, lastUpdated: new Date() }),

  setConnection: (connection) =>
    set({ connection }),

  updateBookingStatus: (id, next) =>
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === id ? { ...b, status: next } : b,
      ),
    })),

  revertBookingStatus: (id, prev) =>
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === id ? { ...b, status: prev } : b,
      ),
    })),
}));
