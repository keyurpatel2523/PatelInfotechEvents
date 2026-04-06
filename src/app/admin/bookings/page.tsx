"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, RotateCcw } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import {
  ADMIN_BOOKINGS,
  type AdminBooking,
  type AdminBookingStatus,
  type AdminPaymentStatus,
} from "@/lib/mock-admin";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FilterTab = AdminBookingStatus | "all";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "pending",   label: "Pending"   },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

type SortField = "customer" | "amount" | "date" | "createdAt";
type SortDir   = "asc" | "desc";

interface OverrideDialog {
  open: boolean;
  bookingId: string;
  currentStatus: AdminBookingStatus;
}

export default function BookingsPage() {
  const { toast } = useAdminStore();
  const [bookings,   setBookings]   = React.useState<AdminBooking[]>(ADMIN_BOOKINGS);
  const [tab,        setTab]        = React.useState<FilterTab>("all");
  const [search,     setSearch]     = React.useState("");
  const [sortField,  setSortField]  = React.useState<SortField | null>("createdAt");
  const [sortDir,    setSortDir]    = React.useState<SortDir>("desc");
  const [override,   setOverride]   = React.useState<OverrideDialog | null>(null);
  const [overrideStatus, setOverrideStatus] = React.useState<AdminBookingStatus>("confirmed");
  const [detailId,   setDetailId]   = React.useState<string | null>(null);

  function handleSort(f: SortField) {
    if (sortField === f) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  }

  function handleOverride(id: string, next: AdminBookingStatus) {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: next } : b));
    setOverride(null);
    toast("Booking status overridden", "warning");
  }

  const filtered = React.useMemo(() => {
    let list = tab === "all" ? bookings : bookings.filter((b) => b.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.customer.toLowerCase().includes(q)     ||
        b.supplierName.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)      ||
        b.id.toLowerCase().includes(q),
      );
    }
    if (sortField) {
      list = [...list].sort((a, b) => {
        const av = a[sortField], bv = b[sortField];
        const cmp = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [bookings, tab, search, sortField, sortDir]);

  const SortBtn = ({ field }: { field: SortField }) => {
    const active = sortField === field;
    return (
      <button onClick={() => handleSort(field)} className="ml-0.5 align-middle">
        {active ? (sortDir === "asc"
          ? <ChevronUp className="h-3 w-3 text-indigo-600 inline" />
          : <ChevronDown className="h-3 w-3 text-indigo-600 inline" />)
          : <ChevronsUpDown className="h-3 w-3 text-gray-300 inline" />}
      </button>
    );
  };

  const detail = detailId ? bookings.find((b) => b.id === detailId) : null;

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled" && b.paymentStatus === "paid")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="p-6 space-y-5 max-w-7xl">

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total",     value: String(bookings.length),                                                      color: "text-gray-800" },
          { label: "Pending",   value: String(bookings.filter(b=>b.status==="pending").length),                      color: "text-amber-600" },
          { label: "Completed", value: String(bookings.filter(b=>b.status==="completed").length),                    color: "text-green-600" },
          { label: "Revenue",   value: formatCurrency(totalRevenue),                                                 color: "text-indigo-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{s.label}</p>
            <p className={`text-xl font-bold tabular-nums mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
          />
        </div>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} bookings</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => {
          const count = t.id === "all" ? bookings.length : bookings.filter((b) => b.status === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-800",
              )}
            >
              {t.label}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                tab === t.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500",
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Customer <SortBtn field="customer" />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Supplier</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Service</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Event Date <SortBtn field="date" />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Amount <SortBtn field="amount" />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Payment</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-sm text-gray-400">
                    No bookings match your filters.
                  </td>
                </tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-[11px] font-mono text-gray-400 whitespace-nowrap">{b.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: b.customerColor }}
                      >
                        {b.customerInitials}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-800">{b.customer}</p>
                        <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{b.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 max-w-[130px] truncate">{b.supplierName}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 max-w-[150px] truncate">{b.service}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 whitespace-nowrap">
                    {format(parseISO(b.date), "d MMM yyyy")}
                    <span className="text-[11px] text-gray-400 block">{b.timeSlot}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-800 tabular-nums whitespace-nowrap">
                    {formatCurrency(b.amount)}
                  </td>
                  <td className="px-4 py-3.5"><AdminStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3.5"><AdminStatusBadge status={b.paymentStatus} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setOverrideStatus(b.status === "pending" ? "confirmed" : "cancelled");
                          setOverride({ open: true, bookingId: b.id, currentStatus: b.status });
                        }}
                        className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" /> Override
                      </button>
                      <button
                        onClick={() => setDetailId(b.id)}
                        className="rounded-md border border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail panel */}
      {detail && (
        <div className="fixed inset-0 z-40 flex" onClick={() => setDetailId(null)}>
          <div className="flex-1 bg-black/30" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-gray-400">{detail.id}</p>
                <h2 className="font-semibold text-gray-900">{detail.customer}</h2>
              </div>
              <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="px-5 py-5 space-y-4 text-sm">
              {[
                ["Customer Email", detail.customerEmail],
                ["Supplier",       detail.supplierName],
                ["Service",        detail.service],
                ["Event Date",     format(parseISO(detail.date), "d MMMM yyyy")],
                ["Time Slot",      detail.timeSlot],
                ["Guests",         String(detail.guests)],
                ["Amount",         formatCurrency(detail.amount)],
                ["Booked on",      format(parseISO(detail.createdAt), "d MMMM yyyy")],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800 text-right max-w-[200px]">{v}</span>
                </div>
              ))}
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Status</span>
                <AdminStatusBadge status={detail.status} />
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Payment</span>
                <AdminStatusBadge status={detail.paymentStatus} />
              </div>
              {detail.notes && (
                <div>
                  <p className="text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-800 bg-gray-50 rounded-lg px-3 py-2">{detail.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Override dialog */}
      {override && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-1">Override booking status</h3>
            <p className="text-sm text-gray-500 mb-4">
              Current: <AdminStatusBadge status={override.currentStatus} />
            </p>
            <select
              value={overrideStatus}
              onChange={(e) => setOverrideStatus(e.target.value as AdminBookingStatus)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              {(["pending","confirmed","completed","cancelled"] as AdminBookingStatus[]).map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOverride(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleOverride(override.bookingId, overrideStatus)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
