import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium border transition-colors",
  {
    variants: {
      variant: {
        default: [
          "bg-brand-100 text-brand-700 border-brand-200",
          "dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800",
        ],
        secondary: [
          "bg-zinc-100 text-zinc-700 border-zinc-200",
          "dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
        ],
        outline: [
          "bg-transparent text-[--text-2] border-[--border]",
        ],
        success: [
          "bg-green-50 text-green-700 border-green-200",
          "dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        ],
        warning: [
          "bg-amber-50 text-amber-700 border-amber-200",
          "dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        ],
        danger: [
          "bg-red-50 text-red-700 border-red-200",
          "dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        ],
        brand: [
          "bg-brand-gradient text-white border-transparent shadow-sm",
        ],
        violet: [
          "bg-violet-50 text-violet-700 border-violet-200",
          "dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
        ],
      },
      size: {
        sm: "text-xs px-2 py-0.5 rounded-md",
        md: "text-xs px-2.5 py-1 rounded-lg",
        lg: "text-sm px-3 py-1 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
