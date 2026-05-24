/**
 * Firestore operations for the chat feature.
 * All imports from firebase/firestore are dynamic so this module is
 * safe to import in Server Components (they tree-shake on the server).
 */

import type { Conversation, Message } from "@/types/chat";
import { initialsFor, avatarColorFor } from "@/lib/chat/helpers";

/* ── Raw Firestore document type ───────────────────────────────────── */

type RawDoc = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toISO(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val?.toDate === "function") return (val.toDate() as Date).toISOString();
  if (typeof val === "string") return val;
  return new Date().toISOString();
}

/* ── Deserialisation ────────────────────────────────────────────────── */

export function deserializeConversation(id: string, data: RawDoc): Conversation {
  return {
    id,
    participants:        Array.isArray(data.participants) ? (data.participants as string[]) : [],
    participantNames:    (data.participantNames    as Record<string, string>) ?? {},
    participantInitials: (data.participantInitials as Record<string, string>) ?? {},
    participantColors:   (data.participantColors   as Record<string, string>) ?? {},
    bookingId:    data.bookingId    ? String(data.bookingId)    : undefined,
    serviceId:    data.serviceId    ? String(data.serviceId)    : undefined,
    serviceTitle: data.serviceTitle ? String(data.serviceTitle) : undefined,
    lastMessage:   String(data.lastMessage ?? ""),
    lastMessageAt: data.lastMessageAt ? toISO(data.lastMessageAt) : null,
    lastSenderId:  String(data.lastSenderId ?? ""),
    unreadCount:   (data.unreadCount as Record<string, number>) ?? {},
    createdAt:     toISO(data.createdAt),
  };
}

export function deserializeMessage(id: string, data: RawDoc): Message {
  return {
    id,
    senderId:   String(data.senderId   ?? ""),
    senderName: String(data.senderName ?? "Unknown"),
    text:       String(data.text       ?? ""),
    createdAt:  toISO(data.createdAt),
    read:       Boolean(data.read),
    readBy:     Array.isArray(data.readBy) ? (data.readBy as string[]) : [],
  };
}

/* ── Write: send a message ──────────────────────────────────────────── */

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string,
  participants: string[],
): Promise<void> {
  const { clientDb, isClientFirebaseConfigured } = await import("@/lib/firebase-client");
  if (!isClientFirebaseConfigured || !clientDb) return;

  const {
    collection, doc, writeBatch, serverTimestamp, increment,
  } = await import("firebase/firestore");

  const batch = writeBatch(clientDb);

  /* Add message document */
  const msgRef = doc(collection(clientDb, "conversations", conversationId, "messages"));
  batch.set(msgRef, {
    senderId,
    senderName,
    text: text.trim(),
    createdAt: serverTimestamp(),
    read: false,
    readBy: [senderId],
  });

  /* Update parent conversation */
  const convRef = doc(clientDb, "conversations", conversationId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {
    lastMessage:   text.trim(),
    lastMessageAt: serverTimestamp(),
    lastSenderId:  senderId,
  };
  for (const pid of participants) {
    if (pid !== senderId) update[`unreadCount.${pid}`] = increment(1);
  }
  batch.update(convRef, update);

  await batch.commit();
}

/* ── Write: reset unread count for a user ───────────────────────────── */

export async function markConversationRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  const { clientDb, isClientFirebaseConfigured } = await import("@/lib/firebase-client");
  if (!isClientFirebaseConfigured || !clientDb) return;

  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(clientDb, "conversations", conversationId), {
    [`unreadCount.${userId}`]: 0,
  });
}

/* ── Write: create a new conversation ──────────────────────────────── */

export async function createConversation(
  participantIds: string[],
  participantNames: Record<string, string>,
  options?: { bookingId?: string; serviceId?: string; serviceTitle?: string },
): Promise<string> {
  const { clientDb, isClientFirebaseConfigured } = await import("@/lib/firebase-client");
  if (!isClientFirebaseConfigured || !clientDb) throw new Error("Firebase not configured");

  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  const ref = await addDoc(collection(clientDb, "conversations"), {
    participants:        participantIds,
    participantNames,
    participantInitials: Object.fromEntries(
      Object.entries(participantNames).map(([id, name]) => [id, initialsFor(name)]),
    ),
    participantColors: Object.fromEntries(
      participantIds.map((id) => [id, avatarColorFor(id)]),
    ),
    bookingId:    options?.bookingId    ?? null,
    serviceId:    options?.serviceId    ?? null,
    serviceTitle: options?.serviceTitle ?? null,
    lastMessage:   "",
    lastMessageAt: null,
    lastSenderId:  "",
    unreadCount:   Object.fromEntries(participantIds.map((id) => [id, 0])),
    createdAt:     serverTimestamp(),
  });

  return ref.id;
}
