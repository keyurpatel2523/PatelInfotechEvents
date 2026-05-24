"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu, Search, ChevronDown, Settings, LogOut,
  User, Keyboard, CreditCard, HelpCircle,
  ShieldCheck, Zap, Crown,
} from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard";
import { useAuthStore } from "@/store/auth";
import { signOut } from "@/lib/auth/client";
import { clearSessionCookie } from "@/lib/auth/session";
import { NotificationBell } from "@/components/notifications/notification-bell";
import type { UserRole } from "@/types/auth";

/* ─── Notification bell (reads userId from auth store) ───── */
function NotificationBellWrapper() {
  const authUser = useAuthStore((s) => s.user);
  return <NotificationBell currentUserId={authUser?.uid ?? "user-current"} />;
}

/* ─── Profile dropdown (Radix) ───────────────────────────── */
const ROLE_META: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
  admin:       { label: "Admin",       color: "text-[#6366f1]",  icon: ShieldCheck },
  super_admin: { label: "Super Admin", color: "text-rose-500",   icon: Crown       },
  supplier:    { label: "Vendor",      color: "text-violet-500", icon: Zap         },
  customer:    { label: "Customer",    color: "text-green-600",  icon: User        },
};

function ProfileDropdown() {
  const router   = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const role     = (authUser?.role ?? useDashboardStore.getState().role) as UserRole;
  const meta     = ROLE_META[role] ?? ROLE_META.customer;
  const RoleIcon = meta.icon;

  const displayName  = authUser?.displayName  ?? "User";
  const initials     = authUser?.initials      ?? displayName.slice(0, 2).toUpperCase();
  const avatarColor  = authUser?.avatarColor   ?? "#6366f1";
  const email        = authUser?.email         ?? "";

  const handleSignOut = async () => {
    await signOut();
    clearSessionCookie();
    useAuthStore.getState().setUser(null);
    router.push("/login");
  };

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
              <AvatarFallback style={{ background: avatarColor, color: "white" }} className="text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 ring-2 ring-[--bg]" />
          </div>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-sm font-semibold text-[--text-1]">{displayName}</span>
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
              <AvatarFallback style={{ background: avatarColor, color: "white" }} className="text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-[--text-1]">{displayName}</p>
              <p className="text-xs text-[--text-3]">{email}</p>
              <div className={cn("flex items-center gap-1 mt-0.5 text-[10px] font-semibold", meta.color)}>
                <RoleIcon className="h-3 w-3" />
                {meta.label}
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
            onSelect={handleSignOut}
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
  const { toggleMobileSidebar, setCommandOpen } = useDashboardStore();

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
        <NotificationBellWrapper />

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-[--border]" />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
