"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CalendarDays, X, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  location: string;
  onLocationChange: (l: string) => void;
  date: string;
  onDateChange: (d: string) => void;
  serviceType: string;
  onServiceTypeChange: (t: string) => void;
  isSticky: boolean;
}

const SERVICE_TYPES = [
  { value: "All Services",  emoji: "✨" },
  { value: "Catering",      emoji: "🍽️" },
  { value: "Photography",   emoji: "📸" },
  { value: "Décor",         emoji: "🌸" },
  { value: "AV & Lighting", emoji: "🔊" },
  { value: "Venue",         emoji: "🏛️" },
  { value: "Bakery",        emoji: "🎂" },
];

const LONDON_SUGGESTIONS = [
  "Mayfair", "Shoreditch", "Chelsea", "Canary Wharf",
  "Notting Hill", "Hackney", "Brixton", "Kensington",
];

/* ─── Field segment ───────────────────────────────────────── */
function Segment({
  label,
  active,
  onClick,
  className,
  children,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col justify-center px-5 py-3 cursor-pointer transition-colors duration-150",
        "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
        active && "bg-white dark:bg-zinc-900 rounded-full shadow-[0_2px_16px_rgba(0,0,0,0.10)]",
        className
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-[--text-1] leading-none mb-1 select-none">
        {label}
      </span>
      {children}
    </div>
  );
}

