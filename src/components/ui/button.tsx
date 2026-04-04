"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-all duration-200 cursor-pointer select-none",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-brand-gradient text-white shadow-md",
          "hover:opacity-90 hover:shadow-lg hover:-translate-y-px",
          "active:translate-y-0 active:opacity-100",
        ],
        secondary: [
          "bg-[--bg-muted] text-[--text-1] border border-[--border]",
          "hover:bg-[--bg-subtle] hover:border-[--text-4]",
          "dark:bg-zinc-800 dark:hover:bg-zinc-700",
        ],
        outline: [
          "border border-[--border] bg-transparent text-[--text-1]",
          "hover:bg-[--bg-muted] hover:border-[--text-3]",
        ],
        ghost: [
          "bg-transparent text-[--text-2]",
          "hover:bg-[--bg-muted] hover:text-[--text-1]",
        ],
        destructive: [
          "bg-red-500 text-white shadow-sm",
          "hover:bg-red-600 hover:shadow-md hover:-translate-y-px",
        ],
        link: [
          "text-[#6366f1] underline-offset-4 hover:underline p-0 h-auto",
        ],
        brand: [
          "bg-brand-gradient text-white shadow-[var(--shadow-glow)]",
          "hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0",
        ],
      },
      size: {
        xs:  "h-7 px-2.5 text-xs rounded-lg gap-1.5",
        sm:  "h-8 px-3 text-sm rounded-xl gap-1.5",
        md:  "h-9 px-4 text-sm rounded-xl",
        lg:  "h-10 px-5 text-sm rounded-2xl",
        xl:  "h-12 px-6 text-base rounded-2xl",
        icon: "h-9 w-9 rounded-xl",
        "icon-sm": "h-7 w-7 rounded-lg",
        "icon-lg": "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    // When asChild=true (Slot), we cannot pass loading spinner alongside children
    // because Slot requires a single React element child. Only add spinner for non-asChild.
    const Comp = asChild ? Slot : "button";
    const inner = asChild ? (
      children
    ) : (
      <>
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </>
    );

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {inner}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
