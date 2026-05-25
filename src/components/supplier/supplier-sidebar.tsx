"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "class-variance-authority";
import {
  LayoutDashboard, Package, Calendar, CalendarDays, TrendingUp,
  Star, User, ChevronLeft, ChevronRight, Zap,
  Settings, HelpCircle, LogOut,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { signOut } from "@/lib/auth/client";
import { clearSessionCookie } from "@/lib/auth/session";
import { useMobileNav } from "@/components/supplier/mobile-nav-context";

/* ─── Nav config ─────────────────────────────────────────────── */
interface NavItem {
  id:     string;
  label:  string;
  href:   string;
  icon:   React.ElementType;
  badge?: number | string;
}

const NAV_MAIN: NavItem[] = [
  { id: "overview",      label: "Overview",      href: "/supplier",                  icon: LayoutDashboard },
  { id: "services",      label: "Services",      href: "/supplier/services",         icon: Package,    badge: 5 },
  { id: "bookings",      label: "Bookings",      href: "/supplier/bookings",         icon: Calendar,   badge: 2 },
  { id: "availability",  label: "Availability",  href: "/supplier/availability",     icon: CalendarDays },
  { id: "earnings",      label: "Earnings",      href: "/supplier/earnings",         icon: TrendingUp },
  { id: "reviews",       label: "Reviews",       href: "/supplier/reviews",          icon: Star,       badge: 2 },
  { id: "profile",       label: "Profile",       href: "/supplier/profile",          icon: User },
];

const NAV_BOTTOM: NavItem[] = [
  { id: "settings",  label: "Settings",   href: "/supplier/settings", icon: Settings },
  { id: "support",   label: "Support",    href: "/supplier/support",  icon: HelpCircle },
];

/* ─── CVA ────────────────────────────────────────────────────── */
const navItemCva = cva(
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
  },
);

/* ─── Single nav item ────────────────────────────────────────── */
function NavItemComp({
  item,
  collapsed,
  active,
}: {
  item:      NavItem;
  collapsed: boolean;
  active:    boolean;
}) {
  const Icon = item.icon;

  const inner = (
    <Link
      href={item.href}
      className={cn(navItemCva({ active, collapsed }))}
    >
      {active && (
        <motion.div
          layoutId="supplier-active-pill"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <span className="relative z-10 shrink-0">
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{   opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 flex-1 whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      <AnimatePresence>
        {!collapsed && item.badge !== undefined && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{   scale: 0, opacity: 0 }}
            className={cn(
              "relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
              active
                ? "bg-white/25 text-white"
                : "bg-[--bg-muted] text-[--text-3]",
            )}
          >
            {item.badge}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge !== undefined && (
            <span className="h-4 min-w-4 flex items-center justify-center rounded-full bg-[#6366f1] px-1 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return inner;
}

/* ─── Sidebar ────────────────────────────────────────────────── */
const EXPANDED = 240;
const COLLAPSED = 64;

export function SupplierSidebar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const setUser    = useAuthStore((s) => s.setUser);
  const { open: mobileOpen, close: closeMobile } = useMobileNav();
  const [collapsed,  setCollapsed]  = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  // Close mobile drawer on route change
  React.useEffect(() => { closeMobile(); }, [pathname]);

  function isActive(item: NavItem) {
    if (item.href === "/supplier") return pathname === "/supplier";
    return pathname.startsWith(item.href);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    clearSessionCookie();
    setUser(null);
    router.push("/login/supplier");
  }

  /* Shared nav content for mobile drawer — always fully expanded */
  const navContent = () => (
    <>
      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 border-b"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-md">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-none" style={{ color: "var(--text-1)" }}>EventSphere</p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-4)" }}>Supplier Portal</p>
        </div>
        <button
          onClick={closeMobile}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          style={{ color: "var(--text-3)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* ── Supplier chip ─────────────────────────────────── */}
      <div
        className="px-3 py-3 border-b"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
        >
          <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[10px] font-bold text-white">
            JH
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-1)" }}>James Hartley</p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-4)" }}>Mayfair Catering Co.</p>
          </div>
        </div>
      </div>

      {/* ── Main nav ──────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5"
        style={{ background: "var(--bg)" }}
      >
        {NAV_MAIN.map((item) => (
          <NavItemComp key={item.id} item={item} collapsed={false} active={isActive(item)} />
        ))}
      </nav>

      {/* ── Bottom nav ────────────────────────────────────── */}
      <div
        className="px-2 py-2 border-t space-y-0.5"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        {NAV_BOTTOM.map((item) => (
          <NavItemComp key={item.id} item={item} collapsed={false} active={isActive(item)} />
        ))}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>{loggingOut ? "Logging out…" : "Log out"}</span>
        </button>
      </div>
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] shadow-2xl lg:hidden overflow-hidden"
              style={{ background: "var(--bg)", borderRight: "1px solid var(--border)" }}
            >
              {navContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ───────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? COLLAPSED : EXPANDED }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col shrink-0 border-r border-[--border] bg-[--bg] overflow-hidden h-screen sticky top-0"
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 py-4 border-b border-[--border]",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-[var(--shadow-md)]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{   opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="min-w-0"
              >
                <p className="text-sm font-bold leading-none text-[--text-1]">EventSphere</p>
                <p className="text-[10px] text-[--text-4] mt-0.5">Supplier Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Supplier chip ─────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{   opacity: 0, height: 0 }}
              className="px-3 py-3 border-b border-[--border]"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-[--border] bg-[--bg-subtle] px-3 py-2">
                <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[10px] font-bold text-white">
                  JH
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[--text-1] truncate">James Hartley</p>
                  <p className="text-[10px] text-[--text-4] truncate">Mayfair Catering Co.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main nav ──────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {NAV_MAIN.map((item) => (
            <NavItemComp
              key={item.id}
              item={item}
              collapsed={collapsed}
              active={isActive(item)}
            />
          ))}
        </nav>

        {/* ── Bottom nav ────────────────────────────────────── */}
        <div className="px-2 py-2 border-t border-[--border] space-y-0.5">
          {NAV_BOTTOM.map((item) => (
            <NavItemComp
              key={item.id}
              item={item}
              collapsed={collapsed}
              active={isActive(item)}
            />
          ))}

          {/* Logout */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="group relative flex w-10 mx-auto items-center justify-center rounded-xl px-0 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span>{loggingOut ? "Logging out…" : "Log out"}</span>
            </button>
          )}
        </div>

        {/* ── Collapse toggle ───────────────────────────────── */}
        <div className="px-2 pb-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium",
              "text-[--text-3] hover:text-[--text-1] hover:bg-[--bg-muted] transition-colors",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
