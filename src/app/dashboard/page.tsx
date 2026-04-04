"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion } from "framer-motion";
import {
  DollarSign, Calendar, Users, Star,
  TrendingUp, Ticket, ArrowRight, Plus,
  BarChart3, Zap,
} from "lucide-react";
import { AppLayout } from "@/components/dashboard/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { EventsTable } from "@/components/dashboard/events-table";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboardStore } from "@/store/dashboard";
import { CURRENCY_SYMBOL } from "@/lib/constants";

/* ─── Quick-action cards ─────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: Plus,     label: "Create Event",    sub: "Launch a new event",      color: "text-[#6366f1]", bg: "bg-[#eef2ff]" },
  { icon: Ticket,   label: "Manage Tickets",  sub: "View ticket sales",       color: "text-violet-500", bg: "bg-[#f5f3ff]" },
  { icon: BarChart3,label: "View Analytics",  sub: "Revenue & growth",        color: "text-[#22c55e]", bg: "bg-[#f0fdf4]" },
  { icon: Zap,      label: "Quick Broadcast", sub: "Send notification",       color: "text-amber-500",  bg: "bg-[#fefce8]" },
];

/* ─── Recent bookings ────────────────────────────────────── */
const RECENT_BOOKINGS = [
  { name: "James Hartley",  event: "London Tech Summit",   tickets: 2, amount: 598,   status: "confirmed" as const,  avatar: "#6366f1" },
  { name: "Sophie Clarke",  event: "Brixton Jazz Fest",    tickets: 1, amount: 45,    status: "confirmed" as const,  avatar: "#8b5cf6" },
  { name: "Oliver Nash",    event: "London Tech Summit",   tickets: 4, amount: 1196,  status: "pending" as const,    avatar: "#f59e0b" },
  { name: "Amelia Brooks",  event: "Cotswolds Retreat",    tickets: 2, amount: 1190,  status: "confirmed" as const,  avatar: "#22c55e" },
  { name: "Harry Webb",     event: "Founders Summit",      tickets: 1, amount: 149,   status: "refunded" as const,   avatar: "#ef4444" },
];

const STATUS_STYLES = {
  confirmed: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  pending:   "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  refunded:  "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
};

/* ─── Top areas ──────────────────────────────────────────── */
const TOP_CITIES = [
  { city: "Shoreditch",    events: 38, pct: 85 },
  { city: "Canary Wharf",  events: 31, pct: 70 },
  { city: "Mayfair",       events: 24, pct: 54 },
  { city: "Brixton",       events: 16, pct: 36 },
  { city: "Chelsea",       events: 12, pct: 27 },
];

/* ─── Stats ──────────────────────────────────────────────── */
const STATS = [
  {
    title: "Total Revenue",
    value: `${CURRENCY_SYMBOL}84,320`,
    change: 24.5,
    icon: DollarSign,
    iconColor: "text-[#6366f1]",
    iconBg: "bg-[#eef2ff] dark:bg-[#1e1b4b]",
    accentColor: "#6366f1",
    sparkline: [42, 38, 55, 47, 65, 59, 80, 72, 91, 84, 100, 92],
  },
  {
    title: "Active Events",
    value: "12",
    change: 14.3,
    changeLabel: "+3 this month",
    icon: Calendar,
    iconColor: "text-violet-500",
    iconBg: "bg-[#f5f3ff] dark:bg-[#2e1065]",
    accentColor: "#8b5cf6",
    sparkline: [5, 6, 7, 8, 8, 9, 10, 11, 11, 12, 12, 12],
  },
  {
    title: "Total Attendees",
    value: "4,231",
    change: 18.2,
    icon: Users,
    iconColor: "text-[#22c55e]",
    iconBg: "bg-[#f0fdf4] dark:bg-[#052e16]",
    accentColor: "#22c55e",
    sparkline: [200, 310, 280, 390, 340, 420, 460, 500, 540, 580, 620, 634],
  },
  {
    title: "Avg. Rating",
    value: "4.9 ★",
    change: 2.1,
    changeLabel: "+0.2 vs last month",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-[#fefce8] dark:bg-[#422006]",
    accentColor: "#f59e0b",
    sparkline: [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9, 4.9, 4.9, 4.9],
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function DashboardPage() {
  const role = useDashboardStore((s) => s.role);

  return (
    <AppLayout>
      <div className="p-5 sm:p-6 lg:p-8 space-y-7 max-w-[1600px]">

        {/* ── Page title ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" size="sm" className="capitalize">{role}</Badge>
              <span className="text-xs" style={{ color: "var(--text-4)" }}>
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
              Good morning, Keyur 👋
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
              Here&apos;s a snapshot of your event business today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-3.5 w-3.5" /> Export report
            </Button>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> New event
            </Button>
          </div>
        </motion.div>

        {/* ── Stat cards ────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard key={s.title} {...s} index={i} />
          ))}
        </div>

        {/* ── Revenue chart + Category donut ────────────── */}
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <CategoryDonut />
        </div>

        {/* ── Quick actions ─────────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-2)" }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_ACTIONS.map((qa, i) => (
              <motion.button
                key={qa.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className={`
                  flex flex-col items-start gap-3 rounded-2xl border border-[--border]
                  bg-[--bg] p-4 text-left cursor-pointer group
                  hover:shadow-[var(--shadow-md)] hover:border-[--text-4]
                  transition-shadow duration-200
                `}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${qa.bg}`}>
                  <qa.icon className={`h-4.5 w-4.5 ${qa.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{qa.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{qa.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Events table + side panel ──────────────────── */}
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <EventsTable />
          </div>

          <div className="flex flex-col gap-5">
            {/* Recent bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Recent Bookings</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Live updates</p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>

              <div className="divide-y divide-[--border-subtle]">
                {RECENT_BOOKINGS.map((b, i) => (
                  <motion.div
                    key={b.name}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[--bg-subtle] transition-colors"
                  >
                    <Avatar size="sm">
                      <AvatarFallback style={{ background: b.avatar, color: "white" }} className="text-xs font-bold">
                        {b.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-1)" }}>{b.name}</p>
                      <p className="text-[11px] truncate" style={{ color: "var(--text-3)" }}>
                        {b.tickets}× {b.event}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold tabular-nums" style={{ color: "var(--text-1)" }}>
                        {CURRENCY_SYMBOL}{b.amount.toLocaleString()}
                      </p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-[--border]">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View all bookings <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>

            {/* Top cities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Top London Areas</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Events by borough</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {TOP_CITIES.map((c, i) => (
                  <div key={c.city}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: "var(--text-1)" }}>{i + 1}.</span>
                        <span style={{ color: "var(--text-2)" }}>{c.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium tabular-nums" style={{ color: "var(--text-2)" }}>{c.events} events</span>
                        <span style={{ color: "var(--text-4)" }}>{c.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct}%` }}
                        transition={{ delay: 0.55 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full bg-brand-gradient"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Activity feed ─────────────────────────────── */}
        <ActivityFeed />

      </div>
    </AppLayout>
  );
}
