"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Pause, Play, Star, MoreHorizontal, Package } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SupplierHeader }  from "@/components/supplier/supplier-header";
import { StatusBadge }     from "@/components/supplier/status-badge";
import { ServiceForm }     from "@/components/supplier/service-form";
import { useToastStore }   from "@/store/toast";
import { formatCurrency }  from "@/lib/constants";
import {
  SUPPLIER_SERVICES,
  type SupplierService,
  type ServiceStatus,
} from "@/lib/mock-supplier";
import { cn } from "@/lib/utils";

/* ─── Confirm dialog ─────────────────────────────────────────── */
function ConfirmDialog({
  open, message, onConfirm, onCancel,
}: {
  open: boolean; message: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{  opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{   scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-2xl border border-[--border] bg-[--bg] p-6 shadow-[var(--shadow-xl)]"
          >
            <h3 className="text-sm font-bold text-[--text-1] mb-2">Are you sure?</h3>
            <p className="text-sm text-[--text-3] mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="rounded-xl border border-[--border] px-4 py-2 text-sm font-semibold text-[--text-2] hover:border-[--text-3] transition-all">
                Cancel
              </button>
              <button onClick={onConfirm} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Service card ───────────────────────────────────────────── */
function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggle,
}: {
  service:  SupplierService;
  onEdit:   () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{   opacity: 0, scale: 0.95 }}
      className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-[--bg-muted]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="400px"
          className={cn(
            "object-cover transition-all duration-300",
            service.status === "paused" && "opacity-50 grayscale",
          )}
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={service.status} />
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="h-7 w-7 flex items-center justify-center rounded-lg glass border border-white/20 text-white hover:bg-white/20 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 min-w-[140px] rounded-xl border border-[--border] bg-[--bg] p-1 shadow-[var(--shadow-xl)]"
              >
                <DropdownMenu.Item
                  onSelect={onEdit}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1] cursor-pointer outline-none"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={onToggle}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1] cursor-pointer outline-none"
                >
                  {service.status === "paused"
                    ? <><Play  className="h-3.5 w-3.5" /> Activate</>
                    : <><Pause className="h-3.5 w-3.5" /> Pause</>
                  }
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-[--border]" />
                <DropdownMenu.Item
                  onSelect={onDelete}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer outline-none"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[--text-4] mb-0.5">
            {service.category}
          </p>
          <h3 className="text-sm font-semibold text-[--text-1] line-clamp-2 leading-snug">
            {service.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {service.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[--text-1]">{service.rating.toFixed(1)}</span>
              <span className="text-[--text-4]">({service.reviewCount})</span>
            </div>
          ) : (
            <span className="text-[--text-4]">No reviews yet</span>
          )}
          <span className="text-[--text-4]">·</span>
          <span className="text-[--text-3]">{service.bookings} bookings</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[--border]">
          <div>
            <span className="text-sm font-bold text-[--text-1] tabular-nums">
              {formatCurrency(service.price)}
            </span>
            <span className="text-xs text-[--text-4] ml-1">/{service.priceUnit}</span>
          </div>
          <div className="flex gap-1.5">
            {service.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full border border-[--border] px-2 py-0.5 text-[10px] text-[--text-3]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tabs ───────────────────────────────────────────────────── */
const TABS: { id: ServiceStatus | "all"; label: string }[] = [
  { id: "all",    label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "draft",  label: "Drafts" },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default function ServicesPage() {
  const { toast } = useToastStore();

  const [services,    setServices]   = React.useState<SupplierService[]>(SUPPLIER_SERVICES);
  const [tab,         setTab]        = React.useState<ServiceStatus | "all">("all");
  const [formOpen,    setFormOpen]   = React.useState(false);
  const [editTarget,  setEditTarget] = React.useState<SupplierService | null>(null);
  const [deleteTarget,setDeleteTarget]= React.useState<string | null>(null);

  const filtered = tab === "all" ? services : services.filter((s) => s.status === tab);

  function handleEdit(svc: SupplierService) {
    setEditTarget(svc);
    setFormOpen(true);
  }

  function handleToggle(id: string) {
    setServices((prev) =>
      prev.map((s) =>
        s.id !== id ? s
          : { ...s, status: s.status === "paused" ? "active" : "paused" }
      )
    );
    const svc = services.find((s) => s.id === id)!;
    const next = svc.status === "paused" ? "active" : "paused";
    toast({ title: `Service ${next}`, description: svc.title, variant: next === "active" ? "success" : "default" });
  }

  function handleDelete(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeleteTarget(null);
    toast({ title: "Service deleted", variant: "success" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSave(data: any) {
    if (editTarget) {
      setServices((prev) =>
        prev.map((s) =>
          s.id !== editTarget.id ? s
            : { ...s, title: data.title, category: data.category, price: Number(data.price), priceUnit: data.priceUnit }
        )
      );
      toast({ title: "Service updated", variant: "success" });
    } else {
      const newSvc: SupplierService = {
        id:          `svc-${Date.now()}`,
        title:       data.title,
        category:    data.category,
        price:       Number(data.price),
        priceUnit:   data.priceUnit,
        status:      "draft",
        bookings:    0,
        rating:      0,
        reviewCount: 0,
        image:       "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80",
        tags:        data.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        createdAt:   new Date().toISOString().split("T")[0],
      };
      setServices((prev) => [newSvc, ...prev]);
      toast({ title: "Service created!", description: newSvc.title, variant: "success" });
    }
    setEditTarget(null);
  }

  const deleteService = services.find((s) => s.id === deleteTarget);

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader
        action={
          <button
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="flex items-center gap-1.5 h-8 rounded-xl px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" /> Add Service
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-6xl">

        {/* ── Page heading ─────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[--text-1]">My Services</h1>
            <p className="text-sm text-[--text-3] mt-0.5">{services.length} services listed</p>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="flex gap-1 rounded-xl border border-[--border] bg-[--bg-subtle] p-1 w-fit">
          {TABS.map((t) => {
            const count = t.id === "all" ? services.length
              : services.filter((s) => s.status === t.id).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                  tab === t.id
                    ? "bg-[--bg] text-[--text-1] shadow-[var(--shadow-sm)]"
                    : "text-[--text-3] hover:text-[--text-2]",
                )}
              >
                {t.label}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  tab === t.id ? "bg-[--bg-muted] text-[--text-2]" : "bg-transparent text-[--text-4]",
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grid ─────────────────────────────────────────── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                onEdit={() => handleEdit(svc)}
                onDelete={() => setDeleteTarget(svc.id)}
                onToggle={() => handleToggle(svc.id)}
              />
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="h-14 w-14 rounded-2xl bg-[--bg-muted] flex items-center justify-center mb-4">
                  <Package className="h-7 w-7 text-[--text-4]" />
                </div>
                <h3 className="text-base font-bold text-[--text-1] mb-1">No services yet</h3>
                <p className="text-sm text-[--text-3] mb-6">Create your first service to start receiving bookings.</p>
                <button
                  onClick={() => { setEditTarget(null); setFormOpen(true); }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  <Plus className="h-4 w-4" /> Add your first service
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Modals ───────────────────────────────────────────── */}
      <ServiceForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        editData={editTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete "${deleteService?.title}"? This cannot be undone and will cancel all associated bookings.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
