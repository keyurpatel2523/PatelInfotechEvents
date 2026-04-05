/**
 * Lightweight Zustand toast store.
 * Usage:
 *   const { toast } = useToastStore();
 *   toast({ title: "Saved!", variant: "success" });
 */

import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface Toast {
  id:       string;
  title:    string;
  description?: string;
  variant:  ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  toast:  (opts: Omit<Toast, "id">) => void;
  dismiss:(id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  toast: (opts) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { ...opts, id }] }));
    /* Auto-dismiss after 4 s */
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
