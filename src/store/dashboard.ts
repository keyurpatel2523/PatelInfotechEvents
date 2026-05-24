import { create } from "zustand";
import { persist } from "zustand/middleware";

/* Re-export from canonical location — all existing imports still work */
export type { UserRole } from "@/types/auth";
import type { UserRole } from "@/types/auth";

export type ThemeMode = "light" | "dark" | "system";

interface DashboardState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  // Role
  role: UserRole;
  setRole: (r: UserRole) => void;

  // Command palette
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleMobileSidebar: () => set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),
      closeMobileSidebar: () => set({ sidebarMobileOpen: false }),

      role: "admin",
      setRole: (role) => set({ role }),

      commandOpen: false,
      setCommandOpen: (commandOpen) => set({ commandOpen }),
    }),
    {
      name: "eventsphere-dashboard",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, role: s.role }),
    }
  )
);
