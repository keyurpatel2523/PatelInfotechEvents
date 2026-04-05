/* ─── Booking domain types ──────────────────────────────────── */

export type BookingStatus   = "pending" | "confirmed" | "cancelled";
export type PaymentStatus   = "unpaid"  | "paid"      | "refunded";

export interface AddOnItem {
  id:       string;
  label:    string;
  price:    number;
  selected: boolean;
}

export interface CheckoutPackage {
  id:          string;
  label:       string;
  price:       number;      // per-unit price
  unit:        string;      // "event" | "per head" | etc.
  description: string;
  popular?:    boolean;
}

export interface BookingDetails {
  date:         string;     // ISO date "2025-12-14"
  timeSlot:     string;     // "14:00"
  guestCount:   number;
  packageId:    string;
  packageLabel: string;
  packagePrice: number;     // total package cost (already × guests if per-head)
  addOns:       AddOnItem[];
  notes:        string;
}

export interface PricingBreakdown {
  packagePrice:    number;
  addOnsTotal:     number;
  serviceFeeRate:  number;  // 0.12 = 12 %
  serviceFee:      number;
  total:           number;
}

/* Sent to POST /api/bookings/create */
export interface BookingPayload {
  serviceId:     string;
  serviceSlug:   string;
  serviceTitle:  string;
  serviceImage:  string;
  supplierId:    string;
  supplierName:  string;
  customerId:    string;
  details:       BookingDetails;
  pricing:       PricingBreakdown;
}

/* Stored in Firestore */
export interface BookingRecord extends BookingPayload {
  id:               string;
  status:           BookingStatus;
  paymentStatus:    PaymentStatus;
  paymentIntentId?: string;
  createdAt:        string;
  updatedAt:        string;
}

/* Returned by POST /api/bookings/create */
export interface CreateBookingResponse {
  bookingId: string;
  createdAt: string;
}

/* Returned by POST /api/payments/create-intent */
export interface CreateIntentResponse {
  clientSecret: string;
  demo?:        boolean;   // true when Stripe is not configured
}
