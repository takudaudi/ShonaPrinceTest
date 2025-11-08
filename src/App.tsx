import { useState, useEffect } from "react"
import type { Todo, ApiError, ViewType, TodoStatus } from "./types/todo"
import { ToDoList } from "./components/ToDoList"
import { AddToDoForm } from "./components/AddToDoForm"
import { ViewSwitcher } from "./components/ViewSwitcher"
import { KanbanBoard } from "./components/KanbanBoard"
import { CalendarView } from "./components/CalendarView"
import { Alert } from "./components/ui/alert"
import { ToastContainer } from "./components/ui/toast"
import { Footer } from "./components/Footer"
import { DeveloperPanel } from "./components/DeveloperPanel"
import { LogoWatermark } from "./components/LogoWatermark"
import { useToast } from "./hooks/useToast"
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  addComment,
  deleteComment,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
} from "./services/mockApi"

/**
 * Main App Component
 * Manages global state for todos, loading states, and error handling
 * Coordinates all CRUD operations and view switching
 */
function App() {
  // State management for todos and UI states
  const [todos, setTodos] = useState<Todo[]>([]) // Main todos array
  const [isLoading, setIsLoading] = useState(true) // Loading state for initial fetch
  const [isCreating, setIsCreating] = useState(false) // Loading state for creating todos
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set()) // Track which todos are being deleted
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set()) // Track which todos are being updated
  const [error, setError] = useState<string | null>(null) // Global error message
  const [currentView, setCurrentView] = useState<ViewType>("list") // Current view: list, kanban, or calendar
  
  // State for comments operations
  const [addingCommentIds, setAddingCommentIds] = useState<Set<string>>(new Set()) // Track todos with pending comment additions
  const [deletingCommentIds, setDeletingCommentIds] = useState<Set<string>>(new Set()) // Track comments being deleted
  
  // State for subtasks operations
  const [addingSubtaskIds, setAddingSubtaskIds] = useState<Set<string>>(new Set()) // Track todos with pending subtask additions
  const [togglingSubtaskIds, setTogglingSubtaskIds] = useState<Set<string>>(new Set()) // Track subtasks being toggled
  const [deletingSubtaskIds, setDeletingSubtaskIds] = useState<Set<string>>(new Set()) // Track subtasks being deleted
  
  // Toast notification hook for user feedback
  const toast = useToast()

  /**
   * Fetch todos on component mount
   * This loads data from the mock API (which now uses localStorage)
   * Data will persist across page reloads
   */
  useEffect(() => {
    loadTodos()
  }, [])

  /**
   * Loads todos from the API
   * Handles loading state and error display
   * Data is automatically loaded from localStorage by the mock API
   */
  const loadTodos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchTodos()
      setTodos(response.data) // Update state with fetched todos
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to load todos"
      setError(errorMessage)
      toast.error(errorMessage) // Show error toast
    } finally {
      setIsLoading(false) // Always stop loading regardless of success/failure
    }
  }

  const handleCreate = async (title: string, description: string, dueDate?: string) => {
    setIsCreating(true)
    setError(null)
    try {
      const response = await createTodo({ title, description, dueDate })
      setTodos((prev) => [response.data, ...prev])
      toast.success("To-Do created successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to create todo"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    setUpdatingIds((prev) => new Set(prev).add(id))
    setError(null)
    try {
      const response = await updateTodo(id, { completed: !todo.completed })
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      )
      toast.success(
        response.data.completed
          ? "To-Do marked as complete!"
          : "To-Do marked as incomplete!"
      )
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to update todo"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleUpdate = async (id: string, title: string, description: string, dueDate?: string) => {
    setUpdatingIds((prev) => new Set(prev).add(id))
    setError(null)
    try {
      const response = await updateTodo(id, { title, description, dueDate })
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      )
      toast.success("To-Do updated successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to update todo"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id))
    setError(null)
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
      toast.success("To-Do deleted successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to delete todo"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleStatusChange = async (id: string, status: TodoStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(id))
    setError(null)
    try {
      const response = await updateTodo(id, { status })
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      )
      const statusLabels: Record<TodoStatus, string> = {
        todo: "To Do",
        "in-progress": "In Progress",
        done: "Done",
      }
      toast.success(`Status changed to ${statusLabels[status]}!`)
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to update todo status"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleAddComment = async (todoId: string, text: string) => {
    setAddingCommentIds((prev) => new Set(prev).add(todoId))
    setError(null)
    try {
      const response = await addComment(todoId, { text })
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? response.data : t))
      )
      toast.success("Comment added successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to add comment"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setAddingCommentIds((prev) => {
        const next = new Set(prev)
        next.delete(todoId)
        return next
      })
    }
  }

  const handleDeleteComment = async (todoId: string, commentId: string) => {
    setDeletingCommentIds((prev) => new Set(prev).add(commentId))
    setError(null)
    try {
      const response = await deleteComment(todoId, commentId)
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? response.data : t))
      )
      toast.success("Comment deleted successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to delete comment"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setDeletingCommentIds((prev) => {
        const next = new Set(prev)
        next.delete(commentId)
        return next
      })
    }
  }

  const handleAddSubtask = async (todoId: string, title: string) => {
    setAddingSubtaskIds((prev) => new Set(prev).add(todoId))
    setError(null)
    try {
      const response = await addSubtask(todoId, { title })
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? response.data : t))
      )
      toast.success("Subtask added successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to add subtask"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setAddingSubtaskIds((prev) => {
        const next = new Set(prev)
        next.delete(todoId)
        return next
      })
    }
  }

  const handleToggleSubtask = async (todoId: string, subtaskId: string) => {
    setTogglingSubtaskIds((prev) => new Set(prev).add(subtaskId))
    setError(null)
    try {
      const response = await toggleSubtask(todoId, subtaskId)
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? response.data : t))
      )
      toast.success("Subtask updated successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to toggle subtask"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setTogglingSubtaskIds((prev) => {
        const next = new Set(prev)
        next.delete(subtaskId)
        return next
      })
    }
  }

  const handleDeleteSubtask = async (todoId: string, subtaskId: string) => {
    setDeletingSubtaskIds((prev) => new Set(prev).add(subtaskId))
    setError(null)
    try {
      const response = await deleteSubtask(todoId, subtaskId)
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? response.data : t))
      )
      toast.success("Subtask deleted successfully!")
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Failed to delete subtask"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setDeletingSubtaskIds((prev) => {
        const next = new Set(prev)
        next.delete(subtaskId)
        return next
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-pink-100">
      {/* Logo Watermark - Rendered at the top */}
      <LogoWatermark />
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-black uppercase mb-4 tracking-tight">
            To-Do App
          </h1>
          <p className="text-lg sm:text-xl font-bold text-gray-700">
            Manage your tasks with style
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert variant="destructive" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddToDoForm onSubmit={handleCreate} isLoading={isCreating} />
        </div>

        {/* View Switcher */}
        <div className="mb-6">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>

        {/* Todo Views */}
      <div>
          <h2 className="text-3xl font-black text-black uppercase mb-6">
            Your To-Dos
          </h2>
          {currentView === "list" && (
            <ToDoList
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isLoading={isLoading}
              deletingIds={deletingIds}
              updatingIds={updatingIds}
            />
          )}
          {currentView === "kanban" && (
            <KanbanBoard
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onStatusChange={handleStatusChange}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteSubtask={handleDeleteSubtask}
              isLoading={isLoading}
              deletingIds={deletingIds}
              updatingIds={updatingIds}
              addingCommentIds={addingCommentIds}
              deletingCommentIds={deletingCommentIds}
              addingSubtaskIds={addingSubtaskIds}
              togglingSubtaskIds={togglingSubtaskIds}
              deletingSubtaskIds={deletingSubtaskIds}
            />
          )}
          {currentView === "calendar" && (
            <CalendarView
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteSubtask={handleDeleteSubtask}
              isLoading={isLoading}
              deletingIds={deletingIds}
              updatingIds={updatingIds}
              addingCommentIds={addingCommentIds}
              deletingCommentIds={deletingCommentIds}
              addingSubtaskIds={addingSubtaskIds}
              togglingSubtaskIds={togglingSubtaskIds}
              deletingSubtaskIds={deletingSubtaskIds}
            />
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      {/* Footer */}
      <Footer />

      {/* Developer Panel */}
      <DeveloperPanel />
      </div>
  )
}

export default App
