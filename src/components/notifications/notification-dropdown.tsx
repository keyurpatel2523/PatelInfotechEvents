"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications";
import { markAllNotificationsRead } from "@/lib/notifications/client";
import { NotificationItem } from "./notification-item";

interface NotificationDropdownProps {
  currentUserId: string;
}

export function NotificationDropdown({ currentUserId }: NotificationDropdownProps) {
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount   = useNotificationsStore((s) => s.unreadCount);
  const markRead      = useNotificationsStore((s) => s.markRead);
  const markAllRead   = useNotificationsStore((s) => s.markAllRead);

  /* Show up to 4 unread + enough read to reach 8 total */
  const unread    = notifications.filter((n) => !n.read).slice(0, 4);
  const read      = notifications.filter((n) =>  n.read).slice(0, Math.max(0, 8 - unread.length));
  const hasGroups = unread.length > 0 && read.length > 0;
  const isEmpty   = unread.length === 0 && read.length === 0;

  const handleMarkAllRead = async () => {
    markAllRead();
    await markAllNotificationsRead(currentUserId);
  };

  return (
    <div
      className={cn(
        "w-[390px] overflow-hidden",
        "bg-[--bg] border border-[--border] rounded-2xl",
        "shadow-[var(--shadow-xl)]",
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold text-[--text-1] tracking-tight">
            Notifications
          </h3>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className={cn(
                  "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full",
                  "bg-brand-gradient text-white text-[10px] font-bold px-1.5",
                )}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.18 }}
              onClick={handleMarkAllRead}
              className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Mark all read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── List ── */}
      <div className="max-h-[440px] overflow-y-auto no-scrollbar">
        {isEmpty ? (
          <EmptyDropdown />
        ) : (
          <>
            {/* Unread section */}
            <AnimatePresence>
              {unread.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {hasGroups && <SectionLabel label="New" />}
                  <div className="divide-y divide-[--border-subtle]">
                    <AnimatePresence mode="popLayout">
                      {unread.map((n, i) => (
                        <NotificationItem
                          key={n.id}
                          notification={n}
                          onRead={markRead}
                          compact
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Read section */}
            {read.length > 0 && (
              <div className={cn(hasGroups && "border-t border-[--border-subtle]")}>
                {hasGroups && <SectionLabel label="Earlier" />}
                <div className="divide-y divide-[--border-subtle]">
                  {read.map((n, i) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={markRead}
                      compact
                      index={unread.length + i}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[--border] px-5 py-3">
        <Link
          href="/notifications"
          className="block w-full text-center text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-3 pb-1.5"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[--text-4]">
        {label}
      </span>
    </motion.div>
  );
}

function EmptyDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center py-14 text-center px-6"
    >
      <div className="h-10 w-10 rounded-2xl bg-[--bg-muted] flex items-center justify-center mb-3">
        <span className="text-xl">🎉</span>
      </div>
      <p className="text-sm font-semibold text-[--text-1]">All caught up</p>
      <p className="text-xs text-[--text-4] mt-1 leading-relaxed">
        No new notifications
      </p>
    </motion.div>
  );
}
