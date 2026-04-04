"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion } from "framer-motion";
import { Grid3X3, List, ArrowUpDown } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/marketplace/search-bar";
import { CategoryFilter } from "@/components/marketplace/category-filter";
import { EventCard } from "@/components/marketplace/event-card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_EVENTS } from "@/lib/mock-data";

type ViewMode = "grid" | "list";
type SortKey = "date" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Upcoming first",  value: "date" },
  { label: "Price: Low–High", value: "price-asc" },
  { label: "Price: High–Low", value: "price-desc" },
  { label: "Top rated",       value: "rating" },
];

export default function EventsPage() {
  const [category, setCategory] = React.useState("all");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [sort, setSort] = React.useState<SortKey>("date");

  const filtered = React.useMemo(() => {
    let list = category === "all" ? MOCK_EVENTS : MOCK_EVENTS.filter((e) => e.category === category);
    if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Page header */}
      <section className="pt-24 pb-10 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" size="sm">Events</Badge>
              <span style={{ color: "var(--text-4)" }} className="text-sm">
                {MOCK_EVENTS.length} events available
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--text-1)" }}>
              Browse all events
            </h1>
            <div className="relative">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <CategoryFilter value={category} onChange={setCategory} className="flex-1 min-w-0" />

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {sortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={sort === opt.value ? "text-[#6366f1] font-medium" : ""}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View toggle */}
            <div className="flex items-center rounded-xl border p-1 gap-0.5" style={{ borderColor: "var(--border)" }}>
              {(["grid", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150 ${
                    view === v
                      ? "bg-[#6366f1] text-white"
                      : "text-[--text-3] hover:bg-[--bg-muted]"
                  }`}
                >
                  {v === "grid" ? <Grid3X3 className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
          Showing <span className="font-semibold" style={{ color: "var(--text-1)" }}>{filtered.length}</span> events
          {category !== "all" && <> in <span className="font-semibold" style={{ color: "var(--text-1)" }}>{category}</span></>}
        </p>

        {/* Events grid / list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 text-5xl">🎭</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-1)" }}>No events found</h3>
            <p className="text-sm" style={{ color: "var(--text-3)" }}>Try a different category or search term.</p>
            <Button variant="outline" className="mt-4" onClick={() => setCategory("all")}>
              Clear filters
            </Button>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <EventCard event={event} variant="featured" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <EventCard event={event} variant="horizontal" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
