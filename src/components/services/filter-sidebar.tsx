"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Zap, BadgeCheck } from "lucide-react";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

/* ─── Types ───────────────────────────────────────────────── */
export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  instantBook: boolean;
  verified: boolean;
  areas: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  instantBook: false,
  verified: false,
  areas: [],
};

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

/* ─── Data ────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "Catering",      emoji: "🍽️", count: 1 },
  { id: "Photography",   emoji: "📸", count: 1 },
  { id: "Décor",         emoji: "🌸", count: 1 },
  { id: "AV & Lighting", emoji: "🔊", count: 1 },
  { id: "Venue",         emoji: "🏛️", count: 1 },
  { id: "Bakery",        emoji: "🎂", count: 1 },
];

const PRICE_PRESETS = [
  { label: `Under ${CURRENCY_SYMBOL}500`,  min: 0,    max: 500   },
  { label: `${CURRENCY_SYMBOL}500–2k`,     min: 500,  max: 2000  },
  { label: `${CURRENCY_SYMBOL}2k–5k`,      min: 2000, max: 5000  },
  { label: `${CURRENCY_SYMBOL}5k+`,        min: 5000, max: 10000 },
];

const LONDON_AREAS = [
  "Mayfair", "Shoreditch", "Chelsea", "Canary Wharf",
  "Notting Hill", "Hackney", "Brixton", "Kensington",
];

const RATING_OPTIONS = [
  { value: 4.5, label: "4.5★ & above", stars: 4 },
  { value: 4.0, label: "4.0★ & above", stars: 4 },
  { value: 3.5, label: "3.5★ & above", stars: 3 },
];

/* ─── Applied filter tag ──────────────────────────────────── */
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1 rounded-full border border-[#6366f1]/30 bg-[#eef2ff] px-2.5 py-1 text-[11px] font-medium text-[#4f46e5] dark:bg-[#1e1b4b] dark:border-[#6366f1]/40"
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-[#6366f1]/20 transition-colors"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </motion.span>
  );
}

