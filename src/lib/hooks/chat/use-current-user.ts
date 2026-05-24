"use client";

/**
 * Returns the current authenticated user for the chat feature.
 * Currently returns a mock user — swap body for Firebase Auth when ready:
 *
 *   const auth = getAuth(clientApp);
 *   const [user] = useAuthState(auth);
 *   return { id: user.uid, name: user.displayName, ... }
 */

import { MOCK_CURRENT_USER } from "@/lib/chat/mock-data";
import type { ChatUser } from "@/types/chat";

export function useCurrentUser(): ChatUser {
  return MOCK_CURRENT_USER;
}
