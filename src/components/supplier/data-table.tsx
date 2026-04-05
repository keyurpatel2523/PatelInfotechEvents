"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Props ──────────────────────────────────────────────────── */
interface DataTableProps<T> {
  columns:     ColumnDef<T>[];
  data:        T[];
  pageSize?:   number;
  searchValue?: string;
  searchKey?:   string;
  emptyLabel?: string;
}

/* ─── Sort icon ──────────────────────────────────────────────── */
function SortIcon({ dir }: { dir: false | "asc" | "desc" }) {
  if (dir === "asc")  return <ChevronUp   className="h-3 w-3 text-[#6366f1]" />;
  if (dir === "desc") return <ChevronDown className="h-3 w-3 text-[#6366f1]" />;
  return <ChevronsUpDown className="h-3 w-3 text-[--text-4]" />;
}

/* ─── DataTable ──────────────────────────────────────────────── */
export function DataTable<T>({
  columns,
  data,
  pageSize = 8,
  searchValue = "",
  searchKey,
  emptyLabel = "No results found",
}: DataTableProps<T>) {
  const [sorting,       setSorting]       = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  /* Sync external search value into column filter */
  React.useEffect(() => {
    if (searchKey) {
      setColumnFilters(
        searchValue
          ? [{ id: searchKey, value: searchValue }]
          : [],
      );
    }
  }, [searchValue, searchKey]);

  const table = useReactTable({
    data,
    columns,
    state:    { sorting, columnFilters },
    onSortingChange:       setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const { rows }      = table.getRowModel();
  const pageCount     = table.getPageCount();
  const pageIndex     = table.getState().pagination.pageIndex;
  const totalFiltered = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-2">
      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[--border]">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[--border] bg-[--bg-subtle]">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={cn(
                        "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[--text-3] whitespace-nowrap",
                        canSort && "cursor-pointer select-none hover:text-[--text-1] transition-colors",
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && <SortIcon dir={header.column.getIsSorted()} />}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[--border-subtle]">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-sm text-[--text-4]"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[--bg-subtle] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between px-1 text-xs text-[--text-3]">
          <span>
            {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, totalFiltered)} of {totalFiltered}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[--border] hover:border-[--text-4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={cn(
                  "h-7 w-7 rounded-lg text-xs font-medium transition-all",
                  i === pageIndex
                    ? "bg-[#6366f1] text-white"
                    : "border border-[--border] hover:border-[--text-4] text-[--text-2]",
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[--border] hover:border-[--text-4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
