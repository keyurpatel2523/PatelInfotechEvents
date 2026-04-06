"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  TrendingUp, Users, Package, CalendarCheck,
  ArrowRight, Clock, CheckCircle2, UserPlus,
} from "lucide-react";
import { formatCurrency } from "@/lib/constants";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  ADMIN_BOOKINGS,
  ADMIN_SUPPLIERS,
  ADMIN_SERVICES,
  MONTHLY_METRICS,
} from "@/lib/mock-admin";

/* ── Stat card ────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, icon: Icon, iconColor, iconBg, href, index,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconColor: string; iconBg: string;
  href: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link
        href={href}
        className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
      >
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{value}</p>
          <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
      </Link>
    </motion.div>
  );
}

/* ── Section heading ──────────────────────────────────────────── */
function SectionHead({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[13px] font-semibold text-gray-700">{title}</h2>
      <Link href={href} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
        {label} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const totalRevenue  = MONTHLY_METRICS.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = ADMIN_BOOKINGS.length;
  const activeSuppliers = ADMIN_SUPPLIERS.filter((s) => s.status === "approved").length;
  const pendingSuppliers = ADMIN_SUPPLIERS.filter((s) => s.status === "pending").length;
  const activeServices  = ADMIN_SERVICES.filter((s) => s.status === "active").length;

  const recentBookings  = [...ADMIN_BOOKINGS].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  ).slice(0, 6);

  const recentSuppliers = [...ADMIN_SUPPLIERS]
    .filter((s) => s.status === "pending")
    .slice(0, 4);

  return (
    <div className="p-6 max-w-6xl space-y-8">

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          index={0} href="/admin/bookings"
          label="Total Bookings"
          value={String(totalBookings)}
          sub={`${ADMIN_BOOKINGS.filter(b=>b.status==="pending").length} pending review`}
          icon={CalendarCheck} iconBg="bg-indigo-50" iconColor="text-indigo-600"
        />
        <StatCard
          index={1} href="/admin/analytics"
          label="Platform Revenue"
          value={formatCurrency(totalRevenue)}
          sub="Last 7 months"
          icon={TrendingUp} iconBg="bg-green-50" iconColor="text-green-600"
        />
        <StatCard
          index={2} href="/admin/suppliers"
          label="Active Suppliers"
          value={String(activeSuppliers)}
          sub={`${pendingSuppliers} awaiting approval`}
          icon={Users} iconBg="bg-violet-50" iconColor="text-violet-600"
        />
        <StatCard
          index={3} href="/admin/services"
          label="Live Services"
          value={String(activeServices)}
          sub={`${ADMIN_SERVICES.filter(s=>s.status==="disabled").length} disabled`}
          icon={Package} iconBg="bg-amber-50" iconColor="text-amber-600"
        />
      </div>

      {/* ── Main grid ─────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recent bookings */}
        <div className="xl:col-span-2">
          <SectionHead title="Recent Bookings" href="/admin/bookings" label="View all" />
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Customer", "Supplier", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: b.customerColor }}
                        >
                          {b.customerInitials}
                        </div>
                        <span className="text-[13px] font-medium text-gray-800 truncate max-w-[120px]">
                          {b.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-600 max-w-[140px] truncate">
                      {b.supplierName}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-gray-800 tabular-nums">
                      {formatCurrency(b.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-400 whitespace-nowrap">
                      {format(parseISO(b.createdAt), "d MMM")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Pending supplier approvals */}
          <div>
            <SectionHead title="Pending Approvals" href="/admin/suppliers" label="Review all" />
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50">
              {recentSuppliers.length === 0 ? (
                <div className="flex items-center gap-2 px-4 py-5 text-sm text-gray-400">
                  <CheckCircle2 className="h-4 w-4" />
                  All caught up!
                </div>
              ) : (
                recentSuppliers.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: s.avatarColor }}
                    >
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">{s.businessName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{s.categories.join(", ")}</p>
                    </div>
                    <Link
                      href="/admin/suppliers"
                      className="text-[11px] font-semibold text-indigo-600 hover:underline shrink-0"
                    >
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-700 mb-3">Platform Health</h2>
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              {[
                { label: "Approval rate",      value: `${Math.round((activeSuppliers / ADMIN_SUPPLIERS.length) * 100)}%`,  color: "bg-green-500" },
                { label: "Active services",    value: `${Math.round((activeServices / ADMIN_SERVICES.length) * 100)}%`,   color: "bg-indigo-500" },
                { label: "Pending bookings",   value: `${ADMIN_BOOKINGS.filter(b=>b.status==="pending").length}`,          color: "bg-amber-500" },
                { label: "Avg. booking value", value: formatCurrency(Math.round(ADMIN_BOOKINGS.reduce((s,b)=>s+b.amount,0)/ADMIN_BOOKINGS.length)), color: "bg-violet-500" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${row.color}`} />
                    <span className="text-[13px] text-gray-600">{row.label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-800 tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
