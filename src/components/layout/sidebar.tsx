"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, BarChart3,
  Settings, Ticket, Star, MessageSquare,
  ChevronLeft, ChevronRight, Zap, HelpCircle,
  TrendingUp, MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { section: "Overview", label: "Dashboard",  href: "/dashboard",          icon: LayoutDashboard },
  { label: "Analytics",  href: "/dashboard/analytics",  icon: BarChart3, badge: "New" },
  { label: "Revenue",    href: "/dashboard/revenue",    icon: TrendingUp },

  { section: "Manage",   label: "Events",      href: "/dashboard/events",    icon: Calendar, badge: 12 },
  { label: "Tickets",    href: "/dashboard/tickets",    icon: Ticket, badge: 3 },
  { label: "Attendees",  href: "/dashboard/attendees",  icon: Users },
  { label: "Venues",     href: "/dashboard/venues",     icon: MapPin },

  { section: "Community",label: "Reviews",     href: "/dashboard/reviews",   icon: Star },
  { label: "Messages",   href: "/dashboard/messages",   icon: MessageSquare, badge: 5 },

  { section: "Account",  label: "Settings",    href: "/dashboard/settings",  icon: Settings },
  { label: "Support",    href: "/dashboard/support",    icon: HelpCircle },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "relative flex flex-col h-full overflow-hidden",
          "bg-[--bg-subtle] border-r border-[--border]",
          "shrink-0",
          className
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-[--border] shrink-0",
          collapsed ? "justify-center px-0" : "px-4 gap-2"
        )}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-[var(--shadow-glow)]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-sm tracking-tight text-[--text-1] whitespace-nowrap overflow-hidden"
            >
              Event<span className="gradient-text">Sphere</span>
            </motion.span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <React.Fragment key={item.href}>
                {item.section && !collapsed && (
                  <p className={cn(
                    "px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[--text-4]",
                    i === 0 && "pt-1"
                  )}>
                    {item.section}
                  </p>
                )}
                {item.section && collapsed && i > 0 && (
                  <div className="my-2 mx-2 h-px bg-[--border]" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2",
                        "text-sm font-medium transition-all duration-150",
                        "group relative",
                        isActive
                          ? "bg-brand-gradient text-white shadow-[var(--shadow-sm)]"
                          : "text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1]",
                        collapsed && "justify-center px-0 w-10 mx-auto"
                      )}
                    >
                      <Icon className={cn(
                        "shrink-0 transition-transform duration-150",
                        collapsed ? "h-5 w-5" : "h-4 w-4",
                        isActive ? "text-white" : "text-[--text-3] group-hover:text-[--text-1]"
                      )} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge !== undefined && (
                            <Badge
                              variant={isActive ? "outline" : "secondary"}
                              size="sm"
                              className={isActive ? "border-white/30 text-white bg-white/10" : ""}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.label}
                      {item.badge !== undefined && ` (${item.badge})`}
                    </TooltipContent>
                  )}
                </Tooltip>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="shrink-0 p-3 border-t border-[--border]">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "flex w-full items-center justify-center rounded-xl p-2",
              "text-[--text-3] hover:bg-[--bg-muted] hover:text-[--text-1]",
              "transition-colors duration-150"
            )}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft className="h-4 w-4" />
            }
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
