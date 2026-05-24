import { AppLayout } from "@/components/dashboard/app-layout";
import { NotificationPage } from "@/components/notifications/notification-page";

/* Placeholder — swap for real auth when Firebase Auth is wired up */
const CURRENT_USER_ID = "user-current";

export default function NotificationsPage() {
  return (
    <AppLayout>
      <NotificationPage currentUserId={CURRENT_USER_ID} />
    </AppLayout>
  );
}
