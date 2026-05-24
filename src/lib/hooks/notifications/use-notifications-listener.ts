"use client";
import { CollectionName } from "@/lib/firebase/collections";

import * as React from "react";
import { useNotificationsStore } from "@/store/notifications";
import { deserializeNotification } from "@/lib/notifications/client";

export function useNotificationsListener(userId: string | null) {
  const setNotifications = useNotificationsStore((s) => s.setNotifications);

  React.useEffect(() => {
    if (!userId) return;

    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { clientDb }        = await import("@/lib/firebase-client");
      const { collection, query, where, orderBy, limit, onSnapshot } =
        await import("firebase/firestore");

      if (!clientDb) return;

      const q = query(
        collection(clientDb, CollectionName.NOTIFICATIONS),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(50),
      );

      unsubscribe = onSnapshot(
        q,
        (snap) => {
          const notifications = snap.docs.map((d) =>
            deserializeNotification(d.id, d.data() as Record<string, unknown>),
          );
          setNotifications(notifications);
        },
        (err) => {
          console.warn("[notifications listener] Firestore unavailable, using mock data:", err.message);
        },
      );
    })();

    return () => unsubscribe?.();
  }, [userId, setNotifications]);
}
