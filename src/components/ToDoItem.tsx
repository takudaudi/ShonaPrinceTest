import { useState } from "react"
import type { Todo } from "../types/todo"
import { Button } from "./ui/button"
import { Trash2, Edit2, Check } from "lucide-react"
import { cn } from "../lib/utils"
import { EditTodoDialog } from "./EditTodoDialog"

interface ToDoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, description: string, dueDate?: string) => void
  onAddComment?: (todoId: string, text: string) => void
  onDeleteComment?: (todoId: string, commentId: string) => void
  onAddSubtask?: (todoId: string, title: string) => void
  onToggleSubtask?: (todoId: string, subtaskId: string) => void
  onDeleteSubtask?: (todoId: string, subtaskId: string) => void
  isDeleting?: boolean
  isUpdating?: boolean
  isAddingComment?: boolean
  isAddingSubtask?: boolean
  deletingCommentIds?: Set<string>
  togglingSubtaskIds?: Set<string>
  deletingSubtaskIds?: Set<string>
}

export const ToDoItem = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onAddComment,
  onDeleteComment,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  isDeleting = false,
  isUpdating = false,
  isAddingComment = false,
  isAddingSubtask = false,
  deletingCommentIds = new Set(),
  togglingSubtaskIds = new Set(),
  deletingSubtaskIds = new Set(),
}: ToDoItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleToggle = () => {
    if (!isUpdating && !isDeleting) {
      onToggle(todo.id)
    }
  }

  const handleDelete = () => {
    if (!isDeleting && !isUpdating) {
      onDelete(todo.id)
    }
  }

  const handleEdit = () => {
    if (!isDeleting && !isUpdating) {
      setIsEditDialogOpen(true)
    }
  }

  return (
    <>
      <div
        className={cn(
          "group relative rounded-lg border-4 border-black bg-white p-6 neobrutalism transition-all hover:shadow-[12px_12px_0px_0px_#000] hover:scale-[1.02] cursor-pointer",
          todo.completed && "bg-gray-100 opacity-75",
          (isDeleting || isUpdating) && "opacity-50 pointer-events-none"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isDeleting || isUpdating}
            className={cn(
              "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border-4 border-black bg-white transition-all neobrutalism-sm hover:bg-yellow-400 active:translate-x-1 active:translate-y-1 active:shadow-none",
              todo.completed && "bg-black"
            )}
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {todo.completed && (
              <Check className="h-5 w-5 text-white font-bold" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-xl font-bold text-black uppercase mb-2",
                todo.completed && "line-through text-gray-500"
              )}
            >
              {todo.title}
            </h3>
            <p
              className={cn(
                "text-base text-gray-700 font-medium",
                todo.completed && "line-through text-gray-400"
              )}
            >
              {todo.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleEdit}
              disabled={isDeleting || isUpdating}
              className="neobrutalism-sm"
              aria-label="Edit todo"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              className="neobrutalism-sm"
              aria-label="Delete todo"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <EditTodoDialog
        todo={todo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={(title, description, dueDate) => {
          onUpdate(todo.id, title, description, dueDate)
          setIsEditDialogOpen(false)
        }}
        onAddComment={onAddComment ? (text) => onAddComment(todo.id, text) : undefined}
        onDeleteComment={onDeleteComment ? (commentId) => onDeleteComment(todo.id, commentId) : undefined}
        onAddSubtask={onAddSubtask ? (title) => onAddSubtask(todo.id, title) : undefined}
        onToggleSubtask={onToggleSubtask ? (subtaskId) => onToggleSubtask(todo.id, subtaskId) : undefined}
        onDeleteSubtask={onDeleteSubtask ? (subtaskId) => onDeleteSubtask(todo.id, subtaskId) : undefined}
        isLoading={isUpdating}
        isAddingComment={isAddingComment}
        isAddingSubtask={isAddingSubtask}
        deletingCommentIds={deletingCommentIds}
        togglingSubtaskIds={togglingSubtaskIds}
        deletingSubtaskIds={deletingSubtaskIds}
      />
    </>
  )
}

