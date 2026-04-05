"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { CalendarDays, ChevronDown, Minus, Plus, Sparkles, Check } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/constants";
import { MiniCalendar } from "./mini-calendar";
import type { BookingDetails, CheckoutPackage } from "@/types/booking";

/* ─── Time slots ─────────────────────────────────────────── */
const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM",
];

/* ─── Props ──────────────────────────────────────────────── */
interface BookingDetailsStepProps {
  packages:   CheckoutPackage[];
  priceUnit:  string;
  details:    Partial<BookingDetails>;
  onChange:   (patch: Partial<BookingDetails>) => void;
  onNext:     () => void;
  errors:     Record<string, string>;
}

/* ─── Section heading ────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-[--text-1] mb-4">{children}</h2>
  );
}

/* ─── Package card ───────────────────────────────────────── */
function PackageCard({
  pkg,
  selected,
  priceUnit,
  onSelect,
}: {
  pkg:      CheckoutPackage;
  selected: boolean;
  priceUnit: string;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={cn(
        "relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-150",
        selected
          ? "border-[#6366f1] bg-[#eef2ff] dark:bg-[#1e1b4b]"
          : "border-[--border] bg-[--bg] hover:border-[--text-3]",
      )}
    >
      {pkg.popular && (
        <span className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full bg-[#6366f1] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          <Sparkles className="h-2.5 w-2.5" />
          Most Popular
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn(
            "text-sm font-bold mb-0.5",
            selected ? "text-[#4f46e5]" : "text-[--text-1]",
          )}>
            {pkg.label}
          </p>
          <p className="text-xs text-[--text-3] leading-snug">{pkg.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={cn("text-sm font-bold tabular-nums", selected ? "text-[#4f46e5]" : "text-[--text-1]")}>
            {formatCurrency(pkg.price)}
          </p>
          <p className="text-[10px] text-[--text-4]">/{priceUnit}</p>
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-3 right-3">
          <div className="h-5 w-5 rounded-full bg-[#6366f1] flex items-center justify-center">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        </div>
      )}
    </motion.button>
  );
}

/* ─── Guest counter ──────────────────────────────────────── */
function GuestCounter({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className={cn(
          "h-9 w-9 rounded-full border border-[--border] flex items-center justify-center transition-all",
          "hover:border-[--text-3] hover:text-[--text-1] disabled:opacity-30 disabled:cursor-not-allowed",
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <motion.span
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        className="w-12 text-center text-xl font-bold text-[--text-1] tabular-nums"
      >
        {value}
      </motion.span>
      <button
        type="button"
        onClick={() => onChange(Math.min(500, value + 1))}
        disabled={value >= 500}
        className={cn(
          "h-9 w-9 rounded-full border border-[--border] flex items-center justify-center transition-all",
          "hover:border-[--text-3] hover:text-[--text-1] disabled:opacity-30 disabled:cursor-not-allowed",
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <span className="text-sm text-[--text-3]">guests</span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export function BookingDetailsStep({
  packages,
  priceUnit,
  details,
  onChange,
  onNext,
  errors,
}: BookingDetailsStepProps) {
  const [calOpen, setCalOpen] = React.useState(false);

  const selectedDate   = details.date ? parseISO(details.date) : null;
  const selectedPkgId  = details.packageId ?? packages[1]?.id ?? "";

  const isValid =
    !!details.date &&
    !!details.timeSlot &&
    !!details.packageId;

  return (
    <div className="space-y-8">

      {/* ── Package selection ────────────────────────────── */}
      <section>
        <SectionHeading>Choose your package</SectionHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              priceUnit={priceUnit}
              selected={pkg.id === selectedPkgId}
              onSelect={() =>
                onChange({
                  packageId:    pkg.id,
                  packageLabel: pkg.label,
                  packagePrice: pkg.price,
                })
              }
            />
          ))}
        </div>
      </section>

      {/* ── Date picker ─────────────────────────────────── */}
      <section>
        <SectionHeading>Event date</SectionHeading>
        <Popover.Root open={calOpen} onOpenChange={setCalOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150",
                calOpen
                  ? "border-[#6366f1] ring-2 ring-[#6366f1]/20"
                  : errors.date
                  ? "border-red-400 ring-2 ring-red-400/20"
                  : "border-[--border] hover:border-[--text-3]",
              )}
            >
              <CalendarDays className="h-4 w-4 shrink-0 text-[--text-3]" />
              <span
                className={cn(
                  "flex-1 text-sm",
                  selectedDate ? "font-medium text-[--text-1]" : "text-[--text-4]",
                )}
              >
                {selectedDate
                  ? format(selectedDate, "EEEE, d MMMM yyyy")
                  : "Select a date"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[--text-4] transition-transform duration-200",
                  calOpen && "rotate-180",
                )}
              />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={8}
              className={cn(
                "z-50 rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-xl)]",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              )}
            >
              <MiniCalendar
                selected={selectedDate}
                onSelect={(d) => {
                  onChange({ date: format(d, "yyyy-MM-dd") });
                  setCalOpen(false);
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {errors.date && (
          <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>
        )}
      </section>

      {/* ── Time selection ──────────────────────────────── */}
      <section>
        <SectionHeading>Preferred start time</SectionHeading>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const active = details.timeSlot === slot;
            return (
              <motion.button
                key={slot}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange({ timeSlot: slot })}
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5] dark:bg-[#1e1b4b]"
                    : "border-[--border] text-[--text-2] hover:border-[--text-3] hover:text-[--text-1]",
                )}
              >
                {slot}
              </motion.button>
            );
          })}
        </div>
        {errors.timeSlot && (
          <p className="mt-1.5 text-xs text-red-500">{errors.timeSlot}</p>
        )}
      </section>

      {/* ── Guest count ─────────────────────────────────── */}
      <section>
        <SectionHeading>Number of guests</SectionHeading>
        <div className="rounded-2xl border border-[--border] p-4">
          <GuestCounter
            value={details.guestCount ?? 50}
            onChange={(n) => onChange({ guestCount: n })}
          />
          <p className="mt-2 text-xs text-[--text-4]">
            Minimum 10 guests · Maximum 500 guests
          </p>
        </div>
      </section>

      {/* ── Notes ───────────────────────────────────────── */}
      <section>
        <SectionHeading>Special requests <span className="text-[--text-4] font-normal text-sm">(optional)</span></SectionHeading>
        <textarea
          rows={3}
          placeholder="Dietary requirements, theme, setup preferences, access needs…"
          value={details.notes ?? ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          className={cn(
            "w-full rounded-2xl border border-[--border] bg-[--bg] px-4 py-3 text-sm text-[--text-1]",
            "placeholder:text-[--text-4] resize-none",
            "focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]",
            "transition-all duration-150",
          )}
        />
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        disabled={!isValid}
        className={cn(
          "w-full rounded-2xl py-4 text-sm font-bold text-white transition-all duration-150",
          "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
          "shadow-[0_4px_20px_rgba(99,102,241,0.4)]",
          "hover:shadow-[0_6px_28px_rgba(99,102,241,0.5)]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
        )}
      >
        Continue to Review →
      </motion.button>
    </div>
  );
}
