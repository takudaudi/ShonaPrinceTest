import * as React from "react"
import { cn } from "../../lib/utils"
import { AlertCircle, X } from "lucide-react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex items-center gap-4 rounded-md border-4 border-black bg-white p-4 neobrutalism-sm",
          variant === "destructive" && "bg-red-50 border-red-500",
          className
        )}
        {...props}
      >
        {variant === "destructive" && (
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        )}
        <div className="flex-1 text-sm font-bold text-black">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }

