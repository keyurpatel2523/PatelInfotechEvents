import { cn } from "@/lib/utils";

type BadgeVariant =
  | "pending" | "approved" | "rejected" | "suspended"
  | "active"  | "paused"   | "draft"    | "disabled"
  | "confirmed" | "completed" | "cancelled"
  | "paid"    | "unpaid"   | "refunded";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  /* Supplier status */
  pending:   "bg-amber-50   text-amber-700  border-amber-200  dark:bg-amber-950/50  dark:text-amber-400  dark:border-amber-800",
  approved:  "bg-green-50   text-green-700  border-green-200  dark:bg-green-950/50  dark:text-green-400  dark:border-green-800",
  rejected:  "bg-red-50     text-red-700    border-red-200    dark:bg-red-950/50    dark:text-red-400    dark:border-red-800",
  suspended: "bg-orange-50  text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
  /* Service status */
  active:    "bg-green-50   text-green-700  border-green-200",
  paused:    "bg-zinc-100   text-zinc-600   border-zinc-200",
  draft:     "bg-amber-50   text-amber-700  border-amber-200",
  disabled:  "bg-red-50     text-red-700    border-red-200",
  /* Booking status */
  confirmed: "bg-blue-50    text-blue-700   border-blue-200",
  completed: "bg-green-50   text-green-700  border-green-200",
  cancelled: "bg-zinc-100   text-zinc-600   border-zinc-200",
  /* Payment */
  paid:      "bg-green-50   text-green-700  border-green-200",
  unpaid:    "bg-amber-50   text-amber-700  border-amber-200",
  refunded:  "bg-violet-50  text-violet-700 border-violet-200",
};

const LABELS: Record<BadgeVariant, string> = {
  pending:   "Pending",
  approved:  "Approved",
  rejected:  "Rejected",
  suspended: "Suspended",
  active:    "Active",
  paused:    "Paused",
  draft:     "Draft",
  disabled:  "Disabled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  paid:      "Paid",
  unpaid:    "Unpaid",
  refunded:  "Refunded",
};

export function AdminStatusBadge({ status }: { status: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        VARIANT_STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}
