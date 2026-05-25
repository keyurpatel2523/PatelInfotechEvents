"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, ChevronDown, BookOpen, Mail,
  Phone, Clock, CheckCircle2, Send, Loader2, Zap,
  AlertCircle, FileText, Video,
} from "lucide-react";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { useToastStore }  from "@/store/toast";
import { cn } from "@/lib/utils";

/* ─── FAQ data ───────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How do payouts work?",
    a: "Earnings are released 48 hours after the event date. Funds are transferred to your registered bank account on your chosen payout schedule (daily, weekly, bi-weekly, or monthly). You can change your schedule in Settings → Payout Settings.",
  },
  {
    q: "How do I dispute a booking cancellation?",
    a: "If a client cancels and you believe you are entitled to a cancellation fee, go to Bookings, select the booking, and click 'Raise Dispute'. Our team reviews disputes within 3 business days and will contact both parties.",
  },
  {
    q: "Can I pause my listing temporarily?",
    a: "Yes. Go to Services, open the three-dot menu on any listing, and select 'Pause'. Paused services are hidden from search results but no data is lost. You can reactivate them at any time.",
  },
  {
    q: "How are my ratings calculated?",
    a: "Your overall rating is the weighted average of all verified client reviews. Only clients who completed a booking can leave a review. You can respond to reviews publicly from the Reviews page.",
  },
  {
    q: "What commission does EventSphere charge?",
    a: "EventSphere charges a 12% platform fee on each confirmed booking. This is deducted automatically before your payout. There are no monthly subscription fees — you only pay when you earn.",
  },
  {
    q: "How do I update my availability?",
    a: "Visit the Availability page in the sidebar to mark dates as unavailable, set recurring blocked days, or adjust your booking lead time. Changes take effect immediately on your listing.",
  },
];

/* ─── FAQ item ───────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-[--border] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-[--text-1] hover:text-indigo-600 transition-colors"
      >
        {q}
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[--text-4] transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-[--text-3] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Quick link card ────────────────────────────────────────── */
function QuickCard({
  icon: Icon, label, desc, color, onClick,
}: {
  icon: React.ElementType; label: string; desc: string; color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-2xl border border-[--border] bg-[--bg] p-4 text-left shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-indigo-200 transition-all group"
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", color)}>
        <Icon className="h-4 w-4 text-white" />
      </span>
      <div>
        <p className="text-sm font-semibold text-[--text-1] group-hover:text-indigo-600 transition-colors">{label}</p>
        <p className="text-xs text-[--text-3] mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SupportPage() {
  const { toast } = useToastStore();
  const [sending, setSending] = React.useState(false);
  const [form, setForm] = React.useState({ subject: "", category: "general", message: "" });
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast({ title: "Please fill in all fields", variant: "default" });
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSending(false);
    setSubmitted(true);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours.", variant: "success" });
  }

  const inp = "w-full rounded-xl border border-[--border] bg-[--bg] px-3.5 py-2.5 text-sm text-[--text-1] placeholder:text-[--text-4] focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 hover:border-[--text-4] transition-all";

  return (
    <div className="flex flex-col min-h-full">
      <SupplierHeader />

      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-8 max-w-3xl">

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold text-[--text-1]">Support</h1>
          <p className="text-sm text-[--text-3] mt-0.5">We're here to help. Average response time: under 4 hours.</p>
        </div>

        {/* ── Status banner ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-sm font-medium text-emerald-800">All systems operational · Support team online Mon–Fri 8am–8pm GMT</p>
        </motion.div>

        {/* ── Quick links ──────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[--text-4] mb-3">Quick help</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickCard
              icon={BookOpen} label="Help Centre" desc="Browse guides and tutorials"
              color="bg-indigo-500"
              onClick={() => toast({ title: "Help Centre", description: "Opening documentation…", variant: "default" })}
            />
            <QuickCard
              icon={Video} label="Video tutorials" desc="Step-by-step supplier walkthroughs"
              color="bg-violet-500"
              onClick={() => toast({ title: "Video tutorials", description: "Opening tutorials…", variant: "default" })}
            />
            <QuickCard
              icon={FileText} label="Supplier agreement" desc="Review your supplier terms"
              color="bg-sky-500"
              onClick={() => toast({ title: "Supplier agreement", description: "Opening document…", variant: "default" })}
            />
            <QuickCard
              icon={AlertCircle} label="Report an issue" desc="Flag a technical problem"
              color="bg-rose-500"
              onClick={() => {
                setForm((f) => ({ ...f, category: "technical", subject: "Technical issue" }));
                document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>

        {/* ── Contact options ──────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: MessageCircle, label: "Live chat",  sub: "Usually replies in minutes", color: "text-indigo-600 bg-indigo-50" },
            { icon: Mail,          label: "Email us",   sub: "support@eventsphere.co.uk",   color: "text-violet-600 bg-violet-50" },
            { icon: Phone,         label: "Call us",    sub: "+44 20 7946 0800",             color: "text-emerald-600 bg-emerald-50" },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="rounded-2xl border border-[--border] bg-[--bg] p-4 shadow-[var(--shadow-sm)] text-center">
              <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-2xl mb-3", color)}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-[--text-1]">{label}</p>
              <p className="text-xs text-[--text-3] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Contact form ─────────────────────────────────────── */}
        <div id="contact-form" className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[--border]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500">
              <Send className="h-4 w-4 text-white" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[--text-1]">Send a message</h2>
              <p className="text-xs text-[--text-3]">We reply to all messages within 24 hours</p>
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-12 flex flex-col items-center text-center"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-[--text-1]">Message sent!</h3>
              <p className="text-sm text-[--text-3] mt-1 max-w-xs">
                Our support team will get back to you at <span className="font-medium text-[--text-1]">james@mayfaircatering.co.uk</span> within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ subject: "", category: "general", message: "" }); }}
                className="mt-5 text-sm font-semibold text-indigo-600 hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[--text-1]">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={inp + " cursor-pointer"}
                  >
                    <option value="general">General enquiry</option>
                    <option value="booking">Booking issue</option>
                    <option value="payout">Payout / billing</option>
                    <option value="technical">Technical problem</option>
                    <option value="account">Account & profile</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[--text-1]">Subject</label>
                  <input
                    className={inp}
                    placeholder="Brief description of your issue"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[--text-1]">Message</label>
                <textarea
                  rows={5}
                  className={inp + " resize-none"}
                  placeholder="Describe your issue in as much detail as possible…"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-sm hover:opacity-90 transition-all disabled:opacity-60"
              >
                {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send message</>}
              </button>
            </form>
          )}
        </div>

        {/* ── FAQs ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[--border]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500">
              <Zap className="h-4 w-4 text-white" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[--text-1]">Frequently asked questions</h2>
              <p className="text-xs text-[--text-3]">Quick answers to common queries</p>
            </div>
          </div>
          <div className="px-6">
            {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>

        {/* ── Response time note ───────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-[--text-4] pb-4">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          Support hours: Monday–Friday, 8am–8pm GMT. Messages outside these hours are answered next business day.
        </div>

      </main>
    </div>
  );
}
