import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodosResponse, TodoResponse, ApiError } from '../types/todo';

// Storage key for localStorage persistence
const STORAGE_KEY = 'shona-prince-todos';

// Simulated delay for API calls (in milliseconds)
// This mimics real network latency to demonstrate proper loading state handling
const API_DELAY = 800;

// Error rate for simulating API failures (10% chance)
// This helps demonstrate error handling in the UI
const ERROR_RATE = 0.1;

/**
 * Loads todos from localStorage if available, otherwise returns default mock data
 * This ensures data persistence across page reloads
 */
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that stored data is an array
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
  }
  // Return default mock data if localStorage is empty or invalid
  return getDefaultTodos();
};

/**
 * Saves todos to localStorage for persistence
 * Called after every create, update, or delete operation
 */
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

/**
 * Returns default mock todos for initial state
 * Only used when localStorage is empty
 */
const getDefaultTodos = (): Todo[] => [
  {
    id: '1',
    title: 'Complete React project',
    description: 'Build a To-Do application with TypeScript and modern React patterns',
    completed: false,
    status: 'in-progress',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    comments: [
      {
        id: 'c1',
        text: 'Great progress so far!',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    subtasks: [
      {
        id: 's1',
        title: 'Set up project structure',
        completed: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 's2',
        title: 'Implement components',
        completed: false,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    description: 'Master TypeScript fundamentals and advanced patterns',
    completed: true,
    status: 'done',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    comments: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Setup Tailwind CSS',
    description: 'Configure Tailwind CSS with shadcn/ui components',
    completed: false,
    status: 'todo',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    comments: [],
    subtasks: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Initialize mockTodos from localStorage or default data
// This ensures data persists across page reloads
let mockTodos: Todo[] = loadTodosFromStorage();

/**
 * Simulates a network delay using Promise and setTimeout
 * This mimics real API latency to test loading states in the UI
 * @param ms - Delay in milliseconds
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Simulates random API errors for demonstration purposes
 * Returns true with a probability equal to ERROR_RATE
 * This helps test error handling and user feedback mechanisms
 */
const simulateError = (): boolean => {
  return Math.random() < ERROR_RATE;
};

/**
 * Simulates a GET request to fetch all To-Dos
 * Loads data from localStorage first, then from in-memory storage
 * This ensures data persistence across page reloads
 * @returns Promise resolving to TodosResponse with all todos
 */
export const fetchTodos = async (): Promise<TodosResponse> => {
  // Simulate network delay
  await delay(API_DELAY);

  // Simulate random API errors (10% chance)
  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to fetch To-Dos. Please try again.',
      code: 'FETCH_ERROR',
    };
    throw error;
  }

  // Reload from storage to ensure we have the latest data
  mockTodos = loadTodosFromStorage();

  return {
    data: [...mockTodos],
    message: 'To-Dos fetched successfully',
  };
};

/**
 * Simulates a POST request to create a new To-Do
 */
export const createTodo = async (todo: CreateTodoRequest): Promise<TodoResponse> => {
  await delay(API_DELAY);

  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to create To-Do. Please try again.',
      code: 'CREATE_ERROR',
    };
    throw error;
  }

  // Create new todo with unique ID and default values
  const newTodo: Todo = {
    id: Date.now().toString(), // Use timestamp as unique ID
    title: todo.title,
    description: todo.description,
    completed: false, // New todos start as incomplete
    status: 'todo', // Default status
    dueDate: todo.dueDate,
    comments: [], // Initialize empty arrays
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to in-memory storage
  mockTodos.push(newTodo);
  
  // Persist to localStorage so data survives page reloads
  saveTodosToStorage(mockTodos);

  return {
    data: newTodo,
    message: 'To-Do created successfully',
  };
};

/**
 * Simulates a PUT request to update an existing To-Do
 * Merges updates with existing todo data and updates timestamp
 * Saves changes to localStorage for persistence
 * @param id - The ID of the todo to update
 * @param updates - Partial UpdateTodoRequest with fields to update
 * @returns Promise resolving to TodoResponse with the updated todo
 */
export const updateTodo = async (
  id: string,
  updates: UpdateTodoRequest
): Promise<TodoResponse> => {
  // Simulate network delay
  await delay(API_DELAY);

  // Simulate random API errors
  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to update To-Do. Please try again.',
      code: 'UPDATE_ERROR',
    };
    throw error;
  }

  // Find the todo by ID
  const todoIndex = mockTodos.findIndex((todo) => todo.id === id);

  // Return error if todo not found
  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  // Merge updates with existing todo data
  const updatedTodo: Todo = {
    ...mockTodos[todoIndex],
    ...updates, // Spread updates to override existing fields
    updatedAt: new Date().toISOString(), // Always update timestamp
  };

  // Update in-memory storage
  mockTodos[todoIndex] = updatedTodo;
  
  // Persist to localStorage
  saveTodosToStorage(mockTodos);

  return {
    data: updatedTodo,
    message: 'To-Do updated successfully',
  };
};

/**
 * Simulates a DELETE request to remove a To-Do
 * Removes the todo from storage and persists the change
 * @param id - The ID of the todo to delete
 * @returns Promise resolving to success message
 */
export const deleteTodo = async (id: string): Promise<{ message: string }> => {
  // Simulate network delay
  await delay(API_DELAY);

  // Simulate random API errors
  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to delete To-Do. Please try again.',
      code: 'DELETE_ERROR',
    };
    throw error;
  }

  // Find the todo by ID
  const todoIndex = mockTodos.findIndex((todo) => todo.id === id);

  // Return error if todo not found
  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  // Remove todo from array
  mockTodos.splice(todoIndex, 1);
  
  // Persist deletion to localStorage
  saveTodosToStorage(mockTodos);

  return {
    message: 'To-Do deleted successfully',
  };
};

