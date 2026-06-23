"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react"

import { RiCloseLine, RiImageAddLine, RiLoader4Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Accept large originals — we downscale + recompress before storing.
const MAX_INPUT_BYTES = 20 * 1024 * 1024

interface ImageUploadInputProps {
  id: string
  label: string
  value: string | null
  onChange: (value: string | null) => void
  helperText: string
  previewClassName?: string
  /** Longest-edge cap in px before storing (default 1280, i.e. 1280x720 covers). */
  maxDimension?: number
}

// Downscale to fit within `max` (longest edge), re-encode as WebP (fallback JPEG),
// and return a data URL. Keeps stored cover images ~50-150KB instead of 1-2MB.
async function compressImage(file: File, max: number): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error("decode failed"))
      i.src = objectUrl
    })

    const scale = Math.min(1, max / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("no 2d context")
    ctx.drawImage(img, 0, 0, w, h)

    const toDataUrl = (type: string, q: number) =>
      new Promise<string | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(null)
            const r = new FileReader()
            r.onload = () => resolve(String(r.result))
            r.onerror = () => resolve(null)
            r.readAsDataURL(blob)
          },
          type,
          q,
        )
      })

    // Prefer WebP; fall back to JPEG if the browser won't encode WebP.
    const webp = await toDataUrl("image/webp", 0.82)
    if (webp && webp.startsWith("data:image/webp")) return webp
    const jpeg = await toDataUrl("image/jpeg", 0.85)
    if (jpeg) return jpeg
    throw new Error("encode failed")
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function ImageUploadInput({
  id,
  label,
  value,
  onChange,
  helperText,
  previewClassName = "aspect-video",
  maxDimension = 1280,
}: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)

  useEffect(() => {
    setPreviewFailed(false)
  }, [value])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.")
      return
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("That image is over 20 MB. Try a smaller file.")
      return
    }

    setIsReading(true)
    try {
      const dataUrl = await compressImage(file, maxDimension)
      onChange(dataUrl)
    } catch {
      // Last-resort fallback: store the original as-is.
      try {
        const raw = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(String(r.result))
          r.onerror = () => reject(new Error("read failed"))
          r.readAsDataURL(file)
        })
        onChange(raw)
      } catch {
        setError("Could not process that image. Try another file.")
      }
    } finally {
      setIsReading(false)
      // allow re-selecting the same file
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          id={id}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder="Paste image URL or upload a file"
        />
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={isReading}
          >
            {isReading ? (
              <RiLoader4Line className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <RiImageAddLine className="mr-1 h-4 w-4" />
            )}
            Upload
          </Button>
          {value && (
            <Button type="button" variant="ghost" onClick={() => onChange(null)}>
              <RiCloseLine className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-xs">{helperText}</p>
      {error && <p className="text-destructive text-xs">{error}</p>}
      {value && !previewFailed && (
        <div className={`bg-muted relative overflow-hidden rounded-lg border ${previewClassName}`}>
          <img
            src={value}
            alt={`${label} preview`}
            className="h-full w-full object-cover"
            onError={() => setPreviewFailed(true)}
          />
        </div>
      )}
      {value && previewFailed && (
        <div
          className={`bg-muted text-muted-foreground flex items-center justify-center rounded-lg border px-3 text-center text-xs ${previewClassName}`}
        >
          Preview unavailable
        </div>
      )}
    </div>
  )
}
