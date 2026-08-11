import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-[42px] w-full rounded-sm border border-line-strong bg-paper px-3 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
