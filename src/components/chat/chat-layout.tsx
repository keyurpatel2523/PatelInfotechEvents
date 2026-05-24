"use client";

/**
 * ChatLayout — root layout for the messages page.
 *
 * Desktop (md+): two-column grid — ConversationList (320px) | ChatWindow
 * Mobile:        full-screen; switches between list and chat window
 *                using isMobileListVisible from the chat store.
 */

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { useConversationsListener } from "@/lib/hooks/chat/use-conversations-listener";
import { useCurrentUser } from "@/lib/hooks/chat/use-current-user";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";

export function ChatLayout() {
  const currentUser            = useCurrentUser();
  const activeConversationId   = useChatStore((s) => s.activeConversationId);
  const isMobileListVisible    = useChatStore((s) => s.isMobileListVisible);
  const setActiveConversation  = useChatStore((s) => s.setActiveConversation);
  const setMobileListVisible   = useChatStore((s) => s.setMobileListVisible);

  /* Kick off real-time conversations listener */
  useConversationsListener(currentUser.id);

  const handleBack = React.useCallback(() => {
    setActiveConversation(null);
    setMobileListVisible(true);
  }, [setActiveConversation, setMobileListVisible]);

  const showList   = !activeConversationId || isMobileListVisible;
  const showWindow = !!activeConversationId && !isMobileListVisible;

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Sidebar: ConversationList ── */}
      <aside
        className={cn(
          "flex-none flex-col border-r border-[--border]",
          /* Desktop: always visible at fixed width */
          "md:flex md:w-80 lg:w-96",
          /* Mobile: full-width, toggles with isMobileListVisible */
          showList ? "flex w-full" : "hidden",
        )}
      >
        <ConversationList currentUserId={currentUser.id} />
      </aside>

      {/* ── Main: ChatWindow or empty state ── */}
      <main
        className={cn(
          "flex-1 flex flex-col min-w-0",
          /* Desktop: always visible */
          "md:flex",
          /* Mobile: toggles */
          showWindow ? "flex" : "hidden",
        )}
      >
        {activeConversationId ? (
          <ChatWindow
            conversationId={activeConversationId}
            currentUserId={currentUser.id}
            onBack={handleBack}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

/* ── Empty state (desktop, no conversation selected) ─────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[--bg-subtle] text-center px-6">
      <div
        className={cn(
          "h-20 w-20 rounded-3xl flex items-center justify-center mb-5",
          "bg-brand-50 dark:bg-brand-950/30",
        )}
      >
        <MessageSquare className="h-10 w-10 text-brand-500" />
      </div>
      <h2 className="text-lg font-semibold text-[--text-1] mb-1.5">
        Your messages
      </h2>
      <p className="text-sm text-[--text-3] max-w-xs leading-relaxed">
        Select a conversation from the list to start messaging with your suppliers
      </p>
    </div>
  );
}
