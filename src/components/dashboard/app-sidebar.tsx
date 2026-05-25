"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "class-variance-authority";
import { ChevronLeft, ChevronRight, Zap, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard";
import { useAuthStore } from "@/store/auth";
import { signOut } from "@/lib/auth/client";
import { clearSessionCookie } from "@/lib/auth/session";
import { getNavForRole, type NavItem } from "@/lib/nav-config";
import type { UserRole } from "@/types/auth";

/* ─── CVA ────────────────────────────────────────────────── */
const navItemVariants = cva(
  [
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
    "text-sm font-medium transition-all duration-150 cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
  ],
  {
    variants: {
      active: {
        true:  "text-white",
        false: "text-[--text-2] hover:text-[--text-1] hover:bg-[--bg-muted]",
      },
      collapsed: {
        true:  "justify-center px-0 mx-auto w-10",
        false: "",
      },
    },
    defaultVariants: { active: false, collapsed: false },
  }
);

/* ─── Sidebar width constants ────────────────────────────── */
const EXPANDED_W = 248;
const COLLAPSED_W = 64;

/* ─── Individual nav item ────────────────────────────────── */
interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}

function SidebarNavItem({ item, collapsed, active, onClick }: NavItemProps) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(navItemVariants({ active, collapsed }))}
    >
      {/* Active background pill */}
      {active && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-xl bg-brand-gradient"
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        />
      )}

      {/* Hover shimmer (inactive only) */}
      {!active && (
        <span className="absolute inset-0 rounded-xl bg-[--bg-muted] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      )}

      {/* Icon */}
      <Icon
        className={cn(
          "relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-110",
          collapsed ? "h-5 w-5" : "h-4 w-4",
          active ? "text-white" : "text-[--text-3] group-hover:text-[--text-1]"
        )}
      />

      {/* Label + badge */}
      {!collapsed && (
        <span className="relative z-10 flex flex-1 items-center justify-between min-w-0">
          <span className="truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                "ml-2 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums shrink-0",
                active
                  ? "bg-white/25 text-white"
                  : item.badgeVariant === "danger"
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    : item.badgeVariant === "warning"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      : "bg-[--bg-muted] text-[--text-2]"
              )}
            >
              {typeof item.badge === "number" && item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge !== undefined && (
            <span className="ml-1 rounded-full bg-[#6366f1] px-1.5 py-0.5 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

/* ─── SidebarUserRow ─────────────────────────────────────── */
function SidebarUserRow() {
  const authUser = useAuthStore((s) => s.user);

  const displayName = authUser?.displayName ?? "User";
  const initials    = authUser?.initials    ?? displayName.slice(0, 2).toUpperCase();
  const avatarColor = authUser?.avatarColor ?? "#6366f1";
  const role        = authUser?.role        ?? "customer";

  const ROLE_LABEL: Record<UserRole, string> = {
    customer: "Customer",
    supplier: "Supplier",
    admin:    "Admin",
  };

  const handleSignOut = async () => {
    await signOut();
    clearSessionCookie();
    useAuthStore.getState().setUser(null);
    window.location.href = "/login/admin";
  };

  return (
    <div className="flex items-center gap-2.5 group">
      <Avatar size="sm" shape="circle" className="flex-none">
        <AvatarFallback
          style={{ background: avatarColor, color: "white" }}
          className="text-xs font-bold"
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[--text-1] truncate">{displayName}</p>
        <p className="text-[10px] text-[--text-4] capitalize">{ROLE_LABEL[role as UserRole]}</p>
      </div>
      <button
        onClick={handleSignOut}
        aria-label="Sign out"
        className="flex-none p-1.5 rounded-lg text-[--text-4] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ─── AppSidebar ─────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed: collapsed,
    toggleSidebar,
    sidebarMobileOpen,
    closeMobileSidebar,
  } = useDashboardStore();

  const authUser = useAuthStore((s) => s.user);
  const role     = (authUser?.role ?? useDashboardStore.getState().role) as UserRole;

  const sections = getNavForRole(role);

  return (
    <TooltipProvider delayDuration={0}>
      {/* ── Mobile overlay ──────────────────────────────── */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileSidebar}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col",
          "border-r border-[--border] overflow-hidden",
          // Subtle layered background
          "bg-[--bg-subtle]",
          // Mobile: slide in/out
          "lg:relative lg:translate-x-0",
          sidebarMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform lg:transition-none duration-300"
        )}
        style={{
          boxShadow: "inset -1px 0 0 var(--border), 2px 0 24px -8px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Logo ──────────────────────────────────────── */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-[--border]",
            collapsed ? "justify-center px-0" : "px-4 gap-3"
          )}
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-[var(--shadow-glow)]">
            <Zap className="h-4 w-4 text-white" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 ring-2 ring-[--bg-subtle]" />
          </div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-bold text-sm leading-none text-[--text-1] tracking-tight">
                  Event<span className="gradient-text">Sphere</span>
                </span>
                <span className="text-[10px] text-[--text-4] leading-none mt-0.5 uppercase tracking-widest">
                  {role} portal
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Nav ──────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 scrollbar-thin">
          {sections.map((section, si) => (
            <div key={section.id}>
              {/* Section label */}
              <AnimatePresence mode="wait">
                {!collapsed ? (
                  <motion.p
                    key={`label-${section.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[--text-4]",
                      si === 0 ? "pt-1" : "pt-4"
                    )}
                  >
                    {section.title}
                  </motion.p>
                ) : (
                  si > 0 && (
                    <motion.div
                      key={`divider-${section.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="my-2 mx-2 h-px bg-[--border]"
                    />
                  )
                )}
              </AnimatePresence>

              {/* Items */}
              {section.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <SidebarNavItem
                    key={item.id}
                    item={item}
                    collapsed={collapsed}
                    active={isActive}
                    onClick={closeMobileSidebar}
                  />
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom: user info + sign out + collapse ──── */}
        <div className="shrink-0 border-t border-[--border]">
          {/* User row (expanded only) */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-3 py-3"
              >
                <SidebarUserRow />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex w-full items-center py-3 transition-colors duration-150",
              "text-[--text-3] hover:bg-[--bg-muted] hover:text-[--text-1]",
              collapsed ? "justify-center px-0" : "gap-2 px-4"
            )}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[--border] bg-[--bg]">
              {collapsed
                ? <ChevronRight className="h-3.5 w-3.5" />
                : <ChevronLeft className="h-3.5 w-3.5" />
              }
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  key="collapse-label"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-medium"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
