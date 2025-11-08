import { useState } from "react"
import type { Todo, TodoStatus } from "../types/todo"
import { LoadingSpinner } from "./ui/loading-spinner"
import { EditTodoDialog } from "./EditTodoDialog"
import { cn } from "../lib/utils"
import { format } from "date-fns"

interface KanbanBoardProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, description: string, dueDate?: string) => void
  onStatusChange: (id: string, status: TodoStatus) => void
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

const columns: { status: TodoStatus; label: string; color: string }[] = [
  { status: "todo", label: "To Do", color: "bg-yellow-400" },
  { status: "in-progress", label: "In Progress", color: "bg-blue-400" },
  { status: "done", label: "Done", color: "bg-green-400" },
]

export const KanbanBoard = ({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  onStatusChange,
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
}: KanbanBoardProps) => {
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleDragStart = (todoId: string) => {
    setDraggedTodo(todoId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: TodoStatus) => {
    if (draggedTodo) {
      onStatusChange(draggedTodo, status)
      setDraggedTodo(null)
    }
  }

  const getTodosByStatus = (status: TodoStatus) => {
    return todos.filter((todo) => todo.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTodos = getTodosByStatus(column.status)
        return (
          <div
            key={column.status}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
          >
            {/* Column Header */}
            <div
              className={cn(
                "rounded-lg border-4 border-black p-4 mb-4 neobrutalism-sm hover:shadow-[6px_6px_0px_0px_#000] transition-all",
                column.color
              )}
            >
              <h3 className="text-xl font-black text-black uppercase">
                {column.label}
              </h3>
              <p className="text-sm font-bold text-black/70">
                {columnTodos.length} {columnTodos.length === 1 ? "task" : "tasks"}
              </p>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-3 min-h-[200px]">
              {columnTodos.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-400 p-8 text-center">
                  <p className="text-sm font-bold text-gray-500 uppercase">
                    No tasks
                  </p>
                </div>
              ) : (
                columnTodos.map((todo) => (
                  <div
                    key={todo.id}
                    draggable
                    onDragStart={() => handleDragStart(todo.id)}
                    className="cursor-move"
                  >
                    <div
                      onClick={() => {
                        setEditingTodo(todo)
                        setIsEditDialogOpen(true)
                      }}
                      className="rounded-lg border-4 border-black bg-white p-4 neobrutalism-sm hover:shadow-[6px_6px_0px_0px_#000] hover:scale-105 transition-all cursor-pointer"
                    >
                      <div className="mb-2">
                        <h4 className="text-lg font-black text-black uppercase mb-1">
                          {todo.title}
                        </h4>
                        <p className="text-sm font-medium text-gray-700 line-clamp-2">
                          {todo.description}
                        </p>
                      </div>
                      {todo.dueDate && (
                        <div className="mb-2">
                          <span className="text-xs font-bold text-gray-600 uppercase">
                            Due: {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(todo.id, "todo")
                          }}
                          disabled={todo.status === "todo" || updatingIds.has(todo.id)}
                          className={cn(
                            "px-3 py-1 text-xs font-bold uppercase rounded border-2 border-black",
                            todo.status === "todo"
                              ? "bg-yellow-400 text-black"
                              : "bg-white text-black hover:bg-yellow-100"
                          )}
                        >
                          To Do
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(todo.id, "in-progress")
                          }}
                          disabled={todo.status === "in-progress" || updatingIds.has(todo.id)}
                          className={cn(
                            "px-3 py-1 text-xs font-bold uppercase rounded border-2 border-black",
                            todo.status === "in-progress"
                              ? "bg-blue-400 text-black"
                              : "bg-white text-black hover:bg-blue-100"
                          )}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(todo.id, "done")
                          }}
                          disabled={todo.status === "done" || updatingIds.has(todo.id)}
                          className={cn(
                            "px-3 py-1 text-xs font-bold uppercase rounded border-2 border-black",
                            todo.status === "done"
                              ? "bg-green-400 text-black"
                              : "bg-white text-black hover:bg-green-100"
                          )}
                        >
                          Done
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(todo.id)
                          }}
                          disabled={deletingIds.has(todo.id) || updatingIds.has(todo.id)}
                          className="px-3 py-1 text-xs font-bold uppercase rounded border-2 border-black bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}

      {/* Edit Todo Dialog */}
      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={(title, description, dueDate) => {
            onUpdate(editingTodo.id, title, description, dueDate)
            setIsEditDialogOpen(false)
            setEditingTodo(null)
          }}
          onAddComment={onAddComment ? (text) => onAddComment(editingTodo.id, text) : undefined}
          onDeleteComment={onDeleteComment ? (commentId) => onDeleteComment(editingTodo.id, commentId) : undefined}
          onAddSubtask={onAddSubtask ? (title) => onAddSubtask(editingTodo.id, title) : undefined}
          onToggleSubtask={onToggleSubtask ? (subtaskId) => onToggleSubtask(editingTodo.id, subtaskId) : undefined}
          onDeleteSubtask={onDeleteSubtask ? (subtaskId) => onDeleteSubtask(editingTodo.id, subtaskId) : undefined}
          isLoading={updatingIds.has(editingTodo.id)}
          isAddingComment={addingCommentIds.has(editingTodo.id)}
          isAddingSubtask={addingSubtaskIds.has(editingTodo.id)}
          deletingCommentIds={deletingCommentIds}
          togglingSubtaskIds={togglingSubtaskIds}
          deletingSubtaskIds={deletingSubtaskIds}
        />
      )}
    </div>
  )
}

