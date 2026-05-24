"use client";

/**
 * Subscribes to the messages subcollection for a given conversation,
 * ordered by createdAt asc. Pushes updates into the ChatStore.
 *
 * Mounts/unmounts a new listener whenever conversationId changes.
 * No-ops when conversationId is null or Firebase is not configured.
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
import { useChatStore } from "@/store/chat";
import { deserializeMessage } from "@/lib/chat/firestore";

export function useMessagesListener(conversationId: string | null) {
  const setMessages = useChatStore((s) => s.setMessages);

  React.useEffect(() => {
    if (!isClientFirebaseConfigured || !clientDb || !conversationId) return;

    const q = query(
      collection(clientDb, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: false },
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) =>
          deserializeMessage(doc.id, doc.data() as Record<string, unknown>),
        );
        setMessages(conversationId, msgs);
      },
      (error: FirestoreError) => {
        console.warn("[MessagesListener]", error.code, error.message);
      },
    );

    return unsubscribe;
  }, [conversationId, setMessages]);
}