/* ─── FilterSidebar ───────────────────────────────────────── */
export function FilterSidebar({ filters, onChange, resultCount }: FilterSidebarProps) {
  const activeCount =
    filters.categories.length +
    filters.areas.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.instantBook ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0);

  /* Build applied-filter tag list */
  const appliedTags: { key: string; label: string; remove: () => void }[] = [
    ...filters.categories.map((c) => ({
      key: `cat-${c}`,
      label: c,
      remove: () => onChange({ ...filters, categories: filters.categories.filter((x) => x !== c) }),
    })),
    ...filters.areas.map((a) => ({
      key: `area-${a}`,
      label: a,
      remove: () => onChange({ ...filters, areas: filters.areas.filter((x) => x !== a) }),
    })),
    ...(filters.minRating > 0
      ? [{ key: "rating", label: `${filters.minRating}★+`, remove: () => onChange({ ...filters, minRating: 0 }) }]
      : []),
    ...(filters.instantBook
      ? [{ key: "instant", label: "Instant Book", remove: () => onChange({ ...filters, instantBook: false }) }]
      : []),
    ...(filters.verified
      ? [{ key: "verified", label: "Verified", remove: () => onChange({ ...filters, verified: false }) }]
      : []),
    ...(filters.minPrice > 0 || filters.maxPrice < 10000
      ? [{
          key: "price",
          label: `${CURRENCY_SYMBOL}${filters.minPrice.toLocaleString()}–${
            filters.maxPrice >= 10000 ? "10k+" : CURRENCY_SYMBOL + filters.maxPrice.toLocaleString()
          }`,
          remove: () => onChange({ ...filters, minPrice: 0, maxPrice: 10000 }),
        }]
      : []),
  ];

  function toggleCategory(id: string) {
    onChange({
      ...filters,
      categories: filters.categories.includes(id)
        ? filters.categories.filter((c) => c !== id)
        : [...filters.categories, id],
    });
  }

  function toggleArea(area: string) {
    onChange({
      ...filters,
      areas: filters.areas.includes(area)
        ? filters.areas.filter((a) => a !== area)
        : [...filters.areas, area],
    });
  }

  const isPricePresetActive = (p: typeof PRICE_PRESETS[0]) =>
    filters.minPrice === p.min && filters.maxPrice === p.max;

  return (
    <div className="w-full">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[--text-1]">Filters</span>
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6366f1] px-1.5 text-[10px] font-bold text-white"
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              onClick={() => onChange({ ...DEFAULT_FILTERS })}
              className="text-xs font-semibold text-[#6366f1] hover:text-[#4f46e5] transition-colors underline underline-offset-2"
            >
              Reset all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Applied filter tags ──────────────────────────── */}
      <AnimatePresence>
        {appliedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-5"
          >
            <div className="flex flex-wrap gap-1.5 pb-4 border-b border-[--border-subtle]">
              <AnimatePresence>
                {appliedTags.map((tag) => (
                  <FilterTag key={tag.key} label={tag.label} onRemove={tag.remove} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result count pill ────────────────────────────── */}
      <motion.div
        layout
        className="mb-5 flex items-center justify-center gap-1.5 rounded-xl bg-[--bg-subtle] px-4 py-2.5"
      >
        <motion.span
          key={resultCount}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-bold text-[--text-1] tabular-nums"
        >
          {resultCount}
        </motion.span>
        <span className="text-xs text-[--text-4]">
          {resultCount === 1 ? "service" : "services"} match
        </span>
      </motion.div>

      {/* ── Accordion sections ───────────────────────────── */}
      <Accordion type="multiple" defaultValue={["categories", "price", "rating"]} className="space-y-0">

        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger>
            <span className="text-sm font-semibold text-[--text-1]">Category</span>
            {filters.categories.length > 0 && (
              <span className="ml-auto mr-2 text-[10px] font-bold text-[#6366f1]">
                {filters.categories.length} selected
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {CATEGORIES.map(({ id, emoji, count }) => (
                <label
                  key={id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2.5 py-2 cursor-pointer transition-colors duration-100",
                    filters.categories.includes(id)
                      ? "bg-[#eef2ff] dark:bg-[#1e1b4b]"
                      : "hover:bg-[--bg-subtle]"
                  )}
                >
                  <Checkbox
                    checked={filters.categories.includes(id)}
                    onCheckedChange={() => toggleCategory(id)}
                  />
                  <span className="text-sm leading-none">{emoji}</span>
                  <span className={cn(
                    "flex-1 text-sm transition-colors",
                    filters.categories.includes(id) ? "font-semibold text-[#4f46e5]" : "text-[--text-2]"
                  )}>
                    {id}
                  </span>
                  <span className="text-xs text-[--text-4] tabular-nums">{count}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price range */}
        <AccordionItem value="price">
          <AccordionTrigger>
            <span className="text-sm font-semibold text-[--text-1]">Price range</span>
            {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
              <span className="ml-auto mr-2 text-[10px] font-bold text-[#6366f1]">
                {CURRENCY_SYMBOL}{filters.minPrice.toLocaleString()}–{filters.maxPrice >= 10000 ? "10k+" : CURRENCY_SYMBOL + filters.maxPrice.toLocaleString()}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-5">
              {/* Preset buttons */}
              <div className="grid grid-cols-2 gap-2">
                {PRICE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      if (isPricePresetActive(p)) {
                        onChange({ ...filters, minPrice: 0, maxPrice: 10000 });
                      } else {
                        onChange({ ...filters, minPrice: p.min, maxPrice: p.max });
                      }
                    }}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-150",
                      isPricePresetActive(p)
                        ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5] dark:bg-[#1e1b4b]"
                        : "border-[--border] text-[--text-3] hover:border-[#6366f1]/40 hover:text-[--text-1]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="px-1">
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => onChange({ ...filters, minPrice: min, maxPrice: max })}
                />
                <div className="mt-3 flex justify-between">
                  <div className="rounded-lg border border-[--border] bg-[--bg-subtle] px-3 py-1.5 text-center">
                    <p className="text-[9px] text-[--text-4] uppercase tracking-wider mb-0.5">Min</p>
                    <p className="text-xs font-bold text-[--text-1] tabular-nums">
                      {CURRENCY_SYMBOL}{filters.minPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center text-[--text-4]">—</div>
                  <div className="rounded-lg border border-[--border] bg-[--bg-subtle] px-3 py-1.5 text-center">
                    <p className="text-[9px] text-[--text-4] uppercase tracking-wider mb-0.5">Max</p>
                    <p className="text-xs font-bold text-[--text-1] tabular-nums">
                      {filters.maxPrice >= 10000 ? `${CURRENCY_SYMBOL}10k+` : `${CURRENCY_SYMBOL}${filters.maxPrice.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>
            <span className="text-sm font-semibold text-[--text-1]">Rating</span>
            {filters.minRating > 0 && (
              <span className="ml-auto mr-2 text-[10px] font-bold text-[#6366f1]">{filters.minRating}★+</span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {RATING_OPTIONS.map(({ value, label, stars }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...filters, minRating: filters.minRating === value ? 0 : value })}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                    filters.minRating === value
                      ? "bg-[#eef2ff] dark:bg-[#1e1b4b]"
                      : "hover:bg-[--bg-subtle]"
                  )}
                >
                  <div className="flex gap-px">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-3.5 w-3.5 transition-colors",
                          s <= stars ? "fill-amber-400 text-amber-400" : "text-[--border] fill-[--bg-muted]"
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    "text-sm transition-colors",
                    filters.minRating === value ? "font-semibold text-[#4f46e5]" : "text-[--text-2]"
                  )}>
                    {label}
                  </span>
                  {filters.minRating === value && (
                    <X className="ml-auto h-3.5 w-3.5 text-[#6366f1]" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Options */}
        <AccordionItem value="options">
          <AccordionTrigger>
            <span className="text-sm font-semibold text-[--text-1]">Options</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              <label className={cn(
                "flex items-center gap-3 rounded-xl px-2.5 py-2.5 cursor-pointer transition-colors duration-100",
                filters.instantBook ? "bg-[#eef2ff] dark:bg-[#1e1b4b]" : "hover:bg-[--bg-subtle]"
              )}>
                <Checkbox
                  checked={filters.instantBook}
                  onCheckedChange={(c) => onChange({ ...filters, instantBook: !!c })}
                />
                <Zap className={cn("h-4 w-4 shrink-0", filters.instantBook ? "text-[#6366f1]" : "text-[--text-4]")} />
                <div>
                  <p className={cn("text-sm", filters.instantBook ? "font-semibold text-[#4f46e5]" : "text-[--text-2]")}>
                    Instant Book
                  </p>
                  <p className="text-xs text-[--text-4] mt-0.5">Confirm without waiting</p>
                </div>
              </label>

              <label className={cn(
                "flex items-center gap-3 rounded-xl px-2.5 py-2.5 cursor-pointer transition-colors duration-100",
                filters.verified ? "bg-[#eef2ff] dark:bg-[#1e1b4b]" : "hover:bg-[--bg-subtle]"
              )}>
                <Checkbox
                  checked={filters.verified}
                  onCheckedChange={(c) => onChange({ ...filters, verified: !!c })}
                />
                <BadgeCheck className={cn("h-4 w-4 shrink-0", filters.verified ? "text-[#6366f1]" : "text-[--text-4]")} />
                <div>
                  <p className={cn("text-sm", filters.verified ? "font-semibold text-[#4f46e5]" : "text-[--text-2]")}>
                    Verified suppliers
                  </p>
                  <p className="text-xs text-[--text-4] mt-0.5">ID checked &amp; background verified</p>
                </div>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* London area */}
        <AccordionItem value="areas">
          <AccordionTrigger>
            <span className="text-sm font-semibold text-[--text-1]">London area</span>
            {filters.areas.length > 0 && (
              <span className="ml-auto mr-2 text-[10px] font-bold text-[#6366f1]">
                {filters.areas.length} selected
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {LONDON_AREAS.map((area) => (
                <motion.button
                  key={area}
                  onClick={() => toggleArea(area)}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                    filters.areas.includes(area)
                      ? "border-[#6366f1] bg-[#eef2ff] text-[#4f46e5] shadow-[0_0_0_1px_#6366f1] dark:bg-[#1e1b4b]"
                      : "border-[--border] text-[--text-3] hover:border-[#6366f1]/40 hover:text-[--text-1]"
                  )}
                >
                  {area}
                </motion.button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
