"use client";

import * as React from "react";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatMsgTimestamp } from "@/lib/chat/formatters";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message:        Message;
  isOwn:          boolean;
  isFirstInGroup: boolean;
  isLastInGroup:  boolean;
  showSender:     boolean;
  senderColor:    string;
  senderInitials: string;
}

/**
 * Returns the iMessage-style border-radius for a bubble.
 *
 *  Solo / mid-group → 18px all around
 *  Own last         → 18 18 4 18  (tail at bottom-right)
 *  Other last       → 18 18 18 4  (tail at bottom-left)
 *
 * CSS order: top-left, top-right, bottom-right, bottom-left
 */
function bubbleRadius(
  isOwn: boolean,
  isFirstInGroup: boolean,
  isLastInGroup: boolean,
): React.CSSProperties {
  if (isLastInGroup && isOwn)  return { borderRadius: "18px 18px 4px 18px" };
  if (isLastInGroup && !isOwn) return { borderRadius: "18px 18px 18px 4px" };
  if (!isFirstInGroup && isOwn)  return { borderRadius: "18px 5px 5px 18px" };
  if (!isFirstInGroup && !isOwn) return { borderRadius: "5px 18px 18px 5px" };
  return { borderRadius: "18px" };
}

export function MessageBubble({
  message,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  showSender,
  senderColor,
  senderInitials,
}: MessageBubbleProps) {
  const createdAt = message.createdAt as string;
  const isRead    = message.readBy.length > 1; /* read by someone other than sender */

  return (
    <div
      className={cn(
        "group flex items-end gap-2",
        isOwn ? "flex-row-reverse" : "flex-row",
        /* Entry animation */
        "animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
      )}
    >
      {/* Avatar column — always reserves 32px so bubbles don't shift */}
      <div className="w-8 flex-none self-end mb-0.5">
        {!isOwn && isLastInGroup && (
          <Avatar size="sm" className="h-8 w-8">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ background: senderColor }}
            >
              {senderInitials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Bubble column */}
      <div
        className={cn(
          "relative flex flex-col gap-0.5",
          "max-w-[68%] sm:max-w-[60%] md:max-w-[55%]",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {/* Sender name (first in group, not own) */}
        {showSender && !isOwn && (
          <span className="text-[11px] font-semibold text-[--text-3] px-3 pb-0.5">
            {message.senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "relative px-4 py-2.5 text-sm leading-relaxed break-words",
            isOwn
              ? "bg-brand-gradient text-white selection:bg-white/20"
              : "bg-[--bg-muted] text-[--text-1] selection:bg-brand-100",
          )}
          style={bubbleRadius(isOwn, isFirstInGroup, isLastInGroup)}
        >
          {message.text}
        </div>

        {/* Last-in-group: read receipt + timestamp */}
        {isLastInGroup && (
          <div
            className={cn(
              "flex items-center gap-1 px-1",
              isOwn ? "flex-row-reverse" : "flex-row",
            )}
          >
            {isOwn && (
              isRead
                ? <CheckCheck className="h-3 w-3 text-brand-400" />
                : <Check      className="h-3 w-3 text-[--text-4]" />
            )}
            <span className="text-[11px] text-[--text-4]">
              {formatMsgTimestamp(createdAt)}
            </span>
          </div>
        )}

        {/* Mid-group hover side-timestamp */}
        {!isLastInGroup && (
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-[10px] text-[--text-4]",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
              "pointer-events-none whitespace-nowrap select-none",
              isOwn ? "right-full mr-2" : "left-full ml-2",
            )}
          >
            {formatMsgTimestamp(createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
