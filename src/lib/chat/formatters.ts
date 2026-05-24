/** Timestamp formatting utilities for the chat UI. */

import { format, isToday, isYesterday } from "date-fns";

/** Conversation list: "9:30 AM" | "Yesterday" | "14 Jun" */
export function formatConvTimestamp(val: string | null): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  if (isToday(d))     return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "d MMM");
}

/** Message bubble: "9:30 AM" */
export function formatMsgTimestamp(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return format(d, "h:mm a");
}

/** Date divider between message groups: "Today" | "Yesterday" | "Monday, 12 May 2025" */
export function formatDateDivider(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  if (isToday(d))     return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, d MMMM yyyy");
}
