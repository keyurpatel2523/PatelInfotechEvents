/**
 * Server-only Stripe instance.
 * Import ONLY from API Route Handlers or Server Actions.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
 *
 * Client-side publishable key:
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
 */

import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/* eslint-disable @typescript-eslint/no-explicit-any */
const stripe: Stripe | null = secretKey
  ? new Stripe(secretKey, { apiVersion: "2025-01-27.acacia" as any })
  : null;

export { stripe };
export const isStripeConfigured = !!secretKey;
