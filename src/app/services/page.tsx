"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, LayoutGrid, List, Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/marketplace/service-card";
import type { ServiceCardData } from "@/components/marketplace/service-card";
import { MOCK_SERVICES } from "@/lib/mock-services";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Catering", "Photography", "Décor", "AV & Lighting", "Venue", "Bakery"];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function sortServices(
  services: ServiceCardData[],
  sort: string
): ServiceCardData[] {
  switch (sort) {
    case "rating":
      return [...services].sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return [...services].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...services].sort((a, b) => b.price - a.price);
    default:
      return [...services].sort((a) => (a.featured ? -1 : 1));
  }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function ServicesPage() {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [sort, setSort] = React.useState("featured");
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    let results = MOCK_SERVICES;
    if (activeCategory !== "All") {
      results = results.filter((s) => s.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return sortServices(results, sort);
  }, [query, activeCategory, sort]);

  const handleSave = (id: string, saved: boolean) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* ── Hero strip ────────────────────────────────────── */}
      <div className="bg-brand-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Event Services
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find the perfect
              <br />
              <span className="text-indigo-200">service for your event</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100/80">
              Browse curated vendors — from catering to décor — all vetted and ready to book.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search services, cities, categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-5 text-white placeholder:text-indigo-200/60 backdrop-blur-sm outline-none focus:ring-2 focus:ring-white/30 transition"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filters toolbar ───────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-[--border] bg-[--bg]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto py-3 no-scrollbar">
            {/* Category pills */}
            <div className="flex shrink-0 items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                    activeCategory === cat
                      ? "border-[--brand] bg-[--brand] text-white"
                      : "border-[--border] bg-transparent text-[--text-2] hover:border-[--brand]/50 hover:text-[--text-1]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {/* Sort */}
              <div className="flex items-center gap-1.5 rounded-xl border border-[--border] bg-[--surface] px-3 py-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[--text-3]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[--text-2] outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout toggle */}
              <div className="flex rounded-xl border border-[--border] bg-[--surface] p-0.5">
                <button
                  onClick={() => setLayout("grid")}
                  className={cn(
                    "rounded-[9px] p-1.5 transition-all",
                    layout === "grid"
                      ? "bg-[--bg] shadow-sm text-[--text-1]"
                      : "text-[--text-3] hover:text-[--text-2]"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={cn(
                    "rounded-[9px] p-1.5 transition-all",
                    layout === "list"
                      ? "bg-[--bg] shadow-sm text-[--text-1]"
                      : "text-[--text-3] hover:text-[--text-2]"
                  )}
                  aria-label="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[--text-3]">
            <span className="font-semibold text-[--text-1]">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "service" : "services"} found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[--border] py-24 text-center">
            <Search className="mb-4 h-10 w-10 text-[--text-3]" />
            <p className="text-lg font-semibold text-[--text-1]">No services found</p>
            <p className="mt-1 text-sm text-[--text-3]">
              Try a different search or category.
            </p>
          </div>
        ) : layout === "grid" ? (
          <motion.div
            key="grid"
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((service) => (
              <motion.div key={service.id} variants={itemFade}>
                <ServiceCard
                  service={service}
                  variant="grid"
                  saved={savedIds.has(service.id)}
                  onSave={handleSave}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {filtered.map((service) => (
              <motion.div key={service.id} variants={itemFade}>
                <ServiceCard
                  service={service}
                  variant="list"
                  saved={savedIds.has(service.id)}
                  onSave={handleSave}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Compact sidebar demo ──────────────────────── */}
        {filtered.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-4 text-lg font-semibold text-[--text-1]">
              Compact variant — sidebar / related listings
            </h2>
            <div className="max-w-sm rounded-2xl border border-[--border] bg-[--surface] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[--text-3]">
                Similar Services
              </p>
              <div className="flex flex-col gap-1">
                {MOCK_SERVICES.slice(0, 4).map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    variant="compact"
                    showQuickActions={false}
                    saved={savedIds.has(service.id)}
                    onSave={handleSave}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
