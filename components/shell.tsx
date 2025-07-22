import type React from "react"
import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col space-y-6 p-6 md:p-8", className)} {...props}>
      {children}
    </div>
  )
}
