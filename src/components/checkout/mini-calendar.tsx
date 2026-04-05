"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface MiniCalendarProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  minDate?: Date;
}

export function MiniCalendar({
  selected,
  onSelect,
  minDate = startOfDay(new Date()),
}: MiniCalendarProps) {
  const [viewMonth, setViewMonth] = React.useState<Date>(selected ?? new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(viewMonth),
    end:   endOfMonth(viewMonth),
  });
  const startPad = getDay(startOfMonth(viewMonth)); // 0 = Sunday

  return (
    <div className="p-4 w-72 select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[--bg-muted] text-[--text-3] hover:text-[--text-1] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-[--text-1]">
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[--bg-muted] text-[--text-3] hover:text-[--text-1] transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center text-[10px] font-semibold text-[--text-4] uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {/* Leading empty cells */}
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isPast     = isBefore(day, minDate);
          const isToday    = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(day)}
              className={cn(
                "h-8 w-8 mx-auto flex items-center justify-center rounded-full text-sm transition-all duration-150",
                isSelected && "bg-[#6366f1] text-white font-semibold shadow-sm",
                !isSelected && !isPast && isToday && "font-bold text-[#6366f1] hover:bg-[--bg-muted]",
                !isSelected && !isPast && !isToday && "text-[--text-1] hover:bg-[--bg-muted] cursor-pointer",
                isPast && "text-[--text-4] opacity-35 cursor-not-allowed",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
