import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 whitespace-nowrap border",
  {
    variants: {
      variant: {
        green: "bg-green-50 text-green-700 border-green-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        red: "bg-red-50 text-red-700 border-red-100",
        ink: "bg-ink-100 text-ink-700 border-ink-200",
        gold: "bg-gold-50 text-gold-700 border-gold-100",
      },
    },
    defaultVariants: { variant: "ink" },
  }
);

const dotColor: Record<string, string> = {
  green: "bg-green-600",
  amber: "bg-amber-600",
  red: "bg-red-600",
  ink: "bg-ink-500",
  gold: "bg-gold-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotColor[variant ?? "ink"])} />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
