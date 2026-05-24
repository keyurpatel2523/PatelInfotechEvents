/* ── Notification domain types ───────────────────────────────────── */

export type NotificationType = "booking" | "payment" | "chat" | "review";

export interface AppNotification {
  id:        string;
  userId:    string;
  type:      NotificationType;
  title:     string;
  message:   string;
  read:      boolean;
  link?:     string;
  metadata?: Record<string, string>;
  createdAt: string;
}

/* Payload sent to POST /api/notifications (internal server-to-server) */
export interface CreateNotificationPayload {
  userId:   string;
  type:     NotificationType;
  title:    string;
  message:  string;
  link?:    string;
  metadata?: Record<string, string>;
}
