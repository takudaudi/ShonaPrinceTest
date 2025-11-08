import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-md border-4 border-black bg-white px-4 py-3 text-base font-bold text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-50 neobrutalism-sm resize-none transition-all hover:shadow-[6px_6px_0px_0px_#000] hover:scale-[1.01] focus:shadow-[6px_6px_0px_0px_#000] focus:scale-[1.01]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

