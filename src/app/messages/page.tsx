import { ChatLayout } from "@/components/chat/chat-layout";

/**
 * /messages — Real-time chat between customers and suppliers.
 *
 * Route is full-screen (see layout.tsx).
 * ChatLayout mounts Firestore listeners on the client.
 */
export default function MessagesPage() {
  return <ChatLayout />;
}
