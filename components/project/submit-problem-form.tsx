"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { RiLoader4Line, RiSendPlaneLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Textarea } from "@/components/ui/textarea"
import { getAllCategories } from "@/app/actions/projects"
import { submitProblem } from "@/app/actions/problems"

import { ImageUploadInput } from "./image-upload-input"

const URGENCY_OPTIONS = [
  { value: "nice_to_have", label: "Nice to have", hint: "Annoying, but I can live with it" },
  { value: "painful", label: "Painful", hint: "Costs me real time or money" },
  { value: "urgent", label: "Urgent", hint: "Blocking me right now" },
]

export function SubmitProblemForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [audience, setAudience] = useState("")
  const [tried, setTried] = useState("")
  const [urgency, setUrgency] = useState("painful")
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    getAllCategories()
      .then(setAllCategories)
      .catch(() => setAllCategories([]))
  }, [])

  const toggleCategory = (id: string, checked: boolean) => {
    setCategories((prev) => {
      if (checked) {
        if (prev.length >= 3) {
          setError("You can select a maximum of 3 categories.")
          return prev
        }
        return [...prev, id]
      }
      return prev.filter((c) => c !== id)
    })
  }

  const handleSubmit = async () => {
    setError(null)
    if (!title.trim()) {
      setError("Give the problem a clear title.")
      return
    }
    if (!description.trim() || description === "<p></p>") {
      setError("Describe the problem you are stuck on.")
      return
    }
    setIsPending(true)
    try {
      const result = await submitProblem({
        title: title.trim(),
        description,
        audience: audience.trim(),
        tried: tried.trim(),
        urgency,
        thumbnail,
        categories,
      })
      if (!result.success || !result.slug) {
        throw new Error(result.error || "Failed to submit problem.")
      }
      router.push(`/projects/${result.slug}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <Label htmlFor="problem-title">
          What problem are you trying to solve? <span className="text-red-500">*</span>
        </Label>
        <Input
          id="problem-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. I can't tell which Etsy listings are actually worth ad spend"
          className="mt-1.5"
          required
        />
      </div>

      <div>
        <Label>
          Describe it <span className="text-red-500">*</span>
        </Label>
        <p className="text-muted-foreground mt-1 mb-1.5 text-xs">
          What's happening, why it's hard, and what a good solution would look like.
        </p>
        <RichTextEditor
          content={description}
          onChange={setDescription}
          placeholder="Describe the problem in detail..."
          className="max-h-[300px] overflow-y-auto"
        />
      </div>

      <ImageUploadInput
        id="problem-thumbnail"
        label="Thumbnail"
        value={thumbnail}
        onChange={setThumbnail}
        helperText="A thumbnail will help people notice your post. Paste an image URL or upload one."
      />

      <div>
        <Label htmlFor="problem-audience">Who else has this problem?</Label>
        <Input
          id="problem-audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Print-on-demand sellers running paid ads"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="problem-tried">What have you tried so far?</Label>
        <Textarea
          id="problem-tried"
          value={tried}
          onChange={(e) => setTried(e.target.value)}
          placeholder="Tools, workarounds, or approaches that didn't fully solve it."
          className="mt-1.5 min-h-[90px]"
        />
      </div>

      <div>
        <Label className="mb-2 block">How painful is it?</Label>
        <RadioGroup
          value={urgency}
          onValueChange={setUrgency}
          className="flex flex-col gap-3 sm:flex-row"
        >
          {URGENCY_OPTIONS.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`urgency-${opt.value}`}
              className="hover:bg-muted/50 flex flex-1 cursor-pointer items-start gap-2 rounded-md border p-3 transition-colors"
            >
              <RadioGroupItem value={opt.value} id={`urgency-${opt.value}`} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">{opt.label}</span>
                <span className="text-muted-foreground block text-xs">{opt.hint}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2 block">
          Categories
          <span className="text-muted-foreground ml-2 text-xs">({categories.length}/3)</span>
        </Label>
        {allCategories.length > 0 ? (
          <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto rounded-md border p-4 sm:grid-cols-2">
            {allCategories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`pcat-${cat.id}`}
                  checked={categories.includes(cat.id)}
                  onCheckedChange={(checked) => toggleCategory(cat.id, !!checked)}
                />
                <Label htmlFor={`pcat-${cat.id}`} className="cursor-pointer font-normal">
                  {cat.name}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No categories available.</p>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-md border p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end border-t pt-6">
        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending ? (
            <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RiSendPlaneLine className="mr-2 h-4 w-4" />
          )}
          Post problem
        </Button>
      </div>
    </div>
  )
}
