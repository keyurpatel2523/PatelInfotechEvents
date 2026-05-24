import { create } from "zustand";
import type { AppNotification } from "@/types/notification";
import { MOCK_NOTIFICATIONS } from "@/lib/notifications/mock-data";

interface NotificationsState {
  notifications:  AppNotification[];
  unreadCount:    number;

  setNotifications:  (notifications: AppNotification[]) => void;
  markRead:          (id: string) => void;
  markAllRead:       () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount:   MOCK_NOTIFICATIONS.filter((n) => !n.read).length,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount:   0,
    })),
}));
