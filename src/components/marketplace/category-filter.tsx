"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mock-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
  return (
    <ScrollArea className={cn("w-full", className)}>
      <div className="flex items-center gap-2 pb-2">
        {CATEGORIES.map((cat) => {
          const active = value === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2",
                "text-sm font-medium whitespace-nowrap",
                "transition-all duration-200 cursor-pointer",
                active
                  ? "bg-brand-gradient text-white shadow-[var(--shadow-glow)]"
                  : "bg-[--bg] border border-[--border] text-[--text-2] hover:border-[--text-3] hover:text-[--text-1]"
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {active && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 rounded-full bg-brand-gradient -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
