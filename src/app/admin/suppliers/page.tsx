"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Search, CheckCircle2, XCircle, Ban, Eye, ChevronUp, ChevronDown, ChevronsUpDown, UserPlus, X, Loader2 } from "lucide-react";
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

interface AddSupplierForm {
  ownerName:   string;
  companyName: string;
  email:       string;
  password:    string;
  location:    string;
  category:    string;
}

const EMPTY_FORM: AddSupplierForm = {
  ownerName: "", companyName: "", email: "", password: "", location: "", category: "",
};

const CATEGORY_OPTIONS = [
  "Catering", "Photography", "DJ & Music", "Venues", "Décor & Floral",
  "Wedding", "AV & Lighting", "Kids & Family",
];

/* ── Add Supplier Modal ───────────────────────────────────── */
function AddSupplierModal({
  open, onClose, onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (supplier: AdminSupplier) => void;
}) {
  const [form,    setForm]    = React.useState<AddSupplierForm>(EMPTY_FORM);
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState<string | null>(null);

  function patch(k: keyof AddSupplierForm, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.ownerName || !form.companyName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/create-user", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:       form.email.trim(),
          password:    form.password,
          displayName: form.ownerName.trim(),
          role:        "supplier",
          companyName: form.companyName.trim(),
          approved:    true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create supplier");

      /* Build a local AdminSupplier row so the table updates immediately */
      const newSupplier: AdminSupplier = {
        id:            json.uid,
        businessName:  form.companyName.trim(),
        ownerName:     form.ownerName.trim(),
        email:         form.email.trim(),
        phone:         "—",
        location:      form.location.trim() || "London, UK",
        categories:    form.category ? [form.category] : ["General"],
        status:        "approved",
        joinedAt:      new Date().toISOString().split("T")[0],
        rating:        0,
        reviewCount:   0,
        serviceCount:  0,
        bookingCount:  0,
        revenue:       0,
        initials:      form.ownerName.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
        avatarColor:   json.profile?.avatarColor ?? "#6366f1",
      };
      onCreated(newSupplier);
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Add Supplier</h2>
            <p className="text-xs text-gray-400 mt-0.5">Creates a Firebase account + supplier profile</p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Owner name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Owner Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Sophie Clarke"
              value={form.ownerName}
              onChange={(e) => patch("ownerName", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Company name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Business Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Golden Touch Events"
              value={form.companyName}
              onChange={(e) => patch("companyName", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              placeholder="supplier@example.co.uk"
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Temporary Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => patch("password", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Location + Category side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Shoreditch"
                value={form.location}
                onChange={(e) => patch("location", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => patch("category", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
              >
                <option value="">Select…</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? "Creating…" : "Create Supplier"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function SuppliersPage() {
  const { toast } = useAdminStore();
  const [suppliers,   setSuppliers]   = React.useState<AdminSupplier[]>(ADMIN_SUPPLIERS);
  const [tab,         setTab]         = React.useState<FilterTab>("all");
  const [search,      setSearch]      = React.useState("");
  const [sortField,   setSortField]   = React.useState<SortField | null>("joinedAt");
  const [sortDir,     setSortDir]     = React.useState<SortDir>("desc");
  const [confirm,     setConfirm]     = React.useState<ConfirmState | null>(null);
  const [detailId,    setDetailId]    = React.useState<string | null>(null);
  const [addOpen,     setAddOpen]     = React.useState(false);

  function handleCreated(supplier: AdminSupplier) {
    setSuppliers((prev) => [supplier, ...prev]);
    toast("Supplier account created", "success");
  }

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
        <div className="flex items-center gap-2">
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
          {/* Add supplier */}
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Add Supplier
          </button>
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

      {/* Add supplier modal */}
      <AddSupplierModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleCreated}
      />

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
