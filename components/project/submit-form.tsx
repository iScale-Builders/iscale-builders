/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { useRouter } from "next/navigation"

import { platformType, pricingType } from "@/drizzle/db/schema"
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiFileCheckLine,
  RiInformation2Line,
  RiInformationLine,
  RiListCheck,
  RiLoader4Line,
  RiRocketLine,
  RiStarLine,
} from "@remixicon/react"
import { addDays, format, parseISO } from "date-fns"
import { Tag, TagInput } from "emblor"

import { DATE_FORMAT, LAUNCH_LIMITS, LAUNCH_SETTINGS, LAUNCH_TYPES } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RichTextDisplay, RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { notifyDiscordLaunch } from "@/app/actions/discord"
import {
  checkUserLaunchLimit,
  getLaunchAvailabilityRange,
  scheduleLaunch,
} from "@/app/actions/launch"
import type { LaunchAvailability } from "@/app/actions/launch"
import { getAllCategories, submitProject } from "@/app/actions/projects"

import { ImageUploadInput } from "./image-upload-input"

interface ProjectFormData {
  name: string
  websiteUrl: string
  description: string
  problemSolved: string
  categories: string[]
  techStack: string[]
  platforms: string[]
  pricing: string
  githubUrl?: string
  twitterUrl?: string
  scheduledDate: string | null
  launchType: (typeof LAUNCH_TYPES)[keyof typeof LAUNCH_TYPES]
  productImage: string | null
  galleryImages: string[]
}

interface DateGroup {
  key: string
  displayName: string
  dates: LaunchAvailability[]
}

interface SubmitProjectFormProps {
  userId: string
}

