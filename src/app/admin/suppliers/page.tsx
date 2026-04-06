"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Search, Filter, CheckCircle2, XCircle, Ban, Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import {
  ADMIN_SUPPLIERS,
  type AdminSupplier,
  type AdminSupplierStatus,
} from "@/lib/mock-admin";
import { cn } from "@/lib/utils";

type FilterTab = AdminSupplierStatus | "all";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "pending",   label: "Pending"   },
  { id: "approved",  label: "Approved"  },
  { id: "rejected",  label: "Rejected"  },
  { id: "suspended", label: "Suspended" },
];

type SortField = "businessName" | "revenue" | "bookingCount" | "joinedAt" | "rating";
type SortDir   = "asc" | "desc";

function SortBtn({ field, current, dir, onSort }: {
  field: SortField; current: SortField | null; dir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button onClick={() => onSort(field)} className="inline-flex items-center gap-0.5">
      {active
        ? dir === "asc" ? <ChevronUp className="h-3 w-3 text-indigo-600" /> : <ChevronDown className="h-3 w-3 text-indigo-600" />
        : <ChevronsUpDown className="h-3 w-3 text-gray-300" />}
    </button>
  );
}

interface ConfirmState {
  open: boolean;
  supplierId: string;
  action: "approve" | "reject" | "suspend";
}

export default function SuppliersPage() {
  const { toast } = useAdminStore();
  const [suppliers, setSuppliers] = React.useState<AdminSupplier[]>(ADMIN_SUPPLIERS);
  const [tab,       setTab]       = React.useState<FilterTab>("all");
  const [search,    setSearch]    = React.useState("");
  const [sortField, setSortField] = React.useState<SortField | null>("joinedAt");
  const [sortDir,   setSortDir]   = React.useState<SortDir>("desc");
  const [confirm,   setConfirm]   = React.useState<ConfirmState | null>(null);
  const [detailId,  setDetailId]  = React.useState<string | null>(null);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  const tabFiltered = React.useMemo(
    () => tab === "all" ? suppliers : suppliers.filter((s) => s.status === tab),
    [suppliers, tab],
  );

  const searched = React.useMemo(() => {
    if (!search) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter((s) =>
      s.businessName.toLowerCase().includes(q) ||
      s.ownerName.toLowerCase().includes(q)    ||
      s.email.toLowerCase().includes(q),
    );
  }, [tabFiltered, search]);

  const sorted = React.useMemo(() => {
    if (!sortField) return searched;
    return [...searched].sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      const cmp = typeof av === "number"
        ? av - (bv as number)
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [searched, sortField, sortDir]);

  function mutate(id: string, status: AdminSupplierStatus) {
    setSuppliers((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
    setConfirm(null);
    const labels: Record<string, string> = {
      approved: "Supplier approved", rejected: "Supplier rejected", suspended: "Supplier suspended",
    };
    toast(labels[status] ?? "Done", status === "approved" ? "success" : "warning");
  }

  const detail = detailId ? suppliers.find((s) => s.id === detailId) : null;
  const pendingCount = suppliers.filter((s) => s.status === "pending").length;

  return (
    <div className="p-6 space-y-5 max-w-7xl">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-gray-500 mt-0.5">
            {suppliers.length} suppliers total
            {pendingCount > 0 && <span className="ml-2 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold px-2 py-0.5">{pendingCount} pending</span>}
          </p>
        </div>
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => {
          const count = t.id === "all" ? suppliers.length : suppliers.filter((s) => s.status === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-800",
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
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <span className="flex items-center gap-1">Business <SortBtn field="businessName" current={sortField} dir={sortDir} onSort={handleSort} /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Owner</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Categories</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <span className="flex items-center gap-1">Rating <SortBtn field="rating" current={sortField} dir={sortDir} onSort={handleSort} /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <span className="flex items-center gap-1">Revenue <SortBtn field="revenue" current={sortField} dir={sortDir} onSort={handleSort} /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <span className="flex items-center gap-1">Joined <SortBtn field="joinedAt" current={sortField} dir={sortDir} onSort={handleSort} /></span>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">
                    No suppliers match your filters.
                  </td>
                </tr>
              ) : sorted.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                        style={{ background: s.avatarColor }}
                      >
                        {s.initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">{s.businessName}</p>
                        <p className="text-[11px] text-gray-400">{s.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[13px] text-gray-700">{s.ownerName}</p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{s.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.categories.map((c) => (
                        <span key={c} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <AdminStatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 tabular-nums">
                    {s.rating > 0 ? `★ ${s.rating.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-800 tabular-nums">
                    {s.revenue > 0 ? `£${(s.revenue / 1000).toFixed(0)}k` : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400 whitespace-nowrap">
                    {format(parseISO(s.joinedAt), "d MMM yyyy")}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {s.status === "pending" && (
                        <>
                          <button
                            onClick={() => setConfirm({ open: true, supplierId: s.id, action: "approve" })}
                            className="flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => setConfirm({ open: true, supplierId: s.id, action: "reject" })}
                            className="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </>
                      )}
                      {s.status === "approved" && (
                        <button
                          onClick={() => setConfirm({ open: true, supplierId: s.id, action: "suspend" })}
                          className="flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                        >
                          <Ban className="h-3 w-3" /> Suspend
                        </button>
                      )}
                      {s.status === "suspended" && (
                        <button
                          onClick={() => mutate(s.id, "approved")}
                          className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Reinstate
                        </button>
                      )}
                      <button
                        onClick={() => setDetailId(s.id)}
                        className="flex items-center justify-center h-7 w-7 rounded-md border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail drawer (simplified slide-in panel) */}
      {detail && (
        <div
          className="fixed inset-0 z-40 flex"
          onClick={() => setDetailId(null)}
        >
          <div className="flex-1 bg-black/30" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{detail.businessName}</h2>
              <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="px-5 py-5 space-y-5 text-sm">
              {[
                ["Owner",    detail.ownerName],
                ["Email",    detail.email],
                ["Phone",    detail.phone],
                ["Location", detail.location],
                ["Joined",   format(parseISO(detail.joinedAt), "d MMMM yyyy")],
                ["Status",   detail.status],
                ["Rating",   detail.rating > 0 ? `${detail.rating} (${detail.reviewCount} reviews)` : "No reviews"],
                ["Services", String(detail.serviceCount)],
                ["Bookings", String(detail.bookingCount)],
                ["Revenue",  detail.revenue > 0 ? `£${detail.revenue.toLocaleString()}` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div>
                <span className="text-gray-500 block mb-1.5">Categories</span>
                <div className="flex flex-wrap gap-1.5">
                  {detail.categories.map((c) => (
                    <span key={c} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirm dialog */}
      <AdminConfirmDialog
        open={!!confirm?.open}
        title={
          confirm?.action === "approve" ? "Approve supplier?" :
          confirm?.action === "reject"  ? "Reject supplier?"  :
          "Suspend supplier?"
        }
        message={
          confirm?.action === "approve"
            ? "The supplier will be notified and can immediately list services."
            : confirm?.action === "reject"
            ? "The supplier application will be declined. They can reapply."
            : "The supplier's listings will be hidden and bookings paused."
        }
        confirmLabel={
          confirm?.action === "approve" ? "Approve" :
          confirm?.action === "reject"  ? "Reject"  :
          "Suspend"
        }
        variant={confirm?.action === "approve" ? "warning" : "danger"}
        onConfirm={() => {
          if (confirm) {
            const statusMap = { approve: "approved", reject: "rejected", suspend: "suspended" } as const;
            mutate(confirm.supplierId, statusMap[confirm.action]);
          }
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