/**
 * Simulates adding a comment to a To-Do
 */
export const addComment = async (
  todoId: string,
  comment: { text: string }
): Promise<TodoResponse> => {
  await delay(API_DELAY);

  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to add comment. Please try again.',
      code: 'ADD_COMMENT_ERROR',
    };
    throw error;
  }

  const todoIndex = mockTodos.findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  const newComment = {
    id: `comment-${Date.now()}`,
    text: comment.text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add comment to todo
  mockTodos[todoIndex].comments.push(newComment);
  mockTodos[todoIndex].updatedAt = new Date().toISOString();
  
  // Persist to localStorage
  saveTodosToStorage(mockTodos);

  return {
    data: mockTodos[todoIndex],
    message: 'Comment added successfully',
  };
};

/**
 * Simulates deleting a comment from a To-Do
 */
export const deleteComment = async (
  todoId: string,
  commentId: string
): Promise<TodoResponse> => {
  await delay(API_DELAY);

  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to delete comment. Please try again.',
      code: 'DELETE_COMMENT_ERROR',
    };
    throw error;
  }

  const todoIndex = mockTodos.findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  const commentIndex = mockTodos[todoIndex].comments.findIndex(
    (c) => c.id === commentId
  );

  if (commentIndex === -1) {
    const error: ApiError = {
      message: 'Comment not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  // Remove comment from array
  mockTodos[todoIndex].comments.splice(commentIndex, 1);
  mockTodos[todoIndex].updatedAt = new Date().toISOString();
  
  // Persist to localStorage
  saveTodosToStorage(mockTodos);

  return {
    data: mockTodos[todoIndex],
    message: 'Comment deleted successfully',
  };
};

/**
 * Simulates adding a subtask to a To-Do
 */
export const addSubtask = async (
  todoId: string,
  subtask: { title: string }
): Promise<TodoResponse> => {
  await delay(API_DELAY);

  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to add subtask. Please try again.',
      code: 'ADD_SUBTASK_ERROR',
    };
    throw error;
  }

  const todoIndex = mockTodos.findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  const newSubtask = {
    id: `subtask-${Date.now()}`,
    title: subtask.title,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add subtask to todo
  mockTodos[todoIndex].subtasks.push(newSubtask);
  mockTodos[todoIndex].updatedAt = new Date().toISOString();
  
  // Persist to localStorage
  saveTodosToStorage(mockTodos);

  return {
    data: mockTodos[todoIndex],
    message: 'Subtask added successfully',
  };
};

/**
 * Simulates toggling a subtask completion status
 */
export const toggleSubtask = async (
  todoId: string,
  subtaskId: string
): Promise<TodoResponse> => {
  await delay(API_DELAY);

  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to toggle subtask. Please try again.',
      code: 'TOGGLE_SUBTASK_ERROR',
    };
    throw error;
  }

  const todoIndex = mockTodos.findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  const subtask = mockTodos[todoIndex].subtasks.find((s) => s.id === subtaskId);

  if (!subtask) {
    const error: ApiError = {
      message: 'Subtask not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  // Toggle subtask completion status
  subtask.completed = !subtask.completed;
  subtask.updatedAt = new Date().toISOString();
  mockTodos[todoIndex].updatedAt = new Date().toISOString();
  
  // Persist to localStorage
  saveTodosToStorage(mockTodos);

  return {
    data: mockTodos[todoIndex],
    message: 'Subtask updated successfully',
  };
};

/**
 * Simulates deleting a subtask from a To-Do
 */
export const deleteSubtask = async (
  todoId: string,
  subtaskId: string
): Promise<TodoResponse> => {
  await delay(API_DELAY);

  if (simulateError()) {
    const error: ApiError = {
      message: 'Failed to delete subtask. Please try again.',
      code: 'DELETE_SUBTASK_ERROR',
    };
    throw error;
  }

  const todoIndex = mockTodos.findIndex((todo) => todo.id === todoId);

  if (todoIndex === -1) {
    const error: ApiError = {
      message: 'To-Do not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  const subtaskIndex = mockTodos[todoIndex].subtasks.findIndex(
    (s) => s.id === subtaskId
  );

  if (subtaskIndex === -1) {
    const error: ApiError = {
      message: 'Subtask not found',
      code: 'NOT_FOUND',
    };
    throw error;
  }

  // Remove subtask from array
  mockTodos[todoIndex].subtasks.splice(subtaskIndex, 1);
  mockTodos[todoIndex].updatedAt = new Date().toISOString();
  
  // Persist to localStorage
  saveTodosToStorage(mockTodos);

  return {
    data: mockTodos[todoIndex],
    message: 'Subtask deleted successfully',
  };
};

