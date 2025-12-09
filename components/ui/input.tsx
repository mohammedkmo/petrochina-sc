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
        // transition
        "transition-all duration-150 ease-out",
        // focus styles - Minimal
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10 focus-visible:border-gray-900",
        // hover state
        "hover:border-gray-300",
        // disabled
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border",
        // invalid
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        // RTL support
        "[dir=rtl]:text-right [dir=ltr]:text-left",
        className
      )}
      autoComplete="off"
      {...props}
    />
  )
}

export { Input }
