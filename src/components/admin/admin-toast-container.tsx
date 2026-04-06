"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES = {
  success: "border-green-200  bg-white text-green-700",
  error:   "border-red-200    bg-white text-red-700",
  warning: "border-amber-200  bg-white text-amber-700",
  info:    "border-gray-200   bg-white text-gray-700",
};

export function AdminToastContainer() {
  const { toasts, dismiss } = useAdminStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0,  scale: 1 }}
              exit={{   opacity: 0, x: 24,  scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm font-medium w-72",
                STYLES[t.variant],
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="text-current opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
