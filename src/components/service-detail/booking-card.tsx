"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CalendarDays, Users, Shield, Zap,
  MessageCircle, Star, CheckCircle2, ChevronDown,
  Info,
} from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { PackageOption } from "@/lib/mock-service-details";

interface BookingCardProps {
  basePrice: number;
  rating: number;
  reviewCount: number;
  packages: PackageOption[];
  responseTime: string;
  instantBook: boolean;
  supplierId: string;
}

/* ─── Animated number ─────────────────────────────────────── */
function AnimatedPrice({ value }: { value: number }) {
  const [displayed, setDisplayed] = React.useState(value);
  const [animating, setAnimating] = React.useState(false);
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    if (value === displayed) return;
    if (prefersReduced) { setDisplayed(value); return; }
    setAnimating(true);
    const timer = setTimeout(() => {
      setDisplayed(value);
      setAnimating(false);
    }, 80);
    return () => clearTimeout(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={displayed}
        initial={{ opacity: 0, y: animating ? -12 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="text-[2rem] font-bold tracking-tight text-[--text-1] leading-none"
      >
        {CURRENCY_SYMBOL}{displayed.toLocaleString()}
      </motion.span>
    </AnimatePresence>
  );
}

/* ─── Package tab ─────────────────────────────────────────── */
function PackageTab({
  pkg,
  selected,
  onSelect,
}: {
  pkg: PackageOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className={cn(
        "relative flex-1 rounded-xl border px-3 py-2.5 text-center focus:outline-none",
        selected
          ? "border-[#6366f1] bg-[#eef2ff] dark:bg-[#1e1b4b]"
          : "border-[--border] bg-transparent hover:border-[#6366f1]/40 hover:bg-[--bg-subtle]"
      )}
      style={{ transition: "border-color 0.15s, background-color 0.15s" }}
    >
      {pkg.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#6366f1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          Popular
        </span>
      )}
      <p className={cn("text-xs font-semibold leading-none mb-1", selected ? "text-[#4f46e5]" : "text-[--text-1]")}>
        {pkg.label}
      </p>
      <p className={cn("text-xs font-bold tabular-nums", selected ? "text-[#4f46e5]" : "text-[--text-2]")}>
        {CURRENCY_SYMBOL}{pkg.price.toLocaleString()}
      </p>
    </motion.button>
  );
}

/* ─── BookingCard ─────────────────────────────────────────── */
export function BookingCard({
  basePrice,
  rating,
  reviewCount,
  packages,
  responseTime,
  instantBook,
}: BookingCardProps) {
  const [selectedId, setSelectedId] = React.useState(
    packages.find((p) => p.popular)?.id ?? packages[0]?.id
  );
  const [guests, setGuests] = React.useState(50);
  const [date, setDate] = React.useState("");
  const [booked, setBooked] = React.useState(false);
  const [showFeeInfo, setShowFeeInfo] = React.useState(false);

  const pkg = packages.find((p) => p.id === selectedId) ?? packages[0];
  const serviceFee = Math.round(pkg.price * 0.05);
  const total = pkg.price + serviceFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 }}
      whileHover={{ y: -2, boxShadow: "0 16px 56px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.08)" }}
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
      className={cn(
        "rounded-3xl border border-[--border] overflow-hidden",
        "bg-[--bg]",
      )}
    >

      {/* ── Header ──────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-5">
        {/* Price + rating row */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <AnimatedPrice value={pkg.price} />
              <span className="text-sm text-[--text-3] font-normal">{pkg.unit}</span>
            </div>
            {pkg.price !== basePrice && (
              <p className="text-xs text-[--text-4] mt-1">
                Base from {CURRENCY_SYMBOL}{basePrice.toLocaleString()}
              </p>
            )}
          </div>
          <a
            href="#reviews"
            className="flex items-center gap-1.5 group"
          >
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-[--text-1] group-hover:underline">{rating}</span>
            <span className="text-sm text-[--text-3] group-hover:underline">· {reviewCount} reviews</span>
          </a>
        </div>

        {/* Free cancellation callout */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Free cancellation up to 14 days before event
        </motion.div>
      </div>

      <div className="px-6 pb-6 space-y-4">

        {/* ── Package tabs ─────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[--text-4] mb-2">
            Package
          </p>
          <div className="flex gap-2">
            {packages.map((p) => (
              <PackageTab
                key={p.id}
                pkg={p}
                selected={selectedId === p.id}
                onSelect={() => setSelectedId(p.id)}
              />
            ))}
          </div>
          {/* Package highlights */}
          <AnimatePresence mode="wait">
            <motion.ul
              key={selectedId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-1.5"
            >
              {pkg.highlights.slice(0, 3).map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="flex items-center gap-2 text-xs text-[--text-3]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                  {h}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* ── Airbnb-style date + guests block ─────────── */}
        <div className="rounded-2xl border-2 border-[--border] overflow-hidden transition-colors duration-200 focus-within:border-[#6366f1]/60">
          {/* Date row */}
          <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[--bg-subtle] transition-colors text-left border-b border-[--border] focus:outline-none">
                <CalendarDays className="h-4 w-4 text-[--text-3] shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[--text-4] leading-none mb-1">
                    Event date
                  </p>
                  <p className={cn("text-sm font-semibold leading-none", date ? "text-[--text-1]" : "text-[--text-3]")}>
                    {date
                      ? new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })
                      : "Add date"}
                  </p>
                </div>
                <motion.span
                  animate={{ rotate: 0 }}
                  className="ml-auto"
                >
                  <ChevronDown className="h-4 w-4 text-[--text-3]" />
                </motion.span>
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                sideOffset={6}
                align="start"
                className={cn(
                  "z-50 w-80 rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-xl)] p-5",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                  "origin-top-left duration-150"
                )}
              >
                <p className="text-sm font-semibold text-[--text-1] mb-4">When is your event?</p>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[--border] bg-[--bg-subtle] px-4 py-3 text-sm text-[--text-1] focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-shadow"
                />
                <p className="mt-3 text-xs text-[--text-4]">
                  Minimum booking notice: 4 weeks in advance
                </p>
                {date && (
                  <button
                    onClick={() => setDate("")}
                    className="mt-3 text-xs text-[#6366f1] hover:underline"
                  >
                    Clear date
                  </button>
                )}
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>

          {/* Guests row */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Users className="h-4 w-4 text-[--text-3] shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[--text-4] leading-none mb-1">
                Guests
              </p>
              <p className="text-sm font-semibold text-[--text-1] leading-none">{guests} guests</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setGuests(Math.max(10, guests - 10))}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.1 }}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[--border] text-sm font-medium text-[--text-2] hover:border-[--text-3] hover:bg-[--bg-muted] transition-colors"
                aria-label="Decrease guests"
              >
                −
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={guests}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="w-8 text-center text-sm font-semibold text-[--text-1] tabular-nums select-none"
                >
                  {guests}
                </motion.span>
              </AnimatePresence>
              <motion.button
                onClick={() => setGuests(guests + 10)}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.1 }}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[--border] text-sm font-medium text-[--text-2] hover:border-[--text-3] hover:bg-[--bg-muted] transition-colors"
                aria-label="Increase guests"
              >
                +
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {booked ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="text-2xl mb-2"
              >
                ✓
              </motion.div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Enquiry sent!
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                The supplier will respond {responseTime.toLowerCase()}.
              </p>
            </motion.div>
          ) : (
            <motion.div key="cta" className="space-y-2.5">
              <motion.button
                onClick={() => setBooked(true)}
                whileHover={{ scale: 1.015, boxShadow: "0 8px 28px rgba(99,102,241,0.52)" }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "w-full rounded-2xl py-4 text-base font-semibold text-white",
                  "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
                  "shadow-[0_4px_20px_rgba(99,102,241,0.4)]",
                  "flex items-center justify-center gap-2",
                )}
              >
                {instantBook ? (
                  <><Zap className="h-4 w-4" /> Book Instantly</>
                ) : (
                  "Request to Book"
                )}
              </motion.button>
              <Button variant="outline" size="lg" className="w-full rounded-2xl">
                <MessageCircle className="h-4 w-4" />
                Contact Supplier
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-[--text-4]">You won&apos;t be charged yet</p>

        {/* ── Price breakdown ───────────────────────────── */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[--text-2] underline underline-offset-2 decoration-dotted cursor-help">
              {CURRENCY_SYMBOL}{pkg.price.toLocaleString()} × {pkg.unit}
            </span>
            <motion.span
              key={pkg.price}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-[--text-2] tabular-nums"
            >
              {CURRENCY_SYMBOL}{pkg.price.toLocaleString()}
            </motion.span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => setShowFeeInfo((v) => !v)}
              className="flex items-center gap-1.5 text-[--text-2] underline underline-offset-2 decoration-dotted hover:text-[--text-1] transition-colors"
            >
              EventSphere service fee
              <motion.span
                animate={{ rotate: showFeeInfo ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Info className="h-3.5 w-3.5 text-[--text-4]" />
              </motion.span>
            </button>
            <motion.span
              key={serviceFee}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-[--text-2] tabular-nums"
            >
              {CURRENCY_SYMBOL}{serviceFee.toLocaleString()}
            </motion.span>
          </div>
          <AnimatePresence>
            {showFeeInfo && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-xs text-[--text-4] bg-[--bg-subtle] rounded-xl px-3 py-2.5 overflow-hidden"
              >
                This fee helps us run EventSphere and offer 24/7 support. It covers fraud protection, dispute resolution, and booking guarantees.
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between pt-3 border-t border-[--border]">
            <span className="text-sm font-bold text-[--text-1]">Total</span>
            <motion.span
              key={total}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, type: "spring", stiffness: 260, damping: 22 }}
              className="text-base font-bold text-[--text-1] tabular-nums"
            >
              {CURRENCY_SYMBOL}{total.toLocaleString()}
            </motion.span>
          </div>
        </div>

        {/* ── Trust strip ───────────────────────────────── */}
        <div className="space-y-2.5 pt-1 border-t border-[--border-subtle]">
          <div className="flex items-start gap-2.5 text-xs text-[--text-3]">
            <Shield className="h-4 w-4 text-[#6366f1] shrink-0 mt-px" />
            <span>
              <strong className="text-[--text-2] font-semibold">EventSphere Guarantee</strong> — full refund if the supplier cancels.
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[--text-3]">
            <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Supplier responds <strong className="text-[--text-2] font-medium">{responseTime.toLowerCase()}</strong></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
