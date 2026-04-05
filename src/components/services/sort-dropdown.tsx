"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type SortValue = "featured" | "rating" | "price-asc" | "price-desc" | "reviews";

export const SORT_OPTIONS: { value: SortValue; label: string; desc: string }[] = [
  { value: "featured",   label: "Featured",          desc: "Our picks first" },
  { value: "rating",     label: "Top Rated",         desc: "Highest rated first" },
  { value: "price-asc",  label: "Price: Low → High", desc: "Cheapest first" },
  { value: "price-desc", label: "Price: High → Low", desc: "Premium first" },
  { value: "reviews",    label: "Most Reviewed",     desc: "Most popular" },
];

interface SortDropdownProps {
  value: SortValue;
  onChange: (v: SortValue) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-xl border border-[--border]",
            "bg-[--bg] px-3.5 py-2 text-xs font-medium text-[--text-2]",
            "hover:border-[--text-3] hover:text-[--text-1] transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
            open && "border-[#6366f1]/60 text-[--text-1]"
          )}
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-[--text-3]" />
          <span className="hidden sm:inline">{current.label}</span>
          <span className="sm:hidden">Sort</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <ChevronDown className="h-3.5 w-3.5 text-[--text-3]" />
          </motion.span>
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <AnimatePresence>
          {open && (
            <DropdownMenuPrimitive.Content
              asChild
              align="end"
              sideOffset={8}
              className="z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className={cn(
                  "w-52 rounded-2xl border border-[--border] bg-[--bg] p-1.5",
                  "shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]",
                )}
              >
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuPrimitive.Item
                    key={opt.value}
                    onSelect={() => onChange(opt.value)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer outline-none transition-colors duration-100",
                      opt.value === value
                        ? "bg-[#eef2ff] dark:bg-[#1e1b4b]"
                        : "hover:bg-[--bg-subtle]"
                    )}
                  >
                    <div>
                      <p className={cn(
                        "text-xs font-semibold",
                        opt.value === value ? "text-[#4f46e5]" : "text-[--text-1]"
                      )}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-[--text-4] mt-0.5">{opt.desc}</p>
                    </div>
                    {opt.value === value && (
                      <Check className="h-3.5 w-3.5 text-[#6366f1] shrink-0" />
                    )}
                  </DropdownMenuPrimitive.Item>
                ))}
              </motion.div>
            </DropdownMenuPrimitive.Content>
          )}
        </AnimatePresence>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
