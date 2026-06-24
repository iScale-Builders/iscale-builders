"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { RiDeleteBinLine, RiLoader4Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { deleteOwnProject } from "@/app/actions/projects"

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      const res = await deleteOwnProject(projectId)
      if (!res.success) throw new Error(res.error || "Could not delete this post.")
      router.push("/")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete this post.")
      setIsDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Delete this post permanently?</span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-full"
        >
          {isDeleting ? <RiLoader4Line className="h-4 w-4 animate-spin" /> : "Yes, delete"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={isDeleting}
          className="rounded-full"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
        className="text-destructive hover:text-destructive rounded-full"
      >
        <RiDeleteBinLine className="mr-1 h-4 w-4" />
        Delete
      </Button>
      {error ? <p className="text-destructive mt-1 text-xs">{error}</p> : null}
    </div>
  )
}
