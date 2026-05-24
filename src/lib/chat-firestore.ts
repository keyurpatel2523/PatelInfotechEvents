/**
 * @deprecated Import from "@/lib/chat" instead.
 * This file is kept as a re-export shim for backwards compatibility.
 *
 * Structure:
 *   conversations/{conversationId}
 *     messages/{messageId}
 *
 * All write operations use writeBatch for atomicity.
 * Timestamps stored as serverTimestamp() on write; deserialised to ISO
 * strings on read so components stay Firestore-free.
 */

import { format, isToday, isYesterday } from "date-fns";
import type { Conversation, Message, ChatUser } from "@/types/chat";

/* ── Mock current user (swap for Firebase Auth when ready) ─────────── */

export const MOCK_CURRENT_USER: ChatUser = {
  id: "user-current",
  name: "James Thompson",
  initials: "JT",
  avatarColor: "#6366f1",
  role: "customer",
};

/* ── Avatar helpers ─────────────────────────────────────────────────── */

const PALETTE = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#06b6d4", "#ef4444", "#84cc16",
];

export function avatarColorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ── Relative time helpers for mock data ───────────────────────────── */

function ago(days: number, hours = 0, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, d.getMinutes() - minutes, 0, 0);
  return d.toISOString();
}

/* ── Mock conversations (London market, £ GBP) ─────────────────────── */

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    participants: ["user-current", "supplier-001"],
    participantNames: {
      "user-current": "James Thompson",
      "supplier-001": "Harmony Photography",
    },
    participantInitials: { "user-current": "JT", "supplier-001": "HP" },
    participantColors:   { "user-current": "#6366f1", "supplier-001": "#8b5cf6" },
    bookingId:    "BK-12345678",
    serviceId:    "svc-001",
    serviceTitle: "Wedding Photography",
    lastMessage:  "Looking forward to your big day! We'll have everything ready.",
    lastMessageAt: ago(1, 0, 5),
    lastSenderId: "supplier-001",
    unreadCount:  { "user-current": 0, "supplier-001": 0 },
    createdAt:    ago(3),
  },
  {
    id: "conv-002",
    participants: ["user-current", "supplier-002"],
    participantNames: {
      "user-current": "James Thompson",
      "supplier-002": "Golden Touch Catering",
    },
    participantInitials: { "user-current": "JT", "supplier-002": "GT" },
    participantColors:   { "user-current": "#6366f1", "supplier-002": "#10b981" },
    serviceId:    "svc-002",
    serviceTitle: "Corporate Event Catering",
    lastMessage:  "Perfect, I'll review it today and get back to you. Thanks!",
    lastMessageAt: ago(6, 12, 15),
    lastSenderId: "user-current",
    unreadCount:  { "user-current": 0, "supplier-002": 1 },
    createdAt:    ago(7),
  },
  {
    id: "conv-003",
    participants: ["user-current", "supplier-003"],
    participantNames: {
      "user-current": "James Thompson",
      "supplier-003": "London Sound Pro",
    },
    participantInitials: { "user-current": "JT", "supplier-003": "LS" },
    participantColors:   { "user-current": "#6366f1", "supplier-003": "#f59e0b" },
    serviceId:    "svc-003",
    serviceTitle: "DJ Services",
    lastMessage:  "Also, do you have a venue sorted? Some Shoreditch spaces have noise restrictions after midnight.",
    lastMessageAt: ago(0, 0, 45),
    lastSenderId: "supplier-003",
    unreadCount:  { "user-current": 2, "supplier-003": 0 },
    createdAt:    ago(0, 1, 0),
  },
];

