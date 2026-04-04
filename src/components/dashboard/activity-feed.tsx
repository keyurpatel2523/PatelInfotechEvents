"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface ActivityItem {
  id: string;
  type: "booking" | "payment" | "review" | "cancellation" | "signup" | "event";
  user: string;
  action: string;
  meta: string;
  time: Date;
  amount?: number;
  avatarColor: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "a1", type: "booking",      user: "James Hartley",   action: "booked",
    meta: "London Tech Summit · 2 tickets",
    time: new Date(Date.now() - 2 * 60_000),    amount: 598,    avatarColor: "#6366f1",
  },
  {
    id: "a2", type: "payment",      user: "System",           action: "payout processed",
    meta: "March earnings transferred",
    time: new Date(Date.now() - 18 * 60_000),   amount: 8420,   avatarColor: "#22c55e",
  },
  {
    id: "a3", type: "review",       user: "Sophie Clarke",   action: "left a 5★ review",
    meta: "Brixton Jazz & Blues Festival",
    time: new Date(Date.now() - 45 * 60_000),   avatarColor: "#f59e0b",
  },
  {
    id: "a4", type: "signup",       user: "Amelia Brooks",   action: "joined EventSphere",
    meta: "Referred by James Hartley",
    time: new Date(Date.now() - 2 * 3600_000),  avatarColor: "#8b5cf6",
  },
  {
    id: "a5", type: "event",        user: "TechConf London", action: "published new event",
    meta: "AI & Machine Learning Summit — Old Street",
    time: new Date(Date.now() - 4 * 3600_000),  avatarColor: "#06b6d4",
  },
  {
    id: "a6", type: "cancellation", user: "Oliver Nash",     action: "cancelled booking",
    meta: "Cotswolds Wellness Retreat · 1 ticket",
    time: new Date(Date.now() - 6 * 3600_000),  amount: -595,   avatarColor: "#ef4444",
  },
  {
    id: "a7", type: "booking",      user: "Harry Webb",      action: "booked",
    meta: "Startup Founders Summit · 1 ticket",
    time: new Date(Date.now() - 8 * 3600_000),  amount: 149,    avatarColor: "#6366f1",
  },
  {
    id: "a8", type: "review",       user: "Charlotte Moore", action: "left a 4★ review",
    meta: "London Street Food Festival",
    time: new Date(Date.now() - 24 * 3600_000), avatarColor: "#f59e0b",
  },
];

const TYPE_BADGE: Record<ActivityItem["type"], { label: string; variant: "success" | "default" | "warning" | "danger" | "secondary" | "violet" }> = {
  booking:      { label: "Booking",      variant: "success" },
  payment:      { label: "Payment",      variant: "default" },
  review:       { label: "Review",       variant: "warning" },
  cancellation: { label: "Cancelled",    variant: "danger" },
  signup:       { label: "New User",     variant: "violet" },
  event:        { label: "Event",        variant: "secondary" },
};

export function ActivityFeed() {
  const [filter, setFilter] = React.useState<ActivityItem["type"] | "all">("all");

  const filtered = filter === "all"
    ? ACTIVITIES
    : ACTIVITIES.filter((a) => a.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Live Activity</h3>
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "booking", "payment", "review"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 capitalize",
                filter === f
                  ? "bg-[--bg-muted] text-[--text-1]"
                  : "text-[--text-4] hover:text-[--text-2]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <ScrollArea className="h-[400px]">
        <div className="p-3 space-y-1">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3 py-3",
                "hover:bg-[--bg-subtle] transition-colors duration-100 cursor-default"
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                <Avatar size="sm">
                  <AvatarFallback
                    style={{ background: item.avatarColor, color: "white" }}
                    className="text-xs font-bold"
                  >
                    {item.user.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm leading-snug" style={{ color: "var(--text-1)" }}>
                    <span className="font-semibold">{item.user}</span>
                    <span style={{ color: "var(--text-3)" }}> {item.action}</span>
                  </p>
                  <span className="text-[10px] whitespace-nowrap shrink-0 mt-0.5" style={{ color: "var(--text-4)" }}>
                    {formatDistanceToNow(item.time, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-3)" }}>{item.meta}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={TYPE_BADGE[item.type].variant} size="sm">
                    {TYPE_BADGE[item.type].label}
                  </Badge>
                  {item.amount !== undefined && (
                    <span className={cn(
                      "text-xs font-semibold tabular-nums",
                      item.amount >= 0 ? "text-green-600" : "text-red-500"
                    )}>
                      {item.amount >= 0 ? "+" : "-"}{CURRENCY_SYMBOL}{Math.abs(item.amount).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-[--border] px-5 py-2.5">
        <button className="w-full text-center text-xs font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors">
          View full activity log
        </button>
      </div>
    </motion.div>
  );
}
