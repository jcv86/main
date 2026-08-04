import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(92,111,240,0.22)] hover:bg-[hsl(233_63%_55%)] hover:shadow-[0_10px_30px_rgba(92,111,240,0.28)]",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-[var(--dtc-shadow-sm)] hover:bg-destructive/88",
        outline:
          "border border-border bg-[rgba(18,24,39,0.72)] text-foreground shadow-[var(--dtc-shadow-sm)] hover:border-[rgba(126,141,255,0.72)] hover:bg-[rgba(38,49,73,0.72)] hover:text-foreground",
        secondary:
          "border border-border bg-secondary text-secondary-foreground shadow-[var(--dtc-shadow-sm)] hover:bg-[rgba(38,49,73,0.86)] hover:text-foreground",
        ghost:
          "border border-transparent text-muted-foreground hover:bg-[rgba(38,49,73,0.62)] hover:text-foreground",
        link: "h-auto rounded-none p-0 text-[hsl(var(--ring))] underline-offset-4 hover:text-[var(--dtc-indigo-300)] hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-[10px] px-3.5 text-xs",
        lg: "h-12 rounded-[14px] px-7 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
