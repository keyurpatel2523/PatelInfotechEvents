"use client";

/**
 * Subscribes to the authenticated user's conversations in Firestore
 * (where `participants` array-contains the userId) and pushes them
 * into the ChatStore, sorted by lastMessageAt desc.
 *
 * Graceful degradation:
 *  - Firebase not configured → stays on mock data, status = "offline"
 *  - Permission/network error → stays on current data, status = "offline"
 *  - Zero docs returned → keeps mock data, status = "live"
 */

import * as React from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  type FirestoreError,
} from "firebase/firestore";
import { clientDb, isClientFirebaseConfigured } from "@/lib/firebase-client";
import { useChatStore } from "@/store/chat";
import { deserializeConversation } from "@/lib/chat/firestore";

export function useConversationsListener(userId: string) {
  const setConversations = useChatStore((s) => s.setConversations);
  const setConnection    = useChatStore((s) => s.setConnection);

  React.useEffect(() => {
    if (!isClientFirebaseConfigured || !clientDb || !userId) {
      setConnection("offline");
      return;
    }

    setConnection("connecting");

    const q = query(
      collection(clientDb, "conversations"),
      where("participants", "array-contains", userId),
      orderBy("lastMessageAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: false },
      (snapshot) => {
        const convs = snapshot.docs.map((doc) =>
          deserializeConversation(doc.id, doc.data() as Record<string, unknown>),
        );
        if (convs.length > 0) setConversations(convs);
        setConnection("live");
      },
      (error: FirestoreError) => {
        console.warn("[ConversationsListener]", error.code, error.message);
        setConnection("offline");
      },
    );

    return unsubscribe;
  }, [userId, setConversations, setConnection]);
}
