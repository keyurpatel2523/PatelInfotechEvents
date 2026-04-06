"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface AdminConfirmDialogProps {
  open:       boolean;
  title:      string;
  message:    string;
  confirmLabel?: string;
  variant?:   "danger" | "warning";
  onConfirm:  () => void;
  onCancel:   () => void;
}

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onCancel()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 4 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    variant === "danger" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      variant === "danger" ? "text-red-600" : "text-amber-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <Dialog.Title className="text-[15px] font-semibold text-gray-900">
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-gray-500">
                      {message}
                    </Dialog.Description>
                  </div>
                  <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={onCancel}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                      variant === "danger"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
