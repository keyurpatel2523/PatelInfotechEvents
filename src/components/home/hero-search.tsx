"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CalendarDays, ChevronDown, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

/* ─── Service categories ──────────────────────────────────── */
const SERVICE_TYPES = [
  { id: "catering",     label: "Catering",        emoji: "🍽️" },
  { id: "photography",  label: "Photography",      emoji: "📸" },
  { id: "dj",           label: "DJ & Music",       emoji: "🎵" },
  { id: "venue",        label: "Venues",           emoji: "🏛️" },
  { id: "decor",        label: "Décor & Floral",   emoji: "🌸" },
  { id: "wedding",      label: "Wedding",          emoji: "💍" },
  { id: "av",           label: "AV & Lighting",    emoji: "💡" },
  { id: "kids",         label: "Kids & Family",    emoji: "🎈" },
];

/* ─── London area suggestions ─────────────────────────────── */
const LONDON_AREAS = [
  "Mayfair", "Shoreditch", "Canary Wharf", "Chelsea",
  "Notting Hill", "Brixton", "Kensington", "Hackney",
  "Richmond", "Greenwich",
];

/* ─── Field wrapper ───────────────────────────────────────── */
function FieldDivider() {
  return <div className="hidden md:block h-8 w-px bg-white/20 shrink-0" />;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

function Field({ label, children, active, className }: FieldProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center px-5 py-3 md:py-0 min-h-[56px]",
        "rounded-2xl md:rounded-none transition-colors duration-150",
        active ? "bg-white/10" : "hover:bg-white/5",
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60 leading-none mb-1">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ─── HeroSearch ──────────────────────────────────────────── */
export function HeroSearch({ className }: { className?: string }) {
  const [serviceOpen, setServiceOpen] = React.useState(false);
  const [locationOpen, setLocationOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [location, setLocation] = React.useState("");
  const [date, setDate] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const locationRef = React.useRef<HTMLInputElement>(null);

  const filteredAreas = LONDON_AREAS.filter((a) =>
    a.toLowerCase().includes(location.toLowerCase()) && location.length > 0
  );

  const selectedServiceObj = SERVICE_TYPES.find((s) => s.id === selectedService);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className={cn("w-full max-w-4xl", className)}>
      {/* Search pill */}
      <div
        className={cn(
          "relative z-10",
          "flex flex-col md:flex-row md:items-center",
          "rounded-2xl md:rounded-full",
          "bg-white/10 backdrop-blur-xl",
          "border border-white/20",
          "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
          "overflow-visible",
          "divide-y divide-white/10 md:divide-y-0"
        )}
      >
        {/* Service type */}
        <PopoverPrimitive.Root open={serviceOpen} onOpenChange={setServiceOpen}>
          <PopoverPrimitive.Trigger asChild>
            <button className="flex-1 text-left focus:outline-none">
              <Field label="Service Type" active={serviceOpen} className="md:rounded-l-full">
                <div className="flex items-center gap-2">
                  {selectedServiceObj ? (
                    <>
                      <span className="text-base leading-none">{selectedServiceObj.emoji}</span>
                      <span className="text-sm font-semibold text-white leading-none">
                        {selectedServiceObj.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService("");
                        }}
                        className="ml-auto text-white/50 hover:text-white transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-white/60 leading-none">Any service</span>
                      <ChevronDown className="h-3.5 w-3.5 text-white/40 ml-auto" />
                    </>
                  )}
                </div>
              </Field>
            </button>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              sideOffset={12}
              align="start"
              className={cn(
                "z-[9999] w-72 rounded-2xl border border-[--border]",
                "bg-[--bg] shadow-[var(--shadow-xl)]",
                "p-3",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "origin-top-left"
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[--text-4] px-1 mb-2">
                Browse categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {SERVICE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedService(type.id);
                      setServiceOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left",
                      "transition-all duration-150",
                      selectedService === type.id
                        ? "bg-[#eef2ff] text-[#4f46e5]"
                        : "hover:bg-[--bg-muted] text-[--text-2]"
                    )}
                  >
                    <span className="text-lg leading-none">{type.emoji}</span>
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        <FieldDivider />

        {/* Location */}
        <div className="flex-1 relative">
          <Field label="Location" active={locationOpen}>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-white/50 shrink-0" />
              <input
                ref={locationRef}
                type="text"
                placeholder="London area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setLocationOpen(true)}
                onBlur={() => setTimeout(() => setLocationOpen(false), 150)}
                className={cn(
                  "w-full bg-transparent text-sm font-medium text-white leading-none",
                  "placeholder:text-white/40 focus:outline-none"
                )}
              />
              {location && (
                <button
                  onClick={() => setLocation("")}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </Field>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {locationOpen && filteredAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute left-0 top-full mt-2 z-[9999] w-64",
                  "rounded-2xl border border-[--border] bg-[--bg]",
                  "shadow-[var(--shadow-xl)] overflow-hidden py-2"
                )}
              >
                {filteredAreas.map((area) => (
                  <button
                    key={area}
                    onMouseDown={() => {
                      setLocation(area);
                      setLocationOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1] transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[--text-4]" />
                    {area}, London
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <FieldDivider />

        {/* Date */}
        <div className="flex-1">
          <Field label="Date">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-white/50 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={cn(
                  "w-full bg-transparent text-sm font-medium leading-none",
                  "focus:outline-none",
                  date ? "text-white" : "text-white/40",
                  "[color-scheme:dark]"
                )}
              />
            </div>
          </Field>
        </div>

        {/* Search button */}
        <div className="p-2 md:p-1.5">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={cn(
              "flex w-full md:w-auto items-center justify-center gap-2.5",
              "rounded-xl md:rounded-full",
              "bg-white px-6 py-3.5 md:h-[44px]",
              "text-sm font-bold text-[#4338ca]",
              "shadow-[0_2px_12px_rgba(0,0,0,0.2)]",
              "hover:bg-white/95 active:scale-[0.98]",
              "transition-all duration-150 disabled:opacity-70"
            )}
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Popular searches */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/50">Popular:</span>
        {["Wedding Caterer", "Event Photographer", "DJ London", "Venue Hire"].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedService("")}
            className={cn(
              "rounded-full border border-white/20 bg-white/10 px-3 py-1",
              "text-xs text-white/70 hover:bg-white/20 hover:text-white",
              "transition-all duration-150 backdrop-blur-sm"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
