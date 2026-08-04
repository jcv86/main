import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "border-[hsl(var(--primary)/0.28)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--dtc-indigo-300))]",
        secondary: "border-border bg-muted/60 text-muted-foreground",
        destructive: "border-[hsl(var(--destructive)/0.28)] bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--dtc-error-text))]",
        success: "border-[hsl(var(--dtc-teal-500)/0.28)] bg-[hsl(var(--dtc-success-bg))] text-[hsl(var(--dtc-success-text))]",
        warning: "border-[hsl(var(--dtc-amber-500)/0.28)] bg-[hsl(var(--dtc-warning-bg))] text-[hsl(var(--dtc-warning-text))]",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
