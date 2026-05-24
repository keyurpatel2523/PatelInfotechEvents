import {
  LayoutDashboard, BarChart3, Users, Settings, Shield,
  Calendar, Ticket, Star, MessageSquare, Bell,
  TrendingUp, FileText,
  CreditCard, Heart, User, HelpCircle,
  Globe, MapPin, Activity, ShoppingBag,
  ShieldCheck, Sliders, Building2,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/auth";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeVariant?: "default" | "danger" | "warning" | "success";
  roles: UserRole[];
  external?: boolean;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
  roles: UserRole[];
}

export const NAV_SECTIONS: NavSection[] = [
  // ─── Admin + Super Admin ────────────────────────────────
  {
    id: "admin-core",
    title: "Overview",
    roles: ["admin", "super_admin"],
    items: [
      { id: "dashboard",  label: "Dashboard",  href: "/admin",                icon: LayoutDashboard, roles: ["admin", "super_admin"] },
      { id: "analytics",  label: "Analytics",  href: "/admin/analytics",      icon: BarChart3,       roles: ["admin", "super_admin"], badge: "New", badgeVariant: "default" },
      { id: "activity",   label: "Live Feed",  href: "/admin/activity",       icon: Activity,        roles: ["admin", "super_admin"] },
    ],
  },
  {
    id: "admin-manage",
    title: "Manage",
    roles: ["admin", "super_admin"],
    items: [
      { id: "suppliers",  label: "Suppliers",  href: "/admin/suppliers",      icon: Building2,       roles: ["admin", "super_admin"], badge: 3, badgeVariant: "warning" },
      { id: "users",      label: "Users",      href: "/admin/users",          icon: Users,           roles: ["admin", "super_admin"], badge: 3, badgeVariant: "danger" },
      { id: "bookings",   label: "Bookings",   href: "/admin/bookings",       icon: Calendar,        roles: ["admin", "super_admin"], badge: 12 },
      { id: "tickets",    label: "Tickets",    href: "/admin/tickets",        icon: Ticket,          roles: ["admin", "super_admin"] },
      { id: "venues",     label: "Venues",     href: "/admin/venues",         icon: MapPin,          roles: ["admin", "super_admin"] },
    ],
  },
  {
    id: "admin-finance",
    title: "Finance",
    roles: ["admin", "super_admin"],
    items: [
      { id: "revenue",    label: "Revenue",    href: "/admin/revenue",        icon: TrendingUp,      roles: ["admin", "super_admin"] },
      { id: "payouts",    label: "Payouts",    href: "/admin/payouts",        icon: CreditCard,      roles: ["admin", "super_admin"] },
      { id: "reports",    label: "Reports",    href: "/admin/reports",        icon: FileText,        roles: ["admin", "super_admin"] },
    ],
  },
  {
    id: "admin-comms",
    title: "Communications",
    roles: ["admin", "super_admin"],
    items: [
      { id: "reviews",    label: "Reviews",    href: "/admin/reviews",        icon: Star,            roles: ["admin", "super_admin"] },
      { id: "messages",   label: "Messages",   href: "/admin/messages",       icon: MessageSquare,   roles: ["admin", "super_admin"], badge: 5 },
      { id: "broadcasts", label: "Broadcasts", href: "/admin/broadcasts",     icon: Bell,            roles: ["admin", "super_admin"] },
    ],
  },
  // ─── Super Admin only ───────────────────────────────────
  {
    id: "super-admin",
    title: "Super Admin",
    roles: ["super_admin"],
    items: [
      { id: "sa-approvals",  label: "Supplier Approvals", href: "/admin/approvals",  icon: ShieldCheck, roles: ["super_admin"], badge: 4, badgeVariant: "danger" },
      { id: "sa-admins",     label: "Admin Accounts",     href: "/admin/admins",     icon: Shield,      roles: ["super_admin"] },
      { id: "sa-categories", label: "Categories",         href: "/admin/categories", icon: Sliders,     roles: ["super_admin"] },
      { id: "sa-services",   label: "All Services",       href: "/admin/services",   icon: ShoppingBag, roles: ["super_admin"] },
    ],
  },

  // ─── Supplier ────────────────────────────────────────────
  {
    id: "supplier-core",
    title: "Overview",
    roles: ["supplier"],
    items: [
      { id: "s-dashboard", label: "Dashboard",   href: "/dashboard",               icon: LayoutDashboard, roles: ["supplier"] },
      { id: "s-analytics", label: "Analytics",   href: "/dashboard/analytics",     icon: BarChart3,       roles: ["supplier"] },
    ],
  },
  {
    id: "supplier-manage",
    title: "My Events",
    roles: ["supplier"],
    items: [
      { id: "s-events",    label: "Events",      href: "/dashboard/events",        icon: Calendar,        roles: ["supplier"], badge: 4 },
      { id: "s-tickets",   label: "Ticket Sales",href: "/dashboard/tickets",       icon: Ticket,          roles: ["supplier"] },
      { id: "s-attendees", label: "Attendees",   href: "/dashboard/attendees",     icon: Users,           roles: ["supplier"] },
      { id: "s-venues",    label: "Venues",      href: "/dashboard/venues",        icon: MapPin,          roles: ["supplier"] },
    ],
  },
  {
    id: "supplier-finance",
    title: "Finance",
    roles: ["supplier"],
    items: [
      { id: "s-revenue",   label: "Revenue",     href: "/dashboard/revenue",       icon: TrendingUp,      roles: ["supplier"] },
      { id: "s-payouts",   label: "Payouts",     href: "/dashboard/payouts",       icon: CreditCard,      roles: ["supplier"] },
    ],
  },
  {
    id: "supplier-comms",
    title: "Engagement",
    roles: ["supplier"],
    items: [
      { id: "s-reviews",   label: "Reviews",     href: "/dashboard/reviews",       icon: Star,            roles: ["supplier"], badge: 2 },
      { id: "s-messages",  label: "Messages",    href: "/dashboard/messages",      icon: MessageSquare,   roles: ["supplier"], badge: 8 },
    ],
  },

  // ─── Customer ────────────────────────────────────────────
  {
    id: "customer-core",
    title: "My Account",
    roles: ["customer"],
    items: [
      { id: "c-home",      label: "Home",        href: "/dashboard",               icon: LayoutDashboard, roles: ["customer"] },
      { id: "c-explore",   label: "Explore",     href: "/events",                  icon: Globe,           roles: ["customer"] },
      { id: "c-services",  label: "Services",    href: "/services",                icon: ShoppingBag,     roles: ["customer"] },
    ],
  },
  {
    id: "customer-bookings",
    title: "My Bookings",
    roles: ["customer"],
    items: [
      { id: "c-tickets",   label: "My Tickets",  href: "/dashboard/tickets",       icon: Ticket,          roles: ["customer"], badge: 2 },
      { id: "c-saved",     label: "Saved Events",href: "/dashboard/saved",         icon: Heart,           roles: ["customer"] },
      { id: "c-history",   label: "History",     href: "/dashboard/history",       icon: FileText,        roles: ["customer"] },
    ],
  },
  {
    id: "customer-profile",
    title: "Profile",
    roles: ["customer"],
    items: [
      { id: "c-profile",   label: "Profile",     href: "/dashboard/profile",       icon: User,            roles: ["customer"] },
      { id: "c-reviews",   label: "My Reviews",  href: "/dashboard/reviews",       icon: Star,            roles: ["customer"] },
      { id: "c-payments",  label: "Payments",    href: "/dashboard/payments",      icon: CreditCard,      roles: ["customer"] },
    ],
  },

  // ─── Shared bottom ─────────────────────────────────────
  {
    id: "shared-settings",
    title: "System",
    roles: ["admin", "super_admin", "supplier", "customer"],
    items: [
      { id: "settings", label: "Settings", href: "/admin/settings",     icon: Settings,   roles: ["admin", "super_admin"] },
      { id: "settings", label: "Settings", href: "/supplier/profile",   icon: Settings,   roles: ["supplier"] },
      { id: "settings", label: "Settings", href: "/dashboard/profile",  icon: Settings,   roles: ["customer"] },
      { id: "support",  label: "Support",  href: "/support",            icon: HelpCircle, roles: ["admin", "super_admin", "supplier", "customer"] },
    ],
  },
];

export function getNavForRole(role: UserRole): NavSection[] {
  return NAV_SECTIONS
    .filter((s) => s.roles.includes(role))
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((s) => s.items.length > 0);
}

// Flat list of all items for a role (used in command palette)
export function getAllNavItems(role: UserRole): NavItem[] {
  return getNavForRole(role).flatMap((s) => s.items);
}
