import { useState } from "react"
import type { Subtask } from "../types/todo"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Check, Plus, Trash2, ListTodo } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import { cn } from "../lib/utils"

interface SubtasksSectionProps {
  subtasks: Subtask[]
  onAddSubtask: (title: string) => void
  onToggleSubtask: (subtaskId: string) => void
  onDeleteSubtask: (subtaskId: string) => void
  isLoading?: boolean
  isAddingSubtask?: boolean
  togglingSubtaskIds?: Set<string>
  deletingSubtaskIds?: Set<string>
}

export const SubtasksSection = ({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  isLoading = false,
  isAddingSubtask = false,
  togglingSubtaskIds = new Set(),
  deletingSubtaskIds = new Set(),
}: SubtasksSectionProps) => {
  const [newSubtask, setNewSubtask] = useState("")
  const [showInput, setShowInput] = useState(false)
  // Error state for subtask validation
  const [subtaskError, setSubtaskError] = useState<string>("")

  /**
   * Validates subtask before submission
   * Subtasks must be at least 2 characters and max 100 characters
   */
  const validateSubtask = (): boolean => {
    const trimmed = newSubtask.trim()
    
    if (!trimmed) {
      setSubtaskError("Subtask title cannot be empty")
      return false
    }
    
    if (trimmed.length < 2) {
      setSubtaskError("Subtask title must be at least 2 characters")
      return false
    }
    
    if (trimmed.length > 100) {
      setSubtaskError("Subtask title must be less than 100 characters")
      return false
    }
    
    setSubtaskError("")
    return true
  }

  /**
   * Handles subtask form submission
   * Validates subtask before adding
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateSubtask() && !isAddingSubtask) {
      onAddSubtask(newSubtask.trim())
      setNewSubtask("")
      setShowInput(false)
      setSubtaskError("") // Clear error on success
    }
  }

  const completedCount = subtasks.filter((st) => st.completed).length
  const progressPercentage =
    subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <LoadingSpinner size="sm" variant="rotate" />
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-black uppercase flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          Subtasks ({completedCount}/{subtasks.length})
        </h4>
        {!showInput && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInput(true)}
            className="neobrutalism-sm"
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Subtask
          </Button>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 border-2 border-black">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {showInput && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              placeholder="Enter subtask title (minimum 2 characters)..."
              value={newSubtask}
              onChange={(e) => {
                setNewSubtask(e.target.value)
                // Clear error when user starts typing
                if (subtaskError) {
                  setSubtaskError("")
                }
              }}
              disabled={isAddingSubtask}
              className={subtaskError ? "neobrutalism-sm border-red-500" : "neobrutalism-sm"}
              autoFocus
              maxLength={100}
            />
            {subtaskError && (
              <p className="mt-1 text-xs font-bold text-red-600 uppercase">
                {subtaskError}
              </p>
            )}
            {newSubtask && !subtaskError && (
              <p className="mt-1 text-xs font-medium text-gray-500">
                {newSubtask.length}/100 characters
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!newSubtask.trim() || isAddingSubtask || !!subtaskError}
              className="neobrutalism-sm"
            >
              {isAddingSubtask ? (
                <>
                  <LoadingSpinner size="sm" variant="pulse" className="mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-2" />
                  Add
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowInput(false)
                setNewSubtask("")
              }}
              disabled={isAddingSubtask}
              className="neobrutalism-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {subtasks.length === 0 ? (
          <p className="text-xs font-medium text-gray-500 italic">
            No subtasks yet. Add your first subtask!
          </p>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] hover:scale-[1.02] transition-all",
                subtask.completed && "bg-gray-100 opacity-75",
                (togglingSubtaskIds.has(subtask.id) ||
                  deletingSubtaskIds.has(subtask.id)) &&
                  "opacity-50"
              )}
            >
              <button
                onClick={() => onToggleSubtask(subtask.id)}
                disabled={
                  togglingSubtaskIds.has(subtask.id) ||
                  deletingSubtaskIds.has(subtask.id)
                }
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 border-black bg-white transition-all neobrutalism-sm hover:bg-yellow-400",
                  subtask.completed && "bg-black"
                )}
                aria-label={
                  subtask.completed ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {togglingSubtaskIds.has(subtask.id) ? (
                  <LoadingSpinner size="sm" variant="pulse" />
                ) : subtask.completed ? (
                  <Check className="h-4 w-4 text-white font-bold" />
                ) : null}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm font-medium text-black",
                  subtask.completed && "line-through text-gray-500"
                )}
              >
                {subtask.title}
              </span>
              <button
                onClick={() => onDeleteSubtask(subtask.id)}
                disabled={
                  togglingSubtaskIds.has(subtask.id) ||
                  deletingSubtaskIds.has(subtask.id)
                }
                className="flex-shrink-0 p-1 rounded hover:bg-red-100 transition-colors"
                aria-label="Delete subtask"
              >
                {deletingSubtaskIds.has(subtask.id) ? (
                  <LoadingSpinner size="sm" variant="pulse" />
                ) : (
                  <Trash2 className="h-3 w-3 text-red-600" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

