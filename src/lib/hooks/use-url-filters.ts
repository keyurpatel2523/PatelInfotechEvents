"use client";

/**
 * useUrlFilters
 *
 * Single source of truth for the services listing page filter state.
 *
 * Responsibilities:
 *  - Reads initial state from URL searchParams (once on mount)
 *  - Exposes typed setters for every filter dimension
 *  - Writes filter state back to the URL, debounced at 350ms, using
 *    router.replace so no history entries are polluted
 *  - Wraps all filter state updates in React.startTransition so the
 *    current UI stays fully interactive while React computes the new
 *    filtered list — isPending replaces the old fake setTimeout loading
 *
 * Performance contract:
 *  - Every setter is wrapped in useCallback with a stable reference;
 *    child components that receive a setter will NOT re-render unless
 *    the underlying filter slice actually changed
 *  - URL writes use a ref-based debounce that is safe across re-renders
 *    and React Strict Mode double-invocations
 */

import * as React from "react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import type { FilterState } from "@/components/services/filter-sidebar";
import type { SortValue } from "@/components/services/sort-dropdown";

/* ─── Constants ───────────────────────────────────────────── */
export const DEFAULT_FILTERS: FilterState = {
  categories:  [],
  minPrice:    0,
  maxPrice:    10000,
  minRating:   0,
  instantBook: false,
  verified:    false,
  areas:       [],
};

const VALID_SORTS: SortValue[] = ["featured", "rating", "price-asc", "price-desc", "reviews"];

/* ─── Serialise state → URLSearchParams ───────────────────── */
function serialise(
  f: FilterState,
  sort:        SortValue,
  query:       string,
  location:    string,
  date:        string,
  serviceType: string,
): URLSearchParams {
  const p = new URLSearchParams();
  if (query)                          p.set("q",       query);
  if (location)                       p.set("loc",     location);
  if (date)                           p.set("date",    date);
  if (serviceType !== "All Services") p.set("type",    serviceType);
  if (sort !== "featured")            p.set("sort",    sort);
  if (f.categories.length)            p.set("cats",    f.categories.join(","));
  if (f.minPrice > 0)                 p.set("minP",    String(f.minPrice));
  if (f.maxPrice < 10000)             p.set("maxP",    String(f.maxPrice));
  if (f.minRating > 0)                p.set("rating",  String(f.minRating));
  if (f.instantBook)                  p.set("instant", "1");
  if (f.verified)                     p.set("verified","1");
  if (f.areas.length)                 p.set("areas",   f.areas.join(","));
  return p;
}

/* ─── Deserialise URLSearchParams → state ─────────────────── */
function deserialise(sp: ReadonlyURLSearchParams | URLSearchParams): {
  filters:     FilterState;
  sort:        SortValue;
  query:       string;
  location:    string;
  date:        string;
  serviceType: string;
} {
  const sortRaw = sp.get("sort") ?? "featured";
  return {
    query:       sp.get("q")    ?? "",
    location:    sp.get("loc")  ?? "",
    date:        sp.get("date") ?? "",
    serviceType: sp.get("type") ?? "All Services",
    sort:        VALID_SORTS.includes(sortRaw as SortValue) ? (sortRaw as SortValue) : "featured",
    filters: {
      categories:  sp.get("cats")    ? sp.get("cats")!.split(",").filter(Boolean)   : [],
      areas:       sp.get("areas")   ? sp.get("areas")!.split(",").filter(Boolean)  : [],
      minPrice:    Number(sp.get("minP")   ?? 0),
      maxPrice:    Number(sp.get("maxP")   ?? 10000),
      minRating:   Number(sp.get("rating") ?? 0),
      instantBook: sp.get("instant")  === "1",
      verified:    sp.get("verified") === "1",
    },
  };
}

/* ─── Ref-based debounce (safe across Strict Mode) ────────── */
function useDebounce(fn: () => void, delay: number): () => void {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef    = React.useRef(fn);
  fnRef.current  = fn;                         // keep fn current without resubscribing

  return React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fnRef.current(), delay);
  }, [delay]);
}