export function SubmitProjectForm({ userId }: SubmitProjectFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    websiteUrl: "",
    description: "",
    problemSolved: "",
    categories: [],
    techStack: [],
    platforms: [],
    pricing: "",
    githubUrl: "",
    twitterUrl: "",
    scheduledDate: null,
    launchType: LAUNCH_TYPES.FREE,
    productImage: null,
    galleryImages: [],
  })

  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null)
  const isUploadingLogo = false
  const isUploadingProductImage = false

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [availableDates, setAvailableDates] = useState<LaunchAvailability[]>([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const [isLaunchDateOverLimit, setIsLaunchDateOverLimit] = useState(false)
  const [launchDateLimitError, setLaunchDateLimitError] = useState<string | null>(null)
  const [isLoadingDateCheck, setIsLoadingDateCheck] = useState(false)

  const tagInputId = useId()

  const [techStackTags, setTechStackTags] = useState<Tag[]>([])
  const [activeTechTagIndex, setActiveTechTagIndex] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const checkWebsiteUrl = async (url: string) => {
    try {
      const response = await fetch(`/api/projects/check-url?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error("Error checking website URL:", error)
      return false
    }
  }

  const loadAvailableDates = useCallback(async () => {
    setIsLoadingDates(true)
    try {
      let startDate, endDate
      const today = new Date()

      if (formData.launchType === LAUNCH_TYPES.PREMIUM) {
        startDate = format(addDays(today, LAUNCH_SETTINGS.PREMIUM_MIN_DAYS_AHEAD), DATE_FORMAT.API)
        endDate = format(addDays(today, LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD), DATE_FORMAT.API)
      } else {
        startDate = format(addDays(today, LAUNCH_SETTINGS.MIN_DAYS_AHEAD), DATE_FORMAT.API)
        endDate = format(addDays(today, LAUNCH_SETTINGS.MAX_DAYS_AHEAD), DATE_FORMAT.API)
      }

      const availability = await getLaunchAvailabilityRange(startDate, endDate, formData.launchType)
      setAvailableDates(availability)
    } catch (err) {
      console.error("Error loading dates:", err)
      setError("Failed to load available dates")
    } finally {
      setIsLoadingDates(false)
    }
  }, [formData.launchType])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const tagsFromFormData = formData.techStack.map((tech, index) => ({
      id: `${index}-${tech}`,
      text: tech,
    }))
    if (JSON.stringify(tagsFromFormData) !== JSON.stringify(techStackTags)) {
      setTechStackTags(tagsFromFormData)
    }
  }, [formData.techStack])

  useEffect(() => {
    const techStringArray = techStackTags.map((tag) => tag.text)
    if (JSON.stringify(techStringArray) !== JSON.stringify(formData.techStack)) {
      setFormData((prev) => ({ ...prev, techStack: techStringArray }))
    }
  }, [techStackTags])

  async function fetchCategories() {
    setIsLoadingCategories(true)
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories")
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleLaunchTypeChange = (type: (typeof LAUNCH_TYPES)[keyof typeof LAUNCH_TYPES]) => {
    setFormData((prev) => ({
      ...prev,
      launchType: type,
      scheduledDate: null,
    }))
  }

  function groupDatesByMonth(dates: LaunchAvailability[]): DateGroup[] {
    const uniqueDates = Array.from(new Map(dates.map((date) => [date.date, date])).values())

    const groups = new Map<string, DateGroup>()

    const sortedDates = [...uniqueDates].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    sortedDates.forEach((date) => {
      const dateObj = new Date(date.date)
      const year = dateObj.getFullYear()
      const month = dateObj.getMonth()
      const groupKey = `${year}-${month}`
      const displayMonth = format(dateObj, DATE_FORMAT.DISPLAY_MONTH)

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          displayName: displayMonth,
          dates: [],
        })
      }
      groups.get(groupKey)?.dates.push(date)
    })

    return Array.from(groups.values()).sort((a, b) => {
      const aDate = new Date(a.dates[0].date)
      const bDate = new Date(b.dates[0].date)
      return aDate.getTime() - bDate.getTime()
    })
  }

  const validateLaunchDateLimit = useCallback(
    async (date: string | null) => {
      if (!date || !userId) {
        setIsLaunchDateOverLimit(false)
        setLaunchDateLimitError(null)
        setIsLoadingDateCheck(false)
        return
      }
      setIsLoadingDateCheck(true)
      setLaunchDateLimitError(null)
      try {
        const result = await checkUserLaunchLimit(userId, date)
        if (!result.allowed) {
          setIsLaunchDateOverLimit(true)
          setLaunchDateLimitError(
            `You have already scheduled ${result.count}/${result.limit} project(s) for this date. Please select another date.`,
          )
        } else {
          setIsLaunchDateOverLimit(false)
        }
      } catch (err) {
        console.error("Error checking launch date limit:", err)
        setIsLaunchDateOverLimit(false)
        setLaunchDateLimitError("Could not verify launch date limit. Please try again.")
      } finally {
        setIsLoadingDateCheck(false)
      }
    },
    [userId],
  )

  useEffect(() => {
    if (formData.scheduledDate && currentStep === 3) {
      validateLaunchDateLimit(formData.scheduledDate)
    }
  }, [formData.scheduledDate, currentStep, validateLaunchDateLimit])

  const nextStep = () => {
    setError(null)
    setLaunchDateLimitError(null)
    if (currentStep === 1) {
      if (
        !formData.name ||
        !formData.websiteUrl ||
        !formData.description ||
        !formData.problemSolved
      ) {
        setError("Please fill in all required project information.")
        return
      }
      try {
        new URL(formData.websiteUrl)
      } catch {
        setError("Please enter a valid website URL.")
        return
      }
    }

    if (currentStep === 2) {
      if (
        formData.categories.length === 0 ||
        formData.techStack.length === 0 ||
        formData.platforms.length === 0 ||
        !formData.pricing
      ) {
        setError("Please complete the technical details and categorization.")
        return
      }

      if (formData.categories.length > 5) {
        setError("You can select a maximum of 5 categories.")
        return
      }

      if (formData.techStack.length > 5) {
        setError("You can add a maximum of 5 technologies.")
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3))

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 0)
  }

  const prevStep = () => {
    setError(null)
    setLaunchDateLimitError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 0)
  }

  const handleFinalSubmit = async () => {
    if (
      !formData.name ||
      !formData.websiteUrl ||
      !formData.description ||
      formData.categories.length === 0 ||
      formData.platforms.length === 0 ||
      !formData.pricing
    ) {
      setError("Some required information is missing. Please go back and complete all fields.")
      setIsPending(false)
      return
    }

    const urlExists = await checkWebsiteUrl(formData.websiteUrl)
    if (urlExists) {
      setError("This website URL has already been submitted. Please use a different URL.")
      setIsPending(false)
      return
    }

    setIsPending(true)
    setError(null)
    setLaunchDateLimitError(null)

    if (formData.techStack.length === 0) {
      setError("Please enter at least one technology in the Tech Stack.")
      setIsPending(false)
      return
    }

    if (formData.categories.length > 5) {
      setError("You can select a maximum of 5 categories.")
      setIsPending(false)
      return
    }

    if (formData.techStack.length > 5) {
      setError("You can add a maximum of 5 technologies.")
      setIsPending(false)
      return
    }

    try {
      // DECISION 5: no upload service. Use the provided logo URL, or fall back to
      // a deterministic generated avatar (dicebear) keyed by the project name.
      const finalLogoUrl =
        uploadedLogoUrl?.trim() ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`

      const projectData = {
        name: formData.name,
        description: formData.description,
        problemSolved: formData.problemSolved,
        websiteUrl: formData.websiteUrl,
        logoUrl: finalLogoUrl,
        productImage: formData.productImage,
        galleryImages: formData.galleryImages,
        categories: formData.categories,
        techStack: formData.techStack,
        platforms: formData.platforms,
        pricing: formData.pricing,
        githubUrl: formData.githubUrl || null,
        twitterUrl: formData.twitterUrl || null,
      }

      const submissionResult = await submitProject(projectData)

      if (!submissionResult.success || !submissionResult.projectId || !submissionResult.slug) {
        throw new Error(submissionResult.error || "Failed to submit project data.")
      }

      const projectId = submissionResult.projectId
      const projectSlug = submissionResult.slug

      // DECISION 4: payments OFF. All submissions are free — always land on the
      // tool page (no Stripe redirect).
      router.push(`/projects/${projectSlug}`)
    } catch (submissionError: unknown) {
      console.error("Error during final submission:", submissionError)
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "An unexpected error occurred.",
      )
      setIsPending(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleFinalSubmit()
  }

  const renderStepper = () => (
    <div className="mb-8 sm:mb-10">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between pt-2 sm:px-4 sm:pt-0">
          {[
            { step: 1, label: "Project Info", icon: RiListCheck },
            {
              step: 2,
              label: "Details",
              shortLabel: "Details",
              icon: RiInformation2Line,
            },
            { step: 3, label: "Review", icon: RiFileCheckLine },
          ].map(({ step, label, shortLabel, icon: Icon }) => (
            <div
              key={`step-${step}`}
              className="relative flex w-[120px] flex-col items-center sm:w-[140px]"
            >
              {step < 3 && (
                <div className="absolute top-5 left-[calc(50%+1.5rem)] -z-10 hidden h-[2px] w-[calc(100%-1rem)] sm:block">
                  <div
                    className={`h-full ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    } transition-all duration-300`}
                  />
                </div>
              )}

              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 sm:h-12 sm:w-12 ${
                  currentStep > step
                    ? "bg-primary ring-primary/10 text-white ring-4"
                    : currentStep === step
                      ? "bg-primary ring-primary/20 text-white ring-4"
                      : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {currentStep > step ? (
                  <RiCheckLine className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}

                {currentStep === step && (
                  <span className="border-primary absolute inset-0 animate-pulse rounded-full border-2" />
                )}
              </div>

              <div className="mt-3 w-full text-center sm:mt-4">
                <span
                  className={`mb-0.5 block text-xs font-medium sm:text-sm ${
                    currentStep >= step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="inline sm:hidden">{shortLabel || label}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 px-2 sm:mt-6 sm:px-4">
        <div className="bg-muted/50 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )

  const handleCheckboxChange = (
    field: "categories" | "platforms",
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field] || []
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] }
      } else {
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        }
      }
    })
  }

  const handleRadioChange = (field: "pricing", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCategoryName = (id: string) => categories.find((cat) => cat.id === id)?.name || id
  const getPlatformLabel = (value: string) =>
    Object.entries(platformType)
      .find(([, v]) => v === value)?.[0]
      ?.toLowerCase() || value
  const getPricingLabel = (value: string) =>
    Object.entries(pricingType)
      .find(([, v]) => v === value)?.[0]
      ?.toLowerCase() || value

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">
                Website URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://myawesomeproject.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                placeholder="Describe your project"
                className="max-h-[300px] overflow-y-auto"
              />
            </div>
            <div>
              <Label htmlFor="problemSolved">
                What problem does this solve? <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="problemSolved"
                name="problemSolved"
                value={formData.problemSolved}
                onChange={handleInputChange}
                placeholder="The specific problem your tool, workflow, or service solves."
                className="mt-1.5 min-h-[90px]"
                required
              />
            </div>
            <ImageUploadInput
              id="logoUrl"
              label="Logo (optional)"
              value={uploadedLogoUrl}
              onChange={setUploadedLogoUrl}
              helperText="Paste an image URL or upload a square logo. If left blank, a generated avatar is used automatically."
              previewClassName="h-24 w-24"
            />
            <ImageUploadInput
              id="productImage"
              label="Product images (optional)"
              multiple
              value={formData.productImage}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  productImage: value,
                  galleryImages: value ? [value] : [],
                }))
              }
              onMultiChange={(values) =>
                setFormData((prev) => ({
                  ...prev,
                  productImage: values[0] ?? null,
                  galleryImages: values,
                }))
              }
              helperText="Add one or more screenshots — you can select several files at once. Recommended: 16:9."
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <Label className="mb-2 block">
                Categories <span className="text-red-500">*</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  ({formData.categories.length}/5 selected)
                </span>
              </Label>
              {isLoadingCategories ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <RiLoader4Line className="h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : categories.length > 0 ? (
                <div className="max-h-60 space-y-3 overflow-y-auto rounded-md border p-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={formData.categories.includes(cat.id)}
                        onCheckedChange={(checked) => {
                          if (checked && formData.categories.length >= 5) {
                            setError("You can select a maximum of 5 categories.")
                            return
                          }
                          handleCheckboxChange("categories", cat.id, !!checked)
                        }}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer font-normal">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No categories available.</p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Select up to 5 relevant categories.
              </p>
            </div>

            <div>
              <Label htmlFor={tagInputId}>
                Tech Stack <span className="text-red-500">*</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  ({formData.techStack.length}/5 technologies)
                </span>
              </Label>
              <TagInput
                id={tagInputId}
                tags={techStackTags}
                setTags={(newTags) => {
                  if (newTags.length > 5) {
                    setError("You can add a maximum of 5 technologies.")
                    return
                  }
                  setTechStackTags(newTags)
                }}
                placeholder="Type a technology and press Enter..."
                styleClasses={{
                  inlineTagsContainer:
                    "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 mt-1",
                  input: "w-full min-w-[80px] shadow-none px-2 h-7",
                  tag: {
                    body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                    closeButton:
                      "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                  },
                }}
                activeTagIndex={activeTechTagIndex}
                setActiveTagIndex={setActiveTechTagIndex}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Enter up to 5 technologies used, press Enter or comma to add a tag.
              </p>
            </div>

            <div>
              <Label className="mb-2 block">
                Platforms <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3 rounded-md border p-4">
                {Object.entries(platformType).map(([key, value]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${value}`}
                      checked={formData.platforms.includes(value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("platforms", value, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`platform-${value}`}
                      className="cursor-pointer font-normal capitalize"
                    >
                      {key.toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Select all platforms your project supports.
              </p>
            </div>

            <div>
              <Label className="mb-2 block">
                Pricing Model <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.pricing}
                onValueChange={(value) => handleRadioChange("pricing", value)}
                className="flex flex-col gap-4 sm:flex-row"
              >
                {Object.entries(pricingType).map(([key, value]) => (
                  <div key={value} className="flex-1">
                    <Label
                      htmlFor={`pricing-${value}`}
                      className="hover:bg-muted/50 flex h-full cursor-pointer items-center space-x-2 rounded-md border p-3 transition-colors"
                    >
                      <RadioGroupItem value={value} id={`pricing-${value}`} />
                      <span className="font-normal capitalize">{key.toLowerCase()}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter URL (Optional)</Label>
                <Input
                  id="twitterUrl"
                  name="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <RiCheckLine className="h-5 w-5" />
              <h3 className="text-lg font-medium">Review and Submit</h3>
            </div>

            <div className="bg-card overflow-hidden rounded-lg border">
              <div className="space-y-6 p-6">
                <div>
                  <h4 className="mb-3 border-b pb-2 text-base font-semibold">
                    Project Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={formData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {formData.websiteUrl}
                      </a>
                    </p>
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <RichTextDisplay
                      content={formData.description}
                      className="mt-1 max-h-[200px] overflow-y-auto rounded-md border p-2 text-sm"
                    />
                    {uploadedLogoUrl && (
                      <p className="flex flex-col items-start gap-2">
                        <strong>Logo:</strong>
                        <img
                          src={uploadedLogoUrl}
                          alt="Uploaded logo"
                          className="h-12 w-12 rounded border object-contain"
                        />
                      </p>
                    )}
                    {formData.productImage && (
                      <p className="flex flex-col items-start gap-2">
                        <strong>Product Image:</strong>
                        <img
                          src={formData.productImage}
                          alt="Product image"
                          className="h-32 w-56 rounded border object-cover"
                        />
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 border-b pb-2 text-base font-semibold">Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Categories:</strong>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.categories.map((catId) => (
                          <Badge key={catId} variant="secondary">
                            {getCategoryName(catId)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Tech Stack:</strong>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.techStack.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Platforms:</strong>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.platforms.map((plat) => (
                          <Badge key={plat} variant="secondary" className="capitalize">
                            {getPlatformLabel(plat)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p>
                      <strong>Pricing:</strong>{" "}
                      <span className="capitalize">
                        <Badge variant="outline">{getPricingLabel(formData.pricing)}</Badge>
                      </span>
                    </p>
                    {formData.githubUrl && (
                      <p>
                        <strong>GitHub:</strong>{" "}
                        <a
                          href={formData.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {formData.githubUrl}
                        </a>
                      </p>
                    )}
                    {formData.twitterUrl && (
                      <p>
                        <strong>Twitter:</strong>{" "}
                        <a
                          href={formData.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {formData.twitterUrl}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border-t px-6 py-4">
                <div className="flex items-start gap-3">
                  <RiInformationLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Ready to submit?</p>
                    <p className="text-muted-foreground text-xs">
                      Please review all information carefully. Once submitted, your solution goes
                      live on the exchange.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {renderStepper()}

      {renderStepContent()}

      {error && (
        <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-md border p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isPending || isUploadingLogo || isUploadingProductImage}
        >
          <RiArrowLeftLine className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={isPending || isUploadingLogo || isUploadingProductImage}
          >
            Next
            <RiArrowRightLine className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isPending || isUploadingLogo || isUploadingProductImage}
          >
            {isPending ? (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RiRocketLine className="mr-2 h-4 w-4" />
            )}
            Submit solution
          </Button>
        )}
      </div>
    </form>
  )
}
