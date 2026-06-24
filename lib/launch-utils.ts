import { launchStatus } from "@/drizzle/db/schema"

/**
 * iScaleXchange is a permanent community showcase, not a time-boxed launch
 * platform. Upstream Open-Launch closes upvoting once a tool's launch day
 * ends (only `ongoing` accepts votes), which left every showcased tool
 * (`launched`) with no upvote button at all.
 *
 * Here, upvoting stays open for any publicly listed tool — both the few
 * currently `ongoing` and the many already `launched`. Pre-publication
 * states (`scheduled`, `payment_*`) are not yet public, so they stay closed.
 */
export function isUpvotingOpen(status: string): boolean {
  return status === launchStatus.ONGOING || status === launchStatus.LAUNCHED
}
