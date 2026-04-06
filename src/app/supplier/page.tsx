"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp, Calendar, Clock, Star,
  ArrowRight, Plus, CheckCircle2,
} from "lucide-react";
import { SupplierHeader }   from "@/components/supplier/supplier-header";
import { StatusBadge }      from "@/components/supplier/status-badge";
import { formatCurrency }   from "@/lib/constants";
import { useBookingsStore } from "@/store/bookings";
import {
  SUPPLIER_SERVICES,
  MONTHLY_EARNINGS,
} from "@/lib/mock-supplier";

/* ─── Mini bar chart ─────────────────────────────────────────── */
function EarningsSparkbar() {
  const max = Math.max(...MONTHLY_EARNINGS.map((m) => m.revenue));
  return (
    <div className="flex items-end gap-1 h-12">
      {MONTHLY_EARNINGS.map((m, i) => {
        const pct = (m.revenue / max) * 100;
        const isLast = i === MONTHLY_EARNINGS.length - 1;
        return (
          <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: "easeOut" }}
              className={`w-full rounded-sm ${isLast ? "bg-[#6366f1]" : "bg-[--bg-muted]"}`}
              style={{ minHeight: 2 }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, index,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconBg: string; iconColor: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: EASE }}
      className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)] flex items-start gap-4"
    >
      <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[--text-3] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[--text-1] tabular-nums leading-none">{value}</p>
        <p className="text-xs text-[--text-4] mt-1.5">{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─── Quick action ───────────────────────────────────────────── */
function QuickAction({ href, icon: Icon, label, sub, iconBg, iconColor }: {
  href: string; icon: React.ElementType; label: string; sub: string; iconBg: string; iconColor: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-[--border] bg-[--bg] p-4 hover:border-[--text-3] hover:shadow-[var(--shadow-md)] transition-all duration-150"
    >
      <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[--text-1]">{label}</p>
        <p className="text-xs text-[--text-3]">{sub}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-[--text-4] group-hover:text-[--text-2] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SupplierOverviewPage() {
  /* Live bookings from the shared Zustand store (populated by Firestore listener) */
  const bookings = useBookingsStore((s) => s.bookings);

  const currentMonth    = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1];
  const prevMonth       = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2];
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const avgRating = (
    SUPPLIER_SERVICES.reduce((s, sv) => s + sv.rating * sv.reviewCount, 0) /
    Math.max(1, SUPPLIER_SERVICES.reduce((s, sv) => s + sv.reviewCount, 0))
  ).toFixed(1);

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader
        action={
          <Link
            href="/supplier/services"
            className="flex items-center gap-1.5 h-8 rounded-xl px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" /> Add Service
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-8 max-w-6xl">

        {/* ── Greeting ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <h1 className="text-2xl font-bold text-[--text-1]">Good morning, James 👋</h1>
          <p className="text-sm text-[--text-3] mt-1">
            Here&apos;s your supplier overview for {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}.
          </p>
        </motion.div>

        {/* ── Stats ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            index={0}
            label="Monthly Revenue"
            value={formatCurrency(currentMonth.revenue)}
            sub={`+${Math.round(((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100)}% vs last month`}
            icon={TrendingUp}
            iconBg="bg-[#eef2ff] dark:bg-[#1e1b4b]"
            iconColor="text-[#6366f1]"
          />
          <StatCard
            index={1}
            label="Total Bookings"
            value={String(bookings.length)}
            sub={`${pendingBookings} pending action`}
            icon={Calendar}
            iconBg="bg-[#f5f3ff] dark:bg-[#2e1065]"
            iconColor="text-violet-500"
          />
          <StatCard
            index={2}
            label="Pending Requests"
            value={String(pendingBookings)}
            sub="Awaiting your response"
            icon={Clock}
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-500"
          />
          <StatCard
            index={3}
            label="Avg. Rating"
            value={`${avgRating} ★`}
            sub={`Based on ${SUPPLIER_SERVICES.reduce((s, sv) => s + sv.reviewCount, 0)} reviews`}
            icon={Star}
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-500"
          />
        </div>

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid gap-6 xl:grid-cols-3">

          {/* Recent bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="xl:col-span-2 rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
              <div>
                <h2 className="text-sm font-bold text-[--text-1]">Recent Bookings</h2>
                <p className="text-xs text-[--text-3] mt-0.5">{bookings.length} total</p>
              </div>
              <Link
                href="/supplier/bookings"
                className="text-xs text-[#6366f1] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-[--border-subtle]">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-[--bg-subtle] transition-colors">
                  <div
                    className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: b.customerColor }}
                  >
                    {b.customerInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[--text-1] truncate">{b.customer}</p>
                    <p className="text-xs text-[--text-4] truncate mt-0.5">{b.service}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-sm font-bold tabular-nums text-[--text-1]">
                      {formatCurrency(b.amount)}
                    </p>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Earnings sparkbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[--text-1]">Earnings</h2>
                  <p className="text-xs text-[--text-3] mt-0.5">Last 7 months</p>
                </div>
                <Link href="/supplier/earnings" className="text-xs text-[#6366f1] hover:underline">
                  Details
                </Link>
              </div>
              <EarningsSparkbar />
              <div className="flex items-center justify-between mt-2">
                {MONTHLY_EARNINGS.map((m) => (
                  <span key={m.month} className="text-[10px] text-[--text-4] flex-1 text-center">
                    {m.month}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Services summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-sm font-bold text-[--text-1]">Services</h2>
                <Link href="/supplier/services" className="text-xs text-[#6366f1] hover:underline">
                  Manage
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Active",  count: SUPPLIER_SERVICES.filter((s) => s.status === "active").length,  color: "text-green-600" },
                  { label: "Paused",  count: SUPPLIER_SERVICES.filter((s) => s.status === "paused").length,  color: "text-zinc-500" },
                  { label: "Draft",   count: SUPPLIER_SERVICES.filter((s) => s.status === "draft").length,   color: "text-amber-600" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-[--text-3]">{row.label}</span>
                    <span className={`text-sm font-bold tabular-nums ${row.color}`}>{row.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Quick actions ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.38 }}
        >
          <h2 className="text-sm font-semibold text-[--text-2] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickAction
              href="/supplier/services"
              icon={Plus}
              label="Add a New Service"
              sub="List a new service for clients"
              iconBg="bg-[#eef2ff] dark:bg-[#1e1b4b]"
              iconColor="text-[#6366f1]"
            />
            <QuickAction
              href="/supplier/bookings"
              icon={Calendar}
              label="Review Pending Bookings"
              sub={`${pendingBookings} requests need attention`}
              iconBg="bg-amber-50 dark:bg-amber-950"
              iconColor="text-amber-500"
            />
            <QuickAction
              href="/supplier/earnings"
              icon={TrendingUp}
              label="View Earnings Report"
              sub="Track your monthly revenue"
              iconBg="bg-green-50 dark:bg-green-950"
              iconColor="text-green-600"
            />
            <QuickAction
              href="/supplier/profile"
              icon={CheckCircle2}
              label="Complete Your Profile"
              sub="Add logo and description"
              iconBg="bg-[#f5f3ff] dark:bg-[#2e1065]"
              iconColor="text-violet-500"
            />
          </div>
        </motion.div>

      </main>
    </div>
  );
}
