"use client";
import { CollectionName } from "@/lib/firebase/collections";

/**
 * Subscribes to the Firestore "bookings" collection and pushes updates into
 * the BookingsStore. Cleans up the listener on unmount.
 *
 * Graceful degradation:
 *  - When Firebase client vars are absent → stays on mock data, status = "offline"
 *  - On Firestore permission/network error → stays on current data, status = "offline"
 *  - When snapshot returns 0 docs (new project) → keeps mock data, status = "live"
 */

import * as React from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type FirestoreError,
} from "firebase/firestore";
import { clientDb, isClientFirebaseConfigured } from "@/lib/firebase-client";
import { useBookingsStore } from "@/store/bookings";
import type { SupplierBooking } from "@/lib/mock-supplier";

export function useBookingsListener() {
  const setBookings   = useBookingsStore((s) => s.setBookings);
  const setConnection = useBookingsStore((s) => s.setConnection);

  React.useEffect(() => {
    if (!isClientFirebaseConfigured || !clientDb) {
      setConnection("offline");
      return;
    }

    setConnection("connecting");

    const q = query(
      collection(clientDb, CollectionName.BOOKINGS),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: false },
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as SupplierBooking[];

        /* Only overwrite mock data when Firestore actually has documents */
        if (docs.length > 0) {
          setBookings(docs);
        }
        setConnection("live");
      },
      (error: FirestoreError) => {
        console.warn("[Bookings Listener]", error.code, error.message);
        setConnection("offline");
      },
    );

    return unsubscribe;
  }, [setBookings, setConnection]);
}
