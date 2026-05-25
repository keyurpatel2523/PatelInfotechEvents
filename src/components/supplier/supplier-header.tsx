"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileNav } from "@/components/supplier/mobile-nav-context";

/* ─── Breadcrumb from pathname ───────────────────────────────── */
function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/supplier\/?/, "").split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [
    { label: "Supplier", href: "/supplier" },
  ];
  segments.forEach((seg, i) => {
    crumbs.push({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href:  "/supplier/" + segments.slice(0, i + 1).join("/"),
    });
  });
  return crumbs;
}

/* ─── Page title map ─────────────────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  "/supplier":              "Overview",
  "/supplier/services":     "My Services",
  "/supplier/bookings":     "Bookings",
  "/supplier/availability": "Availability",
  "/supplier/earnings":     "Earnings",
  "/supplier/reviews":      "Reviews",
  "/supplier/profile":      "Profile",
  "/supplier/settings":     "Settings",
  "/supplier/support":      "Support",
};

interface SupplierHeaderProps {
  /** Inject a CTA button from the page */
  action?: React.ReactNode;
}

export function SupplierHeader({ action }: SupplierHeaderProps) {
  const pathname   = usePathname();
  const breadcrumb = useBreadcrumb();
  const title      = PAGE_TITLES[pathname] ?? "Dashboard";
  const { toggle } = useMobileNav();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[--border] bg-[--bg]/80 backdrop-blur-lg px-4 sm:px-6 h-14 shrink-0">

      {/* ── Left: hamburger (mobile) + breadcrumb/title ───── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[--border] bg-[--bg] text-[--text-3] hover:text-[--text-1] hover:border-[--text-4] transition-all shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>
        {/* Breadcrumb (hidden on mobile) */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[--text-4] mb-0.5">
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
              <Link
                href={crumb.href}
                className={cn(
                  "hover:text-[--text-2] transition-colors",
                  i === breadcrumb.length - 1 && "text-[--text-1] font-medium",
                )}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
        <h1 className="sm:hidden text-sm font-bold text-[--text-1]">{title}</h1>
      </div>

      {/* ── Right: search + notifications + action ────────── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 h-8 rounded-lg border border-[--border] bg-[--bg-muted] px-3 text-xs text-[--text-4] cursor-pointer hover:border-[--text-4] transition-colors w-44">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search…</span>
          <kbd className="ml-auto text-[10px] bg-[--bg] border border-[--border] rounded px-1 py-0.5">⌘K</kbd>
        </div>

        {/* Notification bell */}
        <button className="relative h-8 w-8 flex items-center justify-center rounded-lg border border-[--border] bg-[--bg] text-[--text-3] hover:text-[--text-1] hover:border-[--text-4] transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-[--bg]" />
        </button>

        {/* Page-level CTA */}
        {action}
      </div>
    </header>
  );
}
