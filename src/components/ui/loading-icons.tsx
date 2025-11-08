import { Loader2, RefreshCw, Zap } from "lucide-react"
import { cn } from "../../lib/utils"

interface LoadingIconsProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "rotate" | "pulse"
}

export const LoadingIcons = ({
  className,
  size = "md",
  variant = "spinner",
}: LoadingIconsProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const iconClasses = cn(
    sizeClasses[size],
    variant === "spinner" && "animate-spin",
    variant === "rotate" && "animate-spin",
    variant === "pulse" && "animate-pulse",
    className
  )

  if (variant === "spinner") {
    return <Loader2 className={iconClasses} />
  }

  if (variant === "rotate") {
    return <RefreshCw className={iconClasses} />
  }

  return <Zap className={iconClasses} />
}

