import type React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-muted/70 via-muted to-muted/70 bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
