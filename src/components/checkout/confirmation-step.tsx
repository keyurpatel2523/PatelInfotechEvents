"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  CalendarDays, Clock, Users, Package2,
  Mail, Phone, Download, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/constants";
import type { ServiceCardData } from "@/components/marketplace/service-card";
import type { BookingDetails, PricingBreakdown } from "@/types/booking";

/* ─── Animated checkmark SVG ─────────────────────────────── */
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      className="relative mx-auto flex h-24 w-24 items-center justify-center"
    >
      {/* Outer ring pulse */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0.6 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute inset-0 rounded-full bg-green-400"
      />
      {/* Circle */}
      <div className="relative h-24 w-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_8px_32px_rgba(34,197,94,0.4)]">
        <svg
          viewBox="0 0 52 52"
          className="h-12 w-12"
          fill="none"
        >
          <motion.path
            d="M14 26 L22 34 L38 18"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

/* ─── Detail row ─────────────────────────────────────────── */
function ConfirmRow({
  icon,
  label,
  value,
}: {
  icon:  React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[--border] last:border-0">
      <div className="h-8 w-8 rounded-xl bg-[--bg-muted] flex items-center justify-center text-[--text-3] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[--text-4]">
          {label}
        </p>
        <p className="text-sm font-medium text-[--text-1]">{value}</p>
      </div>
    </div>
  );
}

/* ─── Props ──────────────────────────────────────────────── */
interface ConfirmationStepProps {
  service:   ServiceCardData;
  details:   BookingDetails;
  pricing:   PricingBreakdown;
  bookingId: string;
}

export function ConfirmationStep({
  service,
  details,
  pricing,
  bookingId,
}: ConfirmationStepProps) {
  const formattedDate = details.date
    ? format(parseISO(details.date), "EEEE, d MMMM yyyy")
    : "—";

  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
  const containerVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08, delayChildren: 0.6 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-lg mx-auto text-center space-y-8"
    >
      {/* ── Checkmark ────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <AnimatedCheckmark />
      </motion.div>

      {/* ── Heading ──────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold text-[--text-1]">Booking Confirmed! 🎉</h1>
        <p className="text-[--text-3] leading-relaxed">
          You&apos;re all set. A confirmation email has been sent with full details.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-[--border] bg-[--bg-subtle] px-4 py-2 mt-2">
          <span className="text-xs text-[--text-3]">Booking reference</span>
          <span className="text-sm font-bold text-[--text-1] font-mono">{bookingId}</span>
        </div>
      </motion.div>

      {/* ── Service card ─────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[--border] bg-[--bg] overflow-hidden text-left shadow-[var(--shadow-md)]"
      >
        {/* Service image */}
        <div className="relative aspect-video w-full">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-0.5">
              {service.category}
            </p>
            <h3 className="text-sm font-bold text-white leading-snug">{service.title}</h3>
          </div>
        </div>

        {/* Booking details */}
        <div className="px-5 py-4">
          <ConfirmRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Date"
            value={formattedDate}
          />
          <ConfirmRow
            icon={<Clock className="h-4 w-4" />}
            label="Start time"
            value={details.timeSlot}
          />
          <ConfirmRow
            icon={<Users className="h-4 w-4" />}
            label="Guests"
            value={`${details.guestCount} guests`}
          />
          <ConfirmRow
            icon={<Package2 className="h-4 w-4" />}
            label="Package"
            value={details.packageLabel}
          />
        </div>

        {/* Total */}
        <div className="mx-5 mb-5 flex items-center justify-between rounded-xl bg-[--bg-subtle] border border-[--border] px-4 py-3">
          <span className="text-sm font-semibold text-[--text-2]">Total paid</span>
          <span className="text-lg font-bold text-[--text-1] tabular-nums">
            {formatCurrency(pricing.total)}
          </span>
        </div>
      </motion.div>

      {/* ── Supplier contact ──────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[--border] bg-[--bg] p-5 text-left"
      >
        <h3 className="text-sm font-bold text-[--text-1] mb-3">Your supplier</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-[#eef2ff] flex items-center justify-center text-sm font-bold text-[#6366f1] shrink-0">
            {service.supplier.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[--text-1]">{service.supplier.name}</p>
            <p className="text-xs text-[--text-3]">Verified supplier · Typically responds within 1 hour</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="mailto:supplier@eventsphere.co.uk"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[--border] py-2.5",
              "text-sm font-medium text-[--text-2] hover:border-[#6366f1] hover:text-[#6366f1] transition-colors",
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
          <a
            href="tel:+442071234567"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[--border] py-2.5",
              "text-sm font-medium text-[--text-2] hover:border-[#6366f1] hover:text-[#6366f1] transition-colors",
            )}
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
        </div>
      </motion.div>

      {/* ── CTAs ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <Link
          href="/bookings"
          className={cn(
            "flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white",
            "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
            "shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.5)]",
            "transition-all duration-150",
          )}
        >
          View My Bookings
          <ArrowRight className="h-4 w-4" />
        </Link>

        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-2 rounded-2xl border border-[--border] py-4",
            "text-sm font-semibold text-[--text-2] hover:border-[--text-3] hover:text-[--text-1]",
            "transition-all duration-150",
          )}
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </button>

        <Link
          href="/services"
          className="text-sm text-[--text-3] hover:text-[#6366f1] transition-colors"
        >
          ← Back to all services
        </Link>
      </motion.div>
    </motion.div>
  );
}
