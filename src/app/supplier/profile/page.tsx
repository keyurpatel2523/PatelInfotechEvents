"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, Save, Loader2, CheckCircle2, Globe, MapPin, Mail, Phone } from "lucide-react";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { useToastStore }  from "@/store/toast";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Catering", "Photography", "Décor", "AV & Lighting",
  "Venue", "Bakery", "Entertainment", "Transport", "Florist",
];

const AREAS = [
  "Mayfair", "Shoreditch", "Chelsea", "Canary Wharf", "Brixton",
  "Notting Hill", "Kensington", "Soho", "Greenwich", "Camden",
];

/* ─── Field wrapper ──────────────────────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div>
        <label className="text-sm font-semibold text-[--text-1]">{label}</label>
        {hint && <p className="text-xs text-[--text-3] mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────────── */
function Inp(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-xl border border-[--border] bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1] placeholder:text-[--text-4] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] hover:border-[--text-4] transition-all"
      {...props}
    />
  );
}

/* ─── Section ────────────────────────────────────────────────── */
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[--border]">
        <h2 className="text-sm font-bold text-[--text-1]">{title}</h2>
        {sub && <p className="text-xs text-[--text-3] mt-0.5">{sub}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { toast }  = useToastStore();
  const [saving,   setSaving]   = React.useState(false);
  const [logoName, setLogoName] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    businessName:  "Mayfair Catering Co.",
    displayName:   "James Hartley",
    email:         "james@mayfaircatering.co.uk",
    phone:         "+44 20 7123 4567",
    website:       "www.mayfaircatering.co.uk",
    description:   "White-glove catering trusted by Michelin-starred chefs and royal households. We specialise in weddings, corporate galas, and private fine dining events across London. Every menu is crafted seasonally using the finest British produce.",
    categories:    ["Catering"] as string[],
    areas:         ["Mayfair", "Chelsea", "Kensington", "Notting Hill"] as string[],
    minNotice:     "48",
    responseTime:  "Within 2 hours",
    cancellation:  "Full refund up to 14 days before event",
  });

  function patch(field: string, value: string | string[]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCategory(cat: string) {
    patch("categories", form.categories.includes(cat)
      ? form.categories.filter((c) => c !== cat)
      : [...form.categories, cat]
    );
  }

  function toggleArea(area: string) {
    patch("areas", form.areas.includes(area)
      ? form.areas.filter((a) => a !== area)
      : [...form.areas, area]
    );
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast({ title: "Profile saved", description: "Changes are live on your listing.", variant: "success" });
  }

  const completionFields = [
    form.businessName, form.description, form.email, form.phone,
    form.categories.length > 0 ? "ok" : "",
    form.areas.length > 0 ? "ok" : "",
    logoName ? "ok" : "",
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-1.5 h-8 rounded-xl px-3 text-xs font-semibold text-white",
              "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-sm hover:opacity-90",
              "transition-all disabled:opacity-60",
            )}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-3xl">

        {/* ── Heading ──────────────────────────────────────── */}
        <div>
          <h1 className="text-xl font-bold text-[--text-1]">Profile</h1>
          <p className="text-sm text-[--text-3] mt-0.5">How clients see your business on EventSphere</p>
        </div>

        {/* ── Profile completion ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[--border] bg-[--bg] p-5 shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${completionPct === 100 ? "text-green-500" : "text-[--text-4]"}`} />
              <p className="text-sm font-semibold text-[--text-1]">Profile completion</p>
            </div>
            <span className="text-sm font-bold text-[#6366f1] tabular-nums">{completionPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[--bg-muted] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
            />
          </div>
          <p className="text-xs text-[--text-3] mt-2">
            {completionPct === 100
              ? "Your profile is fully complete!"
              : "Complete your profile to increase bookings and build trust with clients."}
          </p>
        </motion.div>

        {/* ── Logo upload ───────────────────────────────────── */}
        <Section title="Business Logo" sub="Shown on your listing and booking confirmation">
          <div className="flex items-center gap-5">
            <div
              className="h-20 w-20 shrink-0 rounded-2xl border-2 border-dashed border-[--border] bg-[--bg-muted] flex items-center justify-center cursor-pointer hover:border-[#6366f1] transition-all"
              onClick={() => document.getElementById("logo-input")?.click()}
            >
              {logoName ? (
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-xl font-bold">
                  JH
                </div>
              ) : (
                <Upload className="h-6 w-6 text-[--text-4]" />
              )}
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setLogoName(f.name);
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[--text-1]">
                {logoName ?? "No logo uploaded"}
              </p>
              <p className="text-xs text-[--text-3] mt-0.5">PNG or JPG · min 200×200px · max 5MB</p>
              <button
                onClick={() => document.getElementById("logo-input")?.click()}
                className="mt-2 text-xs font-semibold text-[#6366f1] hover:underline"
              >
                {logoName ? "Change logo" : "Upload logo"}
              </button>
            </div>
          </div>
        </Section>

        {/* ── Business info ─────────────────────────────────── */}
        <Section title="Business Information" sub="Your public-facing business details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name">
              <Inp value={form.businessName} onChange={(e) => patch("businessName", e.target.value)} />
            </Field>
            <Field label="Display name (your name)">
              <Inp value={form.displayName}  onChange={(e) => patch("displayName",  e.target.value)} />
            </Field>
          </div>

          <Field label="Business description" hint="Clients read this before booking. Be specific about what you offer.">
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
              className="w-full rounded-xl border border-[--border] bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1] placeholder:text-[--text-4] resize-none focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] hover:border-[--text-4] transition-all"
            />
            <p className="text-xs text-right text-[--text-4]">{form.description.length} / 500</p>
          </Field>
        </Section>

        {/* ── Contact details ───────────────────────────────── */}
        <Section title="Contact Details" sub="How clients and EventSphere can reach you">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-4]" />
                <Inp
                  type="email"
                  value={form.email}
                  onChange={(e) => patch("email", e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Phone">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-4]" />
                <Inp
                  type="tel"
                  value={form.phone}
                  onChange={(e) => patch("phone", e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Website" hint="Optional">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-4]" />
                <Inp
                  value={form.website}
                  onChange={(e) => patch("website", e.target.value)}
                  placeholder="www.yourbusiness.co.uk"
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Minimum notice required (hours)">
              <Inp
                type="number"
                min="1"
                value={form.minNotice}
                onChange={(e) => patch("minNotice", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        {/* ── Categories ───────────────────────────────────── */}
        <Section title="Service Categories" sub="Select all categories that apply to your business">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = form.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 bg-white",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Service areas ─────────────────────────────────── */}
        <Section title="Service Areas" sub="London boroughs and areas you cover">
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => {
              const active = form.areas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 bg-white",
                  )}
                >
                  <MapPin className="h-3 w-3" />
                  {area}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Policies ─────────────────────────────────────── */}
        <Section title="Policies" sub="Shown to clients during checkout">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Typical response time">
              <select
                value={form.responseTime}
                onChange={(e) => patch("responseTime", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 hover:border-gray-400 transition-all cursor-pointer"
              >
                {["Within 1 hour", "Within 2 hours", "Within 4 hours", "Same day", "Within 24 hours"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Cancellation policy">
              <select
                value={form.cancellation}
                onChange={(e) => patch("cancellation", e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 hover:border-gray-400 transition-all cursor-pointer"
              >
                {[
                  "Full refund up to 7 days before event",
                  "Full refund up to 14 days before event",
                  "50% refund up to 7 days before event",
                  "No refund",
                ].map((v) => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* ── Save button ───────────────────────────────────── */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white",
              "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
              "shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.45)]",
              "transition-all disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>

      </main>
    </div>
  );
}
