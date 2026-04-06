"use client";

/**
 * AvailabilityCalendar — Supplier-side calendar for managing availability.
 *
 * States per day:
 *   available   → white / default
 *   unavailable → gray (supplier blocked — click to toggle)
 *   booked      → red  (confirmed booking — read-only)
 *
 * Interactions:
 *   • Click an available day   → marks unavailable
 *   • Click an unavailable day → marks available
 *   • Booked days are non-interactive
 *   • Month navigation arrows
 *   • Bulk-select mode (hold Shift + click to range-select)
 *   • "Save" persists to Firestore via PATCH /api/availability/[supplierId]
 */

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isToday,
  isBefore,
  startOfToday,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, Loader2, Wifi, WifiOff, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailabilityListener } from "@/lib/hooks/use-availability-listener";
import { dateKey, getDateStatus, type DateStatus } from "@/lib/availability-firestore";

/* ── Constants ───────────────────────────────────────────────── */
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* Monday-first grid padding: Mon=0, Tue=1, ... Sun=6 */
function gridOffset(date: Date): number {
  return (getDay(date) + 6) % 7;
}

/* ── Legend dot ──────────────────────────────────────────────── */
function LegendDot({ status, label }: { status: DateStatus; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full shrink-0",
          status === "available"   && "bg-gray-200 border border-gray-300",
          status === "unavailable" && "bg-gray-300",
          status === "booked"      && "bg-red-400",
        )}
      />
      {label}
    </span>
  );
}

/* ── Day cell ────────────────────────────────────────────────── */
interface DayCellProps {
  date:        Date;
  status:      DateStatus;
  inMonth:     boolean;
  isPast:      boolean;
  isSelected:  boolean;
  rangeStart:  boolean;
  onPointerDown: (date: Date, e: React.PointerEvent) => void;
  onPointerEnter: (date: Date) => void;
}

function DayCell({
  date, status, inMonth, isPast, isSelected,
  rangeStart, onPointerDown, onPointerEnter,
}: DayCellProps) {
  const today    = isToday(date);
  const isBooked = status === "booked";
  const isUnavailable = status === "unavailable";
  const interactive = inMonth && !isPast && !isBooked;

  return (
    <motion.button
      type="button"
      disabled={!interactive}
      onPointerDown={(e) => interactive && onPointerDown(date, e)}
      onPointerEnter={() => interactive && onPointerEnter(date)}
      whileTap={interactive ? { scale: 0.88 } : {}}
      transition={{ duration: 0.1 }}
      className={cn(
        "relative h-9 w-full rounded-lg text-[13px] font-medium transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
        /* Out-of-month */
        !inMonth && "opacity-0 pointer-events-none",
        /* Past */
        inMonth && isPast && "text-gray-300 cursor-not-allowed",
        /* Booked — red, non-interactive */
        inMonth && !isPast && isBooked &&
          "bg-red-50 text-red-500 font-semibold cursor-default ring-1 ring-red-200",
        /* Unavailable — gray with stripe */
        inMonth && !isPast && isUnavailable && !isBooked &&
          "bg-gray-100 text-gray-400 hover:bg-gray-200",
        /* Available */
        inMonth && !isPast && !isBooked && !isUnavailable &&
          "text-gray-800 hover:bg-indigo-50 hover:text-indigo-700",
        /* Today ring */
        today && !isBooked && "ring-2 ring-indigo-400 ring-offset-1",
        /* Bulk-selection highlight */
        isSelected && !isBooked && "bg-indigo-100 text-indigo-700",
        rangeStart && "ring-2 ring-indigo-500",
      )}
    >
      {date.getDate()}
      {isBooked && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-400" />
      )}
    </motion.button>
  );
}

/* ── Main component ──────────────────────────────────────────── */
interface AvailabilityCalendarProps {
  supplierId: string;
}

