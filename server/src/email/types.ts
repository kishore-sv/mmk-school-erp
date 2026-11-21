export type EmailPriority = "critical" | "high" | "normal" | "low"

export type EmailMessage = {
  to: string
  subject: string
  text: string
  html: string
}

export type EmailResult = {
  delivered: boolean
  provider: string
  messageId: string | null
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailResult>
}

export type EmailJobPayload = {
  id: string
  emailJobId: string
  priority: EmailPriority
  jobType: string
  to: string
  subject: string
  text: string
  html: string
  idempotencyKey: string
  attempt: number
  maxAttempts: number
  correlationId: string | null
  devOnlyOtp?: string
}
