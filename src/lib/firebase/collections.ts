import { z } from "zod";

export enum CollectionName {
  // ── Core user data ─────────────────────────────────────────
  USERS         = "Users",          // UserProfile documents, doc id = Firebase Auth uid

  // ── Marketplace ────────────────────────────────────────────
  BOOKINGS      = "bookings",       // Booking records created at checkout
  AVAILABILITY  = "availability",   // Supplier availability, doc id = supplierId
  REVIEWS       = "reviews",        // Customer reviews on completed bookings
  CATEGORIES    = "categories",     // Service categories (supports parent/child nesting)

  // ── Messaging ──────────────────────────────────────────────
  CONVERSATIONS = "conversations",  // Chat threads between customer ↔ supplier
  // Subcollection: conversations/{conversationId}/messages

  // ── Notifications ──────────────────────────────────────────
  NOTIFICATIONS = "notifications",  // In-app notifications, doc id = auto
}

export const CollectionNameSchema = z.nativeEnum(CollectionName);

// ── Subcollection names ─────────────────────────────────────
export enum SubCollectionName {
  MESSAGES = "messages", // conversations/{conversationId}/messages/{messageId}
}

export const SubCollectionNameSchema = z.nativeEnum(SubCollectionName);
