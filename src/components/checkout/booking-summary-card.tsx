"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, CalendarDays, Clock, Users, Package } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/constants";
import type { ServiceCardData } from "@/components/marketplace/service-card";
import type { PricingBreakdown, BookingDetails, AddOnItem } from "@/types/booking";

interface BookingSummaryCardProps {
  service:  ServiceCardData;
  details:  Partial<BookingDetails>;
  pricing:  PricingBreakdown | null;
  step:     number;
}

function FlipNumber({ value }: { value: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 8,    opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="tabular-nums"
      >
        {formatCurrency(value)}
      </motion.span>
    </AnimatePresence>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <span className="mt-0.5 shrink-0 text-[--text-4]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[--text-4] leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-[--text-1] leading-snug">{value}</p>
      </div>
    </div>
  );
}

export function BookingSummaryCard({
  service,
  details,
  pricing,
  step,
}: BookingSummaryCardProps) {
  const selectedAddOns: AddOnItem[] = (details.addOns ?? []).filter((a) => a.selected);
  const hasDetails = details.date && details.timeSlot && details.packageLabel;

  return (
    <div className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-md)] overflow-hidden">

      {/* ── Service image + header ─────────────────────────── */}
      <div className="relative aspect-video w-full overflow-hidden bg-[--bg-muted]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="400px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-1">
            {service.category}
          </p>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            {service.title}
          </h3>
        </div>
      </div>

      {/* ── Supplier + rating ────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[--border]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full bg-[#eef2ff] flex items-center justify-center text-[10px] font-bold text-[#6366f1] shrink-0">
            {service.supplier.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[--text-1] truncate">{service.supplier.name}</p>
            <p className="text-[10px] text-[--text-3] flex items-center gap-0.5">
              {service.supplier.verified && (
                <CheckCircle2 className="h-2.5 w-2.5 text-[#6366f1]" />
              )}
              Verified supplier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-[--text-1]">{service.rating.toFixed(1)}</span>
          <span className="text-[10px] text-[--text-4]">({service.reviewCount})</span>
        </div>
      </div>

      {/* ── Booking details ──────────────────────────────── */}
      <AnimatePresence>
        {hasDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-3 border-b border-[--border] space-y-3"
          >
            <SummaryRow
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Date"
              value={details.date
                ? format(parseISO(details.date), "EEEE, d MMM yyyy")
                : "—"}
            />
            <SummaryRow
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Time"
              value={details.timeSlot ?? "—"}
            />
            <SummaryRow
              icon={<Users className="h-3.5 w-3.5" />}
              label="Guests"
              value={details.guestCount ? `${details.guestCount} guests` : "—"}
            />
            <SummaryRow
              icon={<Package className="h-3.5 w-3.5" />}
              label="Package"
              value={details.packageLabel ?? "—"}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pricing breakdown ────────────────────────────── */}
      <AnimatePresence>
        {pricing && step >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-3 space-y-2"
          >
            {/* Package price */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[--text-3]">
                {details.packageLabel ?? "Package"}
              </span>
              <span className="text-[--text-1] font-medium">
                {formatCurrency(pricing.packagePrice)}
              </span>
            </div>

            {/* Add-ons */}
            {selectedAddOns.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-[--text-3]">{a.label}</span>
                <span className="text-[--text-1] font-medium">
                  {formatCurrency(a.price)}
                </span>
              </div>
            ))}

            {/* Service fee */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[--text-3]">
                Service fee ({Math.round(pricing.serviceFeeRate * 100)}%)
              </span>
              <span className="text-[--text-1] font-medium">
                {formatCurrency(pricing.serviceFee)}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-[--border] my-1" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[--text-1]">Total</span>
              <span className="text-lg font-bold text-[--text-1]">
                <FlipNumber value={pricing.total} />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trust badges ─────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-[--border] flex items-center justify-center gap-4">
        {["Free cancellation", "Secure payment", "24/7 support"].map((badge) => (
          <div key={badge} className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
            <span className="text-[10px] text-[--text-3]">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
