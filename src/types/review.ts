/* ─── Review domain types ─────────────────────────────────────── */

/**
 * Stored in Firestore: collection "reviews", doc id = reviewId
 *
 * Integrity rules (enforced by POST /api/reviews):
 *   - bookingId must belong to customerId
 *   - booking.status must be "completed"
 *   - only ONE review may reference a given bookingId (unique constraint)
 */
export interface ReviewRecord {
  id:               string;
  bookingId:        string;   // FK → bookings/{id}  (unique — 1 review per booking)
  serviceId:        string;   // FK → services/{id}
  serviceSlug:      string;
  supplierId:       string;   // FK → suppliers/{id}
  customerId:       string;
  customerName:     string;
  customerInitials: string;
  avatarColor:      string;   // hex — deterministic from customerId
  rating:           number;   // 1 – 5 integer
  comment:          string;
  eventType:        string;   // e.g. "Wedding", "Corporate Event"
  createdAt:        string;   // ISO-8601
}

/* Sent from client → POST /api/reviews */
export interface CreateReviewPayload {
  bookingId:    string;
  serviceId:    string;
  serviceSlug:  string;
  supplierId:   string;
  customerId:   string;
  customerName: string;
  rating:       number;
  comment:      string;
  eventType:    string;
}

export interface CreateReviewResponse {
  review: ReviewRecord;
}

/* Used by RatingSummary */
export interface RatingDistribution {
  [star: number]: number;  // star → count
}
