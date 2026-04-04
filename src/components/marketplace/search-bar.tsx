"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Tech Summit Bangalore",
  "Jazz Festival Mumbai",
  "Yoga Retreat Rishikesh",
  "Food Carnival Delhi",
  "Art Expo Chennai",
  "Startup Networking",
];

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [focused, setFocused] = React.useState<"query" | "location" | null>(null);
  const [loading, setLoading] = React.useState(false);

  const filteredSuggestions = SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <div className={cn(
        "flex items-stretch rounded-2xl border transition-all duration-200",
        "bg-[--bg] shadow-[var(--shadow-lg)]",
        focused ? "border-brand-400 ring-4 ring-brand-500/10" : "border-[--border]"
      )}>
        {/* Query field */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-[--text-3] pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, artists, venues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused("query")}
            onBlur={() => setTimeout(() => setFocused(null), 150)}
            className={cn(
              "w-full bg-transparent pl-10 pr-4 py-3.5 text-sm text-[--text-1]",
              "placeholder:text-[--text-4] focus:outline-none"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 p-1 rounded-lg text-[--text-4] hover:text-[--text-2] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px bg-[--border] my-3" />

        {/* Location field */}
        <div className="relative flex items-center min-w-[160px]">
          <MapPin className="absolute left-3 h-4 w-4 text-[--text-3] pointer-events-none" />
          <input
            type="text"
            placeholder="City or online"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setFocused("location")}
            onBlur={() => setTimeout(() => setFocused(null), 150)}
            className={cn(
              "w-full bg-transparent pl-9 pr-3 py-3.5 text-sm text-[--text-1]",
              "placeholder:text-[--text-4] focus:outline-none"
            )}
          />
        </div>

        {/* Search button */}
        <div className="p-1.5">
          <Button
            size="lg"
            onClick={handleSearch}
            loading={loading}
            className="h-full px-6 rounded-xl"
          >
            {!loading && <Search className="h-4 w-4" />}
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {focused === "query" && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-20 mt-2 w-full max-w-3xl",
              "bg-[--bg] border border-[--border] rounded-2xl",
              "shadow-[var(--shadow-xl)] overflow-hidden"
            )}
          >
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-[--text-4] uppercase tracking-wider">
                Suggestions
              </p>
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => setQuery(s)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[--text-2] hover:bg-[--bg-muted] hover:text-[--text-1] transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-[--text-4]" />
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
