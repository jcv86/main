import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[12px] border border-input bg-[rgba(13,18,32,0.78)] px-3.5 py-2.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[border-color,background-color,box-shadow] duration-200 ease-out file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-muted-foreground/80 hover:border-[rgba(126,141,255,0.42)] focus-visible:border-[rgba(126,141,255,0.82)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
