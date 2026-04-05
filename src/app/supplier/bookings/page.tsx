"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Check, X, CheckCircle2, Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { StatusBadge }    from "@/components/supplier/status-badge";
import { DataTable }      from "@/components/supplier/data-table";
import { useToastStore }  from "@/store/toast";
import { formatCurrency } from "@/lib/constants";
import {
  SUPPLIER_BOOKINGS,
  type SupplierBooking,
  type BookingStatus,
} from "@/lib/mock-supplier";
import { cn } from "@/lib/utils";

/* ─── Tabs ───────────────────────────────────────────────────── */
const TABS: { id: BookingStatus | "all"; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "pending",   label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/* ─── Columns ────────────────────────────────────────────────── */
function buildColumns(
  onAccept:   (id: string) => void,
  onReject:   (id: string) => void,
  onComplete: (id: string) => void,
): ColumnDef<SupplierBooking>[] {
  return [
    {
      id:     "customer",
      header: "Customer",
      accessorKey: "customer",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: b.customerColor }}
            >
              {b.customerInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[--text-1]">{b.customer}</p>
              <p className="text-xs text-[--text-3] font-mono">{b.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      id:     "service",
      header: "Service",
      accessorKey: "service",
      cell: ({ row }) => (
        <p className="text-sm text-[--text-2] max-w-[180px] truncate">{row.original.service}</p>
      ),
    },
    {
      id:     "date",
      header: "Event Date",
      accessorKey: "date",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div>
            <p className="text-sm text-[--text-1] font-medium">
              {format(parseISO(b.date), "d MMM yyyy")}
            </p>
            <p className="text-xs text-[--text-4]">{b.timeSlot} · {b.guests} guests</p>
          </div>
        );
      },
    },
    {
      id:     "amount",
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-[--text-1] tabular-nums">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      id:     "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id:     "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const b = row.original;
        if (b.status === "pending") {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAccept(b.id)}
                className="flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400 transition-colors"
              >
                <Check className="h-3 w-3" /> Accept
              </button>
              <button
                onClick={() => onReject(b.id)}
                className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" /> Reject
              </button>
            </div>
          );
        }
        if (b.status === "confirmed") {
          return (
            <button
              onClick={() => onComplete(b.id)}
              className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400 transition-colors"
            >
              <CheckCircle2 className="h-3 w-3" /> Complete
            </button>
          );
        }
        return <span className="text-xs text-[--text-4]">—</span>;
      },
    },
  ];
}

/* ─── Summary stat ───────────────────────────────────────────── */
function BookingStat({ label, value, sub, color }: {
  label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-[--border] bg-[--bg] p-4">
      <p className="text-xs font-medium text-[--text-3] mb-1">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-[--text-4] mt-0.5">{sub}</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function BookingsPage() {
  const { toast }     = useToastStore();
  const [bookings,    setBookings]  = React.useState<SupplierBooking[]>(SUPPLIER_BOOKINGS);
  const [tab,         setTab]       = React.useState<BookingStatus | "all">("all");
  const [search,      setSearch]    = React.useState("");

  const filtered = React.useMemo(
    () => tab === "all" ? bookings : bookings.filter((b) => b.status === tab),
    [bookings, tab],
  );

  const filteredBySearch = React.useMemo(
    () => search
      ? filtered.filter((b) =>
          b.customer.toLowerCase().includes(search.toLowerCase()) ||
          b.service.toLowerCase().includes(search.toLowerCase()) ||
          b.id.toLowerCase().includes(search.toLowerCase())
        )
      : filtered,
    [filtered, search],
  );

  function mutateStatus(id: string, next: BookingStatus) {
    setBookings((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: next } : b),
    );
  }

  function handleAccept(id: string) {
    mutateStatus(id, "confirmed");
    toast({ title: "Booking confirmed",  variant: "success" });
  }
  function handleReject(id: string) {
    mutateStatus(id, "cancelled");
    toast({ title: "Booking rejected",  variant: "error", description: "The customer will be notified." });
  }
  function handleComplete(id: string) {
    mutateStatus(id, "completed");
    toast({ title: "Marked as completed", variant: "success" });
  }

  const columns = React.useMemo(
    () => buildColumns(handleAccept, handleReject, handleComplete),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const pending   = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-6xl">

        {/* ── Heading ──────────────────────────────────────── */}
        <div>
          <h1 className="text-xl font-bold text-[--text-1]">Bookings</h1>
          <p className="text-sm text-[--text-3] mt-0.5">{bookings.length} total bookings</p>
        </div>

        {/* ── Stats ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <BookingStat label="Pending"      value={pending}   sub="Need action" color="text-amber-600" />
          <BookingStat label="Confirmed"    value={confirmed} sub="Upcoming"    color="text-blue-600"  />
          <BookingStat label="Completed"    value={completed} sub="This period" color="text-green-600" />
          <BookingStat label="Total Revenue"value={formatCurrency(totalRevenue)} sub="Excl. cancelled" color="text-[#6366f1]" />
        </motion.div>

        {/* ── Filters ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        >
          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-[--border] bg-[--bg-subtle] p-1">
            {TABS.map((t) => {
              const count = t.id === "all" ? bookings.length
                : bookings.filter((b) => b.status === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    tab === t.id
                      ? "bg-[--bg] text-[--text-1] shadow-[var(--shadow-sm)]"
                      : "text-[--text-3] hover:text-[--text-2]",
                  )}
                >
                  {t.label}
                  {count > 0 && (
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px]",
                      t.id === "pending" && count > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400" : "bg-[--bg-muted] text-[--text-4]",
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-4]" />
            <input
              type="text"
              placeholder="Search bookings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[--border] bg-[--bg] pl-9 pr-4 py-2 text-sm text-[--text-1] placeholder:text-[--text-4] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-all"
            />
          </div>
        </motion.div>

        {/* ── Table ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <DataTable
            columns={columns}
            data={filteredBySearch}
            pageSize={8}
            emptyLabel="No bookings match your filters"
          />
        </motion.div>
      </main>
    </div>
  );
}
