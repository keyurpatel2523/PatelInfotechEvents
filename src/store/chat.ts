/**
 * Zustand store for the real-time chat system.
 *
 * Seeded from mock data; overwritten by Firestore listeners once live.
 *
 * Mobile UX:
 *   isMobileListVisible=true  → ConversationList shown (default)
 *   isMobileListVisible=false → ChatWindow shown (conversation open)
 */

import { create } from "zustand";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/chat/mock-data";
import type { Conversation, Message } from "@/types/chat";
import type { ConnectionStatus } from "@/store/bookings";

interface ChatState {
  /* ── Data ── */
  conversations:        Conversation[];
  messages:             Record<string, Message[]>;
  activeConversationId: string | null;

  /* ── Connection ── */
  connection: ConnectionStatus;

  /* ── Mobile nav ── */
  isMobileListVisible: boolean;

  /* ── Setters called by Firestore listeners ── */
  setConversations: (convs: Conversation[]) => void;
  setMessages:      (convId: string, msgs: Message[]) => void;
  setConnection:    (c: ConnectionStatus) => void;

  /* ── UI actions ── */
  setActiveConversation: (id: string | null) => void;
  setMobileListVisible:  (visible: boolean) => void;

  /* ── Optimistic append (replaced by listener snapshot) ── */
  addOptimisticMessage: (convId: string, msg: Message) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  conversations:        MOCK_CONVERSATIONS,
  messages:             MOCK_MESSAGES,
  activeConversationId: null,
  connection:           "offline",
  isMobileListVisible:  true,

  setConversations: (conversations) => set({ conversations }),

  setMessages: (convId, msgs) =>
    set((s) => ({ messages: { ...s.messages, [convId]: msgs } })),

  setConnection: (connection) => set({ connection }),

  setActiveConversation: (id) =>
    set({ activeConversationId: id, isMobileListVisible: id === null }),

  setMobileListVisible: (isMobileListVisible) => set({ isMobileListVisible }),

  addOptimisticMessage: (convId, msg) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: [...(s.messages[convId] ?? []), msg],
      },
    })),
}));
