import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: [
          "bg-[--bg] border-[--border]",
          "shadow-[var(--shadow-sm)]",
        ],
        elevated: [
          "bg-[--bg-subtle] border-[--border]",
          "shadow-[var(--shadow-md)]",
        ],
        outline: [
          "bg-transparent border-[--border]",
        ],
        ghost: [
          "bg-transparent border-transparent",
        ],
        glass: [
          "glass border-[--border]",
          "shadow-[var(--shadow-md)]",
        ],
        brand: [
          "bg-brand-gradient text-white border-transparent",
          "shadow-[var(--shadow-glow)]",
        ],
      },
      interactive: {
        true: "cursor-pointer hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 hover:border-[--text-4]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold text-[--text-1] leading-tight tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[--text-3]", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 px-6 pb-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