export function SearchBar({
  query, onQueryChange,
  location, onLocationChange,
  date, onDateChange,
  serviceType, onServiceTypeChange,
  isSticky,
}: SearchBarProps) {
  const [activeField, setActiveField] = React.useState<string | null>(null);
  const [showServiceMenu, setShowServiceMenu] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const queryRef    = React.useRef<HTMLInputElement>(null);
  const locationRef = React.useRef<HTMLInputElement>(null);

  const filteredSuggestions = location.length > 0
    ? LONDON_SUGGESTIONS.filter((s) => s.toLowerCase().includes(location.toLowerCase()))
    : LONDON_SUGGESTIONS;

  const currentType = SERVICE_TYPES.find((t) => t.value === serviceType) ?? SERVICE_TYPES[0];

  function blur() {
    setActiveField(null);
    setShowServiceMenu(false);
    setShowSuggestions(false);
  }

  return (
    <div className={cn(
      "bg-[--bg]/95 backdrop-blur-xl border-b border-[--border] transition-all duration-200",
      isSticky ? "py-2.5" : "py-4",
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ maxWidth: isSticky ? "720px" : "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="w-full"
        >
          {/* Pill container */}
          <div
            className={cn(
              "flex items-stretch rounded-full border border-[--border] bg-[--bg-subtle]",
              "divide-x divide-[--border]",
              "shadow-[var(--shadow-sm)]",
              "hover:shadow-[var(--shadow-md)] transition-shadow duration-200",
              activeField && "border-[--text-4] shadow-[var(--shadow-lg)]"
            )}
          >
            {/* ── Service type ─────────────────────────── */}
            <div className="relative shrink-0">
              <Segment
                label="Service"
                active={activeField === "service"}
                onClick={() => {
                  setActiveField("service");
                  setShowServiceMenu((v) => !v);
                }}
                className={cn("rounded-l-full min-w-[160px]", isSticky && "hidden sm:flex")}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{currentType.emoji}</span>
                  <span className="text-sm font-semibold text-[--text-1] truncate max-w-[100px]">
                    {serviceType === "All Services" ? "Any service" : serviceType}
                  </span>
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 text-[--text-3] transition-transform duration-200",
                    showServiceMenu && "rotate-180"
                  )} />
                </div>
              </Segment>

              {/* Service dropdown */}
              <AnimatePresence>
                {showServiceMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => { setShowServiceMenu(false); setActiveField(null); }} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      className={cn(
                        "absolute top-full left-0 mt-3 z-40 w-56",
                        "rounded-2xl border border-[--border] bg-[--bg] p-2",
                        "shadow-[0_16px_48px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]"
                      )}
                    >
                      {SERVICE_TYPES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => { onServiceTypeChange(t.value); setShowServiceMenu(false); setActiveField(null); }}
                          className={cn(
                            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-100",
                            serviceType === t.value
                              ? "bg-[#eef2ff] text-[#4f46e5] font-semibold dark:bg-[#1e1b4b]"
                              : "text-[--text-2] hover:bg-[--bg-subtle] hover:text-[--text-1]"
                          )}
                        >
                          <span className="text-base leading-none">{t.emoji}</span>
                          {t.value}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* ── Keyword search ───────────────────────── */}
            <Segment
              label="What"
              active={activeField === "query"}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={queryRef}
                  type="text"
                  placeholder="Search services…"
                  value={query}
                  onFocus={() => setActiveField("query")}
                  onBlur={() => setTimeout(blur, 150)}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="w-full bg-transparent text-sm text-[--text-1] placeholder:text-[--text-4] outline-none"
                />
                <AnimatePresence>
                  {query && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      onClick={() => { onQueryChange(""); queryRef.current?.focus(); }}
                      className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[--bg-muted] text-[--text-3] hover:bg-[--border] hover:text-[--text-1] transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </Segment>

            {/* ── Location ─────────────────────────────── */}
            <div className={cn(
              "relative hidden md:block",
              isSticky && "md:hidden lg:block"
            )}>
              <Segment label="Where" active={activeField === "location"}>
                <div className="flex items-center gap-1.5 min-w-[148px]">
                  <MapPin className="h-3.5 w-3.5 text-[--text-4] shrink-0" />
                  <input
                    ref={locationRef}
                    type="text"
                    placeholder="London area"
                    value={location}
                    onFocus={() => { setActiveField("location"); setShowSuggestions(true); }}
                    onBlur={() => setTimeout(blur, 150)}
                    onChange={(e) => { onLocationChange(e.target.value); setShowSuggestions(true); }}
                    className="w-full bg-transparent text-sm text-[--text-1] placeholder:text-[--text-4] outline-none"
                  />
                  <AnimatePresence>
                    {location && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => { onLocationChange(""); locationRef.current?.focus(); }}
                        className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[--bg-muted] text-[--text-3] hover:text-[--text-1] transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </Segment>

              {/* Location autocomplete */}
              <AnimatePresence>
                {showSuggestions && activeField === "location" && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "absolute left-0 top-full mt-3 z-40 w-56",
                      "rounded-2xl border border-[--border] bg-[--bg] p-2",
                      "shadow-[0_16px_48px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]"
                    )}
                  >
                    <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[--text-4]">
                      Popular areas
                    </p>
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={() => { onLocationChange(s); setShowSuggestions(false); setActiveField(null); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[--text-2] hover:bg-[--bg-subtle] hover:text-[--text-1] transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5 text-[--text-4] shrink-0" />
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Date ─────────────────────────────────── */}
            <PopoverPrimitive.Root onOpenChange={(o) => setActiveField(o ? "date" : null)}>
              <PopoverPrimitive.Trigger asChild>
                <div className={cn("hidden lg:block cursor-pointer", isSticky && "hidden xl:block")}>
                  <Segment label="When" active={activeField === "date"}>
                    <div className="flex items-center gap-1.5 min-w-[120px]">
                      <CalendarDays className="h-3.5 w-3.5 text-[--text-4] shrink-0" />
                      <span className={cn(
                        "text-sm",
                        date ? "font-semibold text-[--text-1]" : "text-[--text-4]"
                      )}>
                        {date
                          ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                          : "Any date"}
                      </span>
                    </div>
                  </Segment>
                </div>
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  sideOffset={12}
                  align="end"
                  className={cn(
                    "z-50 w-72 rounded-2xl border border-[--border] bg-[--bg] p-5",
                    "shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "origin-top-right duration-150"
                  )}
                >
                  <p className="text-sm font-bold text-[--text-1] mb-1">When&apos;s your event?</p>
                  <p className="text-xs text-[--text-4] mb-4">Select a date to filter availability</p>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full rounded-xl border border-[--border] bg-[--bg-subtle] px-4 py-3 text-sm text-[--text-1] focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-shadow"
                  />
                  {date && (
                    <button
                      onClick={() => onDateChange("")}
                      className="mt-3 text-xs text-[#6366f1] hover:underline"
                    >
                      Clear date
                    </button>
                  )}
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>

            {/* ── Search button ────────────────────────── */}
            <div className="flex items-center p-1.5 shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.13 }}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 text-sm font-semibold text-white h-full",
                  "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
                  "shadow-[0_2px_12px_rgba(99,102,241,0.45)]",
                  "hover:shadow-[0_4px_20px_rgba(99,102,241,0.55)] transition-shadow duration-200",
                )}
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Search</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
