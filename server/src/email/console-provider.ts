import { log } from "../utils/logger"
import type { EmailMessage, EmailProvider, EmailResult } from "./types"

export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<EmailResult> {
    log("info", "email preview (console provider, not delivered)", {
      to: message.to,
      subject: message.subject,
      text: message.text,
    })
    return { delivered: false, provider: "console", messageId: null }
  }
}
