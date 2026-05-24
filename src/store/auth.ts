import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types/auth";

interface AuthState {
  user:       UserProfile | null;
  loading:    boolean;
  setUser:    (user: UserProfile | null) => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:       null,
      loading:    false,
      setUser:    (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name:       "eventsphere-auth",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
