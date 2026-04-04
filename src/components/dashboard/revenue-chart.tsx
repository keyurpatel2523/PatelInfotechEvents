"use client";

import * as React from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MONTHLY_DATA = [
  { month: "Aug",  revenue: 420000, bookings: 312, target: 400000 },
  { month: "Sep",  revenue: 385000, bookings: 287, target: 420000 },
  { month: "Oct",  revenue: 510000, bookings: 398, target: 450000 },
  { month: "Nov",  revenue: 445000, bookings: 341, target: 470000 },
  { month: "Dec",  revenue: 680000, bookings: 512, target: 500000 },
  { month: "Jan",  revenue: 592000, bookings: 461, target: 530000 },
  { month: "Feb",  revenue: 845000, bookings: 634, target: 560000 },
  { month: "Mar",  revenue: 720000, bookings: 554, target: 600000 },
];

type Range = "1W" | "1M" | "3M" | "1Y";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}
interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

/* ─── Custom tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={cn(
      "rounded-xl border border-[--border] bg-[--bg] px-3 py-2.5 shadow-[var(--shadow-lg)]",
      "text-xs"
    )}>
      <p className="font-semibold mb-1.5" style={{ color: "var(--text-1)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: "var(--text-3)" }}>
            <span className="h-2 w-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums" style={{ color: "var(--text-1)" }}>
            {p.name === "Revenue" || p.name === "Target"
              ? `${CURRENCY_SYMBOL}${(p.value / 1000).toFixed(0)}K`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const [range, setRange] = React.useState<Range>("1M");
  const [chartType, setChartType] = React.useState<"area" | "bar">("area");

  const data = range === "1W" ? MONTHLY_DATA.slice(-2) :
               range === "3M" ? MONTHLY_DATA.slice(-3) :
               range === "1Y" ? MONTHLY_DATA : MONTHLY_DATA.slice(-4);

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const prev  = MONTHLY_DATA.slice(0, data.length).reduce((s, d) => s + d.revenue, 0);
  const pct   = prev > 0 ? (((total - prev) / prev) * 100).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl border border-[--border] bg-[--bg] p-6 shadow-[var(--shadow-sm)]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-3)" }}>Total Revenue</p>
          <p className="text-3xl font-bold tabular-nums mt-1" style={{ color: "var(--text-1)" }}>
            {CURRENCY_SYMBOL}{(total / 1000).toFixed(1)}K
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="success" size="sm">
              <TrendingUp className="h-3 w-3" />
              +{pct}%
            </Badge>
            <span className="text-xs" style={{ color: "var(--text-4)" }}>vs previous period</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart type toggle */}
          <div className="flex items-center rounded-xl border border-[--border] p-1 gap-0.5">
            {(["area", "bar"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 capitalize",
                  chartType === type
                    ? "bg-brand-gradient text-white shadow-sm"
                    : "text-[--text-3] hover:text-[--text-2]"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Range tabs */}
          <div className="flex items-center rounded-xl border border-[--border] p-1 gap-0.5">
            {(["1W", "1M", "3M", "1Y"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150",
                  range === r
                    ? "bg-[--bg-muted] text-[--text-1] shadow-sm"
                    : "text-[--text-4] hover:text-[--text-2]"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-target" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-4)" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-4)" }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `${CURRENCY_SYMBOL}${v / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#grad-rev)"
                dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6366f1" }}
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#grad-target)"
                dot={false}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-4)" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-4)" }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `${CURRENCY_SYMBOL}${v / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="target"  name="Target"  fill="#e0e7ff" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
