"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Users,
  Package,
  CalendarCheck,
  BarChart3,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",           icon: LayoutDashboard, label: "Dashboard"   },
  { href: "/admin/categories",icon: Tag,             label: "Categories"  },
  { href: "/admin/suppliers", icon: Users,           label: "Suppliers"   },
  { href: "/admin/services",  icon: Package,         label: "Services"    },
  { href: "/admin/bookings",  icon: CalendarCheck,   label: "Bookings"    },
  { href: "/admin/analytics", icon: BarChart3,       label: "Analytics"   },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col bg-zinc-950 border-r border-zinc-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-zinc-800">
        <div className="h-7 w-7 rounded-md bg-indigo-500 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-none">EventSphere</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Admin Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Platform
        </p>
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center text-[11px] font-bold text-zinc-200 shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-zinc-200 truncate">Super Admin</p>
            <p className="text-[10px] text-zinc-500 truncate">admin@eventsphere.co.uk</p>
          </div>
          <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
