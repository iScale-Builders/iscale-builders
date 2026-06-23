"use client"

import Link from "next/link"

import { RiMessage2Line, RiThumbUpLine } from "@remixicon/react"

import { isUpvotingOpen } from "@/lib/launch-utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UpvoteButton } from "@/components/project/upvote-button"

interface ProjectCardButtonsProps {
  projectPageUrl: string
  commentCount: number
  projectId: string
  upvoteCount: number
  isAuthenticated: boolean
  hasUpvoted: boolean
  launchStatus: string
  projectName: string
}

export function ProjectCardButtons({
  projectPageUrl,
  commentCount,
  projectId,
  upvoteCount,
  isAuthenticated,
  hasUpvoted,
  launchStatus,
  projectName,
}: ProjectCardButtonsProps) {
  const canUpvote = isUpvotingOpen(launchStatus)

  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-start">
      <Link
        href={`${projectPageUrl}#comments`}
        prefetch={false}
        className="hover:border-primary dark:hover:border-primary group hidden h-12 w-12 flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 sm:flex"
        aria-label={`View comments for ${projectName}`}
      >
        <RiMessage2Line className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
        <span className="mt-1 text-sm leading-none font-semibold text-gray-700 dark:text-gray-300">
          {commentCount}
        </span>
      </Link>
      {canUpvote ? (
        <UpvoteButton
          projectId={projectId}
          initialUpvoted={hasUpvoted}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          variant="compact"
        />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-8 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-dashed px-2.5">
                <RiThumbUpLine className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <span className="text-sm leading-none font-semibold text-gray-700 dark:text-gray-300">
                  {upvoteCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="z-100 text-xs">
              Upvoting closed
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
