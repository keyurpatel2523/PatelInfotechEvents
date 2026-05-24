"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications";
import { useNotificationsListener } from "@/lib/hooks/notifications/use-notifications-listener";
import { NotificationDropdown } from "./notification-dropdown";

interface NotificationBellProps {
  currentUserId: string;
}

export function NotificationBell({ currentUserId }: NotificationBellProps) {
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const [open, setOpen]   = React.useState(false);
  const [ringing, setRinging] = React.useState(false);
  const prevCountRef = React.useRef(unreadCount);

  useNotificationsListener(currentUserId);

  /* Ring the bell when a new notification arrives */
  React.useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setRinging(true);
      const t = setTimeout(() => setRinging(false), 700);
      return () => clearTimeout(t);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-xl",
            "text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1]",
            "transition-all duration-150",
            open && "bg-[--bg-muted] text-[--text-1]",
          )}
        >
          {/* Bell with ring animation */}
          <motion.div
            animate={
              ringing
                ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.65, ease: "easeInOut" }}
            style={{ originX: "50%", originY: "0%" }}
          >
            <Bell className="h-4 w-4" />
          </motion.div>

          {/* Unread badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className={cn(
                  "absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center",
                  "rounded-full bg-brand-gradient px-1 text-[9px] font-bold text-white",
                  "ring-2 ring-[--bg]",
                )}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50",
            "data-[state=open]:animate-in  data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "duration-200",
          )}
        >
          <NotificationDropdown currentUserId={currentUserId} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
