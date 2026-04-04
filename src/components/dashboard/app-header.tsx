"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Search, Bell, ChevronDown, Settings, LogOut,
  User, Keyboard, Moon, Sun, CreditCard, HelpCircle,
  Check, Dot, ShieldCheck, Zap,
} from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDashboardStore, type UserRole } from "@/store/dashboard";
import { format } from "date-fns";

/* ─── Mock notifications ─────────────────────────────────── */
const NOTIFS = [
  {
    id: "n1",
    title: "New booking confirmed",
    body: "Arjun Mehta booked 2 tickets for India Tech Summit",
    time: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    type: "booking",
    color: "bg-green-500",
  },
  {
    id: "n2",
    title: "Payout processed",
    body: "₹18,450 has been transferred to your account",
    time: new Date(Date.now() - 28 * 60 * 1000),
    read: false,
    type: "payment",
    color: "bg-[#6366f1]",
  },
  {
    id: "n3",
    title: "New review received",
    body: "Priya Sharma left a 5★ review on Mumbai Jazz Festival",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    type: "review",
    color: "bg-amber-500",
  },
  {
    id: "n4",
    title: "Event capacity at 90%",
    body: "India Tech Summit 2025 is almost sold out",
    time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    type: "alert",
    color: "bg-red-500",
  },
  {
    id: "n5",
    title: "Monthly report ready",
    body: "Your February analytics report is available",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    type: "report",
    color: "bg-zinc-500",
  },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return format(date, "MMM d");
}

/* ─── Notification panel ─────────────────────────────────── */
function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifs, setNotifs] = React.useState(NOTIFS);
  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute right-0 top-full mt-2 z-50 w-[380px]",
              "bg-[--bg] border border-[--border] rounded-2xl shadow-[var(--shadow-xl)]",
              "overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[--border]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[--text-1]">Notifications</h3>
                {unread > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6366f1] px-1.5 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {notifs.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-100",
                    "hover:bg-[--bg-muted]",
                    !n.read && "bg-[--bg-subtle]"
                  )}
                  onClick={() => setNotifs((prev) =>
                    prev.map((x) => x.id === n.id ? { ...x, read: true } : x)
                  )}
                >
                  {/* Dot indicator */}
                  <div className="relative mt-1 shrink-0">
                    <div className={cn("h-2 w-2 rounded-full", n.color)} />
                    {!n.read && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 rounded-full bg-[#6366f1] ring-1 ring-[--bg]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "text-sm leading-snug",
                        n.read ? "text-[--text-2] font-normal" : "text-[--text-1] font-semibold"
                      )}>
                        {n.title}
                      </p>
                      <span className="text-xs text-[--text-4] whitespace-nowrap shrink-0">
                        {timeAgo(n.time)}
                      </span>
                    </div>
                    <p className="text-xs text-[--text-3] mt-0.5 leading-relaxed line-clamp-2">
                      {n.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[--border] px-4 py-2.5">
              <button className="w-full text-center text-xs font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Profile dropdown (Radix) ───────────────────────────── */
const ROLE_META: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
  admin:    { label: "Admin",    color: "text-[#6366f1]", icon: ShieldCheck },
  supplier: { label: "Vendor",   color: "text-violet-500", icon: Zap },
  customer: { label: "Customer", color: "text-green-600",  icon: User },
};

