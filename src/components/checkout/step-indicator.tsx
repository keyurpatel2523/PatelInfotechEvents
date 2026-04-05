"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step = 1 | 2 | 3 | 4;

interface StepConfig {
  label: string;
  sublabel: string;
}

const STEPS: StepConfig[] = [
  { label: "Details",     sublabel: "Date & guests"  },
  { label: "Review",      sublabel: "Confirm order"  },
  { label: "Payment",     sublabel: "Pay securely"   },
  { label: "Confirmed",   sublabel: "All done!"      },
];

interface StepIndicatorProps {
  current: Step;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const num       = (i + 1) as Step;
          const isDone    = num < current;
          const isActive  = num === current;
          const isUpcoming= num > current;

          return (
            <React.Fragment key={step.label}>
              {/* Step node */}
              <li className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isDone
                      ? "#6366f1"
                      : isActive
                      ? "#6366f1"
                      : "transparent",
                    borderColor: isDone || isActive ? "#6366f1" : "var(--border)",
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 flex items-center justify-center",
                    "text-xs font-bold transition-shadow",
                    isActive && "shadow-[0_0_0_4px_rgba(99,102,241,0.15)]",
                  )}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  ) : (
                    <span
                      className={cn(
                        isActive  && "text-white",
                        isUpcoming && "text-[--text-4]",
                      )}
                    >
                      {num}
                    </span>
                  )}
                </motion.div>

                {/* Labels — hidden on very small screens */}
                <div className="hidden sm:flex flex-col items-center">
                  <span
                    className={cn(
                      "text-[11px] font-semibold leading-none",
                      isActive  && "text-[#6366f1]",
                      isDone    && "text-[--text-2]",
                      isUpcoming&& "text-[--text-4]",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[--text-4] mt-0.5 leading-none">
                    {step.sublabel}
                  </span>
                </div>
              </li>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="relative mx-2 sm:mx-3 h-px w-12 sm:w-16 bg-[--border] flex-shrink-0 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: num < current ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 bg-[#6366f1]"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
