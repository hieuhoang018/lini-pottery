import { resend } from "./resend"
import { logger } from "./logger"

type SendMailInput = {
  to: string
  subject: string
  html: string
}

export const sendMail = async ({ to, subject, html }: SendMailInput): Promise<void> => {
  if (!resend) {
    logger.warn("[mailer] RESEND_API_KEY not configured, skipping email send")
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@lini-pottery.local",
      to,
      subject,
      html,
    })

    if (error) {
      logger.error({ error }, "[mailer] Resend API returned an error")
    }
  } catch (err) {
    logger.error({ err }, "[mailer] Failed to send email")
  }
}
