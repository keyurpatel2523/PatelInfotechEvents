/**
 * Shared helpers for the "reviews" Firestore collection.
 *
 * Collection: "reviews"
 * Document ID: auto-generated
 *
 * Fields: (see ReviewRecord in src/types/review.ts)
 *   id, bookingId, serviceId, serviceSlug, supplierId,
 *   customerId, customerName, customerInitials, avatarColor,
 *   rating, comment, eventType, createdAt (Timestamp)
 *
 * Queries enabled (composite indexes in firestore.indexes.json):
 *   • By service:  where("serviceId","==",X).orderBy("createdAt","desc")
 *   • By supplier: where("supplierId","==",X).orderBy("createdAt","desc")
 *   • By booking:  where("bookingId","==",X)  ← uniqueness check
 *
 * Incremental rating formula (avoids reading all docs every time):
 *   newRating = ((oldRating * totalReviews) + newStars) / (totalReviews + 1)
 */

import type { ReviewRecord } from "@/types/review";

/* ── Avatar colour — deterministic from customerId ─────────────── */
const PALETTE = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#06b6d4", "#ef4444", "#84cc16",
];

export function avatarColorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ── Incremental rating ─────────────────────────────────────────── */
export function incrementalRating(
  oldRating: number,
  totalReviews: number,
  newStars: number,
): number {
  if (totalReviews === 0) return newStars;
  return (oldRating * totalReviews + newStars) / (totalReviews + 1);
}

/* ── Serialise / deserialise ────────────────────────────────────── */
export function deserializeReview(
  id: string,
  data: Record<string, unknown>,
): ReviewRecord {
  return {
    id,
    bookingId:        String(data.bookingId        ?? ""),
    serviceId:        String(data.serviceId        ?? ""),
    serviceSlug:      String(data.serviceSlug      ?? ""),
    supplierId:       String(data.supplierId       ?? ""),
    customerId:       String(data.customerId       ?? ""),
    customerName:     String(data.customerName     ?? "Anonymous"),
    customerInitials: String(data.customerInitials ?? "?"),
    avatarColor:      String(data.avatarColor      ?? "#6366f1"),
    rating:           Number(data.rating           ?? 0),
    comment:          String(data.comment          ?? ""),
    eventType:        String(data.eventType        ?? ""),
    createdAt:        data.createdAt instanceof Date
      ? data.createdAt.toISOString()
      : String(data.createdAt ?? new Date().toISOString()),
  };
}
