import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-ink-950 text-white shadow-rest hover:bg-brand-900 hover:-translate-y-px hover:shadow-card",
        secondary: "bg-paper text-ink-900 border border-line-strong hover:bg-mist-dark hover:border-ink-300",
        ghost: "bg-transparent text-ink-700 hover:bg-mist-dark",
        gold: "bg-gold-50 text-gold-700 border border-gold-100 hover:bg-gold-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-[42px] px-5",
        sm: "h-[34px] px-3.5 text-[13px]",
        lg: "h-[50px] px-7 text-[15.5px]",
        icon: "h-[38px] w-[38px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
