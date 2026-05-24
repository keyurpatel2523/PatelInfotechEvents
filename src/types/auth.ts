/* ── Auth domain types ───────────────────────────────────── */

export type UserRole = "customer" | "supplier" | "admin" | "super_admin";

export interface UserProfile {
  uid:          string;
  email:        string;
  displayName:  string;
  initials:     string;
  avatarColor:  string;
  role:         UserRole;
  createdAt:    string;
  /* Supplier-specific */
  companyName?: string;
  approved?:    boolean;
}

export interface AuthSession {
  uid:  string;
  role: UserRole;
}
