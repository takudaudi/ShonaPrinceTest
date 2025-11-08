import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border-4 border-black bg-white px-4 py-3 text-base font-bold text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 neobrutalism-sm transition-all hover:shadow-[6px_6px_0px_0px_#000] hover:scale-[1.02] focus:shadow-[6px_6px_0px_0px_#000] focus:scale-[1.02]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

