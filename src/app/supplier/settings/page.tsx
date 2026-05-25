"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Bell, Lock, CreditCard, Shield, Smartphone,
  Eye, EyeOff, Loader2, Save, CheckCircle2, Trash2,
} from "lucide-react";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { useToastStore }  from "@/store/toast";
import { cn } from "@/lib/utils";

/* ─── Section wrapper ────────────────────────────────────────── */
function Section({
  icon: Icon, title, sub, color, children,
}: {
  icon: React.ElementType; title: string; sub?: string;
  color: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[--border]">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", color)}>
          <Icon className="h-4 w-4 text-white" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-[--text-1]">{title}</h2>
          {sub && <p className="text-xs text-[--text-3]">{sub}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </motion.div>
  );
}

/* ─── Toggle row ─────────────────────────────────────────────── */
function ToggleRow({
  label, hint, checked, onChange,
}: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[--text-1]">{label}</p>
        {hint && <p className="text-xs text-[--text-3] mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-indigo-600" : "bg-zinc-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { toast } = useToastStore();
  const [saving, setSaving] = React.useState(false);
  const [showPass, setShowPass]  = React.useState(false);

  /* Notifications */
  const [notif, setNotif] = React.useState({
    newBooking:    true,
    bookingCancel: true,
    newReview:     true,
    payoutSent:    true,
    marketingEmail:false,
    smsAlerts:     false,
    pushNotif:     true,
  });

  /* Security */
  const [twoFA, setTwoFA]  = React.useState(false);
  const [passwords, setPasswords] = React.useState({ current: "", next: "", confirm: "" });

  /* Payout */
  const [payout, setPayout] = React.useState({
    accountName:   "James Hartley",
    sortCode:      "20-12-34",
    accountNumber: "87654321",
    schedule:      "weekly",
  });

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast({ title: "Settings saved", description: "Your preferences have been updated.", variant: "success" });
  }

  const inp = "w-full rounded-xl border border-[--border] bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1] placeholder:text-[--text-4] focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 hover:border-[--text-4] transition-all";

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 h-8 rounded-xl px-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-sm hover:opacity-90 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-3xl">

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold text-[--text-1]">Settings</h1>
          <p className="text-sm text-[--text-3] mt-0.5">Manage your account preferences and security</p>
        </div>

        {/* ── Notifications ───────────────────────────────────── */}
        <Section icon={Bell} title="Notifications" sub="Choose when and how we contact you" color="bg-indigo-500">
          <ToggleRow
            label="New booking received"
            hint="Get notified when a client books your service"
            checked={notif.newBooking}
            onChange={(v) => setNotif((n) => ({ ...n, newBooking: v }))}
          />
          <ToggleRow
            label="Booking cancellation"
            hint="Alert when a client cancels a confirmed booking"
            checked={notif.bookingCancel}
            onChange={(v) => setNotif((n) => ({ ...n, bookingCancel: v }))}
          />
          <ToggleRow
            label="New review posted"
            hint="Be notified when clients leave a review"
            checked={notif.newReview}
            onChange={(v) => setNotif((n) => ({ ...n, newReview: v }))}
          />
          <ToggleRow
            label="Payout sent"
            hint="Confirmation when funds are transferred to your bank"
            checked={notif.payoutSent}
            onChange={(v) => setNotif((n) => ({ ...n, payoutSent: v }))}
          />
          <div className="border-t border-[--border] pt-4 space-y-4">
            <ToggleRow
              label="SMS alerts"
              hint="Receive critical alerts via text message"
              checked={notif.smsAlerts}
              onChange={(v) => setNotif((n) => ({ ...n, smsAlerts: v }))}
            />
            <ToggleRow
              label="Push notifications"
              hint="Browser and mobile push notifications"
              checked={notif.pushNotif}
              onChange={(v) => setNotif((n) => ({ ...n, pushNotif: v }))}
            />
            <ToggleRow
              label="Marketing & tips emails"
              hint="Product updates, tips to grow your bookings"
              checked={notif.marketingEmail}
              onChange={(v) => setNotif((n) => ({ ...n, marketingEmail: v }))}
            />
          </div>
        </Section>

        {/* ── Security ─────────────────────────────────────────── */}
        <Section icon={Lock} title="Security" sub="Keep your account protected" color="bg-violet-500">
          <ToggleRow
            label="Two-factor authentication"
            hint="Add an extra layer of security to your login"
            checked={twoFA}
            onChange={setTwoFA}
          />
          {twoFA && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700 flex items-start gap-2"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-indigo-500" />
              2FA is enabled. We will send a code to your registered phone number on each login.
            </motion.div>
          )}

          <div className="border-t border-[--border] pt-5 space-y-4">
            <p className="text-sm font-semibold text-[--text-1]">Change Password</p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className={inp}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-4] hover:text-[--text-2]"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <input type="password" placeholder="New password" value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} className={inp} />
              <input type="password" placeholder="Confirm new password" value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} className={inp} />
              <button
                onClick={() => toast({ title: "Password updated", variant: "success" })}
                className="rounded-xl border border-[--border] px-4 py-2 text-sm font-semibold text-[--text-2] hover:bg-[--bg-muted] transition-colors"
              >
                Update password
              </button>
            </div>
          </div>
        </Section>

        {/* ── Payout settings ──────────────────────────────────── */}
        <Section icon={CreditCard} title="Payout Settings" sub="Bank details for receiving your earnings" color="bg-emerald-500">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-[--text-1]">Account holder name</label>
              <input className={inp} value={payout.accountName}
                onChange={(e) => setPayout((p) => ({ ...p, accountName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[--text-1]">Sort code</label>
              <input className={inp} value={payout.sortCode} placeholder="00-00-00"
                onChange={(e) => setPayout((p) => ({ ...p, sortCode: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[--text-1]">Account number</label>
              <input className={inp} value={payout.accountNumber}
                onChange={(e) => setPayout((p) => ({ ...p, accountNumber: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[--text-1]">Payout schedule</label>
            <select
              value={payout.schedule}
              onChange={(e) => setPayout((p) => ({ ...p, schedule: e.target.value }))}
              className={inp + " cursor-pointer"}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly (every Monday)</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly (1st of month)</option>
            </select>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            Your bank details are encrypted and stored securely. We never share them with third parties.
          </div>
        </Section>

        {/* ── Privacy ──────────────────────────────────────────── */}
        <Section icon={Shield} title="Privacy" sub="Control how your data is used" color="bg-rose-500">
          <ToggleRow
            label="Show profile in search results"
            hint="Let clients find you via EventSphere search"
            checked={true}
            onChange={() => {}}
          />
          <ToggleRow
            label="Allow review responses"
            hint="Respond publicly to client reviews"
            checked={true}
            onChange={() => {}}
          />
          <div className="border-t border-[--border] pt-4">
            <button
              onClick={() => toast({ title: "Request submitted", description: "We will process your request within 30 days.", variant: "default" })}
              className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Request account deletion
            </button>
            <p className="text-xs text-[--text-4] mt-2">This will permanently delete your account and all associated data.</p>
          </div>
        </Section>

        {/* ── Mobile app ───────────────────────────────────────── */}
        <Section icon={Smartphone} title="Mobile App" sub="Manage your business on the go" color="bg-sky-500">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[--text-1]">EventSphere Supplier App</p>
              <p className="text-xs text-[--text-3] mt-1">Manage bookings, chat with clients, and track earnings from your phone.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-[--border] px-4 py-2.5 text-sm font-semibold text-[--text-1] hover:bg-[--bg-muted] transition-colors">
              App Store
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-[--border] px-4 py-2.5 text-sm font-semibold text-[--text-1] hover:bg-[--bg-muted] transition-colors">
              Google Play
            </button>
          </div>
        </Section>

        {/* Save */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:opacity-90 transition-all disabled:opacity-60"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>

      </main>
    </div>
  );
}