export function AvailabilityCalendar({ supplierId }: AvailabilityCalendarProps) {
  const { availability, status: connStatus } = useAvailabilityListener(supplierId);

  /* Local copy of unavailableDates — only this changes via interaction */
  const [localUnavailable, setLocalUnavailable] = React.useState<string[]>([]);
  const [month,    setMonth]    = React.useState(new Date());
  const [saving,   setSaving]   = React.useState(false);
  const [saveMsg,  setSaveMsg]  = React.useState<{ ok: boolean; text: string } | null>(null);
  const [dirty,    setDirty]    = React.useState(false);

  /* Range-select state */
  const [rangeStart, setRangeStart] = React.useState<Date | null>(null);
  const [rangeEnd,   setRangeEnd]   = React.useState<Date | null>(null);

  /* Sync when listener fires (e.g. first load or another tab saves) */
  React.useEffect(() => {
    setLocalUnavailable(availability.unavailableDates);
    setDirty(false);
  }, [availability.unavailableDates]);

  /* ── Calendar grid ─────────────────────────────────────────── */
  const today  = startOfToday();
  const start  = startOfMonth(month);
  const end    = endOfMonth(month);
  const days   = eachDayOfInterval({ start, end });
  const offset = gridOffset(start); // empty leading cells

  /* 6 × 7 = 42 cells. Pad start + fill remaining to complete last row */
  const totalCells = Math.ceil((offset + days.length) / 7) * 7;
  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...days,
    ...Array(totalCells - offset - days.length).fill(null),
  ];

  /* ── Interaction: click to toggle ──────────────────────────── */
  function toggleDate(date: Date) {
    const key = dateKey(date);
    setLocalUnavailable((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
    );
    setDirty(true);
  }

  /* ── Interaction: shift+drag range select ──────────────────── */
  function handlePointerDown(date: Date, e: React.PointerEvent) {
    if (e.shiftKey && rangeStart) {
      /* Complete range */
      const [a, b] = rangeStart <= date
        ? [rangeStart, date]
        : [date, rangeStart];
      const range = eachDayOfInterval({ start: a, end: b });
      const keys  = range.map(dateKey);
      const bookedKeys = new Set(availability.bookedDates);

      /* Decide: if majority are available → block all; else unblock all */
      const availCount = keys.filter(
        (k) => !localUnavailable.includes(k) && !bookedKeys.has(k),
      ).length;
      const shouldBlock = availCount >= keys.length / 2;

      setLocalUnavailable((prev) => {
        const filtered = prev.filter((k) => !keys.includes(k) || bookedKeys.has(k));
        return shouldBlock
          ? [...filtered, ...keys.filter((k) => !bookedKeys.has(k))]
          : filtered;
      });
      setRangeStart(null);
      setRangeEnd(null);
      setDirty(true);
    } else {
      /* Start a new range or single toggle */
      setRangeStart(date);
      setRangeEnd(null);
      toggleDate(date);
    }
  }

  function handlePointerEnter(date: Date) {
    if (rangeStart) setRangeEnd(date);
  }

  /* ── Highlight range preview ───────────────────────────────── */
  function isInRange(date: Date): boolean {
    if (!rangeStart || !rangeEnd) return false;
    const [a, b] = rangeStart <= rangeEnd ? [rangeStart, rangeEnd] : [rangeEnd, rangeStart];
    return date >= a && date <= b;
  }

  /* ── Save ──────────────────────────────────────────────────── */
  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/availability/${supplierId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ unavailableDates: localUnavailable }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaveMsg({ ok: true, text: "Availability saved" });
      setDirty(false);
    } catch {
      setSaveMsg({ ok: false, text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 3500);
    }
  }

  /* ── Stats for toolbar ─────────────────────────────────────── */
  const unavailCount = localUnavailable.length;
  const bookedCount  = availability.bookedDates.length;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[12px]">
            <span className="text-gray-500">
              <span className="font-semibold text-gray-800 tabular-nums">{unavailCount}</span> blocked
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-red-500">
              <span className="font-semibold tabular-nums">{bookedCount}</span> booked
            </span>
          </div>

          {/* Connection status */}
          {connStatus === "live" && (
            <span className="flex items-center gap-1 text-[11px] text-green-600">
              <Wifi className="h-3 w-3" /> Live
            </span>
          )}
          {connStatus === "offline" && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save message */}
          <AnimatePresence>
            {saveMsg && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className={cn(
                  "text-[12px] font-medium",
                  saveMsg.ok ? "text-green-600" : "text-red-500",
                )}
              >
                {saveMsg.text}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors",
              dirty && !saving
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed",
            )}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* ── Month header ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <AnimatePresence mode="wait">
          <motion.h2
            key={format(month, "yyyy-MM")}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="text-[15px] font-bold text-gray-900"
          >
            {format(month, "MMMM yyyy")}
          </motion.h2>
        </AnimatePresence>

        <button
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* ── Day-of-week labels ───────────────────────────────── */}
      <div className="grid grid-cols-7 px-4 pb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ───────────────────────────────────── */}
      <div
        className="grid grid-cols-7 gap-1 px-4 pb-5 select-none"
        onPointerUp={() => { setRangeStart(null); setRangeEnd(null); }}
      >
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} />;
          }
          const status   = getDateStatus(date, {
            unavailableDates: localUnavailable,
            bookedDates:      availability.bookedDates,
          });
          const isPast = isBefore(date, today);
          const inMonth = isSameMonth(date, month);

          return (
            <DayCell
              key={dateKey(date)}
              date={date}
              status={status}
              inMonth={inMonth}
              isPast={isPast}
              isSelected={isInRange(date)}
              rangeStart={rangeStart ? isSameDay(date, rangeStart) : false}
              onPointerDown={handlePointerDown}
              onPointerEnter={handlePointerEnter}
            />
          );
        })}
      </div>

      {/* ── Legend ──────────────────────────────────────────── */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LegendDot status="available"   label="Available" />
          <LegendDot status="unavailable" label="Unavailable" />
          <LegendDot status="booked"      label="Booked" />
        </div>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Info className="h-3 w-3" />
          Shift+click to range-select
        </span>
      </div>
    </div>
  );
}
