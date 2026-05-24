"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, CreditCard, MessageCircle, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notification";

export const TYPE_META = {
  booking: {
    icon:  CalendarCheck,
    bg:    "bg-emerald-100 dark:bg-emerald-950/50",
    color: "text-emerald-600 dark:text-emerald-400",
    ring:  "ring-1 ring-emerald-200 dark:ring-emerald-800/60",
    label: "Booking",
  },
  payment: {
    icon:  CreditCard,
    bg:    "bg-violet-100 dark:bg-violet-950/50",
    color: "text-violet-600 dark:text-violet-400",
    ring:  "ring-1 ring-violet-200 dark:ring-violet-800/60",
    label: "Payment",
  },
  chat: {
    icon:  MessageCircle,
    bg:    "bg-sky-100 dark:bg-sky-950/50",
    color: "text-sky-600 dark:text-sky-400",
    ring:  "ring-1 ring-sky-200 dark:ring-sky-800/60",
    label: "Message",
  },
  review: {
    icon:  Star,
    bg:    "bg-amber-100 dark:bg-amber-950/50",
    color: "text-amber-600 dark:text-amber-400",
    ring:  "ring-1 ring-amber-200 dark:ring-amber-800/60",
    label: "Review",
  },
} as const;

/* Shared variants — use in parent AnimatePresence for stagger */
export const itemVariants = {
  hidden:  { opacity: 0, y: -5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay:    i * 0.04,
      duration: 0.22,
      ease:     [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.16, ease: "easeIn" as const },
  },
};

interface NotificationItemProps {
  notification: AppNotification;
  onRead:       (id: string) => void;
  compact?:     boolean;
  index?:       number;
}

export function NotificationItem({ notification: n, onRead, compact, index = 0 }: NotificationItemProps) {
  const router = useRouter();
  const meta   = TYPE_META[n.type] ?? TYPE_META.booking;
  const Icon   = meta.icon;

  const timeAgo = React.useMemo(
    () => formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
    [n.createdAt],
  );

  const handleClick = () => {
    if (!n.read) onRead(n.id);
    if (n.link)  router.push(n.link);
  };

  return (
    <motion.div
      layout="position"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className="relative"
    >
      {/* Unread left accent strip */}
      {!n.read && (
        <motion.span
          layoutId={`accent-${n.id}`}
          className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-brand-500"
        />
      )}

      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-start gap-3 text-left",
          compact ? "px-4 py-3.5" : "px-5 py-4",
          "transition-colors duration-150 hover:bg-[--bg-muted]",
          !n.read && "bg-brand-50/50 dark:bg-brand-950/10",
        )}
      >
        {/* Type icon */}
        <div
          className={cn(
            "flex-none flex items-center justify-center rounded-xl shrink-0 mt-0.5",
            compact ? "h-8 w-8" : "h-9 w-9",
            meta.bg,
            !n.read && meta.ring,
          )}
        >
          <Icon className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4", meta.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-[13px] leading-snug",
                n.read ? "font-normal text-[--text-2]" : "font-semibold text-[--text-1]",
              )}
            >
              {n.title}
            </p>
            <span
              className={cn(
                "text-[11px] whitespace-nowrap shrink-0 mt-0.5",
                n.read ? "text-[--text-4]" : "text-brand-500 font-medium",
              )}
            >
              {timeAgo}
            </span>
          </div>
          <p className="text-xs text-[--text-3] mt-0.5 leading-relaxed line-clamp-2">
            {n.message}
          </p>
        </div>
      </button>
    </motion.div>
  );
}
