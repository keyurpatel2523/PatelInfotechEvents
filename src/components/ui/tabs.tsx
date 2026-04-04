"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        default: [
          "bg-[--bg-muted] p-1 rounded-xl gap-0.5",
        ],
        underline: [
          "border-b border-[--border] gap-0 rounded-none bg-transparent p-0",
        ],
        pills: [
          "gap-1 bg-transparent p-0",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-lg px-3 py-1.5 text-[--text-3]",
          "data-[state=active]:bg-[--bg] data-[state=active]:text-[--text-1]",
          "data-[state=active]:shadow-[var(--shadow-sm)]",
          "hover:text-[--text-2]",
        ],
        underline: [
          "rounded-none px-4 py-2.5 text-[--text-3]",
          "border-b-2 border-transparent -mb-px",
          "data-[state=active]:border-[#6366f1] data-[state=active]:text-[--text-1]",
          "hover:text-[--text-2]",
        ],
        pills: [
          "rounded-full px-4 py-1.5 text-[--text-3]",
          "data-[state=active]:bg-brand-gradient data-[state=active]:text-white",
          "hover:bg-[--bg-muted] hover:text-[--text-2]",
          "data-[state=active]:shadow-[var(--shadow-sm)]",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none",
      "data-[state=inactive]:hidden",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
