import type { UserProfile, UserRole } from "@/types/auth";

export type DemoUser = UserProfile & { password: string };

export const DEMO_USERS: DemoUser[] = [
  {
    uid:         "admin-001",
    email:       "admin@eventsphere.co.uk",
    password:    "admin123",
    displayName: "Sarah Mitchell",
    initials:    "SM",
    avatarColor: "#6366f1",
    role:        "admin" as UserRole,
    createdAt:   "2024-01-01T00:00:00Z",
  },
  {
    uid:         "supplier-001",
    email:       "supplier@goldentouchevents.co.uk",
    password:    "supplier123",
    displayName: "Sophie Clarke",
    initials:    "SC",
    avatarColor: "#22c55e",
    role:        "supplier" as UserRole,
    companyName: "Golden Touch Events",
    approved:    true,
    createdAt:   "2024-01-01T00:00:00Z",
  },
  {
    uid:         "customer-001",
    email:       "james@example.co.uk",
    password:    "customer123",
    displayName: "James Thompson",
    initials:    "JT",
    avatarColor: "#f59e0b",
    role:        "customer" as UserRole,
    createdAt:   "2024-01-01T00:00:00Z",
  },
];

export const DEMO_CREDENTIALS: Record<
  "admin" | "supplier" | "customer",
  { email: string; password: string; label: string }
> = {
  admin:    { email: "admin@eventsphere.co.uk",         password: "admin123",    label: "Admin"    },
  supplier: { email: "supplier@goldentouchevents.co.uk", password: "supplier123", label: "Supplier" },
  customer: { email: "james@example.co.uk",             password: "customer123", label: "Customer" },
};