/* ── Mock messages ──────────────────────────────────────────────────── */

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-001": [
    {
      id: "m01-01", senderId: "user-current", senderName: "James Thompson",
      text: "Hi! I've just completed my booking for wedding photography on 15th June — reference BK-12345678. Could you confirm you've received everything?",
      createdAt: ago(3, 0, 20), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-02", senderId: "supplier-001", senderName: "Harmony Photography",
      text: "Hello James! Great news — we have you confirmed in our system. BK-12345678 is all set for 15th June. You're in safe hands!",
      createdAt: ago(3, 0, 15), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-03", senderId: "user-current", senderName: "James Thompson",
      text: "Wonderful! Do you have a style questionnaire I should fill in? We'd love documentary-style coverage throughout the day.",
      createdAt: ago(3, 0, 12), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-04", senderId: "supplier-001", senderName: "Harmony Photography",
      text: "Absolutely! I'll send that over via email shortly. In the meantime, could you share the ceremony and reception venues so I can plan lighting and logistics?",
      createdAt: ago(3, 0, 8), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-05", senderId: "user-current", senderName: "James Thompson",
      text: "The ceremony is at St. Paul's Church in Covent Garden, then the reception at The Savoy. Should be a stunning setting!",
      createdAt: ago(3, 0, 5), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-06", senderId: "supplier-001", senderName: "Harmony Photography",
      text: "Perfect choices! We've worked at both venues before. The natural light filtering through St. Paul's in June is just beautiful, and The Savoy's grand staircase makes for stunning portraits.",
      createdAt: ago(3, 0, 2), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-07", senderId: "user-current", senderName: "James Thompson",
      text: "That's really reassuring! Quick question — will you be doing a pre-wedding shoot as well? We'd love some portraits in Hyde Park beforehand.",
      createdAt: ago(2, 9, 30), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-08", senderId: "supplier-001", senderName: "Harmony Photography",
      text: "Yes, that's included in your package! I'd suggest the Long Water area near the bridge for golden hour portraits — it photographs beautifully. I'll include all the details in the questionnaire.",
      createdAt: ago(2, 9, 15), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-09", senderId: "user-current", senderName: "James Thompson",
      text: "That sounds perfect. We're really excited!",
      createdAt: ago(1, 15, 0), read: true, readBy: ["user-current", "supplier-001"],
    },
    {
      id: "m01-10", senderId: "supplier-001", senderName: "Harmony Photography",
      text: "Looking forward to your big day! We'll have everything ready.",
      createdAt: ago(1, 0, 5), read: true, readBy: ["user-current", "supplier-001"],
    },
  ],

  "conv-002": [
    {
      id: "m02-01", senderId: "user-current", senderName: "James Thompson",
      text: "Hello! I'm planning a corporate networking evening for around 80 guests in Canary Wharf. Are you available on 20th July?",
      createdAt: ago(7, 10, 0), read: true, readBy: ["user-current", "supplier-002"],
    },
    {
      id: "m02-02", senderId: "supplier-002", senderName: "Golden Touch Catering",
      text: "Hi James! Yes, 20th July is available. We specialise in corporate events and can offer a full range of canapé and buffet options. What budget per head are you working with?",
      createdAt: ago(7, 8, 30), read: true, readBy: ["user-current", "supplier-002"],
    },
    {
      id: "m02-03", senderId: "user-current", senderName: "James Thompson",
      text: "We're thinking around £45–55 per head. Mostly finance professionals, so something polished and sophisticated would work well.",
      createdAt: ago(7, 8, 0), read: true, readBy: ["user-current", "supplier-002"],
    },
    {
      id: "m02-04", senderId: "supplier-002", senderName: "Golden Touch Catering",
      text: "That works perfectly. I'd suggest our 'City Prestige' package — artisan canapés, mezze stations and a curated dessert bar. Shall I put together a full menu proposal?",
      createdAt: ago(7, 7, 40), read: true, readBy: ["user-current", "supplier-002"],
    },
    {
      id: "m02-05", senderId: "user-current", senderName: "James Thompson",
      text: "Yes please! That sounds exactly right for the occasion.",
      createdAt: ago(6, 14, 0), read: true, readBy: ["user-current", "supplier-002"],
    },
    {
      id: "m02-06", senderId: "supplier-002", senderName: "Golden Touch Catering",
      text: "Menu proposal sent to your email! We also offer complimentary tasting sessions at our Southwark kitchen for bookings over 50 guests — just say the word.",
      createdAt: ago(6, 12, 30), read: true, readBy: ["user-current", "supplier-002"],
    },
    {
      id: "m02-07", senderId: "user-current", senderName: "James Thompson",
      text: "Perfect, I'll review it today and get back to you. Thanks!",
      createdAt: ago(6, 12, 15), read: true, readBy: ["user-current", "supplier-002"],
    },
  ],

  "conv-003": [
    {
      id: "m03-01", senderId: "user-current", senderName: "James Thompson",
      text: "Hi! I'm interested in DJ services for a birthday party in Shoreditch — around 60 guests, mid-August. Do you have availability?",
      createdAt: ago(0, 1, 0), read: true, readBy: ["user-current", "supplier-003"],
    },
    {
      id: "m03-02", senderId: "supplier-003", senderName: "London Sound Pro",
      text: "Hey James! Great news — we have several dates free in mid-August. What kind of vibe are you going for? House, funk, disco, chart hits? We tailor every set.",
      createdAt: ago(0, 0, 50), read: false, readBy: ["supplier-003"],
    },
    {
      id: "m03-03", senderId: "supplier-003", senderName: "London Sound Pro",
      text: "Also, do you have a venue sorted? Some Shoreditch spaces have noise restrictions after midnight that are worth knowing about.",
      createdAt: ago(0, 0, 45), read: false, readBy: ["supplier-003"],
    },
  ],
};

/* ── Deserialisation ────────────────────────────────────────────────── */

type RawDoc = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toISO(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val?.toDate === "function") return (val.toDate() as Date).toISOString();
  if (typeof val === "string") return val;
  return new Date().toISOString();
}

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

/* ── Firestore write operations ─────────────────────────────────────── */

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

  const msgRef = doc(collection(clientDb, "conversations", conversationId, "messages"));
  batch.set(msgRef, {
    senderId,
    senderName,
    text: text.trim(),
    createdAt: serverTimestamp(),
    read: false,
    readBy: [senderId],
  });

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

/* ── Timestamp formatters used in UI components ─────────────────────── */

export function formatConvTimestamp(val: string | null): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  if (isToday(d))     return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "d MMM");
}

export function formatMsgTimestamp(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return format(d, "h:mm a");
}

export function formatDateDivider(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  if (isToday(d))     return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, d MMMM yyyy");
}
