"use client";

import * as React from "react";
import { ChevronLeft, Info, MessageSquare, ArrowDown } from "lucide-react";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatStore } from "@/store/chat";
import { useMessagesListener } from "@/lib/hooks/chat/use-messages-listener";
import { sendMessage, markConversationRead } from "@/lib/chat/firestore";
import { formatDateDivider } from "@/lib/chat/formatters";
import { MessageBubble } from "@/components/chat/message-bubble";
import { MessageInput } from "@/components/chat/message-input";
import type { Message } from "@/types/chat";

interface ChatWindowProps {
  conversationId: string;
  currentUserId:  string;
  onBack?:        () => void;
}

export function ChatWindow({ conversationId, currentUserId, onBack }: ChatWindowProps) {
  const conversations = useChatStore((s) => s.conversations);
  const messages      = useChatStore((s) => s.messages[conversationId] ?? []);

  const scrollAreaRef      = React.useRef<HTMLDivElement>(null);
  const isNearBottomRef    = React.useRef(true);
  const prevCountRef       = React.useRef(messages.length);

  /* Unread-while-scrolled counter for the FAB */
  const [unreadScrolled, setUnreadScrolled] = React.useState(0);
  const [showFab,        setShowFab]        = React.useState(false);

  /* Which index was the first unread when this conversation opened */
  const firstUnreadIdxRef = React.useRef<number | null>(null);

  useMessagesListener(conversationId);

  /* ── Conversation metadata ─────────────────────────────────────────── */
  const conversation = React.useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );

  const otherId       = conversation?.participants.find((p) => p !== currentUserId) ?? "";
  const otherName     = conversation?.participantNames[otherId]    ?? "Unknown";
  const otherInitials = conversation?.participantInitials[otherId] ?? "?";
  const otherColor    = conversation?.participantColors[otherId]   ?? "#6366f1";

  /* ── Scroll helpers ────────────────────────────────────────────────── */

  /** Instantly jump to bottom without animation (e.g. on conversation switch). */
  const jumpToBottom = React.useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    /* Temporarily disable smooth scroll for the jump */
    el.style.scrollBehavior = "auto";
    el.scrollTop = el.scrollHeight;
    /* Restore smooth scroll on next tick */
    requestAnimationFrame(() => {
      if (el) el.style.scrollBehavior = "";
    });
  }, []);

  /** Smoothly scroll to bottom (CSS scroll-behavior handles the easing). */
  const smoothScrollToBottom = React.useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  /* Jump to bottom + capture first-unread index on conversation open */
  React.useEffect(() => {
    firstUnreadIdxRef.current = messages.findIndex(
      (m) => !m.readBy.includes(currentUserId),
    );
    setUnreadScrolled(0);
    setShowFab(false);
    isNearBottomRef.current = true;
    prevCountRef.current = messages.length;

    /* requestAnimationFrame ensures DOM is painted before we scroll */
    requestAnimationFrame(jumpToBottom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  /* Auto-scroll when new messages arrive */
  React.useEffect(() => {
    const newCount = messages.length - prevCountRef.current;
    prevCountRef.current = messages.length;

    if (newCount <= 0) return;

    if (isNearBottomRef.current) {
      smoothScrollToBottom();
      setUnreadScrolled(0);
    } else {
      setUnreadScrolled((c) => c + newCount);
    }
  }, [messages.length, smoothScrollToBottom]);

  /* Track scroll position */
  const handleScroll = React.useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    isNearBottomRef.current = nearBottom;
    setShowFab(!nearBottom);
    if (nearBottom) setUnreadScrolled(0);
  }, []);

  /* Mark read on open */
  React.useEffect(() => {
    markConversationRead(conversationId, currentUserId);
  }, [conversationId, currentUserId]);

  const handleFabClick = () => {
    smoothScrollToBottom();
    setUnreadScrolled(0);
  };

  const handleSend = async (text: string) => {
    if (!conversation) return;
    await sendMessage(
      conversationId,
      currentUserId,
      conversation.participantNames[currentUserId] ?? "You",
      text,
      conversation.participants,
    );
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full bg-[--bg]">

      {/* ── Header ── */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 shrink-0",
          "bg-[--bg] border-b border-[--border]",
          "shadow-[0_1px_3px_0_rgb(0_0_0_/_0.06)]",
        )}
      >
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to conversations"
            className={cn(
              "flex-none -ml-1 p-1.5 rounded-xl",
              "text-[--text-3] hover:bg-[--bg-muted] hover:text-[--text-1]",
              "transition-colors duration-150 md:hidden",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative flex-none">
          <Avatar size="md">
            <AvatarFallback
              className="text-sm font-semibold text-white"
              style={{ background: otherColor }}
            >
              {otherInitials}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success-500 ring-2 ring-[--bg]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[--text-1] truncate leading-tight">
            {otherName}
          </p>
          {conversation.serviceTitle ? (
            <p className="text-[11px] text-[--text-3] truncate leading-tight mt-0.5">
              {conversation.serviceTitle}
              {conversation.bookingId && (
                <span className="text-[--text-4]"> · {conversation.bookingId}</span>
              )}
            </p>
          ) : (
            <p className="text-[11px] text-success-500 font-medium leading-tight mt-0.5">
              Online
            </p>
          )}
        </div>

        <button
          aria-label="Conversation info"
          className={cn(
            "flex-none p-2 rounded-xl text-[--text-3]",
            "hover:bg-[--bg-muted] hover:text-[--text-1]",
            "transition-colors duration-150",
          )}
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 pt-5 pb-3 no-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.length === 0 ? (
            <EmptyMessages name={otherName} />
          ) : (
            <div className="flex flex-col">
              {messages.map((msg, i) => {
                const prev = i > 0 ? messages[i - 1] : null;
                const next = i < messages.length - 1 ? messages[i + 1] : null;

                const showDateDivider =
                  !prev ||
                  !isSameDay(
                    new Date(msg.createdAt as string),
                    new Date(prev.createdAt as string),
                  );

                const isOwn          = msg.senderId === currentUserId;
                const isFirstInGroup = !prev || prev.senderId !== msg.senderId;
                const isLastInGroup  = !next || next.senderId !== msg.senderId;

                const senderColor    = conversation.participantColors[msg.senderId]   ?? "#6366f1";
                const senderInitials = conversation.participantInitials[msg.senderId] ?? "?";

                /* "New messages" divider — shown once, at the first unread msg */
                const showUnreadDivider =
                  firstUnreadIdxRef.current !== null &&
                  firstUnreadIdxRef.current >= 0 &&
                  i === firstUnreadIdxRef.current;

                return (
                  <React.Fragment key={msg.id}>
                    {showDateDivider && (
                      <DateDivider date={msg.createdAt as string} />
                    )}
                    {showUnreadDivider && <UnreadDivider />}
                    <div className={cn(isFirstInGroup ? "mt-4" : "mt-[3px]")}>
                      <MessageBubble
                        message={msg}
                        isOwn={isOwn}
                        isFirstInGroup={isFirstInGroup}
                        isLastInGroup={isLastInGroup}
                        showSender={isFirstInGroup}
                        senderColor={senderColor}
                        senderInitials={senderInitials}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          <div className="h-2" />
        </div>

        {/* ── Scroll-to-bottom FAB ── */}
        {showFab && (
          <button
            onClick={handleFabClick}
            aria-label="Scroll to latest messages"
            className={cn(
              "absolute bottom-4 right-4 z-10",
              "flex items-center gap-1.5",
              "h-9 rounded-full px-3",
              "bg-[--bg] border border-[--border]",
              "shadow-[var(--shadow-md)]",
              "text-[--text-1] text-xs font-medium",
              "hover:bg-[--bg-muted] transition-all duration-150",
              "animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
            )}
          >
            <ArrowDown className="h-3.5 w-3.5" />
            {unreadScrolled > 0 && (
              <span className="text-brand-500 font-semibold">
                {unreadScrolled} new
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── Input ── */}
      <div className="shrink-0">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

/* ── Date divider ───────────────────────────────────────────────────── */

function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[--border-subtle]" />
      <span
        className={cn(
          "text-[11px] font-medium text-[--text-4] whitespace-nowrap select-none",
          "bg-[--bg] px-2 py-0.5 rounded-full border border-[--border-subtle]",
        )}
      >
        {formatDateDivider(date)}
      </span>
      <div className="flex-1 h-px bg-[--border-subtle]" />
    </div>
  );
}

/* ── New messages divider ───────────────────────────────────────────── */

function UnreadDivider() {
  return (
    <div className="flex items-center gap-2.5 my-3">
      <div className="flex-1 h-px bg-brand-200 dark:bg-brand-900" />
      <span className="text-[11px] font-semibold text-brand-500 whitespace-nowrap select-none">
        New messages
      </span>
      <div className="flex-1 h-px bg-brand-200 dark:bg-brand-900" />
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────────────── */

function EmptyMessages({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-48 text-center py-16">
      <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mb-4 shadow-sm">
        <MessageSquare className="h-7 w-7 text-brand-400" />
      </div>
      <p className="text-sm font-semibold text-[--text-1]">Start the conversation</p>
      <p className="text-xs text-[--text-3] mt-1.5 max-w-[200px] leading-relaxed">
        Say hello to {name} and get things moving
      </p>
    </div>
  );
}

/* ── Skeleton ────────────────────────────────────────────────────────── */

export function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[--bg] animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[--border]">
        <div className="h-10 w-10 rounded-full bg-[--bg-muted]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 rounded-full bg-[--bg-muted]" />
          <div className="h-2.5 w-16 rounded-full bg-[--bg-muted]" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-5">
        {[38, 58, 46, 70, 42].map((w, i) => (
          <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
            {i % 2 !== 0 && <div className="h-8 w-8 rounded-full bg-[--bg-muted] mr-2 self-end" />}
            <div className="h-9 rounded-2xl bg-[--bg-muted]" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export type { Message };
