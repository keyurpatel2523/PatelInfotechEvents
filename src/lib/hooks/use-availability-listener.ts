"use client";

/**
 * Real-time Firestore listener for a supplier's availability document.
 * Falls back to an empty record when Firebase is not configured or offline.
 */

import * as React from "react";
import { doc, onSnapshot, type FirestoreError } from "firebase/firestore";
import { clientDb, isClientFirebaseConfigured } from "@/lib/firebase-client";
import {
  emptyRecord,
  deserializeAvailability,
  type AvailabilityRecord,
} from "@/lib/availability-firestore";

export type ConnectionStatus = "connecting" | "live" | "offline";

export function useAvailabilityListener(supplierId: string): {
  availability: AvailabilityRecord;
  status:       ConnectionStatus;
} {
  const [availability, setAvailability] = React.useState<AvailabilityRecord>(
    emptyRecord(supplierId),
  );
  const [status, setStatus] = React.useState<ConnectionStatus>(
    isClientFirebaseConfigured ? "connecting" : "offline",
  );

  React.useEffect(() => {
    if (!isClientFirebaseConfigured || !clientDb) {
      setStatus("offline");
      return;
    }

    setStatus("connecting");

    const ref = doc(clientDb, "availability", supplierId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setAvailability(
            deserializeAvailability(supplierId, snap.data() as Record<string, unknown>),
          );
        } else {
          /* Doc doesn't exist yet — show empty (available by default) */
          setAvailability(emptyRecord(supplierId));
        }
        setStatus("live");
      },
      (err: FirestoreError) => {
        console.warn("[Availability Listener]", err.code, err.message);
        setStatus("offline");
      },
    );

    return unsub;
  }, [supplierId]);

  return { availability, status };
}
