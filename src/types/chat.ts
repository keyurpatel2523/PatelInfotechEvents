import type { Timestamp } from "firebase/firestore";

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantInitials: Record<string, string>;
  participantColors: Record<string, string>;
  bookingId?: string;
  serviceId?: string;
  serviceTitle?: string;
  lastMessage: string;
  lastMessageAt: Timestamp | string | null;
  lastSenderId: string;
  unreadCount: Record<string, number>;
  createdAt: Timestamp | string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp | string;
  read: boolean;
  readBy: string[];
}

export interface ChatUser {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: "customer" | "supplier" | "admin";
}
