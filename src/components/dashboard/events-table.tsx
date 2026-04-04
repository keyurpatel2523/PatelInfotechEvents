"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal, Eye, Edit, Trash2,
  ArrowUpDown, ChevronDown, ChevronUp, Filter,
  Plus, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MOCK_EVENTS } from "@/lib/mock-data";

type SortKey = "title" | "date" | "revenue" | "attendees";
type SortDir = "asc" | "desc";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "danger" }> = {
  active:    { label: "Active",    variant: "success" },
  upcoming:  { label: "Upcoming",  variant: "warning" },
  draft:     { label: "Draft",     variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

function getStatus(event: (typeof MOCK_EVENTS)[0]) {
  const d = new Date(event.date);
  if (d > new Date()) return "upcoming";
  return "active";
}

export function EventsTable() {
  const [sortKey, setSortKey] = React.useState<SortKey>("date");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const sorted = React.useMemo(() => {
    return [...MOCK_EVENTS].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title")     cmp = a.title.localeCompare(b.title);
      if (sortKey === "date")      cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortKey === "attendees") cmp = a.attendees - b.attendees;
      if (sortKey === "revenue")   cmp = (a.price * a.attendees) - (b.price * b.attendees);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function toggleAll() {
    setSelected(selected.size === sorted.length
      ? new Set()
      : new Set(sorted.map((e) => e.id))
    );
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="h-3 w-3 text-[--text-4]" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 text-[#6366f1]" />
      : <ChevronDown className="h-3 w-3 text-[#6366f1]" />;
  }

  const thClass = cn(
    "text-left text-xs font-semibold uppercase tracking-wider py-3 px-4",
    "border-b border-[--border]"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="rounded-2xl border border-[--border] bg-[--bg] shadow-[var(--shadow-sm)] overflow-hidden"
    >
      {/* Table header bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[--border]">
        <div>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Events</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
            {sorted.length} total · {selected.size > 0 && `${selected.size} selected`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <Button variant="destructive" size="sm">
              <Trash2 className="h-3.5 w-3.5" /> Delete ({selected.size})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> New event
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ color: "var(--text-3)" }}>
            <tr>
              {/* Checkbox */}
              <th className={cn(thClass, "w-12")}>
                <input
                  type="checkbox"
                  checked={selected.size === sorted.length && sorted.length > 0}
                  onChange={toggleAll}
                  className="rounded accent-[#6366f1] cursor-pointer"
                />
              </th>
              <th className={thClass}>
                <button className="flex items-center gap-1 hover:text-[--text-1] transition-colors" onClick={() => toggleSort("title")}>
                  Event <SortIcon k="title" />
                </button>
              </th>
              <th className={thClass}>Status</th>
              <th className={thClass}>
                <button className="flex items-center gap-1 hover:text-[--text-1] transition-colors" onClick={() => toggleSort("date")}>
                  Date <SortIcon k="date" />
                </button>
              </th>
              <th className={thClass}>
                <button className="flex items-center gap-1 hover:text-[--text-1] transition-colors" onClick={() => toggleSort("attendees")}>
                  Attendees <SortIcon k="attendees" />
                </button>
              </th>
              <th className={thClass}>
                <button className="flex items-center gap-1 hover:text-[--text-1] transition-colors" onClick={() => toggleSort("revenue")}>
                  Revenue <SortIcon k="revenue" />
                </button>
              </th>
              <th className={cn(thClass, "w-12")} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((event, i) => {
              const status = getStatus(event);
              const s = STATUS_MAP[status];
              const revenue = event.price * event.attendees;
              const fill = Math.round((event.attendees / event.capacity) * 100);
              const isSelected = selected.has(event.id);

              return (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "group border-b border-[--border-subtle] transition-colors duration-100",
                    "hover:bg-[--bg-subtle]",
                    isSelected && "bg-brand-50/40 dark:bg-brand-950/20"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setSelected((prev) => {
                        const next = new Set(prev);
                        if (next.has(event.id)) { next.delete(event.id); } else { next.add(event.id); }
                        return next;
                      })}
                      className="rounded accent-[#6366f1] cursor-pointer"
                    />
                  </td>

                  {/* Event */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white text-xs font-bold">
                        {event.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: "var(--text-1)" }}>
                          {event.title}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-4)" }}>
                          {event.city} · {event.vendor.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <Badge variant={s.variant} size="sm">{s.label}</Badge>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-2)" }}>
                      <Calendar className="h-3.5 w-3.5" style={{ color: "var(--text-4)" }} />
                      {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </td>

                  {/* Attendees + fill bar */}
                  <td className="px-4 py-3.5">
                    <div className="min-w-[100px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: "var(--text-1)" }} className="font-medium tabular-nums">
                          {event.attendees.toLocaleString()}
                        </span>
                        <span style={{ color: "var(--text-4)" }}>/{event.capacity.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                        <div
                          className={cn("h-full rounded-full bg-brand-gradient", fill >= 85 && "bg-none bg-amber-500")}
                          style={{ width: `${fill}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
                      {event.price === 0 ? "Free" : `₹${(revenue / 1000).toFixed(0)}K`}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem><Eye className="h-4 w-4" />View</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[--border]">
        <p className="text-xs" style={{ color: "var(--text-4)" }}>
          Showing {sorted.length} of {sorted.length} results
        </p>
        <div className="flex items-center gap-1">
          {["1", "2", "3"].map((p, i) => (
            <button
              key={p}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                i === 0
                  ? "bg-brand-gradient text-white"
                  : "text-[--text-3] hover:bg-[--bg-muted] hover:text-[--text-1]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
