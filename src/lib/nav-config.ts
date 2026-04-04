import {
  LayoutDashboard, BarChart3, Users, Settings, Shield,
  Calendar, Ticket, Star, MessageSquare, Bell,
  TrendingUp, FileText,
  CreditCard, Heart, User, HelpCircle,
  Globe, MapPin, Activity, ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/store/dashboard";

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
  // ─── Admin ──────────────────────────────────────────────
  {
    id: "admin-core",
    title: "Overview",
    roles: ["admin"],
    items: [
      { id: "dashboard",  label: "Dashboard",  href: "/dashboard",            icon: LayoutDashboard, roles: ["admin"] },
      { id: "analytics",  label: "Analytics",  href: "/dashboard/analytics",  icon: BarChart3,       roles: ["admin"], badge: "New", badgeVariant: "default" },
      { id: "activity",   label: "Live Feed",  href: "/dashboard/activity",   icon: Activity,        roles: ["admin"] },
    ],
  },
  {
    id: "admin-manage",
    title: "Manage",
    roles: ["admin"],
    items: [
      { id: "events",     label: "Events",     href: "/dashboard/events",     icon: Calendar,        roles: ["admin"], badge: 12 },
      { id: "vendors",    label: "Vendors",    href: "/dashboard/vendors",    icon: Shield,          roles: ["admin"] },
      { id: "users",      label: "Users",      href: "/dashboard/users",      icon: Users,           roles: ["admin"], badge: 3, badgeVariant: "danger" },
      { id: "tickets",    label: "Tickets",    href: "/dashboard/tickets",    icon: Ticket,          roles: ["admin"] },
      { id: "venues",     label: "Venues",     href: "/dashboard/venues",     icon: MapPin,          roles: ["admin"] },
    ],
  },
  {
    id: "admin-finance",
    title: "Finance",
    roles: ["admin"],
    items: [
      { id: "revenue",    label: "Revenue",    href: "/dashboard/revenue",    icon: TrendingUp,      roles: ["admin"] },
      { id: "payouts",    label: "Payouts",    href: "/dashboard/payouts",    icon: CreditCard,      roles: ["admin"] },
      { id: "reports",    label: "Reports",    href: "/dashboard/reports",    icon: FileText,        roles: ["admin"] },
    ],
  },
  {
    id: "admin-comms",
    title: "Communications",
    roles: ["admin"],
    items: [
      { id: "reviews",    label: "Reviews",    href: "/dashboard/reviews",    icon: Star,            roles: ["admin"] },
      { id: "messages",   label: "Messages",   href: "/dashboard/messages",   icon: MessageSquare,   roles: ["admin"], badge: 5 },
      { id: "broadcasts", label: "Broadcasts", href: "/dashboard/broadcasts", icon: Bell,            roles: ["admin"] },
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
    roles: ["admin", "supplier", "customer"],
    items: [
      { id: "settings",    label: "Settings",    href: "/dashboard/settings",      icon: Settings,        roles: ["admin", "supplier", "customer"] },
      { id: "support",     label: "Support",     href: "/dashboard/support",       icon: HelpCircle,      roles: ["admin", "supplier", "customer"] },
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
