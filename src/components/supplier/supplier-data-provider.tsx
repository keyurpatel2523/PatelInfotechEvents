"use client";

/**
 * Mounts the Firestore bookings listener once at the layout level so the
 * real-time connection is shared across all supplier pages and persists
 * during client-side navigation.
 */

import * as React from "react";
import { useBookingsListener } from "@/lib/hooks/use-bookings-listener";

export function SupplierDataProvider({ children }: { children: React.ReactNode }) {
  useBookingsListener();
  return <>{children}</>;
}
