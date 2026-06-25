"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { RiDeleteBinLine, RiLoader4Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteOwnProject } from "@/app/actions/projects"

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canDelete = confirmText.trim().toLowerCase() === "delete"

  const cancel = () => {
    setConfirming(false)
    setConfirmText("")
    setError(null)
  }

  const onDelete = async () => {
    if (!canDelete) return
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
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">
          Type <span className="text-foreground font-semibold">delete</span> to permanently remove
          this post.
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canDelete) onDelete()
            }}
            placeholder="delete"
            autoFocus
            aria-label="Type delete to confirm"
            className="h-9 w-36"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={!canDelete || isDeleting}
            className="rounded-full"
          >
            {isDeleting ? <RiLoader4Line className="h-4 w-4 animate-spin" /> : "Delete"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={cancel}
            disabled={isDeleting}
            className="rounded-full"
          >
            Cancel
          </Button>
        </div>
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
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
