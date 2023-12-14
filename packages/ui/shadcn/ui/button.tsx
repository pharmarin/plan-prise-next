import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn, tw } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      loading: {
        true: tw`cursor-not-allowed`,
        false: tw``,
      },
      variant: {
        default: tw`bg-primary text-primary-foreground shadow hover:bg-primary/90`,
        gradient: tw`text-primary-foreground bg-gradient-to-r from-emerald-500 to-teal-500 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-slate-500`,
        destructive: tw`bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:text-white`,
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      loading: false,
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant, size, loading, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ loading, variant, size, className }))}
        ref={ref}
        {...props}
        disabled={loading ?? props.disabled}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
