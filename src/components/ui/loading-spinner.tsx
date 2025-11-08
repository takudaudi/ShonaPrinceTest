import { cn } from "../../lib/utils"
import { LoadingIcons } from "./loading-icons"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "rotate" | "pulse"
}

export const LoadingSpinner = ({
  className,
  size = "md",
  variant = "spinner",
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label="Loading"
    >
      <LoadingIcons size={size} variant={variant} className="text-black" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

