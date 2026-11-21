import type { EmailMessage, EmailProvider, EmailResult } from "./types"

export class AmazonSesEmailProvider implements EmailProvider {
  async send(_message: EmailMessage): Promise<EmailResult> {
    throw new Error("Amazon SES is not configured. Set EMAIL_PROVIDER=console for local development.")
  }
}
