"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

const PAGE_LABELS: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/categories": "Category Management",
  "/admin/suppliers":  "Supplier Management",
  "/admin/services":   "Service Management",
  "/admin/bookings":   "Booking Management",
  "/admin/analytics":  "Analytics",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = PAGE_LABELS[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 border-b border-gray-200 bg-white px-6 shrink-0">
      <h1 className="text-[15px] font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 h-8 w-56 rounded-md border border-gray-200 bg-gray-50 px-3 text-xs text-gray-400">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search…</span>
          <kbd className="ml-auto text-[10px] bg-white border border-gray-200 rounded px-1">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="relative h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
