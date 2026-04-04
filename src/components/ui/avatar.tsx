"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        xs:  "h-6 w-6 rounded-lg text-xs",
        sm:  "h-8 w-8 rounded-xl text-sm",
        md:  "h-10 w-10 rounded-xl text-sm",
        lg:  "h-12 w-12 rounded-2xl text-base",
        xl:  "h-16 w-16 rounded-2xl text-lg",
        "2xl": "h-20 w-20 rounded-3xl text-xl",
      },
      shape: {
        circle: "rounded-full",
        square: "",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
);

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, shape, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, shape }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center",
      "bg-brand-gradient text-white font-semibold",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/** Avatar group — stacked avatars */
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  count?: number;
}

function AvatarGroup({ children, max = 4, count, className, ...props }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children);
  const visible = childArray.slice(0, max);
  const overflow = count ?? (childArray.length > max ? childArray.length - max : 0);

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-[--bg] rounded-full">
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div className="ring-2 ring-[--bg] rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[--bg-muted] text-xs font-medium text-[--text-2]">
            +{overflow}
          </div>
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
