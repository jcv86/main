"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  indicatorColor?: React.CSSProperties["backgroundColor"]
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorClassName, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--dtc-ink-700)/0.72)] shadow-[var(--dtc-shadow-inset)]",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.28)] transition-transform duration-300 ease-out",
        indicatorClassName,
      )}
      style={{
        transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)`,
        ...(indicatorColor ? { backgroundColor: indicatorColor } : {}),
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
