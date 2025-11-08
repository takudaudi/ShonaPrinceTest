/**
 * To-Do status for Kanban board
 */
export type TodoStatus = "todo" | "in-progress" | "done";

/**
 * Comment interface
 */
export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subtask interface
 */
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * To-Do item interface
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: TodoStatus;
  dueDate?: string; // ISO date string
  comments: Comment[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

/**
 * API response wrapper for single To-Do
 */
export interface TodoResponse {
  data: Todo;
  message?: string;
}

/**
 * API response wrapper for multiple To-Dos
 */
export interface TodosResponse {
  data: Todo[];
  message?: string;
}

/**
 * Create To-Do request payload
 */
export interface CreateTodoRequest {
  title: string;
  description: string;
  dueDate?: string;
}

/**
 * Update To-Do request payload
 */
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TodoStatus;
  dueDate?: string;
  comments?: Comment[];
  subtasks?: Subtask[];
}

/**
 * Add Comment request payload
 */
export interface AddCommentRequest {
  text: string;
}

/**
 * Add Subtask request payload
 */
export interface AddSubtaskRequest {
  title: string;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  code?: string;
}

/**
 * View type for the application
 */
export type ViewType = "list" | "kanban" | "calendar";

