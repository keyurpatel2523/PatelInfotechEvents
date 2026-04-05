"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Star, Zap, BadgeCheck, PoundSterling } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { FilterState } from "./filter-sidebar";

interface FilterChipsProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onOpenSidebar: () => void;
  sidebarOpen: boolean;
}

const CATEGORIES = ["Catering", "Photography", "Décor", "AV & Lighting", "Venue", "Bakery"];

interface QuickChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onToggle: () => void;
}

export function FilterChips({ filters, onChange, onOpenSidebar, sidebarOpen }: FilterChipsProps) {
  const quickChips: QuickChip[] = [
    {
      id: "instant",
      label: "Instant Book",
      icon: <Zap className="h-3 w-3" />,
      active: filters.instantBook,
      onToggle: () => onChange({ ...filters, instantBook: !filters.instantBook }),
    },
    {
      id: "rating",
      label: "Top Rated",
      icon: <Star className="h-3 w-3" />,
      active: filters.minRating >= 4,
      onToggle: () => onChange({ ...filters, minRating: filters.minRating >= 4 ? 0 : 4 }),
    },
    {
      id: "verified",
      label: "Verified",
      icon: <BadgeCheck className="h-3 w-3" />,
      active: filters.verified,
      onToggle: () => onChange({ ...filters, verified: !filters.verified }),
    },
    {
      id: "budget",
      label: `Under ${CURRENCY_SYMBOL}1k`,
      icon: <PoundSterling className="h-3 w-3" />,
      active: filters.maxPrice <= 1000,
      onToggle: () => onChange({ ...filters, maxPrice: filters.maxPrice <= 1000 ? 10000 : 1000 }),
    },
  ];

  const activeCount =
    (filters.instantBook ? 1 : 0) +
    (filters.minRating >= 4 ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.maxPrice <= 1000 ? 1 : 0) +
    filters.categories.length +
    filters.areas.length +
    (filters.minPrice > 0 || (filters.maxPrice < 10000 && filters.maxPrice > 1000) ? 1 : 0);

  return (
    <div className="relative flex items-center gap-0 overflow-hidden">
      {/* Left gradient fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-[--bg] to-transparent" />
      {/* Right gradient fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[--bg] to-transparent" />

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 py-0.5">
        {/* ── Filters toggle button ────────────────────── */}
        <motion.button
          onClick={onOpenSidebar}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "relative shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-150",
            sidebarOpen || activeCount > 0
              ? "border-[#6366f1] bg-[#6366f1] text-white shadow-[0_2px_8px_rgba(99,102,241,0.35)]"
              : "border-[--border] text-[--text-2] bg-[--bg] hover:border-[--text-3] hover:text-[--text-1]"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/30 px-1 text-[9px] font-bold text-white"
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* ── Separator ───────────────────────────────── */}
        <div className="h-5 w-px shrink-0 bg-[--border]" />

        {/* ── Category tabs ────────────────────────────── */}
        {CATEGORIES.map((cat) => {
          const isActive = filters.categories.includes(cat);
          return (
            <motion.button
              key={cat}
              layout
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.1 }}
              onClick={() => {
                onChange({
                  ...filters,
                  categories: isActive
                    ? filters.categories.filter((c) => c !== cat)
                    : [...filters.categories, cat],
                });
              }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-150",
                isActive
                  ? "border-[--text-1] bg-[--text-1] text-[--bg]"
                  : "border-[--border] text-[--text-2] bg-[--bg] hover:border-[--text-3] hover:text-[--text-1]"
              )}
            >
              {cat}
            </motion.button>
          );
        })}

        {/* ── Separator ───────────────────────────────── */}
        <div className="h-5 w-px shrink-0 bg-[--border]" />

        {/* ── Quick filter chips ───────────────────────── */}
        {quickChips.map((chip) => (
          <motion.button
            key={chip.id}
            layout
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.1 }}
            onClick={chip.onToggle}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-150",
              chip.active
                ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5] dark:bg-[#1e1b4b]"
                : "border-[--border] text-[--text-2] bg-[--bg] hover:border-[#6366f1]/40 hover:text-[--text-1]"
            )}
          >
            <span className={cn(chip.active ? "text-[#6366f1]" : "text-[--text-4]")}>
              {chip.icon}
            </span>
            {chip.label}
            <AnimatePresence>
              {chip.active && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden flex"
                >
                  <X className="h-3 w-3 text-[#6366f1]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
