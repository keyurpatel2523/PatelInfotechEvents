"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Ban, Trash2, Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import {
  ADMIN_SERVICES,
  ADMIN_CATEGORIES,
  type AdminService,
  type AdminServiceStatus,
} from "@/lib/mock-admin";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FilterTab = AdminServiceStatus | "all";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all",      label: "All"      },
  { id: "active",   label: "Active"   },
  { id: "paused",   label: "Paused"   },
  { id: "draft",    label: "Drafts"   },
  { id: "disabled", label: "Disabled" },
];

type SortField = "title" | "price" | "bookings" | "rating" | "createdAt";
type SortDir   = "asc" | "desc";

function SortBtn({ field, current, dir, onSort }: {
  field: SortField; current: SortField | null; dir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button onClick={() => onSort(field)} className="ml-0.5">
      {active
        ? dir === "asc" ? <ChevronUp className="h-3 w-3 text-indigo-600 inline" /> : <ChevronDown className="h-3 w-3 text-indigo-600 inline" />
        : <ChevronsUpDown className="h-3 w-3 text-gray-300 inline" />}
    </button>
  );
}

interface ConfirmState {
  open: boolean;
  serviceId: string;
  action: "disable" | "delete";
}

export default function ServicesPage() {
  const { toast } = useAdminStore();

  const rootCategories = ADMIN_CATEGORIES.filter((c) => c.level === 0).map((c) => c.name);

  const [services,   setServices]   = React.useState<AdminService[]>(ADMIN_SERVICES);
  const [tab,        setTab]        = React.useState<FilterTab>("all");
  const [search,     setSearch]     = React.useState("");
  const [category,   setCategory]   = React.useState("all");
  const [sortField,  setSortField]  = React.useState<SortField | null>("createdAt");
  const [sortDir,    setSortDir]    = React.useState<SortDir>("desc");
  const [confirm,    setConfirm]    = React.useState<ConfirmState | null>(null);

  function handleSort(f: SortField) {
    if (sortField === f) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  }

  function handleDisable(id: string) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, status: "disabled" as AdminServiceStatus } : s));
    setConfirm(null);
    toast("Service disabled", "warning");
  }

  function handleDelete(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setConfirm(null);
    toast("Service removed", "success");
  }

  const filtered = React.useMemo(() => {
    let list = tab === "all" ? services : services.filter((s) => s.status === tab);
    if (category !== "all") list = list.filter((s) => s.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.supplierName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
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
  }, [services, tab, category, search, sortField, sortDir]);

  return (
    <div className="p-6 space-y-5 max-w-7xl">

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 cursor-pointer"
        >
          <option value="all">All categories</option>
          {rootCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} services</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => {
          const count = t.id === "all" ? services.length : services.filter((s) => s.status === t.id).length;
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
                  Service <SortBtn field="title" current={sortField} dir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Supplier</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Category</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Price <SortBtn field="price" current={sortField} dir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Bookings <SortBtn field="bookings" current={sortField} dir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Rating <SortBtn field="rating" current={sortField} dir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">
                    No services match your filters.
                  </td>
                </tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{s.title}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{s.id}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 max-w-[140px] truncate">{s.supplierName}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{s.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-800 tabular-nums whitespace-nowrap">
                    {formatCurrency(s.price)}<span className="text-[11px] font-normal text-gray-400 ml-0.5">/{s.priceUnit}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 tabular-nums">{s.bookings}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700 tabular-nums">
                    {s.rating > 0 ? `★ ${s.rating.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-4 py-3.5"><AdminStatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {s.status !== "disabled" && (
                        <button
                          onClick={() => setConfirm({ open: true, serviceId: s.id, action: "disable" })}
                          className="flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-1.5 text-[11px] font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                        >
                          <Ban className="h-3 w-3" /> Disable
                        </button>
                      )}
                      <button
                        onClick={() => setConfirm({ open: true, serviceId: s.id, action: "delete" })}
                        className="flex items-center justify-center h-7 w-7 rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AdminConfirmDialog
        open={!!confirm?.open}
        title={confirm?.action === "disable" ? "Disable service?" : "Delete service?"}
        message={
          confirm?.action === "disable"
            ? "The service will be hidden from the marketplace. The supplier will be notified."
            : "This service and all its listing data will be permanently removed. This cannot be undone."
        }
        confirmLabel={confirm?.action === "disable" ? "Disable" : "Delete"}
        variant="danger"
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === "disable") handleDisable(confirm.serviceId);
          else handleDelete(confirm.serviceId);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
