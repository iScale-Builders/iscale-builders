import { Resend } from "resend"

interface EmailPayload {
  to: string
  subject: string
  html: string
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured")
  }

  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Sends an email using Resend
 * @param payload - Email configuration object
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(payload: EmailPayload) {
  const { to, subject, html } = payload

  try {
    const resend = getResendClient()
    const data = await resend.emails.send({
      from: "iScaleXchange <noreply@iscalebuilders.com>",
      to,
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send email")
  }
}
