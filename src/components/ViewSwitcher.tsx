import type { ViewType } from "../types/todo"
import { Button } from "./ui/button"
import { List, LayoutGrid, Calendar } from "lucide-react"
import { cn } from "../lib/utils"

interface ViewSwitcherProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export const ViewSwitcher = ({
  currentView,
  onViewChange,
}: ViewSwitcherProps) => {
  const views: { type: ViewType; label: string; icon: React.ReactNode }[] = [
    { type: "list", label: "List", icon: <List className="h-4 w-4" /> },
    { type: "kanban", label: "Kanban", icon: <LayoutGrid className="h-4 w-4" /> },
    { type: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
  ]

  return (
    <div className="flex gap-2 rounded-lg border-4 border-black bg-white p-2 neobrutalism-sm hover:shadow-[6px_6px_0px_0px_#000] transition-all">
      {views.map((view) => (
        <Button
          key={view.type}
          variant={currentView === view.type ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange(view.type)}
          className={cn(
            "flex items-center gap-2 uppercase transition-all",
            currentView === view.type && "bg-black text-white"
          )}
        >
          {view.icon}
          {view.label}
        </Button>
      ))}
    </div>
  )
}

