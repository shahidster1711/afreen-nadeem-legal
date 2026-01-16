import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-accent text-accent-foreground font-semibold shadow-[0_4px_20px_-2px_hsl(38_80%_50%_/_0.3)] hover:shadow-[0_20px_50px_-10px_hsl(220_60%_20%_/_0.15)] hover:scale-[1.02] active:scale-[0.98]",
        heroOutline: "border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 font-medium",
        gold: "bg-accent text-accent-foreground font-semibold hover:brightness-110 shadow-[0_4px_20px_-2px_hsl(38_80%_50%_/_0.3)]",
        navy: "bg-primary text-primary-foreground font-semibold hover:bg-primary/80 shadow-[0_4px_20px_-2px_hsl(220_60%_20%_/_0.08)]",
        navyOutline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-medium",
        legal: "bg-primary text-primary-foreground font-medium shadow-[0_8px_30px_-4px_hsl(220_60%_20%_/_0.1)] hover:shadow-[0_20px_50px_-10px_hsl(220_60%_20%_/_0.15)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
