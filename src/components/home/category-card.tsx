"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CategoryCardData {
  id: string;
  label: string;
  emoji: string;
  count: string;
  /** Tailwind-safe hex for icon background */
  bg: string;
  /** Hex used for gradient accent */
  accent: string;
  href: string;
}

interface CategoryCardProps {
  category: CategoryCardData;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        href={category.href}
        className={cn(
          "group flex flex-col items-center gap-4 rounded-2xl border border-[--border]",
          "bg-[--bg] p-6 text-center",
          "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
          "transition-shadow duration-300 outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        )}
      >
        {/* Emoji icon circle */}
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ background: category.bg }}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 blur-lg group-hover:opacity-40 transition-opacity duration-400"
            style={{ background: category.accent }}
          />
          <span className="relative leading-none select-none">{category.emoji}</span>
        </div>

        {/* Label */}
        <div>
          <p
            className="font-semibold text-sm text-[--text-1] group-hover:text-[#6366f1] transition-colors duration-150 leading-tight"
          >
            {category.label}
          </p>
          <p className="text-xs text-[--text-4] mt-1">{category.count}</p>
        </div>

        {/* Accent underline on hover */}
        <div
          className="h-0.5 w-0 rounded-full group-hover:w-8 transition-all duration-300"
          style={{ background: category.accent }}
        />
      </Link>
    </motion.div>
  );
}
