"use client"

import { useEffect, useState } from "react"

import { RiAddLine, RiCheckLine, RiCloseLine, RiHashtag, RiLoader4Line } from "@remixicon/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProject } from "@/app/actions/project-details"
import { getAllCategories } from "@/app/actions/projects"

import { ImageUploadInput } from "./image-upload-input"

const MAX_GALLERY_IMAGES = 10

function normalizeGalleryImages(values: Array<string | null | undefined>) {
  const seen = new Set<string>()

  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value) => {
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
    .slice(0, MAX_GALLERY_IMAGES)
}

interface EditProjectFormProps {
  projectId: string
  initialName: string
  initialWebsiteUrl: string
  initialLogoUrl: string
  initialProductImage: string | null
  initialCoverImage: string | null
  initialGalleryImages: string[] | null
  initialDescription: string
  initialCategories: { id: string; name: string }[]
  onUpdate: () => void
  onCancel: () => void
}

export function EditProjectForm({
  projectId,
  initialName,
  initialWebsiteUrl,
  initialLogoUrl,
  initialProductImage,
  initialCoverImage,
  initialGalleryImages,
  initialDescription,
  initialCategories,
  onUpdate,
  onCancel,
}: EditProjectFormProps) {
  const [name, setName] = useState(initialName)
  const [websiteUrl, setWebsiteUrl] = useState(initialWebsiteUrl)
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl)
  const [galleryImages, setGalleryImages] = useState<Array<string | null>>(() => {
    const initialImages = normalizeGalleryImages([
      ...(initialGalleryImages ?? []),
      initialProductImage,
      initialCoverImage,
    ])
    return initialImages.length > 0 ? initialImages : [null]
  })
  const [description, setDescription] = useState(initialDescription)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories.map((cat) => cat.id),
  )
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Charger toutes les catégories lors de l'initialisation
  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true)
      try {
        const allCategories = await getAllCategories()
        setCategories(allCategories)
      } catch (error) {
        console.error("Failed to load categories:", error)
        toast.error("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category")
      return
    }

    setIsSaving(true)

    try {
      const cleanedGalleryImages = normalizeGalleryImages(galleryImages)
      const result = await updateProject(projectId, {
        name,
        websiteUrl,
        logoUrl: logoUrl ?? "",
        productImage: cleanedGalleryImages[0] ?? null,
        coverImage: cleanedGalleryImages[1] ?? null,
        galleryImages: cleanedGalleryImages,
        description,
        categories: selectedCategories,
      })

      if (result.success) {
        toast.success("Project updated successfully")
        onUpdate()
      } else {
        toast.error(result.error || "Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Gérer l'ajout/suppression d'une catégorie
  const handleCategoryChange = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      // Limiter à 3 catégories maximum
      if (selectedCategories.length >= 5) {
        toast.error("Maximum 5 categories allowed")
        return
      }
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
  }

  const handleGalleryImageChange = (index: number, value: string | null) => {
    setGalleryImages((current) => current.map((image, i) => (i === index ? value : image)))
  }

  const handleGalleryImagesUpload = (index: number, values: string[]) => {
    const incoming = normalizeGalleryImages(values)
    if (incoming.length === 0) return

    setGalleryImages((current) => {
      const next = [...current]
      next[index] = incoming[0]

      for (const image of incoming.slice(1)) {
        const emptyIndex = next.findIndex((value, i) => i > index && !value?.trim())
        if (emptyIndex >= 0) {
          next[emptyIndex] = image
        } else if (next.length < MAX_GALLERY_IMAGES) {
          next.push(image)
        }
      }

      const normalized = normalizeGalleryImages(next)
      return normalized.length > 0 ? normalized : [null]
    })

    if (incoming.length > 1) {
      toast.success("Added selected images")
    }
  }

  const handleAddGalleryImage = () => {
    setGalleryImages((current) =>
      current.length >= MAX_GALLERY_IMAGES ? current : [...current, null],
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Tool name</Label>
          <Input id="edit-name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-website">Website URL</Label>
          <Input
            id="edit-website"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
          />
        </div>
      </div>

      <ImageUploadInput
        id="edit-logo"
        label="Logo / avatar"
        value={logoUrl}
        onChange={setLogoUrl}
        helperText="Paste an image URL or upload a square logo."
        previewClassName="h-24 w-24"
        maxDimension={512}
      />

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Listing images</Label>
          <p className="text-muted-foreground text-xs">
            Add up to {MAX_GALLERY_IMAGES} screenshots or cover images. The first image is the main
            thumbnail.
          </p>
        </div>
        {galleryImages.map((image, index) => (
          <ImageUploadInput
            key={index}
            id={`edit-gallery-image-${index}`}
            label={`Image ${index + 1}`}
            value={image}
            onChange={(value) => handleGalleryImageChange(index, value)}
            onMultiChange={(values) => handleGalleryImagesUpload(index, values)}
            helperText="Paste an image URL or upload one or more screenshots/cover images. Recommended: 16:9."
            multiple
          />
        ))}
        {galleryImages.length < MAX_GALLERY_IMAGES && (
          <Button type="button" variant="outline" onClick={handleAddGalleryImage}>
            <RiAddLine className="mr-1 h-4 w-4" />
            Add image
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <RichTextEditor
          className="max-h-[250px] overflow-y-auto"
          content={description}
          onChange={(content) => setDescription(content)}
          placeholder="Enter project description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Categories <span className="text-muted-foreground text-xs">(maximum 3)</span>
        </label>

        {/* Selected categories */}
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId)
            return cat ? (
              <Badge key={cat.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <RiHashtag className="h-3 w-3" />
                {cat.name}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground ml-1 cursor-pointer"
                  onClick={() => handleRemoveCategory(cat.id)}
                >
                  ×
                </button>
              </Badge>
            ) : null
          })}
        </div>

        {/* Category selector */}
        <Select
          onValueChange={handleCategoryChange}
          disabled={isLoading || selectedCategories.length >= 5}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoading
                  ? "Loading categories..."
                  : selectedCategories.length >= 5
                    ? "Maximum 5 categories reached"
                    : "Add a category"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    disabled={selectedCategories.includes(cat.id)}
                  >
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          <RiCloseLine className="mr-1 h-4 w-4" />
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving || selectedCategories.length === 0}>
          {isSaving ? (
            <>
              <RiLoader4Line className="mr-1 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <RiCheckLine className="mr-1 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
