import { useState } from "react"
import type { Comment } from "../types/todo"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MessageSquare, Send, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { LoadingSpinner } from "./ui/loading-spinner"
import { cn } from "../lib/utils"

interface CommentsSectionProps {
  comments: Comment[]
  onAddComment: (text: string) => void
  onDeleteComment: (commentId: string) => void
  isLoading?: boolean
  isAddingComment?: boolean
  deletingCommentIds?: Set<string>
}

export const CommentsSection = ({
  comments,
  onAddComment,
  onDeleteComment,
  isLoading = false,
  isAddingComment = false,
  deletingCommentIds = new Set(),
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("")
  const [showInput, setShowInput] = useState(false)
  // Error state for comment validation
  const [commentError, setCommentError] = useState<string>("")

  /**
   * Validates comment before submission
   * Comments must be at least 2 characters and max 500 characters
   */
  const validateComment = (): boolean => {
    const trimmed = newComment.trim()
    
    if (!trimmed) {
      setCommentError("Comment cannot be empty")
      return false
    }
    
    if (trimmed.length < 2) {
      setCommentError("Comment must be at least 2 characters")
      return false
    }
    
    if (trimmed.length > 500) {
      setCommentError("Comment must be less than 500 characters")
      return false
    }
    
    setCommentError("")
    return true
  }

  /**
   * Handles comment form submission
   * Validates comment before adding
   * Prevents event propagation to avoid triggering parent form submissions
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event from bubbling up to parent forms
    if (validateComment() && !isAddingComment) {
      onAddComment(newComment.trim())
      setNewComment("")
      setShowInput(false)
      setCommentError("") // Clear error on success
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <LoadingSpinner size="sm" variant="rotate" />
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-black uppercase flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
        </h4>
        {!showInput && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInput(true)}
            className="neobrutalism-sm"
          >
            Add Comment
          </Button>
        )}
      </div>

      {showInput && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              placeholder="Write a comment (minimum 2 characters)..."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value)
                // Clear error when user starts typing
                if (commentError) {
                  setCommentError("")
                }
              }}
              onKeyDown={(e) => {
                // Prevent Enter key from submitting parent form
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSubmit(e as any)
                }
              }}
              disabled={isAddingComment}
              className={commentError ? "neobrutalism-sm border-red-500" : "neobrutalism-sm"}
              autoFocus
              maxLength={500}
            />
            {commentError && (
              <p className="mt-1 text-xs font-bold text-red-600 uppercase">
                {commentError}
              </p>
            )}
            {newComment && !commentError && (
              <p className="mt-1 text-xs font-medium text-gray-500">
                {newComment.length}/500 characters
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isAddingComment || !!commentError}
              className="neobrutalism-sm"
            >
              {isAddingComment ? (
                <>
                  <LoadingSpinner size="sm" variant="pulse" className="mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3 mr-2" />
                  Post
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowInput(false)
                setNewComment("")
              }}
              disabled={isAddingComment}
              className="neobrutalism-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
                  {comments.length === 0 ? (
          <p className="text-xs font-medium text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                "rounded-lg border-2 border-black bg-white p-3 neobrutalism-sm hover:shadow-[4px_4px_0px_0px_#000] hover:scale-[1.02] transition-all",
                deletingCommentIds.has(comment.id) && "opacity-50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black mb-1">
                    {comment.text}
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    {format(new Date(comment.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  disabled={deletingCommentIds.has(comment.id)}
                  className="flex-shrink-0 p-1 rounded hover:bg-red-100 transition-colors"
                  aria-label="Delete comment"
                >
                  {deletingCommentIds.has(comment.id) ? (
                    <LoadingSpinner size="sm" variant="pulse" />
                  ) : (
                    <Trash2 className="h-3 w-3 text-red-600" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

