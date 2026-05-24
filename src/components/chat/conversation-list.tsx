"use client";

import * as React from "react";
import { Search, MessageSquarePlus, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatStore } from "@/store/chat";
import { formatConvTimestamp } from "@/lib/chat/formatters";
import type { Conversation } from "@/types/chat";

interface ConversationListProps {
  currentUserId: string;
}

export function ConversationList({ currentUserId }: ConversationListProps) {
  const conversations         = useChatStore((s) => s.conversations);
  const activeConversationId  = useChatStore((s) => s.activeConversationId);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const setMobileListVisible  = useChatStore((s) => s.setMobileListVisible);

  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conv) => {
      const otherId   = conv.participants.find((p) => p !== currentUserId) ?? "";
      const otherName = conv.participantNames[otherId]?.toLowerCase() ?? "";
      return (
        otherName.includes(q) ||
        conv.lastMessage.toLowerCase().includes(q) ||
        conv.serviceTitle?.toLowerCase().includes(q)
      );
    });
  }, [conversations, search, currentUserId]);

  const handleSelect = (conv: Conversation) => {
    setActiveConversation(conv.id);
    setMobileListVisible(false);
  };

  /* Total unread across all conversations (for header badge) */
  const totalUnread = React.useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount[currentUserId] ?? 0), 0),
    [conversations, currentUserId],
  );

  return (
    <div className="flex flex-col h-full bg-[--bg-subtle]">

      {/* ── Header ── */}
      <div className="px-5 pt-6 pb-4 border-b border-[--border]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[17px] font-semibold text-[--text-1] tracking-tight">
              Messages
            </h1>
            {totalUnread > 0 && (
              <span
                className={cn(
                  "inline-flex items-center justify-center",
                  "min-w-[20px] h-5 px-1.5 rounded-full",
                  "bg-brand-gradient text-white text-[10px] font-bold",
                  "animate-in zoom-in-50 duration-200",
                )}
              >
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <button
            aria-label="New conversation"
            className={cn(
              "p-2 rounded-xl text-[--text-3]",
              "hover:bg-[--bg-muted] hover:text-[--text-1]",
              "transition-colors duration-150",
            )}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--text-4] pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className={cn(
              "w-full pl-9 text-sm rounded-xl",
              "bg-[--bg-muted] text-[--text-1] placeholder:text-[--text-4]",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/25",
              "transition-all duration-150",
              "py-2",
              search ? "pr-8" : "pr-3",
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[--text-4] hover:text-[--text-2] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.length === 0 ? (
          <EmptyList hasSearch={search.length > 0} />
        ) : (
          <ul role="list" className="py-1">
            {filtered.map((conv) => {
              const otherId      = conv.participants.find((p) => p !== currentUserId) ?? "";
              const name         = conv.participantNames[otherId]    ?? "Unknown";
              const initials     = conv.participantInitials[otherId] ?? "?";
              const color        = conv.participantColors[otherId]   ?? "#6366f1";
              const unread       = conv.unreadCount[currentUserId]   ?? 0;
              const isActive     = conv.id === activeConversationId;
              const isSelf       = conv.lastSenderId === currentUserId;
              const lastMsgAt    = conv.lastMessageAt as string | null;
              const hasUnread    = unread > 0;

              return (
                <li key={conv.id}>
                  <button
                    onClick={() => handleSelect(conv)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative w-full flex items-center gap-3 text-left",
                      "pl-5 pr-4 py-4",
                      "transition-colors duration-150",
                      /* Left accent bar */
                      "border-l-[3px]",
                      isActive
                        ? "border-l-brand-500 bg-brand-50/70 dark:bg-brand-950/20"
                        : "border-l-transparent hover:bg-[--bg-muted]",
                    )}
                  >
                    {/* Avatar */}
                    <Avatar size="md" className="flex-none shrink-0">
                      <AvatarFallback
                        className="text-sm font-semibold text-white"
                        style={{ background: color }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "text-[13px] truncate",
                            hasUnread
                              ? "font-semibold text-[--text-1]"
                              : "font-medium text-[--text-1]",
                          )}
                        >
                          {name}
                        </span>
                        {/* Timestamp — brand color when unread */}
                        <span
                          className={cn(
                            "text-[11px] flex-none",
                            hasUnread ? "text-brand-500 font-semibold" : "text-[--text-4]",
                          )}
                        >
                          {formatConvTimestamp(lastMsgAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p
                          className={cn(
                            "text-xs truncate leading-snug",
                            hasUnread
                              ? "text-[--text-2] font-medium"
                              : "text-[--text-3]",
                          )}
                        >
                          {isSelf && (
                            <span className="text-[--text-4]">You: </span>
                          )}
                          {conv.lastMessage || "Start a conversation"}
                        </p>

                        {/* Unread badge */}
                        {hasUnread && (
                          <span
                            aria-label={`${unread} unread`}
                            className={cn(
                              "flex-none min-w-[20px] h-5 px-1.5",
                              "inline-flex items-center justify-center",
                              "rounded-full bg-brand-gradient text-white",
                              "text-[10px] font-bold leading-none",
                              "animate-in zoom-in-50 duration-200",
                            )}
                          >
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>

                      {/* Service context pill */}
                      {conv.serviceTitle && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[--text-3] bg-[--bg] border border-[--border] px-2 py-0.5 rounded-full max-w-full truncate">
                          {conv.serviceTitle}
                          {conv.bookingId && (
                            <span className="text-[--text-4]">· {conv.bookingId}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────────────── */

function EmptyList({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-52 px-8 text-center">
      <div className="h-12 w-12 rounded-2xl bg-[--bg-muted] flex items-center justify-center mb-3">
        <MessageSquare className="h-6 w-6 text-[--text-4]" />
      </div>
      <p className="text-sm font-medium text-[--text-2]">
        {hasSearch ? "No results found" : "No conversations yet"}
      </p>
      <p className="text-xs text-[--text-4] mt-1 leading-relaxed">
        {hasSearch
          ? "Try a different name or keyword"
          : "Your supplier conversations will appear here"}
      </p>
    </div>
  );
}
