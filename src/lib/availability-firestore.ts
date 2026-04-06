/**
 * Shared types and helpers for the "availability" Firestore collection.
 *
 * Firestore document  (collection: "availability", doc id = supplierId):
 * ─────────────────────────────────────────────────────────────────────
 *   supplierId:       string
 *   unavailableDates: string[]  — supplier-blocked  ("yyyy-MM-dd")
 *   bookedDates:      string[]  — confirmed bookings ("yyyy-MM-dd")
 *   updatedAt:        Timestamp
 *
 * Race-condition strategy
 * ─────────────────────────────────────────────────────────────────────
 * The booking-create route uses a Firestore transaction that atomically:
 *   1. reads the availability doc
 *   2. checks the requested date isn't in bookedDates | unavailableDates
 *   3. if clean, adds to bookedDates AND writes the booking record
 * This guarantees no two bookings can share a date for the same supplier.
 */

import { format, parseISO, isValid } from "date-fns";

/* ── Types ────────────────────────────────────────────────────── */

export interface AvailabilityRecord {
  supplierId:       string;
  unavailableDates: string[];   // supplier-managed blocks
  bookedDates:      string[];   // system-managed confirmed bookings
}

export type DateStatus =
  | "available"      // default — supplier is open, no booking
  | "unavailable"    // supplier manually blocked
  | "booked";        // confirmed booking exists

/* ── Key format ───────────────────────────────────────────────── */

/** Canonical date key used throughout the system: "2025-12-14" */
export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Parse a date key back to a Date object (noon UTC to avoid TZ shifts). */
export function parseKey(key: string): Date {
  const d = parseISO(key);
  return isValid(d) ? d : new Date();
}

/* ── Status helper ────────────────────────────────────────────── */

export function getDateStatus(
  date: Date,
  record: Pick<AvailabilityRecord, "unavailableDates" | "bookedDates">,
): DateStatus {
  const key = dateKey(date);
  if (record.bookedDates.includes(key))      return "booked";
  if (record.unavailableDates.includes(key)) return "unavailable";
  return "available";
}

/* ── Serialise / deserialise ──────────────────────────────────── */

export function emptyRecord(supplierId: string): AvailabilityRecord {
  return { supplierId, unavailableDates: [], bookedDates: [] };
}

export function deserializeAvailability(
  supplierId: string,
  data: Record<string, unknown>,
): AvailabilityRecord {
  return {
    supplierId,
    unavailableDates: Array.isArray(data.unavailableDates)
      ? (data.unavailableDates as string[]).filter((s) => typeof s === "string")
      : [],
    bookedDates: Array.isArray(data.bookedDates)
      ? (data.bookedDates as string[]).filter((s) => typeof s === "string")
      : [],
  };
}
