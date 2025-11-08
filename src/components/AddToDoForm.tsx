import { useState, type FormEvent } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Plus } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"

interface AddToDoFormProps {
  onSubmit: (title: string, description: string, dueDate?: string) => void
  isLoading?: boolean
}

export const AddToDoForm = ({
  onSubmit,
  isLoading = false,
}: AddToDoFormProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  // Error state for validation messages
  const [errors, setErrors] = useState<{ title?: string; description?: string; dueDate?: string }>({})

  /**
   * Validates form inputs before submission
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate() && !isLoading) {
      onSubmit(title.trim(), description.trim(), dueDate || undefined)
      setTitle("")
      setDescription("")
      setDueDate("")
      setErrors({})
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border-4 border-black bg-white p-6 neobrutalism hover:shadow-[10px_10px_0px_0px_#000] transition-all"
    >
      <h2 className="text-2xl font-bold text-black uppercase mb-4">
        Add New To-Do
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-bold text-black uppercase mb-2"
          >
            Title *
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter todo title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }))
              }
            }}
            disabled={isLoading}
            required
            className={errors.title ? "w-full border-red-500" : "w-full"}
          />
          {errors.title && (
            <p className="mt-1 text-xs font-bold text-red-600 uppercase">
              {errors.title}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-bold text-black uppercase mb-2"
          >
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Enter todo description (minimum 4 characters if provided)..."
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
          />
          {errors.description && (
            <p className="mt-1 text-xs font-bold text-red-600 uppercase">
              {errors.description}
            </p>
          )}
          {description && !errors.description && (
            <p className="mt-1 text-xs font-medium text-gray-500">
              {description.length}/500 characters
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-bold text-black uppercase mb-2"
          >
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value)
              if (errors.dueDate) {
                setErrors((prev) => ({ ...prev, dueDate: undefined }))
              }
            }}
            disabled={isLoading}
            className={errors.dueDate ? "w-full border-red-500" : "w-full"}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs font-bold text-red-600 uppercase">
              {errors.dueDate}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add To-Do
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

