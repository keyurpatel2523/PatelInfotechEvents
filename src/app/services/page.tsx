"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, List, Search, X, SlidersHorizontal, ChevronDown, MapPin,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/marketplace/service-card";
import type { ServiceCardData } from "@/components/marketplace/service-card";
import { SearchBar } from "@/components/services/search-bar";
import { FilterSidebar } from "@/components/services/filter-sidebar";
import type { FilterState } from "@/components/services/filter-sidebar";
import { FilterChips } from "@/components/services/filter-chips";
import { SortDropdown } from "@/components/services/sort-dropdown";
import type { SortValue } from "@/components/services/sort-dropdown";
import { SkeletonGrid, SkeletonList } from "@/components/services/skeleton-card";
import { MOCK_SERVICES } from "@/lib/mock-services";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { cn } from "@/lib/utils";

/* ─── Motion helpers ─────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.02 } },
};
const cardFade = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease } },
};

/* ─── Sort ───────────────────────────────────────────────── */
function applySort(services: ServiceCardData[], sort: SortValue): ServiceCardData[] {
  const s = [...services];
  switch (sort) {
    case "rating":     return s.sort((a, b) => b.rating - a.rating);
    case "price-asc":  return s.sort((a, b) => a.price - b.price);
    case "price-desc": return s.sort((a, b) => b.price - a.price);
    case "reviews":    return s.sort((a, b) => b.reviewCount - a.reviewCount);
    default:           return s.sort((a) => (a.featured ? -1 : 1));
  }
}

/* ─── Filters ────────────────────────────────────────────── */
function applyFilters(services: ServiceCardData[], f: FilterState, query: string): ServiceCardData[] {
  return services.filter((s) => {
    if (f.categories.length > 0 && !f.categories.includes(s.category)) return false;
    if (s.price < f.minPrice || s.price > f.maxPrice) return false;
    if (f.minRating > 0 && s.rating < f.minRating) return false;
    if (f.instantBook && !s.instantBook) return false;
    if (f.verified && !s.supplier.verified) return false;
    if (f.areas.length > 0 && !f.areas.some((a) => a.toLowerCase() === s.location.toLowerCase())) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!s.title.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q) &&
          !s.location.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

const PAGE_SIZE = 6;

/* ─── Empty state ────────────────────────────────────────── */
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease, delay: 0.05 }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[--bg-subtle] border border-[--border]"
      >
        <Search className="h-10 w-10 text-[--text-4]" />
      </motion.div>
      <h3 className="text-2xl font-bold text-[--text-1] mb-2">No services found</h3>
      <p className="text-sm text-[--text-3] max-w-sm mb-8 leading-relaxed">
        We couldn&apos;t find any services matching your current filters. Try removing some filters or searching for something else.
      </p>
      <motion.button
        onClick={onClear}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "rounded-2xl border border-[--border] bg-[--bg] px-8 py-3 text-sm font-semibold text-[--text-1]",
          "hover:border-[#6366f1] hover:text-[#6366f1] transition-all duration-150",
          "shadow-[var(--shadow-sm)]"
        )}
      >
        Reset all filters
      </motion.button>
    </motion.div>
  );
}

