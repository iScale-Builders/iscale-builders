"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { formatDistanceToNow } from "date-fns"

import { extractTextFromContent } from "@/lib/content-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ProjectCommentsProps {
  projectId: string
  isAuthenticated: boolean
  className?: string
}

interface ProjectComment {
  id: string
  author?: {
    id: string
    name: string
    image?: string
  }
  content: unknown
  timestamp: string
}

function CommentsLoading() {
  return (
    <div className="mt-8 animate-pulse">
      <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-2.5 h-24 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-10 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  )
}

function buildCommentContent(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  }
}

function formatCommentTime(timestamp: string) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ""
  return formatDistanceToNow(date, { addSuffix: true })
}

export function ProjectComments({ projectId, isAuthenticated, className }: ProjectCommentsProps) {
  const [isClient, setIsClient] = useState(false)
  const [comments, setComments] = useState<ProjectComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let ignore = false

    async function loadComments() {
      setIsLoadingComments(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/comments/${projectId}`, {
          credentials: "same-origin",
        })

        if (!response.ok) {
          throw new Error("Unable to load comments.")
        }

        const data = (await response.json()) as ProjectComment[]
        if (!ignore) setComments(data)
      } catch (error) {
        console.error("[ProjectComments] failed to load comments", error)
        if (!ignore) setErrorMessage("Comments could not load. Refresh and try again.")
      } finally {
        if (!ignore) setIsLoadingComments(false)
      }
    }

    void loadComments()

    return () => {
      ignore = true
    }
  }, [isClient, projectId])

  const trimmedComment = useMemo(() => commentText.trim(), [commentText])

  const signIn = () => {
    router.push("/sign-in")
  }

  const submitComment = async () => {
    if (!trimmedComment || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/comments/${projectId}`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: buildCommentContent(trimmedComment),
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "Unable to post comment.")
      }

      const savedComment = (await response.json()) as ProjectComment
      setComments((currentComments) => [savedComment, ...currentComments])
      setCommentText("")
    } catch (error) {
      console.error("[ProjectComments] failed to submit comment", error)
      setErrorMessage("Your comment could not be posted. Try again in a moment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isClient) {
    return <CommentsLoading />
  }

  return (
    <div
      className={cn(
        "bg-card border-border relative z-10 mt-8 rounded-xl border p-5 shadow-[0_18px_54px_rgb(0_0_0_/_0.22)] backdrop-blur-xl",
        className,
      )}
    >
      {isAuthenticated ? (
        <>
          <div className="mb-4">
            <p className="text-foreground text-sm font-semibold">Discussion</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Ask a question, leave feedback, or share what you want to see next.
            </p>
          </div>

          <div className="space-y-3">
            <Textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Leave a comment"
              maxLength={1500}
              className="bg-background min-h-24 resize-y"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs">{trimmedComment.length}/1500</p>
              <Button
                type="button"
                onClick={submitComment}
                disabled={!trimmedComment || isSubmitting}
                className="text-primary-foreground rounded-full bg-cyan-200 px-5 font-bold hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Posting..." : "Post comment"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-5 text-center">
          <p className="text-foreground text-sm font-semibold">Read the discussion below.</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Sign in only when you want to leave a comment or reply.
          </p>
          <Button
            type="button"
            onClick={signIn}
            className="text-primary-foreground mt-4 rounded-full bg-cyan-200 px-5 font-bold hover:bg-cyan-100"
          >
            Sign in to comment
          </Button>
        </div>
      )}

      {errorMessage ? (
        <p className="text-destructive mt-4 text-sm font-medium">{errorMessage}</p>
      ) : null}

      <div className="mt-6 space-y-4">
        {isLoadingComments ? <CommentsLoading /> : null}

        {!isLoadingComments && comments.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
            No comments yet.
          </p>
        ) : null}

        {comments.map((comment) => {
          const text = extractTextFromContent(comment.content)

          return (
            <article key={comment.id} className="border-border rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-foreground text-sm font-semibold">
                  {comment.author?.name || "iScaleBuilders member"}
                </p>
                <time className="text-muted-foreground text-xs">
                  {formatCommentTime(comment.timestamp)}
                </time>
              </div>
              <p className="text-foreground mt-3 text-sm leading-6 whitespace-pre-wrap">
                {text || "[Comment]"}
              </p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
