import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[--text-3]">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-xl border border-[--border] bg-[--bg]",
            "px-3 py-2 text-sm text-[--text-1]",
            "placeholder:text-[--text-4]",
            "transition-all duration-200",
            "hover:border-[--text-3]",
            "focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            startIcon && "pl-9",
            endIcon && "pr-9",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center text-[--text-3]">
            {endIcon}
          </div>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
