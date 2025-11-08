import { useState } from "react"
import type { Todo } from "../types/todo"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import { EditTodoDialog } from "./EditTodoDialog"
import { cn } from "../lib/utils"

interface CalendarViewProps {
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

export const CalendarView = ({
  todos,
  onToggle: _onToggle, // Unused but kept for API consistency
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
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const getTodosForDate = (date: Date) => {
    return todos.filter((todo) => {
      if (!todo.dueDate) return false
      return isSameDay(new Date(todo.dueDate), date)
    })
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between rounded-lg border-4 border-black bg-white p-4 neobrutalism">
        <Button
          variant="outline"
          size="icon"
          onClick={previousMonth}
          className="neobrutalism-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-black text-black uppercase">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="neobrutalism-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border-4 border-black bg-white p-4 neobrutalism">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-black text-black uppercase py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayTodos = getTodosForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] rounded-lg border-4 border-black p-2 neobrutalism-sm transition-all hover:shadow-[4px_4px_0px_0px_#000] hover:scale-105",
                  isCurrentMonth ? "bg-white" : "bg-gray-100",
                  isToday && "bg-yellow-400"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-black mb-2",
                    isCurrentMonth ? "text-black" : "text-gray-400",
                    isToday && "text-black"
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayTodos.slice(0, 3).map((todo) => (
                    <div
                      key={todo.id}
                      onClick={() => {
                        setEditingTodo(todo)
                        setIsEditDialogOpen(true)
                      }}
                      className={cn(
                        "text-xs font-bold p-1 rounded border-2 border-black truncate cursor-pointer hover:shadow-[2px_2px_0px_0px_#000] transition-all hover:scale-110",
                        todo.completed
                          ? "bg-green-400 text-black line-through"
                          : todo.status === "in-progress"
                          ? "bg-blue-400 text-black"
                          : "bg-yellow-400 text-black"
                      )}
                      title={`${todo.title} - Click to edit`}
                    >
                      {todo.title}
                    </div>
                  ))}
                  {dayTodos.length > 3 && (
                    <div className="text-xs font-bold text-gray-600">
                      +{dayTodos.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Todos List for Selected Month */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-black uppercase">
          Tasks This Month
        </h3>
        <div className="space-y-2">
          {todos
            .filter((todo) => {
              if (!todo.dueDate) return false
              const todoDate = new Date(todo.dueDate)
              return (
                todoDate >= monthStart &&
                todoDate <= monthEnd
              )
            })
            .map((todo) => (
              <div
                key={todo.id}
                className="rounded-lg border-4 border-black bg-white p-4 neobrutalism-sm hover:shadow-[6px_6px_0px_0px_#000] hover:scale-105 transition-all cursor-pointer"
                onClick={() => {
                  setEditingTodo(todo)
                  setIsEditDialogOpen(true)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-black uppercase mb-1">
                      {todo.title}
                    </h4>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {todo.description}
                    </p>
                    {todo.dueDate && (
                      <p className="text-xs font-bold text-gray-600 uppercase">
                        Due: {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
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
            ))}
        </div>
      </div>

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

