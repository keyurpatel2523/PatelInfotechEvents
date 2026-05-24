"use client";

import * as React from "react";
import { CheckCheck, Bell } from "lucide-react";
import { isToday, isYesterday, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications";
import { markAllNotificationsRead } from "@/lib/notifications/client";
import { useNotificationsListener } from "@/lib/hooks/notifications/use-notifications-listener";
import { NotificationItem } from "./notification-item";
import type { AppNotification } from "@/types/notification";

type Filter = "all" | "unread";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",    label: "All" },
  { value: "unread", label: "Unread" },
];

function groupByDate(notifications: AppNotification[]): [string, AppNotification[]][] {
  const groups = new Map<string, AppNotification[]>();
  for (const n of notifications) {
    const d   = new Date(n.createdAt);
    const key = isToday(d)
      ? "Today"
      : isYesterday(d)
      ? "Yesterday"
      : format(d, "d MMMM yyyy");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(n);
  }
  return [...groups.entries()];
}

const sectionVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay:    i * 0.06,
      duration: 0.28,
      ease:     [0.22, 1, 0.36, 1] as const,
    },
  }),
};

interface NotificationPageProps {
  currentUserId: string;
}

export function NotificationPage({ currentUserId }: NotificationPageProps) {
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount   = useNotificationsStore((s) => s.unreadCount);
  const markRead      = useNotificationsStore((s) => s.markRead);
  const markAllRead   = useNotificationsStore((s) => s.markAllRead);

  const [filter, setFilter] = React.useState<Filter>("all");

  useNotificationsListener(currentUserId);

  const handleMarkAllRead = async () => {
    markAllRead();
    await markAllNotificationsRead(currentUserId);
  };

  /* ── "All" view: unread section at top, then date-grouped read ── */
  const unreadItems  = notifications.filter((n) => !n.read);
  const readItems    = notifications.filter((n) =>  n.read);
  const readGroups   = groupByDate(readItems);

  /* ── "Unread" view: date-grouped unread only ── */
  const unreadGroups = groupByDate(unreadItems);

  const isEmpty = filter === "unread" ? unreadItems.length === 0 : notifications.length === 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[--text-1]">Notifications</h1>
          <AnimatePresence mode="wait">
            {unreadCount > 0 ? (
              <motion.p
                key="count"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-sm text-[--text-3] mt-0.5"
              >
                {unreadCount} unread
              </motion.p>
            ) : (
              <motion.p
                key="clear"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-sm text-[--text-4] mt-0.5"
              >
                You're all caught up
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleMarkAllRead}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium",
                "text-brand-600 bg-brand-50 dark:bg-brand-950/30 dark:text-brand-400",
                "hover:bg-brand-100 dark:hover:bg-brand-950/50 transition-colors",
              )}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-1 p-1 rounded-xl bg-[--bg-muted] w-fit mb-7">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
              filter === f.value
                ? "text-[--text-1]"
                : "text-[--text-3] hover:text-[--text-2]",
            )}
          >
            {filter === f.value && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-[--bg] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {f.label}
              {f.value === "unread" && unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-brand-gradient text-white px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {isEmpty ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState filter={filter} />
          </motion.div>
        ) : filter === "unread" ? (
          /* Unread tab — date-grouped */
          <motion.div
            key="unread-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {unreadGroups.map(([date, items], sIdx) => (
              <motion.section
                key={date}
                custom={sIdx}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <DateLabel label={date} />
                <div className="rounded-2xl border border-[--border] overflow-hidden bg-[--bg] divide-y divide-[--border-subtle]">
                  <AnimatePresence mode="popLayout">
                    {items.map((n, i) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onRead={markRead}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            ))}
          </motion.div>
        ) : (
          /* All tab — unread pinned at top, then date-grouped read */
          <motion.div
            key="all-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Unread section — floated to top */}
            <AnimatePresence>
              {unreadItems.length > 0 && (
                <motion.section
                  custom={0}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -4 }}
                >
                  <DateLabel label="New" accent />
                  <div className="rounded-2xl border border-brand-200/60 dark:border-brand-800/40 overflow-hidden bg-[--bg] divide-y divide-[--border-subtle]">
                    <AnimatePresence mode="popLayout">
                      {unreadItems.map((n, i) => (
                        <NotificationItem
                          key={n.id}
                          notification={n}
                          onRead={markRead}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Date-grouped read items */}
            {readGroups.map(([date, items], sIdx) => (
              <motion.section
                key={date}
                custom={unreadItems.length > 0 ? sIdx + 1 : sIdx}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <DateLabel label={date} />
                <div className="rounded-2xl border border-[--border] overflow-hidden bg-[--bg] divide-y divide-[--border-subtle]">
                  {items.map((n, i) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={markRead}
                      index={i}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

function DateLabel({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <h2
      className={cn(
        "text-[11px] font-semibold uppercase tracking-widest mb-2 px-1",
        accent ? "text-brand-500" : "text-[--text-4]",
      )}
    >
      {label}
    </h2>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-14 w-14 rounded-2xl bg-[--bg-muted] flex items-center justify-center mb-4">
        <Bell className="h-7 w-7 text-[--text-4]" />
      </div>
      <p className="text-sm font-semibold text-[--text-1]">
        {filter === "unread" ? "No unread notifications" : "No notifications yet"}
      </p>
      <p className="text-xs text-[--text-3] mt-1.5 max-w-[240px] leading-relaxed">
        {filter === "unread"
          ? "You're all caught up. Check back later."
          : "Booking updates, payments, messages and reviews will appear here."}
      </p>
    </div>
  );
}
