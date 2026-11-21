import { ConsoleEmailProvider } from "./console-provider"
import { AmazonSesEmailProvider } from "./ses-provider"
import type { EmailProvider } from "./types"

export function createEmailProvider(name: "console" | "ses"): EmailProvider {
  if (name === "ses") {
    return new AmazonSesEmailProvider()
  }
  return new ConsoleEmailProvider()
}

export type { EmailJobPayload, EmailMessage, EmailPriority, EmailProvider, EmailResult } from "./types"
