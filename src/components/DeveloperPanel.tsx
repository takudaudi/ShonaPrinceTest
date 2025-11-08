import { useState, useRef, useEffect } from "react"
import { Code2, Play, CheckCircle2, XCircle, Loader2, GripVertical } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { cn } from "../lib/utils"
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
} from "../services/mockApi"
import type { Todo } from "../types/todo"

interface EndpointTest {
  id: string
  name: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  description: string
  test: () => Promise<void>
}

export const DeveloperPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)
  const [testResults, setTestResults] = useState<
    Record<string, { status: "idle" | "loading" | "success" | "error"; result?: any; error?: string }>
  >({})
  const [testInputs, setTestInputs] = useState<Record<string, string>>({
    createTitle: "Test Todo",
    createDescription: "Test Description",
    updateId: "1",
    updateTitle: "Updated Todo",
    deleteId: "1",
    commentTodoId: "1",
    commentText: "Test comment",
    commentId: "c1",
    subtaskTodoId: "1",
    subtaskTitle: "Test subtask",
    subtaskId: "s1",
    toggleSubtaskTodoId: "1",
    toggleSubtaskId: "s1",
  })

  const endpoints: EndpointTest[] = [
    {
      id: "fetchTodos",
      name: "Fetch All Todos",
      method: "GET",
      endpoint: "GET /api/todos",
      description: "Fetch all to-do items",
      test: async () => {
        setTestResults((prev) => ({ ...prev, fetchTodos: { status: "loading" } }))
        try {
          const result = await fetchTodos()
          setTestResults((prev) => ({
            ...prev,
            fetchTodos: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            fetchTodos: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "createTodo",
      name: "Create Todo",
      method: "POST",
      endpoint: "POST /api/todos",
      description: "Create a new to-do item",
      test: async () => {
        setTestResults((prev) => ({ ...prev, createTodo: { status: "loading" } }))
        try {
          const result = await createTodo({
            title: testInputs.createTitle,
            description: testInputs.createDescription,
          })
          setTestResults((prev) => ({
            ...prev,
            createTodo: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            createTodo: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "updateTodo",
      name: "Update Todo",
      method: "PUT",
      endpoint: "PUT /api/todos/:id",
      description: "Update an existing to-do item",
      test: async () => {
        setTestResults((prev) => ({ ...prev, updateTodo: { status: "loading" } }))
        try {
          const result = await updateTodo(testInputs.updateId, {
            title: testInputs.updateTitle,
          })
          setTestResults((prev) => ({
            ...prev,
            updateTodo: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            updateTodo: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "deleteTodo",
      name: "Delete Todo",
      method: "DELETE",
      endpoint: "DELETE /api/todos/:id",
      description: "Delete a to-do item",
      test: async () => {
        setTestResults((prev) => ({ ...prev, deleteTodo: { status: "loading" } }))
        try {
          const result = await deleteTodo(testInputs.deleteId)
          setTestResults((prev) => ({
            ...prev,
            deleteTodo: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            deleteTodo: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "addComment",
      name: "Add Comment",
      method: "POST",
      endpoint: "POST /api/todos/:id/comments",
      description: "Add a comment to a to-do",
      test: async () => {
        setTestResults((prev) => ({ ...prev, addComment: { status: "loading" } }))
        try {
          const result = await addComment(testInputs.commentTodoId, {
            text: testInputs.commentText,
          })
          setTestResults((prev) => ({
            ...prev,
            addComment: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            addComment: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "deleteComment",
      name: "Delete Comment",
      method: "DELETE",
      endpoint: "DELETE /api/todos/:id/comments/:commentId",
      description: "Delete a comment from a to-do",
      test: async () => {
        setTestResults((prev) => ({ ...prev, deleteComment: { status: "loading" } }))
        try {
          const result = await deleteComment(testInputs.commentTodoId, testInputs.commentId)
          setTestResults((prev) => ({
            ...prev,
            deleteComment: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            deleteComment: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "addSubtask",
      name: "Add Subtask",
      method: "POST",
      endpoint: "POST /api/todos/:id/subtasks",
      description: "Add a subtask to a to-do",
      test: async () => {
        setTestResults((prev) => ({ ...prev, addSubtask: { status: "loading" } }))
        try {
          const result = await addSubtask(testInputs.subtaskTodoId, {
            title: testInputs.subtaskTitle,
          })
          setTestResults((prev) => ({
            ...prev,
            addSubtask: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            addSubtask: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "toggleSubtask",
      name: "Toggle Subtask",
      method: "PUT",
      endpoint: "PUT /api/todos/:id/subtasks/:subtaskId/toggle",
      description: "Toggle subtask completion status",
      test: async () => {
        setTestResults((prev) => ({ ...prev, toggleSubtask: { status: "loading" } }))
        try {
          const result = await toggleSubtask(
            testInputs.toggleSubtaskTodoId,
            testInputs.toggleSubtaskId
          )
          setTestResults((prev) => ({
            ...prev,
            toggleSubtask: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            toggleSubtask: { status: "error", error: error.message },
          }))
        }
      },
    },
    {
      id: "deleteSubtask",
      name: "Delete Subtask",
      method: "DELETE",
      endpoint: "DELETE /api/todos/:id/subtasks/:subtaskId",
      description: "Delete a subtask from a to-do",
      test: async () => {
        setTestResults((prev) => ({ ...prev, deleteSubtask: { status: "loading" } }))
        try {
          const result = await deleteSubtask(testInputs.subtaskTodoId, testInputs.subtaskId)
          setTestResults((prev) => ({
            ...prev,
            deleteSubtask: { status: "success", result: JSON.stringify(result, null, 2) },
          }))
        } catch (error: any) {
          setTestResults((prev) => ({
            ...prev,
            deleteSubtask: { status: "error", error: error.message },
          }))
        }
      },
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-400"
      case "POST":
        return "bg-green-400"
      case "PUT":
        return "bg-yellow-400"
      case "DELETE":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        
        // Constrain to viewport
        const maxX = window.innerWidth - panelRef.current.offsetWidth
        const maxY = window.innerHeight - panelRef.current.offsetHeight
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border-4 border-black bg-purple-400 p-4 neobrutalism hover:shadow-[8px_8px_0px_0px_#000] transition-all hover:scale-105",
          isOpen && "bg-purple-500"
        )}
        aria-label="Toggle Developer Panel"
      >
        <Code2 className="h-5 w-5 text-black" />
        <span className="text-sm font-black text-black uppercase hidden sm:inline">
          Dev Tools
        </span>
      </button>

      {/* Developer Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed z-40 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg border-4 border-black bg-white neobrutalism-lg shadow-2xl cursor-move"
          style={{
            left: position.x !== null ? `${position.x}px` : undefined,
            top: position.y !== null ? `${position.y}px` : undefined,
            right: position.x !== null ? undefined : "1rem",
            bottom: position.y !== null ? undefined : "5rem",
          }}
        >
          <div
            className="sticky top-0 bg-white border-b-4 border-black p-4 z-10 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-gray-400" />
                <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
                  <Code2 className="h-6 w-6" />
                  API Endpoint Tester
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="neobrutalism-sm"
              >
                Close
              </Button>
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">
              Test all available API endpoints with mock data
            </p>
          </div>

          <div className="p-4 space-y-4">
            {endpoints.map((endpoint) => {
              const result = testResults[endpoint.id]
              const status = result?.status || "idle"

              return (
                <div
                  key={endpoint.id}
                  className="rounded-lg border-4 border-black bg-white p-4 neobrutalism-sm hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            "px-3 py-1 text-xs font-black text-black uppercase rounded border-2 border-black",
                            getMethodColor(endpoint.method)
                          )}
                        >
                          {endpoint.method}
                        </span>
                        <h3 className="text-lg font-black text-black uppercase">
                          {endpoint.name}
                        </h3>
                        {getStatusIcon(status)}
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-2">
                        {endpoint.endpoint}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        {endpoint.description}
                      </p>
                    </div>
                    <Button
                      onClick={endpoint.test}
                      disabled={status === "loading"}
                      size="sm"
                      className="neobrutalism-sm flex-shrink-0"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Input Fields for Specific Endpoints */}
                  {endpoint.id === "createTodo" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Title"
                        value={testInputs.createTitle}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, createTitle: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="Description"
                        value={testInputs.createDescription}
                        onChange={(e) =>
                          setTestInputs((prev) => ({
                            ...prev,
                            createDescription: e.target.value,
                          }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "updateTodo" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.updateId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, updateId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="New Title"
                        value={testInputs.updateTitle}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, updateTitle: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "deleteTodo" && (
                    <div className="mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.deleteId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, deleteId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "addComment" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.commentTodoId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, commentTodoId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="Comment Text"
                        value={testInputs.commentText}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, commentText: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "deleteComment" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.commentTodoId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, commentTodoId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="Comment ID"
                        value={testInputs.commentId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, commentId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "addSubtask" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.subtaskTodoId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, subtaskTodoId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="Subtask Title"
                        value={testInputs.subtaskTitle}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, subtaskTitle: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "toggleSubtask" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.toggleSubtaskTodoId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({
                            ...prev,
                            toggleSubtaskTodoId: e.target.value,
                          }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="Subtask ID"
                        value={testInputs.toggleSubtaskId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, toggleSubtaskId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {endpoint.id === "deleteSubtask" && (
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Todo ID"
                        value={testInputs.subtaskTodoId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, subtaskTodoId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                      <Input
                        placeholder="Subtask ID"
                        value={testInputs.subtaskId}
                        onChange={(e) =>
                          setTestInputs((prev) => ({ ...prev, subtaskId: e.target.value }))
                        }
                        className="neobrutalism-sm"
                      />
                    </div>
                  )}

                  {/* Results */}
                  {result && (
                    <div
                      className={cn(
                        "rounded-lg border-2 border-black p-3 mt-3",
                        status === "success" && "bg-green-50",
                        status === "error" && "bg-red-50"
                      )}
                    >
                      {status === "success" && result.result && (
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase mb-2">
                            Success Response:
                          </p>
                          <pre className="text-xs font-mono text-black bg-white p-2 rounded border border-black overflow-x-auto">
                            {result.result}
                          </pre>
                        </div>
                      )}
                      {status === "error" && result.error && (
                        <div>
                          <p className="text-xs font-bold text-red-600 uppercase mb-2">
                            Error:
                          </p>
                          <p className="text-xs font-medium text-red-700">{result.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