/* ─── Page (inner — needs Suspense for useSearchParams) ──── */
function ServicesPageInner() {
  const {
    query, location, date, serviceType, sort, filters, isPending,
    setQuery, setLocation, setDate, setServiceType, setSort, setFilters,
    clearAll, activeFilterCount,
  } = useUrlFilters();

  const [layout, setLayout]           = React.useState<"grid" | "list">("grid");
  const [page, setPage]               = React.useState(1);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isSticky, setIsSticky]       = React.useState(false);
  const [savedIds, setSavedIds]       = React.useState<Set<string>>(new Set());

  /* Reset page whenever filters/sort/query change */
  React.useEffect(() => { setPage(1); }, [filters, sort, query]);

  /* Sticky detection */
  React.useEffect(() => {
    const el = document.getElementById("sticky-sentinel");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsSticky(!e.isIntersecting),
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Derived results — only recompute when filter-relevant state changes */
  const all = React.useMemo(
    () => applySort(applyFilters(MOCK_SERVICES, filters, query), sort),
    [filters, sort, query],
  );

  const visible = all.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < all.length;

  const handleSave = React.useCallback((id: string, saved: boolean) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(id); else next.delete(id);
      return next;
    });
  }, []);

  const loadMore = React.useCallback(() => setPage((p) => p + 1), []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Spacer for fixed Navbar + sentinel for sticky detection */}
      <div className="h-16" />
      <div id="sticky-sentinel" className="h-px" />

      {/* ══════════════════════════════════════════════════
          STICKY SEARCH BAR
      ══════════════════════════════════════════════════ */}
      <div className={cn(
        "sticky top-16 z-40 transition-all duration-200",
        isSticky && "shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
      )}>
        <SearchBar
          query={query}             onQueryChange={setQuery}
          location={location}       onLocationChange={setLocation}
          date={date}               onDateChange={setDate}
          serviceType={serviceType} onServiceTypeChange={setServiceType}
          isSticky={isSticky}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ══════════════════════════════════════════════
            FILTER CHIPS + CONTROLS BAR
        ══════════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-[--border]">
          <div className="flex-1 min-w-0">
            <FilterChips
              filters={filters}
              onChange={setFilters}
              onOpenSidebar={() => setSidebarOpen((v) => !v)}
              sidebarOpen={sidebarOpen}
            />
          </div>
          <div className="hidden sm:flex shrink-0 items-center gap-2">
            <SortDropdown value={sort} onChange={setSort} />
            <div className="flex rounded-xl border border-[--border] bg-[--bg] p-0.5">
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setLayout(v)}
                  aria-label={v}
                  className={cn(
                    "rounded-[9px] p-1.5 transition-all duration-150",
                    layout === v
                      ? "bg-[--bg-subtle] shadow-sm text-[--text-1]"
                      : "text-[--text-3] hover:text-[--text-2]"
                  )}
                >
                  {v === "grid" ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MAIN LAYOUT
        ══════════════════════════════════════════════ */}
        <div className="flex gap-8 pt-7 pb-16">

          {/* ── Filter sidebar (desktop) ──────────────── */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.aside
                key="sidebar"
                initial={{ opacity: 0, width: 0, marginRight: -32 }}
                animate={{ opacity: 1, width: 272, marginRight: 0 }}
                exit={{ opacity: 0, width: 0, marginRight: -32 }}
                transition={{ duration: 0.26, ease }}
                className="shrink-0 hidden lg:block overflow-hidden"
              >
                <div className="sticky top-[144px] w-[272px]">
                  <div className="rounded-2xl border border-[--border] bg-[--bg] p-5">
                    <FilterSidebar
                      filters={filters}
                      onChange={setFilters}
                      resultCount={all.length}
                    />
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Results column ────────────────────────── */}
          <div className="min-w-0 flex-1">

            {/* Results header */}
            <div className="flex items-start justify-between gap-4 mb-7">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <motion.span
                    key={isPending ? "loading" : all.length}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="text-xl font-bold text-[--text-1] tabular-nums"
                  >
                    {isPending ? "…" : all.length}
                  </motion.span>
                  <span className="text-xl font-bold text-[--text-1]">
                    {all.length === 1 ? "service" : "services"} found
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[--text-4]">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>London, United Kingdom</span>
                  <AnimatePresence>
                    {activeFilterCount > 0 && !isPending && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        className="flex items-center gap-1"
                      >
                        <span className="text-[--border]">·</span>
                        <span>{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}</span>
                        <button
                          onClick={clearAll}
                          className="text-[#6366f1] hover:underline font-medium"
                        >
                          · Clear all
                        </button>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {/* Mobile sort */}
              <div className="flex sm:hidden shrink-0">
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Cards area */}
            <AnimatePresence mode="wait">
              {isPending ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {layout === "grid"
                    ? <SkeletonGrid count={6} />
                    : <SkeletonList count={4} />
                  }
                </motion.div>
              ) : all.length === 0 ? (
                <motion.div key="empty">
                  <EmptyState onClear={clearAll} />
                </motion.div>
              ) : layout === "grid" ? (
                <motion.div
                  key={`grid-${sort}-${JSON.stringify(filters)}-${query}`}
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className={cn(
                    "grid gap-6",
                    sidebarOpen
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  )}
                >
                  {visible.map((svc) => (
                    <motion.div key={svc.id} variants={cardFade} layout>
                      <ServiceCard
                        service={svc}
                        variant="grid"
                        saved={savedIds.has(svc.id)}
                        onSave={handleSave}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`list-${sort}-${JSON.stringify(filters)}-${query}`}
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-5"
                >
                  {visible.map((svc) => (
                    <motion.div key={svc.id} variants={cardFade} layout>
                      <ServiceCard
                        service={svc}
                        variant="list"
                        saved={savedIds.has(svc.id)}
                        onSave={handleSave}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load more */}
            <AnimatePresence>
              {!isPending && hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.15, duration: 0.35, ease }}
                  className="mt-12 flex flex-col items-center gap-4"
                >
                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="w-48 rounded-full bg-[--bg-muted] h-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(visible.length / all.length) * 100}%` }}
                        transition={{ duration: 0.6, ease }}
                        className="h-full bg-[#6366f1] rounded-full"
                      />
                    </div>
                    <span className="text-xs text-[--text-4] tabular-nums whitespace-nowrap">
                      {visible.length} of {all.length}
                    </span>
                  </div>
                  <motion.button
                    onClick={loadMore}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-2xl border border-[--border] bg-[--bg]",
                      "px-10 py-3.5 text-sm font-semibold text-[--text-1]",
                      "hover:border-[--text-3] transition-all duration-150",
                      "shadow-[var(--shadow-sm)]"
                    )}
                  >
                    <ChevronDown className="h-4 w-4 text-[--text-3]" />
                    Show more services
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* End of results */}
            {!isPending && !hasMore && all.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex flex-col items-center gap-2"
              >
                <div className="h-px w-16 bg-[--border]" />
                <p className="text-xs text-[--text-4]">
                  All {all.length} services shown
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile sidebar drawer ─────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease }}
              className="fixed inset-y-0 left-0 z-50 flex w-[340px] max-w-[90vw] flex-col bg-[--bg] shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[--border] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eef2ff] dark:bg-[#1e1b4b]">
                    <SlidersHorizontal className="h-4 w-4 text-[#6366f1]" />
                  </div>
                  <span className="font-bold text-[--text-1]">Filters</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[--border] text-[--text-3] hover:border-[--text-3] hover:text-[--text-1] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer content (scrollable) */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  resultCount={all.length}
                />
              </div>

              {/* Drawer footer CTA */}
              <div className="shrink-0 px-6 py-4 border-t border-[--border] bg-[--bg]">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "w-full rounded-2xl py-4 text-sm font-bold text-white",
                    "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]",
                    "shadow-[0_4px_20px_rgba(99,102,241,0.4)]",
                    "transition-shadow hover:shadow-[0_6px_24px_rgba(99,102,241,0.5)]"
                  )}
                >
                  Show {all.length} {all.length === 1 ? "service" : "services"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ─── Loading fallback ───────────────────────────────────── */
function ServicesPageFallback() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <SkeletonGrid count={6} />
      </div>
      <Footer />
    </div>
  );
}

/* ─── Default export with Suspense ──────────────────────── */
export default function ServicesPage() {
  return (
    <React.Suspense fallback={<ServicesPageFallback />}>
      <ServicesPageInner />
    </React.Suspense>
  );
}
