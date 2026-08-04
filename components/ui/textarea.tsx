import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full resize-y rounded-[var(--dtc-radius-md)] border border-input bg-card px-4 py-3 text-sm text-foreground shadow-[var(--dtc-shadow-inset)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground hover:border-[hsl(var(--dtc-ink-600))] focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-[hsl(var(--ring)/0.16)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
