import type { UserRole } from "@/types/auth";

export const SESSION_COOKIE = "eventsphere-session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setSessionCookie(uid: string, role: UserRole): void {
  const value = btoa(JSON.stringify({ uid, role }));
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export function parseSessionCookie(
  value: string,
): { uid: string; role: UserRole } | null {
  try {
    return JSON.parse(atob(value));
  } catch {
    return null;
  }
}

export const ROLE_HOME: Record<UserRole, string> = {
  customer: "/dashboard",
  supplier: "/supplier",
  admin:    "/admin",
};
