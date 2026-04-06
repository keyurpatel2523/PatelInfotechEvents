/**
 * Zustand store for the Super Admin Panel.
 * Manages global admin UI state: toast notifications and cross-page mutations.
 */

import { create } from "zustand";

/* ── Admin Toast ──────────────────────────────────────────────── */
export type AdminToastVariant = "success" | "error" | "warning" | "info";

export interface AdminToast {
  id:           string;
  message:      string;
  variant:      AdminToastVariant;
}

interface AdminState {
  toasts: AdminToast[];
  toast:  (message: string, variant?: AdminToastVariant) => void;
  dismiss:(id: string) => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  toasts: [],

  toast: (message, variant = "info") => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
