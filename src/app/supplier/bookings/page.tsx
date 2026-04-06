"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Check, X, CheckCircle2, Search, Wifi, WifiOff, Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { StatusBadge }    from "@/components/supplier/status-badge";
import { DataTable }      from "@/components/supplier/data-table";
import { useToastStore }  from "@/store/toast";
import { useBookingsStore, type ConnectionStatus } from "@/store/bookings";
import { formatCurrency } from "@/lib/constants";
import { type SupplierBooking, type BookingStatus } from "@/lib/mock-supplier";
import { cn } from "@/lib/utils";

/* ─── Connection badge ───────────────────────────────────────── */
function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  if (status === "live") {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/60 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:text-green-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
        Live
      </div>
    );
  }
  if (status === "connecting") {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-[--border] bg-[--bg-muted] px-2.5 py-1 text-[11px] font-semibold text-[--text-3]">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[--border] bg-[--bg-muted] px-2.5 py-1 text-[11px] font-semibold text-[--text-4]">
      <WifiOff className="h-3 w-3" />
      Demo mode
    </div>
  );
}

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
      id:          "customer",
      header:      "Customer",
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
      id:          "service",
      header:      "Service",
      accessorKey: "service",
      cell: ({ row }) => (
        <p className="text-sm text-[--text-2] max-w-[180px] truncate">{row.original.service}</p>
      ),
    },
    {
      id:          "date",
      header:      "Event Date",
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
      id:          "amount",
      header:      "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-[--text-1] tabular-nums">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      id:          "status",
      header:      "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id:            "actions",
      header:        "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const b = row.original;
        if (b.status === "pending") {
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAccept(b.id)}
                className="flex items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 active:scale-95 transition-all shadow-sm"
              >
                <Check className="h-3.5 w-3.5" /> Accept
              </button>
              <button
                onClick={() => onReject(b.id)}
                className="flex items-center gap-1.5 rounded-xl border-2 border-red-300 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 hover:border-red-400 active:scale-95 dark:border-red-700 dark:bg-red-950/60 dark:text-red-400 transition-all"
              >
                <X className="h-3.5 w-3.5" /> Reject
              </button>
            </div>
          );
        }
        if (b.status === "confirmed") {
          return (
            <button
              onClick={() => onComplete(b.id)}
              className="flex items-center gap-1.5 rounded-xl bg-[#6366f1] px-3 py-2 text-xs font-bold text-white hover:bg-[#4f46e5] active:scale-95 transition-all shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
            </button>
          );
        }
        return <span className="text-xs text-[--text-4]">—</span>;
      },
    },
  ];
}

/* ─── Summary stat ───────────────────────────────────────────── */
const BookingStat = React.memo(function BookingStat({
  label, value, sub, color,
}: {
  label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[--text-3] mb-2">{label}</p>
      <p className={`text-2xl font-bold tabular-nums leading-none ${color}`}>{value}</p>
      <p className="text-xs text-[--text-4] mt-1.5">{sub}</p>
    </div>
  );
});

/* ─── Page ───────────────────────────────────────────────────── */
export default function BookingsPage() {
  const { toast } = useToastStore();

  /* Global bookings state + connection status from Zustand */
  const bookings           = useBookingsStore((s) => s.bookings);
  const connection         = useBookingsStore((s) => s.connection);
  const updateStatus       = useBookingsStore((s) => s.updateBookingStatus);
  const revertStatus       = useBookingsStore((s) => s.revertBookingStatus);

  const [tab,    setTab]    = React.useState<BookingStatus | "all">("all");
  const [search, setSearch] = React.useState("");

  /* useDeferredValue defers the expensive filter on search while keeping
     the input itself snappy — no artificial debounce timeout needed.     */
  const deferredSearch = React.useDeferredValue(search);
  const isStale        = search !== deferredSearch;

  /* Optimistic status update with API call + rollback on failure */
  const mutateStatus = React.useCallback(
    async (id: string, next: BookingStatus, prev: BookingStatus) => {
      updateStatus(id, next);
      try {
        const res = await fetch(`/api/bookings/${id}/status`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ status: next }),
        });
        if (!res.ok) throw new Error(await res.text());
      } catch (err) {
        revertStatus(id, prev);
        console.error("[mutateStatus]", err);
        toast({ title: "Update failed", description: "Please try again.", variant: "error" });
      }
    },
    [updateStatus, revertStatus, toast],
  );

  const handleAccept = React.useCallback(
    (id: string) => {
      mutateStatus(id, "confirmed", "pending");
      toast({ title: "Booking confirmed", variant: "success" });
    },
    [mutateStatus, toast],
  );

  const handleReject = React.useCallback(
    (id: string) => {
      mutateStatus(id, "cancelled", "pending");
      toast({ title: "Booking rejected", variant: "error", description: "The customer will be notified." });
    },
    [mutateStatus, toast],
  );

  const handleComplete = React.useCallback(
    (id: string) => {
      mutateStatus(id, "completed", "confirmed");
      toast({ title: "Marked as completed", variant: "success" });
    },
    [mutateStatus, toast],
  );

  /* Stable column reference — deps are the callback refs, not inline fns */
  const columns = React.useMemo(
    () => buildColumns(handleAccept, handleReject, handleComplete),
    [handleAccept, handleReject, handleComplete],
  );

  /* Tab filter then deferred search filter */
  const tabFiltered = React.useMemo(
    () => tab === "all" ? bookings : bookings.filter((b) => b.status === tab),
    [bookings, tab],
  );

  const displayData = React.useMemo(() => {
    if (!deferredSearch) return tabFiltered;
    const q = deferredSearch.toLowerCase();
    return tabFiltered.filter(
      (b) =>
        b.customer.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)  ||
        b.id.toLowerCase().includes(q),
    );
  }, [tabFiltered, deferredSearch]);

  /* Summary stats */
  const pending      = bookings.filter((b) => b.status === "pending").length;
  const confirmed    = bookings.filter((b) => b.status === "confirmed").length;
  const completed    = bookings.filter((b) => b.status === "completed").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-6xl">

        {/* ── Heading ──────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[--text-1]">Bookings</h1>
            <p className="text-sm text-[--text-3] mt-1">
              {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <ConnectionBadge status={connection} />
        </div>

        {/* ── Stats ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <BookingStat label="Pending"       value={pending}   sub="Need action"    color="text-amber-600" />
          <BookingStat label="Confirmed"     value={confirmed} sub="Upcoming"       color="text-blue-600"  />
          <BookingStat label="Completed"     value={completed} sub="This period"    color="text-green-600" />
          <BookingStat label="Total Revenue" value={formatCurrency(totalRevenue)} sub="Excl. cancelled" color="text-[#6366f1]" />
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
              const count = t.id === "all"
                ? bookings.length
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
                      t.id === "pending" && count > 0
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400"
                        : "bg-[--bg-muted] text-[--text-4]",
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
              className={cn(
                "w-full rounded-xl border border-[--border] bg-[--bg] pl-9 pr-4 py-2 text-sm text-[--text-1] placeholder:text-[--text-4]",
                "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-all",
                isStale && "opacity-60",
              )}
            />
            {isStale && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-4] animate-spin" />
            )}
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
            data={displayData}
            pageSize={8}
            emptyLabel="No bookings found"
            emptySubLabel="Try changing the status filter or search query."
          />
        </motion.div>

      </main>
    </div>
  );
}
