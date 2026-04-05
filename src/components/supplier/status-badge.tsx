import { cn } from "@/lib/utils";
import type { BookingStatus, ServiceStatus } from "@/lib/mock-supplier";

type AnyStatus = BookingStatus | ServiceStatus;

const CONFIG: Record<AnyStatus, { label: string; className: string }> = {
  /* Booking */
  pending:   { label: "Pending",   className: "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-950  dark:text-amber-400  dark:border-amber-800"  },
  confirmed: { label: "Confirmed", className: "bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-950   dark:text-blue-400   dark:border-blue-800"   },
  completed: { label: "Completed", className: "bg-green-50  text-green-700  border-green-200  dark:bg-green-950  dark:text-green-400  dark:border-green-800"  },
  cancelled: { label: "Cancelled", className: "bg-red-50    text-red-600    border-red-200    dark:bg-red-950    dark:text-red-400    dark:border-red-800"    },
  /* Service */
  active:    { label: "Active",    className: "bg-green-50  text-green-700  border-green-200  dark:bg-green-950  dark:text-green-400  dark:border-green-800"  },
  paused:    { label: "Paused",    className: "bg-zinc-50   text-zinc-600   border-zinc-200   dark:bg-zinc-800   dark:text-zinc-400   dark:border-zinc-700"   },
  draft:     { label: "Draft",     className: "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-950  dark:text-amber-400  dark:border-amber-800"  },
};

interface StatusBadgeProps {
  status: AnyStatus;
  size?:  "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const { label, className } = CONFIG[status] ?? {
    label:     status,
    className: "bg-zinc-50 text-zinc-600 border-zinc-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      {label}
    </span>
  );
}