/* ─── Hook ────────────────────────────────────────────────── */
export interface UrlFilterState {
  /* state */
  query:       string;
  location:    string;
  date:        string;
  serviceType: string;
  sort:        SortValue;
  filters:     FilterState;
  isPending:   boolean;           // true while React is computing the transition

  /* setters — all stable references via useCallback */
  setQuery:       (q: string)      => void;
  setLocation:    (l: string)      => void;
  setDate:        (d: string)      => void;
  setServiceType: (t: string)      => void;
  setSort:        (s: SortValue)   => void;
  setFilters:     (f: FilterState) => void;
  clearAll:       ()               => void;

  /* derived */
  activeFilterCount: number;
}

export function useUrlFilters(): UrlFilterState {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  /* Read initial state from URL — once on mount only */
  const initial = React.useMemo(
    () => deserialise(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [query,       setQueryState]       = React.useState(initial.query);
  const [location,    setLocationState]    = React.useState(initial.location);
  const [date,        setDateState]        = React.useState(initial.date);
  const [serviceType, setServiceTypeState] = React.useState(initial.serviceType);
  const [sort,        setSortState]        = React.useState<SortValue>(initial.sort);
  const [filters,     setFiltersState]     = React.useState<FilterState>(initial.filters);

  /* Keep a ref snapshot of everything so the debounced write sees current values */
  const stateRef = React.useRef({ query, location, date, serviceType, sort, filters });
  stateRef.current = { query, location, date, serviceType, sort, filters };

  /* URL writer — fire-and-forget, called by the debounced trigger */
  const writeUrl = React.useCallback(() => {
    const { query: q, location: l, date: d, serviceType: st, sort: so, filters: f } = stateRef.current;
    const params = serialise(f, so, q, l, d, st).toString();
    router.replace(`/services${params ? "?" + params : ""}`, { scroll: false });
  }, [router]);

  const scheduleUrlWrite = useDebounce(writeUrl, 350);

  /* ── Setters ─────────────────────────────────────────────── */
  /* Filters and sort use startTransition: React keeps the current UI
     visible while computing the re-filtered list, then swaps atomically.
     isPending drives the loading indicator — no fake timer needed.      */

  const setFilters = React.useCallback((f: FilterState) => {
    startTransition(() => setFiltersState(f));
    scheduleUrlWrite();
  }, [scheduleUrlWrite]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSort = React.useCallback((s: SortValue) => {
    startTransition(() => setSortState(s));
    scheduleUrlWrite();
  }, [scheduleUrlWrite]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Query/location/date are typed live — use urgent updates so the
     input feels instant; only the derived result re-render is deferred */
  const setQuery = React.useCallback((q: string) => {
    setQueryState(q);
    startTransition(() => {}); // mark next result render as transition
    scheduleUrlWrite();
  }, [scheduleUrlWrite]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLocation = React.useCallback((l: string) => {
    setLocationState(l);
    scheduleUrlWrite();
  }, [scheduleUrlWrite]);

  const setDate = React.useCallback((d: string) => {
    setDateState(d);
    scheduleUrlWrite();
  }, [scheduleUrlWrite]);

  const setServiceType = React.useCallback((t: string) => {
    setServiceTypeState(t);
    scheduleUrlWrite();
  }, [scheduleUrlWrite]);

  const clearAll = React.useCallback(() => {
    startTransition(() => {
      setQueryState("");
      setLocationState("");
      setDateState("");
      setServiceTypeState("All Services");
      setSortState("featured");
      setFiltersState({ ...DEFAULT_FILTERS });
    });
    scheduleUrlWrite();
  }, [scheduleUrlWrite]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Derived ─────────────────────────────────────────────── */
  const activeFilterCount = React.useMemo(() =>
    filters.categories.length +
    filters.areas.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.instantBook ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0),
  [filters]);

  return {
    query, location, date, serviceType, sort, filters, isPending,
    setQuery, setLocation, setDate, setServiceType, setSort, setFilters, clearAll,
    activeFilterCount,
  };
}
