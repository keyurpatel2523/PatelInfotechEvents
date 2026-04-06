"use client";

/**
 * BookingDatePicker — Customer-facing date picker embedded in BookingCard.
 *
 * Fetches availability for the given supplierId on mount, then shows a
 * month calendar with three visual states:
 *   available   → selectable (indigo on hover / when selected)
 *   unavailable → gray, disabled
 *   booked      → red, disabled
 *   past        → muted, disabled
 *
 * The parent receives the selected date as an ISO string "yyyy-MM-dd".
 * Before the user can proceed to checkout, the booking-create API performs
 * a Firestore transaction as the final atomic double-booking guard.
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
  addWeeks,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { dateKey, getDateStatus, emptyRecord, type AvailabilityRecord } from "@/lib/availability-firestore";

/* ── Constants ───────────────────────────────────────────────── */
const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MIN_NOTICE_WEEKS = 4; // minimum booking notice

function gridOffset(date: Date): number {
  return (getDay(date) + 6) % 7;
}

/* ── Day cell (customer — read-only statuses) ────────────────── */
interface CustomerDayProps {
  date:        Date;
  record:      AvailabilityRecord;
  selected:    boolean;
  minDate:     Date;
  inMonth:     boolean;
  onSelect:    (date: Date) => void;
}

function CustomerDay({ date, record, selected, minDate, inMonth, onSelect }: CustomerDayProps) {
  const status  = getDateStatus(date, record);
  const isPast  = isBefore(date, minDate);
  const today   = isToday(date);
  const available = status === "available" && !isPast && inMonth;

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => available && onSelect(date)}
      className={cn(
        "h-9 w-full rounded-xl text-[13px] font-medium transition-all duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
        !inMonth && "opacity-0 pointer-events-none",
        /* Past */
        inMonth && isPast && "text-gray-300 cursor-not-allowed",
        /* Booked */
        inMonth && !isPast && status === "booked" &&
          "bg-red-50 text-red-400 cursor-not-allowed line-through decoration-red-300",
        /* Unavailable */
        inMonth && !isPast && status === "unavailable" &&
          "bg-gray-100 text-gray-400 cursor-not-allowed",
        /* Available unselected */
        available && !selected && "text-gray-800 hover:bg-indigo-50 hover:text-indigo-700",
        /* Available selected */
        available && selected &&
          "bg-indigo-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.45)]",
        /* Today ring */
        today && !selected && status === "available" && "ring-2 ring-indigo-300 ring-offset-1",
      )}
    >
      {date.getDate()}
    </button>
  );
}

/* ── Props ───────────────────────────────────────────────────── */
export interface BookingDatePickerProps {
  supplierId:    string;
  selectedDate:  string;                     // "yyyy-MM-dd" or ""
  onDateChange:  (date: string) => void;
}

/* ── Component ───────────────────────────────────────────────── */
export function BookingDatePicker({
  supplierId,
  selectedDate,
  onDateChange,
}: BookingDatePickerProps) {
  const [month,   setMonth]   = React.useState(new Date());
  const [record,  setRecord]  = React.useState<AvailabilityRecord>(emptyRecord(supplierId));
  const [loading, setLoading] = React.useState(true);

  /* Minimum selectable date = today + MIN_NOTICE_WEEKS */
  const minDate = addWeeks(startOfToday(), MIN_NOTICE_WEEKS);

  /* Fetch availability on mount */
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/availability/${supplierId}`)
      .then((r) => r.json())
      .then((json: { availability?: AvailabilityRecord }) => {
        if (!cancelled && json.availability) setRecord(json.availability);
      })
      .catch(() => { /* keep empty record — all available */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [supplierId]);

  /* ── Calendar grid ──────────────────────────────────────────── */
  const start  = startOfMonth(month);
  const end    = endOfMonth(month);
  const days   = eachDayOfInterval({ start, end });
  const offset = gridOffset(start);
  const totalCells = Math.ceil((offset + days.length) / 7) * 7;
  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...days,
    ...Array(totalCells - offset - days.length).fill(null),
  ];

  const selectedDate_ = selectedDate
    ? new Date(selectedDate + "T12:00:00")
    : null;

  return (
    <div className="w-full">
      {/* ── Month header ────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
        </button>

        <AnimatePresence mode="wait">
          <motion.span
            key={format(month, "yyyy-MM")}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.14 }}
            className="text-[13px] font-bold text-gray-900"
          >
            {format(month, "MMMM yyyy")}
          </motion.span>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
        </button>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading availability…
        </div>
      ) : (
        <>
          {/* ── Day-of-week header ──────────────────────────── */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* ── Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((date, idx) => {
              if (!date) return <div key={`e-${idx}`} />;
              const sel = selectedDate_
                ? isSameDay(date, selectedDate_)
                : false;
              return (
                <CustomerDay
                  key={dateKey(date)}
                  date={date}
                  record={record}
                  selected={sel}
                  minDate={minDate}
                  inMonth={isSameMonth(date, month)}
                  onSelect={(d) => onDateChange(dateKey(d))}
                />
              );
            })}
          </div>

          {/* ── Legend ──────────────────────────────────────── */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="h-2 w-2 rounded-full bg-gray-200 border border-gray-300" />
              Available
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="h-2 w-2 rounded-full bg-gray-200" />
              Unavailable
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="h-2 w-2 rounded-full bg-red-300" />
              Booked
            </span>
          </div>

          <p className="mt-2 text-[10px] text-gray-400">
            Minimum {MIN_NOTICE_WEEKS} weeks notice required.
          </p>
        </>
      )}
    </div>
  );
}
