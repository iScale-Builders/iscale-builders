"use client"

import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { Comments } from "@fuma-comment/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProjectCommentsProps {
  projectId: string
  isAuthenticated: boolean
  className?: string
}

interface CommentsBoundaryProps {
  children: ReactNode
}

interface CommentsBoundaryState {
  hasError: boolean
}

class CommentsBoundary extends Component<CommentsBoundaryProps, CommentsBoundaryState> {
  state: CommentsBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ProjectComments] client comments failed", {
      error,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return <CommentsUnavailable />
    }

    return this.props.children
  }
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

function CommentsUnavailable() {
  return (
    <div className="bg-card border-border mt-8 rounded-xl border p-5 text-center shadow-[0_18px_54px_rgb(0_0_0_/_0.22)] backdrop-blur-xl">
      <p className="text-foreground text-sm font-semibold">Comments could not load.</p>
      <p className="text-muted-foreground mt-1 text-xs">
        The listing is still available. Refresh the page or try again in a moment.
      </p>
    </div>
  )
}

export function ProjectComments({ projectId, isAuthenticated, className }: ProjectCommentsProps) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const signIn = () => {
    router.push("/sign-in")
  }

  if (!isAuthenticated) {
    return (
      <div
        className={cn(
          "bg-card border-border mt-8 rounded-xl border p-5 text-center shadow-[0_18px_54px_rgb(0_0_0_/_0.22)] backdrop-blur-xl",
          className,
        )}
      >
        <p className="text-foreground text-sm font-semibold">Sign in to join the discussion.</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Comments are available for signed-in iScaleBuilders members.
        </p>
        <Button
          type="button"
          onClick={signIn}
          className="text-primary-foreground mt-4 rounded-full bg-cyan-200 px-5 font-bold hover:bg-cyan-100"
        >
          Sign in
        </Button>
      </div>
    )
  }

  if (!isClient) {
    return <CommentsLoading />
  }

  return (
    <div
      className={cn("relative z-10 mt-8", className)}
      data-fuma-comment-container="true"
      data-fuma-comment-button="true"
    >
      <CommentsBoundary>
        <Comments
          page={projectId}
          className="bg-background w-full"
          auth={{
            type: "api",
            signIn,
          }}
        />
      </CommentsBoundary>
    </div>
  )
}
