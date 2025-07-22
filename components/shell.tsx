import type React from "react"
import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ className, children, ...props }: ShellProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)} {...props}>
      {children}
    </div>
  )
}
