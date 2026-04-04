"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────── */
export interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  /** Tailwind text colour class — e.g. "text-[#6366f1]" */
  iconColor?: string;
  /** Tailwind bg colour class — e.g. "bg-[#eef2ff]" */
  iconBg?: string;
  /** CSS hex/rgba for the top gradient accent line */
  accentColor?: string;
  /** 8–16 numeric data points for the mini area chart */
  sparkline?: number[];
  loading?: boolean;
  /** Stagger animation index */
  index?: number;
}

/* ─── Mini area sparkline ─────────────────────────────────── */
function MiniSparkline({
  data,
  positive,
  uid,
}: {
  data: number[];
  positive: boolean;
  uid: string;
}) {
  const W = 88;
  const H = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2; // vertical padding so stroke isn't clipped
  const step = W / (data.length - 1);

  const pts = data.map(
    (v, i) => [i * step, pad + (H - pad * 2) * (1 - (v - min) / range)] as [number, number]
  );

  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${W},${H + pad} L0,${H + pad} Z`;

  const strokeColor = positive ? "#22c55e" : "#ef4444";
  const gradId = `spark-area-${uid}`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last-point dot */}
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2.5"
        fill={strokeColor}
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ─── StatsCard ───────────────────────────────────────────── */
export function StatCard({
  title,
  value,
  change = 0,
  changeLabel,
  icon: Icon,
  iconColor = "text-[#6366f1]",
  iconBg = "bg-[#eef2ff]",
  accentColor = "#6366f1",
  sparkline,
  loading,
  index = 0,
}: StatCardProps) {
  const positive = change > 0;
  const neutral = change === 0;
  const TrendIcon = neutral ? Minus : positive ? TrendingUp : TrendingDown;
  const trendColors = positive
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
    : neutral
    ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
    : "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className={cn(
        /* Glassmorphism base */
        "group relative flex flex-col overflow-hidden",
        "rounded-2xl border border-[--border]",
        "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl",
        /* Soft multi-layer shadow */
        "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.06)]",
        "hover:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.10)]",
        "transition-shadow duration-300 cursor-default"
      )}
    >
      {/* ── Gradient accent top border ───────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor}22)`,
        }}
      />

      {/* ── Radial glow on hover ──────────────────────────── */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: accentColor }}
      />

      <div className="relative flex flex-col gap-4 p-5 pt-6">
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-4 w-20 rounded-lg" />
            <div className="skeleton h-8 w-28 rounded-lg" />
            <div className="skeleton h-3 w-16 rounded-lg" />
          </div>
        ) : (
          <>
            {/* ── Top row: icon + sparkline ─────────────── */}
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl",
                  iconBg
                )}
              >
                <Icon className={cn("h-5 w-5", iconColor)} />
              </div>

              {sparkline && sparkline.length >= 2 && (
                <MiniSparkline
                  data={sparkline}
                  positive={positive || neutral}
                  uid={`${title}-${index}`}
                />
              )}
            </div>

            {/* ── Value + title ─────────────────────────── */}
            <div>
              <p
                className="text-2xl font-bold tabular-nums tracking-tight"
                style={{ color: "var(--text-1)" }}
              >
                {value}
              </p>
              <p className="mt-0.5 text-sm" style={{ color: "var(--text-3)" }}>
                {title}
              </p>
            </div>

            {/* ── Trend indicator ───────────────────────── */}
            {change !== undefined && (
              <div
                className="flex items-center gap-1.5 border-t pt-3"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
                    "text-xs font-semibold",
                    trendColors
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  {neutral ? "0" : `${positive ? "+" : "-"}${Math.abs(change)}`}%
                </span>
                <span className="text-xs" style={{ color: "var(--text-4)" }}>
                  {changeLabel ?? "vs last month"}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
