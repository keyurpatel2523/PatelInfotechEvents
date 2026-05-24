import { CollectionName } from "@/lib/firebase/collections";
import type { AppNotification } from "@/types/notification";

export function deserializeNotification(
  id: string,
  data: Record<string, unknown>,
): AppNotification {
  return {
    id,
    userId:    data.userId    as string,
    type:      data.type      as AppNotification["type"],
    title:     data.title     as string,
    message:   data.message   as string,
    read:      data.read      as boolean,
    link:      data.link      as string | undefined,
    metadata:  data.metadata  as Record<string, string> | undefined,
    createdAt: (() => {
      const v = data.createdAt;
      if (v && typeof v === "object" && "toDate" in v && typeof (v as { toDate: () => Date }).toDate === "function") {
        return (v as { toDate: () => Date }).toDate().toISOString();
      }
      return v as string;
    })(),
  };
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { clientDb }   = await import("@/lib/firebase-client");
  const { doc, updateDoc } = await import("firebase/firestore");
  if (!clientDb) return;
  await updateDoc(doc(clientDb, CollectionName.NOTIFICATIONS, notificationId), { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { clientDb }                        = await import("@/lib/firebase-client");
  const { collection, query, where, getDocs, writeBatch } = await import("firebase/firestore");
  if (!clientDb) return;

  const q     = query(
    collection(clientDb, CollectionName.NOTIFICATIONS),
    where("userId", "==", userId),
    where("read",   "==", false),
  );
  const snaps = await getDocs(q);
  if (snaps.empty) return;

  /* Firestore batch limit is 500 writes */
  const BATCH_SIZE = 500;
  for (let i = 0; i < snaps.docs.length; i += BATCH_SIZE) {
    const batch = writeBatch(clientDb);
    snaps.docs.slice(i, i + BATCH_SIZE).forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
  }
}
