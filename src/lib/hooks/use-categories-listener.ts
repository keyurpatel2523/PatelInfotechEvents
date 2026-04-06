"use client";

/**
 * Subscribes to the Firestore "categories" collection and returns live data.
 *
 * Behaviour:
 *  - Firebase not configured → returns { categories: fallback, status: "offline" }
 *  - Connected, but collection is empty → keeps `fallback`, status = "live"
 *    (lets dev environments seed from mock data without wiping it)
 *  - Connected, collection has docs → returns live Firestore data, status = "live"
 *  - Error (permissions, network) → keeps last known data, status = "offline"
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
import { deserializeCategory } from "@/lib/categories-firestore";
import type { AdminCategory } from "@/lib/mock-admin";

export type ConnectionStatus = "connecting" | "live" | "offline";

export function useCategoriesListener(fallback: AdminCategory[]): {
  categories: AdminCategory[];
  status:     ConnectionStatus;
} {
  const [categories, setCategories] = React.useState<AdminCategory[]>(fallback);
  const [status,     setStatus]     = React.useState<ConnectionStatus>(
    isClientFirebaseConfigured ? "connecting" : "offline",
  );

  React.useEffect(() => {
    if (!isClientFirebaseConfigured || !clientDb) {
      setStatus("offline");
      return;
    }

    /* Order by level then order so the snapshot reflects tree depth correctly */
    const q = query(
      collection(clientDb, "categories"),
      orderBy("level",  "asc"),
      orderBy("order",  "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: false },
      (snapshot) => {
        const docs = snapshot.docs.map((doc) =>
          deserializeCategory(doc.id, doc.data() as Record<string, unknown>),
        );
        /* Only overwrite when Firestore has data — avoids blanking on empty project */
        if (docs.length > 0) setCategories(docs);
        setStatus("live");
      },
      (error: FirestoreError) => {
        console.warn("[Categories Listener]", error.code, error.message);
        setStatus("offline");
      },
    );

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { categories, status };
}