function ProfileDropdown() {
  const role = useDashboardStore((s) => s.role);
  const meta = ROLE_META[role];
  const RoleIcon = meta.icon;

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2.5 rounded-xl pl-1 pr-2.5 py-1",
            "border border-transparent hover:border-[--border] hover:bg-[--bg-muted]",
            "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
          )}
        >
          <div className="relative">
            <Avatar size="sm" shape="circle">
              <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Keyur+Patel&backgroundColor=6366f1" />
              <AvatarFallback>KP</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 ring-2 ring-[--bg]" />
          </div>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-sm font-semibold text-[--text-1]">Keyur Patel</span>
            <span className={cn("text-[10px] font-medium flex items-center gap-0.5 mt-0.5", meta.color)}>
              <RoleIcon className="h-2.5 w-2.5" />
              {meta.label}
            </span>
          </div>
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-[--text-4]" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-64 overflow-hidden",
            "bg-[--bg] border border-[--border] rounded-2xl",
            "shadow-[var(--shadow-xl)] p-1.5",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "duration-150"
          )}
        >
          {/* User info header */}
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1">
            <Avatar size="md" shape="circle">
              <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Keyur+Patel&backgroundColor=6366f1" />
              <AvatarFallback>KP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-[--text-1]">Keyur Patel</p>
              <p className="text-xs text-[--text-3]">keyur@patelinfotec.com</p>
              <div className={cn("flex items-center gap-1 mt-0.5 text-[10px] font-semibold", meta.color)}>
                <RoleIcon className="h-3 w-3" />
                {meta.label} · Pro Plan
              </div>
            </div>
          </div>

          <DropdownMenuPrimitive.Separator className="-mx-1.5 my-1.5 h-px bg-[--border]" />

          {/* Menu items */}
          {[
            { icon: User,       label: "My Profile",    shortcut: "⌘P" },
            { icon: Settings,   label: "Settings",      shortcut: "⌘," },
            { icon: CreditCard, label: "Billing",       shortcut: null },
            { icon: Keyboard,   label: "Keyboard shortcuts", shortcut: "⌘K" },
          ].map(({ icon: Icon, label, shortcut }) => (
            <DropdownMenuPrimitive.Item
              key={label}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[--text-1]",
                "outline-none cursor-default select-none",
                "transition-colors duration-100 focus:bg-[--bg-muted]"
              )}
            >
              <Icon className="h-4 w-4 text-[--text-3]" />
              <span className="flex-1">{label}</span>
              {shortcut && (
                <span className="text-xs text-[--text-4] tracking-widest">{shortcut}</span>
              )}
            </DropdownMenuPrimitive.Item>
          ))}

          <DropdownMenuPrimitive.Separator className="-mx-1.5 my-1.5 h-px bg-[--border]" />

          {/* Help */}
          <DropdownMenuPrimitive.Item
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[--text-1]",
              "outline-none cursor-default select-none",
              "transition-colors duration-100 focus:bg-[--bg-muted]"
            )}
          >
            <HelpCircle className="h-4 w-4 text-[--text-3]" />
            Support &amp; Docs
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Separator className="-mx-1.5 my-1.5 h-px bg-[--border]" />

          {/* Sign out */}
          <DropdownMenuPrimitive.Item
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm",
              "outline-none cursor-default select-none",
              "text-red-500 transition-colors duration-100",
              "focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-600"
            )}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

/* ─── AppHeader ──────────────────────────────────────────── */
export function AppHeader() {
  const { toggleMobileSidebar, setCommandOpen, notifOpen, setNotifOpen } =
    useDashboardStore();

  const unreadCount = NOTIFS.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6",
        "border-b border-[--border]",
        "bg-[--bg]/80 backdrop-blur-xl",
        "shadow-[0_1px_0_0_var(--border-subtle)]"
      )}
    >
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleMobileSidebar}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl lg:hidden",
          "text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1]",
          "transition-colors duration-150"
        )}
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      {/* ── Search bar ──────────────────────────────────── */}
      <button
        onClick={() => setCommandOpen(true)}
        className={cn(
          "flex h-9 flex-1 max-w-sm items-center gap-2.5 rounded-xl",
          "border border-[--border] bg-[--bg-muted]",
          "px-3 text-sm text-[--text-3]",
          "hover:border-[--text-4] hover:bg-[--bg-subtle]",
          "transition-all duration-150 cursor-text",
          "group"
        )}
      >
        <Search className="h-3.5 w-3.5 text-[--text-4] group-hover:text-[--text-3] transition-colors" />
        <span className="flex-1 text-left text-[--text-4]">Search anything...</span>
        <kbd
          className={cn(
            "hidden sm:inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5",
            "border border-[--border] text-[10px] font-medium text-[--text-4]",
            "bg-[--bg]"
          )}
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* ── Right actions ───────────────────────────────── */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-xl",
              "text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1]",
              "transition-all duration-150",
              notifOpen && "bg-[--bg-muted] text-[--text-1]"
            )}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center",
                  "rounded-full bg-[#6366f1] px-1 text-[9px] font-bold text-white",
                  "ring-2 ring-[--bg]"
                )}
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <NotificationPanel
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
        </div>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-[--border]" />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
