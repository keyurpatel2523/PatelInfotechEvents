"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DATA = [
  { name: "Technology",  value: 32, color: "#6366f1" },
  { name: "Music",       value: 24, color: "#8b5cf6" },
  { name: "Food & Drink",value: 18, color: "#a78bfa" },
  { name: "Business",    value: 14, color: "#c4b5fd" },
  { name: "Wellness",    value: 8,  color: "#ddd6fe" },
  { name: "Arts",        value: 4,  color: "#ede9fe" },
];

interface TooltipItem { name: string; value: number }
function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipItem[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[--border] bg-[--bg] px-3 py-2 shadow-[var(--shadow-md)] text-xs">
      <p className="font-semibold" style={{ color: "var(--text-1)" }}>{payload[0].name}</p>
      <p style={{ color: "var(--text-3)" }}>{payload[0].value}% of bookings</p>
    </div>
  );
}

export function CategoryDonut() {
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="rounded-2xl border border-[--border] bg-[--bg] p-6 shadow-[var(--shadow-sm)]"
    >
      <div className="mb-5">
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Bookings by Category</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Distribution this quarter</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative h-[140px] w-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, i) => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {DATA.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={active === null || active === i ? 1 : 0.4}
                    stroke="transparent"
                    style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xl font-bold tabular-nums" style={{ color: "var(--text-1)" }}>
              {active !== null ? `${DATA[active].value}%` : "100%"}
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-4)" }}>
              {active !== null ? DATA[active].name : "Total"}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {DATA.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center justify-between cursor-pointer"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color }} />
                <span
                  className={cn("text-xs truncate transition-colors", active === i ? "font-semibold" : "")}
                  style={{ color: active === i ? "var(--text-1)" : "var(--text-3)" }}
                >
                  {d.name}
                </span>
              </div>
              <span className="text-xs font-semibold tabular-nums ml-2 shrink-0" style={{ color: "var(--text-2)" }}>
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
