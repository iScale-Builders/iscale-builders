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
  // iScaleXchange retired launch scheduling — every publicly listed post is live
  // and upvotable. Only legacy pre-public payment states stay closed.
  return status !== launchStatus.PAYMENT_PENDING && status !== launchStatus.PAYMENT_FAILED
}
