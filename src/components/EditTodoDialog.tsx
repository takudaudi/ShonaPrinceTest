import { useState, useEffect } from "react"
import type { Todo } from "../types/todo"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { LoadingSpinner } from "./ui/loading-spinner"
import { CommentsSection } from "./CommentsSection"
import { SubtasksSection } from "./SubtasksSection"

interface EditTodoDialogProps {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (title: string, description: string, dueDate?: string) => void
  onAddComment?: (text: string) => void
  onDeleteComment?: (commentId: string) => void
  onAddSubtask?: (title: string) => void
  onToggleSubtask?: (subtaskId: string) => void
  onDeleteSubtask?: (subtaskId: string) => void
  isLoading?: boolean
  isAddingComment?: boolean
  isAddingSubtask?: boolean
  deletingCommentIds?: Set<string>
  togglingSubtaskIds?: Set<string>
  deletingSubtaskIds?: Set<string>
}

export const EditTodoDialog = ({
  todo,
  open,
  onOpenChange,
  onSave,
  onAddComment,
  onDeleteComment,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  isLoading = false,
  isAddingComment = false,
  isAddingSubtask = false,
  deletingCommentIds = new Set(),
  togglingSubtaskIds = new Set(),
  deletingSubtaskIds = new Set(),
}: EditTodoDialogProps) => {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)
  const [dueDate, setDueDate] = useState(todo.dueDate || "")
  // Error state for validation messages
  const [errors, setErrors] = useState<{ title?: string; description?: string; dueDate?: string }>({})

  /**
   * Reset form fields when dialog opens/closes
   * Ensures form shows current todo data when opened
   */
  useEffect(() => {
    if (open) {
      setTitle(todo.title)
      setDescription(todo.description)
      setDueDate(todo.dueDate || "")
      setErrors({}) // Clear errors when dialog opens
    }
  }, [open, todo])

  /**
   * Validates form inputs before saving
   * Returns true if all validations pass, false otherwise
   * Sets error messages for invalid fields
   */
  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string; dueDate?: string } = {}

    // Title validation: required, min 3 chars, max 100 chars
    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    // Description validation: if provided, must be at least 4 characters
    if (description.trim() && description.trim().length < 4) {
      newErrors.description = "Description must be at least 4 characters"
    } else if (description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    // Due date validation: cannot be in the past
    if (dueDate) {
      const selectedDate = new Date(dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles the main form submission for editing todo
   * Only submits if validation passes and not currently loading
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent any nested form submissions from triggering this
    if (validate() && !isLoading) {
      onSave(title.trim(), description.trim(), dueDate || undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit To-Do</DialogTitle>
            <DialogDescription>
              Update the title and description of your to-do item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-title"
                className="text-sm font-bold text-black uppercase"
              >
                Title *
              </label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }))
                  }
                }}
                disabled={isLoading}
                required
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-xs font-bold text-red-600 uppercase">
                  {errors.title}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-description"
                className="text-sm font-bold text-black uppercase"
              >
                Description
              </label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  // Clear error when user starts typing
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }))
                  }
                }}
                disabled={isLoading}
                className={errors.description ? "w-full border-red-500" : "w-full"}
                maxLength={500}
                placeholder="Enter description (minimum 4 characters if provided)..."
              />
              {errors.description && (
                <p className="text-xs font-bold text-red-600 uppercase">
                  {errors.description}
                </p>
              )}
              {description && !errors.description && (
                <p className="text-xs font-medium text-gray-500">
                  {description.length}/500 characters
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-dueDate"
                className="text-sm font-bold text-black uppercase"
              >
                Due Date
              </label>
              <Input
                id="edit-dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (errors.dueDate) {
                    setErrors((prev) => ({ ...prev, dueDate: undefined }))
                  }
                }}
                disabled={isLoading}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && (
                <p className="text-xs font-bold text-red-600 uppercase">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Subtasks Section */}
          {onAddSubtask && onToggleSubtask && onDeleteSubtask && (
            <SubtasksSection
              subtasks={todo.subtasks}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              isAddingSubtask={isAddingSubtask}
              togglingSubtaskIds={togglingSubtaskIds}
              deletingSubtaskIds={deletingSubtaskIds}
            />
          )}

          {/* Comments Section */}
          {onAddComment && onDeleteComment && (
            <CommentsSection
              comments={todo.comments}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              isAddingComment={isAddingComment}
              deletingCommentIds={deletingCommentIds}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

