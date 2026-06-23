"use client"

import { useState } from "react"

import { RiPencilLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { EditProjectForm } from "./edit-project-form"

interface EditButtonProps {
  projectId: string
  initialName: string
  initialWebsiteUrl: string
  initialLogoUrl: string
  initialProductImage: string | null
  initialDescription: string
  initialCategories: { id: string; name: string }[]
  isOwner: boolean
}

export function EditButton({
  projectId,
  initialName,
  initialWebsiteUrl,
  initialLogoUrl,
  initialProductImage,
  initialDescription,
  initialCategories,
  isOwner,
}: EditButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!isOwner) {
    return null
  }

  const handleUpdate = () => {
    // Fermer le dialogue et rafraîchir la page pour afficher les changements
    setIsDialogOpen(false)
    window.location.reload()
  }

  return (
    <>
      <Button variant="outline" size="sm" className="h-9" onClick={() => setIsDialogOpen(true)}>
        <RiPencilLine className="mr-1 h-4 w-4" />
        Edit Project Details
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Project Information</DialogTitle>
          </DialogHeader>

          <EditProjectForm
            projectId={projectId}
            initialName={initialName}
            initialWebsiteUrl={initialWebsiteUrl}
            initialLogoUrl={initialLogoUrl}
            initialProductImage={initialProductImage}
            initialDescription={initialDescription}
            initialCategories={initialCategories}
            onUpdate={handleUpdate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
