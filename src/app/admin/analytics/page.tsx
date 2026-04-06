"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  MONTHLY_METRICS,
  CATEGORY_METRICS,
  ADMIN_SUPPLIERS,
  ADMIN_BOOKINGS,
} from "@/lib/mock-admin";
import { formatCurrency } from "@/lib/constants";

/* ── Shared chart tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label, currency }: {
  active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string; currency?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-gray-600">
          {p.dataKey === "revenue" ? "Revenue" : p.dataKey === "bookings" ? "Bookings" : p.dataKey}:{" "}
          <span className="font-bold text-gray-900">
            {currency || p.dataKey === "revenue" ? formatCurrency(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ── Section wrapper ──────────────────────────────────────────── */
function ChartCard({ title, sub, children }: {
  title: string; sub: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
      {children}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const totalRevenue  = MONTHLY_METRICS.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = MONTHLY_METRICS.reduce((s, m) => s + m.bookings, 0);
  const avgBookingVal = Math.round(totalRevenue / totalBookings);
  const approvedRate  = Math.round(
    (ADMIN_SUPPLIERS.filter(s => s.status === "approved").length / ADMIN_SUPPLIERS.length) * 100,
  );

  /* Top categories by bookings */
  const topCats = [...CATEGORY_METRICS].sort((a, b) => b.bookings - a.bookings);

  return (
    <div className="p-6 max-w-6xl space-y-6">

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Revenue",     value: formatCurrency(totalRevenue), color: "text-gray-900" },
          { label: "Total Bookings",    value: String(totalBookings),        color: "text-indigo-600" },
          { label: "Avg. Booking",      value: formatCurrency(avgBookingVal),color: "text-gray-900" },
          { label: "Supplier Approval", value: `${approvedRate}%`,           color: "text-green-600" },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-gray-200 bg-white px-5 py-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{k.label}</p>
            <p className={`text-2xl font-bold tabular-nums mt-1.5 ${k.color}`}>{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ChartCard title="Revenue Over Time" sub="Gross platform revenue (last 7 months)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_METRICS} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false} tickLine={false} width={40}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#6366f1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Bookings chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <ChartCard title="Bookings Over Time" sub="Total confirmed + completed bookings per month">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_METRICS} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Top categories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <ChartCard title="Top Categories" sub="Ranked by total booking volume">
          <div className="space-y-3 mt-2">
            {topCats.map((c, i) => {
              const pct = Math.round((c.bookings / topCats[0].bookings) * 100);
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 w-4 shrink-0 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-gray-700">{c.name}</span>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 shrink-0">
                        <span>{c.bookings} bookings</span>
                        <span className="font-semibold text-gray-700">{formatCurrency(c.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </motion.div>

      {/* Supplier breakdown table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <ChartCard title="Category Performance" sub="Revenue and booking breakdown by category">
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Category", "Bookings", "Revenue", "Avg. per Booking", "Share"].map((h) => (
                    <th key={h} className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topCats.map((c) => {
                  const totalRev = topCats.reduce((s, x) => s + x.revenue, 0);
                  const share = Math.round((c.revenue / totalRev) * 100);
                  return (
                    <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 text-[13px] font-medium text-gray-800">{c.name}</td>
                      <td className="py-2.5 text-[13px] text-gray-600 tabular-nums">{c.bookings}</td>
                      <td className="py-2.5 text-[13px] font-semibold text-gray-800 tabular-nums">{formatCurrency(c.revenue)}</td>
                      <td className="py-2.5 text-[13px] text-gray-600 tabular-nums">{formatCurrency(Math.round(c.revenue / c.bookings))}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-400" style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-[11px] text-gray-500 tabular-nums">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </motion.div>

    </div>
  );
}
