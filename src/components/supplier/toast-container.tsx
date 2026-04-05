"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/store/toast";
import { cn } from "@/lib/utils";

const CONFIG: Record<ToastVariant, {
  icon:       React.ElementType;
  iconClass:  string;
  borderClass:string;
}> = {
  default: { icon: Info,          iconClass: "text-[#6366f1]", borderClass: "border-[--border]"         },
  success: { icon: CheckCircle2,  iconClass: "text-green-500", borderClass: "border-green-200 dark:border-green-800" },
  error:   { icon: AlertCircle,   iconClass: "text-red-500",   borderClass: "border-red-200 dark:border-red-800"    },
  warning: { icon: AlertTriangle, iconClass: "text-amber-500", borderClass: "border-amber-200 dark:border-amber-800"},
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const { icon: Icon, iconClass, borderClass } = CONFIG[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{   opacity: 0, y: 8,   scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-2xl border",
                "bg-[--bg] shadow-[var(--shadow-xl)] px-4 py-3 min-w-[280px] max-w-[360px]",
                borderClass,
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0 mt-0.5", iconClass)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[--text-1]">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-[--text-3] mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-[--text-4] hover:text-[--text-2] transition-colors mt-0.5"
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
