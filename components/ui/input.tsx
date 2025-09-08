import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // size and shape
        "w-full rounded-lg border border-border bg-white px-4 py-2 text-base md:text-sm",
        // placeholder and selection
        "placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground",
        // transition and shadow subtle
        "transition-[border-color,box-shadow,background-color,color]",
        // focus styles
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary",
        // disabled
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // invalid
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      autoComplete="off"
      {...props}
    />
  )
}

export { Input }
