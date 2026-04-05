"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowDownToLine } from "lucide-react";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { formatCurrency } from "@/lib/constants";
import { MONTHLY_EARNINGS } from "@/lib/mock-supplier";

/* ─── Bar chart ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function EarningsBarChart() {
  const max  = Math.max(...MONTHLY_EARNINGS.map((m) => m.revenue));
  const [tooltip, setTooltip] = React.useState<number | null>(null);

  return (
    <div className="relative">
      <div className="flex items-end gap-3 h-48 px-2">
        {MONTHLY_EARNINGS.map((m, i) => {
          const pct     = (m.revenue / max) * 100;
          const isLast  = i === MONTHLY_EARNINGS.length - 1;
          const isHover = tooltip === i;

          return (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Tooltip */}
              {isHover && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 rounded-lg border border-[--border] bg-[--bg] px-2.5 py-1.5 shadow-[var(--shadow-lg)] text-xs whitespace-nowrap pointer-events-none"
                >
                  <p className="font-bold text-[--text-1]">{formatCurrency(m.revenue)}</p>
                  <p className="text-[--text-3]">{m.bookings} bookings</p>
                </motion.div>
              )}

              {/* Bar */}
              <div className="relative w-full flex flex-col justify-end" style={{ height: "100%" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: EASE }}
                  className={`w-full rounded-lg transition-all ${
                    isLast || isHover
                      ? "bg-gradient-to-t from-[#6366f1] to-[#8b5cf6]"
                      : "bg-[--bg-muted] group-hover:bg-[--border]"
                  }`}
                />
              </div>

              {/* Label */}
              <span className={`text-[11px] font-medium transition-colors ${
                isLast ? "text-[#6366f1] font-bold" : "text-[--text-4]"
              }`}>
                {m.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function EarningsPage() {
  const currentMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1];
  const prevMonth    = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 2];
  const totalRevenue = MONTHLY_EARNINGS.reduce((s, m) => s + m.revenue, 0);
  const totalPayout  = MONTHLY_EARNINGS.reduce((s, m) => s + m.payout, 0);
  const totalBookings= MONTHLY_EARNINGS.reduce((s, m) => s + m.bookings, 0);
  const avgMonthly   = Math.round(totalRevenue / MONTHLY_EARNINGS.length);
  const growth = ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1);

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader
        action={
          <button className="flex items-center gap-1.5 h-8 rounded-xl px-3 text-xs font-semibold border border-[--border] text-[--text-2] hover:border-[--text-3] hover:text-[--text-1] transition-all bg-[--bg]">
            <ArrowDownToLine className="h-3.5 w-3.5" /> Export
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-7 max-w-4xl">

        {/* ── Heading ──────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[--text-1]">Earnings</h1>
            <p className="text-sm text-[--text-3] mt-0.5">Last 7 months · Mayfair Catering Co.</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 px-3 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">+{growth}% this month</span>
          </div>
        </div>

        {/* ── Summary cards ────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "This Month",    value: formatCurrency(currentMonth.revenue), sub: `${currentMonth.bookings} bookings`,    color: "text-[#6366f1]" },
            { label: "Total Revenue", value: formatCurrency(totalRevenue),          sub: `${totalBookings} total bookings`,       color: "text-[--text-1]" },
            { label: "Total Payout",  value: formatCurrency(totalPayout),           sub: "After 12% platform fee",               color: "text-green-600" },
            { label: "Monthly Avg",   value: formatCurrency(avgMonthly),            sub: "Over last 7 months",                   color: "text-[--text-1]" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: EASE }}
              className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)]"
            >
              <p className="text-xs font-medium text-[--text-3] mb-1">{card.label}</p>
              <p className={`text-xl font-bold tabular-nums ${card.color}`}>{card.value}</p>
              <p className="text-xs text-[--text-4] mt-1">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Bar chart ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-2xl border border-[--border] bg-[--bg] p-6 shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[--text-1]">Monthly Revenue</h2>
              <p className="text-xs text-[--text-3] mt-0.5">Gross revenue before platform fee</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" />
                <span className="text-[--text-3]">Current month</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-[--bg-muted]" />
                <span className="text-[--text-3]">Previous months</span>
              </div>
            </div>
          </div>
          <EarningsBarChart />
        </motion.div>

        {/* ── Monthly breakdown table ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[--border]">
            <h2 className="text-sm font-bold text-[--text-1]">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--border] bg-[--bg-subtle]">
                  {["Month", "Bookings", "Gross Revenue", "Platform Fee (12%)", "Net Payout"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[--text-3]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[--border-subtle]">
                {[...MONTHLY_EARNINGS].reverse().map((m, i) => {
                  const fee = m.revenue - m.payout;
                  const isLatest = i === 0;
                  return (
                    <tr key={m.month} className={`hover:bg-[--bg-subtle] transition-colors ${isLatest ? "font-semibold" : ""}`}>
                      <td className="px-5 py-3">
                        <span className={`text-sm ${isLatest ? "text-[#6366f1] font-bold" : "text-[--text-1]"}`}>
                          {m.month} {isLatest && <span className="text-[10px] ml-1 opacity-70">(current)</span>}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[--text-2] tabular-nums">{m.bookings}</td>
                      <td className="px-5 py-3 text-[--text-1] tabular-nums font-medium">{formatCurrency(m.revenue)}</td>
                      <td className="px-5 py-3 text-red-500 tabular-nums">−{formatCurrency(fee)}</td>
                      <td className="px-5 py-3 text-green-600 tabular-nums font-bold">{formatCurrency(m.payout)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[--border] bg-[--bg-subtle]">
                  <td className="px-5 py-3 text-xs font-bold text-[--text-2] uppercase tracking-wide">Total</td>
                  <td className="px-5 py-3 text-sm font-bold text-[--text-1] tabular-nums">{totalBookings}</td>
                  <td className="px-5 py-3 text-sm font-bold text-[--text-1] tabular-nums">{formatCurrency(totalRevenue)}</td>
                  <td className="px-5 py-3 text-sm font-bold text-red-500 tabular-nums">−{formatCurrency(totalRevenue - totalPayout)}</td>
                  <td className="px-5 py-3 text-sm font-bold text-green-600 tabular-nums">{formatCurrency(totalPayout)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* ── Payout info ──────────────────────────────────── */}
        <div className="rounded-2xl border border-[--border] bg-[--bg-subtle] p-5">
          <h3 className="text-sm font-bold text-[--text-1] mb-3">Payout Information</h3>
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-xs text-[--text-3] mb-0.5">Next payout</p>
              <p className="font-semibold text-[--text-1]">15 May 2025</p>
            </div>
            <div>
              <p className="text-xs text-[--text-3] mb-0.5">Payout method</p>
              <p className="font-semibold text-[--text-1]">Bank transfer ···4521</p>
            </div>
            <div>
              <p className="text-xs text-[--text-3] mb-0.5">Platform fee</p>
              <p className="font-semibold text-[--text-1]">12% of gross revenue</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
