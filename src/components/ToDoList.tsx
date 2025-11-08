import type { Todo } from "../types/todo"
import { ToDoItem } from "./ToDoItem"
import { LoadingSpinner } from "./ui/loading-spinner"

interface ToDoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, description: string, dueDate?: string) => void
  onAddComment?: (todoId: string, text: string) => void
  onDeleteComment?: (todoId: string, commentId: string) => void
  onAddSubtask?: (todoId: string, title: string) => void
  onToggleSubtask?: (todoId: string, subtaskId: string) => void
  onDeleteSubtask?: (todoId: string, subtaskId: string) => void
  isLoading?: boolean
  deletingIds?: Set<string>
  updatingIds?: Set<string>
  addingCommentIds?: Set<string>
  deletingCommentIds?: Set<string>
  addingSubtaskIds?: Set<string>
  togglingSubtaskIds?: Set<string>
  deletingSubtaskIds?: Set<string>
}

export const ToDoList = ({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  onAddComment,
  onDeleteComment,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  isLoading = false,
  deletingIds = new Set(),
  updatingIds = new Set(),
  addingCommentIds = new Set(),
  deletingCommentIds = new Set(),
  addingSubtaskIds = new Set(),
  togglingSubtaskIds = new Set(),
  deletingSubtaskIds = new Set(),
}: ToDoListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block rounded-lg border-4 border-black bg-yellow-400 p-8 neobrutalism">
          <p className="text-2xl font-bold text-black uppercase">
            No To-Dos Yet!
          </p>
          <p className="text-lg text-black mt-2 font-medium">
            Add your first task to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <ToDoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          isDeleting={deletingIds.has(todo.id)}
          isUpdating={updatingIds.has(todo.id)}
          isAddingComment={addingCommentIds.has(todo.id)}
          isAddingSubtask={addingSubtaskIds.has(todo.id)}
          deletingCommentIds={deletingCommentIds}
          togglingSubtaskIds={togglingSubtaskIds}
          deletingSubtaskIds={deletingSubtaskIds}
        />
      ))}
    </div>
  )
}

