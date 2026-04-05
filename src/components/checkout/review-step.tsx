"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  CalendarDays, Clock, Users, Package2,
  Info, ChevronLeft, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/constants";
import type { BookingDetails, AddOnItem, PricingBreakdown } from "@/types/booking";

/* ─── Add-on defaults ─────────────────────────────────────── */
export const DEFAULT_ADD_ONS: AddOnItem[] = [
  { id: "setup",       label: "Professional Setup & Breakdown",   price: 150,  selected: false },
  { id: "extra-hour",  label: "Extended Coverage (+2 hours)",       price: 120,  selected: false },
  { id: "photo",       label: "Event Photography Package",          price: 350,  selected: false },
  { id: "transport",   label: "London Transport & Travel",          price: 80,   selected: false },
];

/* ─── Props ──────────────────────────────────────────────── */
interface ReviewStepProps {
  details:       BookingDetails;
  addOns:        AddOnItem[];
  pricing:       PricingBreakdown;
  onAddOnToggle: (id: string) => void;
  onBack:        () => void;
  onNext:        () => void;
  loading:       boolean;
}

/* ─── Detail row ─────────────────────────────────────────── */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon:  React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-[--bg-muted] text-[--text-3] shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[--text-4]">
          {label}
        </p>
        <p className="text-sm font-medium text-[--text-1]">{value}</p>
      </div>
    </div>
  );
}

/* ─── Add-on checkbox ────────────────────────────────────── */
function AddOnCheckbox({
  item,
  onToggle,
}: {
  item:     AddOnItem;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-150",
        item.selected
          ? "border-[#6366f1] bg-[#eef2ff] dark:bg-[#1e1b4b]"
          : "border-[--border] hover:border-[--text-3]",
      )}
    >
      {/* Custom checkbox */}
      <div
        className={cn(
          "h-4.5 w-4.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
          item.selected ? "border-[#6366f1] bg-[#6366f1]" : "border-[--border]",
        )}
      >
        <AnimatePresence>
          {item.selected && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{  scale: 0, opacity: 0 }}
              transition={{ duration: 0.12 }}
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium",
          item.selected ? "text-[#4f46e5]" : "text-[--text-1]",
        )}>
          {item.label}
        </p>
      </div>

      <span className={cn(
        "text-sm font-semibold tabular-nums shrink-0",
        item.selected ? "text-[#4f46e5]" : "text-[--text-3]",
      )}>
        +{formatCurrency(item.price)}
      </span>
    </motion.button>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export function ReviewStep({
  details,
  addOns,
  pricing,
  onAddOnToggle,
  onBack,
  onNext,
  loading,
}: ReviewStepProps) {
  const formattedDate = details.date
    ? format(parseISO(details.date), "EEEE, d MMMM yyyy")
    : "—";

  return (
    <div className="space-y-7">

      {/* ── Booking summary ──────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-[--text-1] mb-3">Booking details</h2>
        <div className="rounded-2xl border border-[--border] bg-[--bg] divide-y divide-[--border] px-4">
          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Date"
            value={formattedDate}
          />
          <DetailRow
            icon={<Clock className="h-4 w-4" />}
            label="Time"
            value={details.timeSlot}
          />
          <DetailRow
            icon={<Users className="h-4 w-4" />}
            label="Guests"
            value={`${details.guestCount} guests`}
          />
          <DetailRow
            icon={<Package2 className="h-4 w-4" />}
            label="Package"
            value={details.packageLabel}
          />
        </div>
      </section>

      {/* ── Add-ons ──────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-[--text-1] mb-1">
          Enhance your experience
        </h2>
        <p className="text-sm text-[--text-3] mb-4">
          Add optional extras to make your event exceptional.
        </p>
        <div className="space-y-2">
          {addOns.map((item) => (
            <AddOnCheckbox
              key={item.id}
              item={item}
              onToggle={() => onAddOnToggle(item.id)}
            />
          ))}
        </div>
      </section>

      {/* ── Pricing breakdown ────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-[--text-1] mb-3">Price breakdown</h2>
        <div className="rounded-2xl border border-[--border] bg-[--bg] p-5 space-y-3">

          {/* Package */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[--text-2]">{details.packageLabel}</span>
            <span className="text-sm font-medium text-[--text-1] tabular-nums">
              {formatCurrency(pricing.packagePrice)}
            </span>
          </div>

          {/* Add-ons */}
          {addOns.filter((a) => a.selected).map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <span className="text-sm text-[--text-2]">{a.label}</span>
              <span className="text-sm font-medium text-[--text-1] tabular-nums">
                +{formatCurrency(a.price)}
              </span>
            </div>
          ))}

          {/* Service fee */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-[--text-2]">
              Service fee
              <Info className="h-3 w-3 text-[--text-4]" />
            </span>
            <span className="text-sm font-medium text-[--text-1] tabular-nums">
              {formatCurrency(pricing.serviceFee)}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-[--border]" />

          {/* Total */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-base font-bold text-[--text-1]">Total</span>
            <motion.span
              key={pricing.total}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              className="text-xl font-bold text-[--text-1] tabular-nums"
            >
              {formatCurrency(pricing.total)}
            </motion.span>
          </div>
        </div>
      </section>

      {/* ── Cancellation policy ──────────────────────────── */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[--border] bg-[--bg-subtle] p-4">
        <Info className="h-4 w-4 text-[--text-3] shrink-0 mt-0.5" />
        <p className="text-xs text-[--text-3] leading-relaxed">
          <span className="font-semibold text-[--text-2]">Free cancellation</span> up to 7 days before
          your event. After that, a 50% cancellation fee applies. Full details in our{" "}
          <a href="#" className="underline text-[#6366f1]">cancellation policy</a>.
        </p>
      </div>

      {/* ── Action buttons ───────────────────────────────── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className={cn(
            "flex items-center gap-1.5 rounded-2xl border border-[--border] px-5 py-4",
            "text-sm font-semibold text-[--text-2] hover:border-[--text-3] hover:text-[--text-1]",
            "transition-all duration-150 disabled:opacity-40",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={loading}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white",
            "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
            "shadow-[0_4px_20px_rgba(99,102,241,0.4)]",
            "hover:shadow-[0_6px_28px_rgba(99,102,241,0.5)] transition-all duration-150",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing payment…
            </>
          ) : (
            <>Confirm & Pay {formatCurrency(pricing.total)} →</>
          )}
        </motion.button>
      </div>
    </div>
  );
}
