"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Upload, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupplierService } from "@/lib/mock-supplier";

const CATEGORIES = [
  "Catering", "Photography", "Décor", "AV & Lighting",
  "Venue", "Bakery", "Entertainment", "Transport", "Florist", "Other",
];

const PRICE_UNITS = ["per head", "per event", "per hour", "per day"];

/* ─── Form state ─────────────────────────────────────────────── */
interface FormData {
  title:       string;
  description: string;
  category:    string;
  price:       string;
  priceUnit:   string;
  tags:        string;
}

const EMPTY: FormData = {
  title: "", description: "", category: "Catering",
  price: "", priceUnit: "per head", tags: "",
};

function fromService(s: SupplierService): FormData {
  return {
    title:       s.title,
    description: "",
    category:    s.category,
    price:       String(s.price),
    priceUnit:   s.priceUnit,
    tags:        s.tags.join(", "),
  };
}

/* ─── Field wrapper ──────────────────────────────────────────── */
function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[--text-2] uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────────── */
function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, className, ...rest } = props;
  return (
    <input
      className={cn(
        "w-full rounded-xl border bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1]",
        "placeholder:text-[--text-4] transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]",
        error ? "border-red-400" : "border-[--border] hover:border-[--text-4]",
        className,
      )}
      {...rest}
    />
  );
}

/* ─── Props ──────────────────────────────────────────────────── */
interface ServiceFormProps {
  open:      boolean;
  onClose:   () => void;
  onSave:    (data: FormData) => void;
  editData?: SupplierService | null;
}

/* ─── Component ──────────────────────────────────────────────── */
export function ServiceForm({ open, onClose, onSave, editData }: ServiceFormProps) {
  const [form,    setForm]    = React.useState<FormData>(EMPTY);
  const [errors,  setErrors]  = React.useState<Partial<FormData>>({});
  const [saving,  setSaving]  = React.useState(false);
  const [dragOver,setDragOver]= React.useState(false);
  const [imgName, setImgName] = React.useState<string | null>(null);

  /* Pre-populate when editing */
  React.useEffect(() => {
    if (open) {
      setForm(editData ? fromService(editData) : EMPTY);
      setErrors({});
      setImgName(null);
    }
  }, [open, editData]);

  function patch(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate(): boolean {
    const errs: Partial<FormData> = {};
    if (!form.title.trim())    errs.title    = "Title is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Enter a valid price";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    onSave(form);
    setSaving(false);
    onClose();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) setImgName(file.name);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          />
        </Dialog.Overlay>

        {/* Panel */}
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 16,  scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
              "w-full max-w-lg max-h-[90vh] flex flex-col",
              "rounded-2xl border border-gray-200 bg-white shadow-2xl",
              "focus:outline-none",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl shrink-0">
              <div>
                <Dialog.Title className="text-base font-bold text-[--text-1]">
                  {editData ? "Edit Service" : "Add New Service"}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[--text-3] mt-0.5">
                  {editData ? "Update your service details" : "Create a new service listing"}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="h-8 w-8 flex items-center justify-center rounded-xl border border-[--border] text-[--text-3] hover:text-[--text-1] hover:border-[--text-4] transition-all">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-white">

              <Field label="Service title" error={errors.title}>
                <FieldInput
                  placeholder="e.g. Premium Wedding Catering Package"
                  value={form.title}
                  onChange={(e) => patch("title", e.target.value)}
                  error={!!errors.title}
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={3}
                  placeholder="Describe what's included, your approach, and what makes this service special…"
                  value={form.description}
                  onChange={(e) => patch("description", e.target.value)}
                  className={cn(
                    "w-full rounded-xl border border-[--border] bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1]",
                    "placeholder:text-[--text-4] resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]",
                    "hover:border-[--text-4] transition-all duration-150",
                  )}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => patch("category", e.target.value)}
                    className={cn(
                      "w-full rounded-xl border border-[--border] bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1]",
                      "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]",
                      "hover:border-[--text-4] transition-all duration-150 cursor-pointer",
                    )}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Price (£)" error={errors.price}>
                  <div className="flex gap-2">
                    <FieldInput
                      type="number"
                      min="0"
                      placeholder="95"
                      value={form.price}
                      onChange={(e) => patch("price", e.target.value)}
                      error={!!errors.price}
                      className="flex-1"
                    />
                    <select
                      value={form.priceUnit}
                      onChange={(e) => patch("priceUnit", e.target.value)}
                      className={cn(
                        "rounded-xl border border-[--border] bg-[--bg] px-2.5 py-2.5 text-xs text-[--text-2]",
                        "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]",
                        "hover:border-[--text-4] transition-all duration-150 cursor-pointer",
                      )}
                    >
                      {PRICE_UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </Field>
              </div>

              {/* Image upload */}
              <Field label="Images">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 text-center transition-all duration-150 cursor-pointer",
                    dragOver
                      ? "border-[#6366f1] bg-[#eef2ff]"
                      : "border-[--border] hover:border-[--text-3] bg-[--bg-subtle]",
                  )}
                  onClick={() => document.getElementById("service-img-input")?.click()}
                >
                  <input
                    id="service-img-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setImgName(f.name);
                    }}
                  />
                  {imgName ? (
                    <div className="flex items-center gap-2 text-sm text-[#4f46e5]">
                      <Upload className="h-4 w-4" />
                      {imgName}
                    </div>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-xl bg-[--bg-muted] flex items-center justify-center">
                        <Upload className="h-5 w-5 text-[--text-4]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[--text-2]">Drop images here</p>
                        <p className="text-xs text-[--text-4] mt-0.5">PNG, JPG up to 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </Field>

              <Field label="Tags">
                <FieldInput
                  placeholder="wedding, corporate, fine-dining (comma separated)"
                  value={form.tags}
                  onChange={(e) => patch("tags", e.target.value)}
                />
              </Field>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <Dialog.Close asChild>
                <button className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all">
                  Cancel
                </button>
              </Dialog.Close>

              <button
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white",
                  "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
                  "shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)]",
                  "transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <><Plus className="h-4 w-4" /> {editData ? "Save Changes" : "Create Service"}</>
                )}
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
