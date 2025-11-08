import * as React from "react"
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react"
import { cn } from "../../lib/utils"

export type ToastVariant = "success" | "error" | "warning" | "info"

export interface ToastProps {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

export const Toast = ({ id, message, variant = "info", duration = 3000, onClose }: ToastProps) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const variants = {
    success: {
      bg: "bg-green-400",
      border: "border-green-500",
      icon: CheckCircle2,
      iconColor: "text-green-700",
      animation: "animate-bounce",
    },
    error: {
      bg: "bg-red-400",
      border: "border-red-500",
      icon: XCircle,
      iconColor: "text-red-700",
      animation: "animate-pulse",
    },
    warning: {
      bg: "bg-yellow-400",
      border: "border-yellow-500",
      icon: AlertTriangle,
      iconColor: "text-yellow-700",
      animation: "animate-pulse",
    },
    info: {
      bg: "bg-blue-400",
      border: "border-blue-500",
      icon: Info,
      iconColor: "text-blue-700",
      animation: "animate-spin",
    },
  }

  const variantStyles = variants[variant]
  const Icon = variantStyles.icon

  return (
    <div
      className={cn(
        "animate-in slide-in-from-top-5 fade-in-0 rounded-lg border-4 border-black p-4 neobrutalism-sm shadow-lg",
        variantStyles.bg,
        variantStyles.border
      )}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            variantStyles.iconColor,
            variantStyles.animation
          )}
        />
        <p className="flex-1 text-sm font-bold text-black uppercase">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-black" />
        </button>
      </div>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

