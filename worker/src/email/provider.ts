export type EmailMessage = {
  to: string
  subject: string
  text: string
  html: string
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ delivered: boolean; provider: string }>
}

export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<{ delivered: boolean; provider: string }> {
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        level: "info",
        service: "worker",
        message: "email preview (console provider, not delivered)",
        to: message.to,
        subject: message.subject,
        text: message.text,
      }),
    )
    return { delivered: false, provider: "console" }
  }
}

export class AmazonSesEmailProvider implements EmailProvider {
  async send(): Promise<{ delivered: boolean; provider: string }> {
    throw new Error("Amazon SES is not configured.")
  }
}
