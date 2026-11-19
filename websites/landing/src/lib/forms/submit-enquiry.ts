"use server"

import { siteConfig } from "@/config/site"
import type { EnquiryPayload } from "@/lib/forms/schemas"

export type EnquiryResult =
  | { status: "sent" }
  | { status: "unconfigured"; mailto: string }
  | { status: "error"; message: string }

const visitorErrorMessage =
  "We could not send your enquiry right now. Please try again or contact us using the email and phone numbers on this page."

function providerRejectedMessage(message?: string) {
  if (!message) return visitorErrorMessage
  if (/html files|web server|formsubmit/i.test(message)) return visitorErrorMessage
  return visitorErrorMessage
}

function formSubmitRecipient() {
  return process.env.FORMSUBMIT_EMAIL ?? siteConfig.email
}

function payloadToFormSubmitBody(purpose: string, payload: EnquiryPayload) {
  const body: Record<string, string> = {
    _subject: `${siteConfig.name} - ${purpose} enquiry`,
    _template: "table",
    _captcha: "false",
    purpose,
    source: siteConfig.url,
  }

  if ("email" in payload && payload.email) {
    body._replyto = payload.email
  }

  for (const [key, value] of Object.entries(payload)) {
    if (key === "consent") continue
    if (value === undefined || value === null) continue
    body[key] = Array.isArray(value) ? value.join(", ") : String(value)
  }

  return body
}

export async function submitEnquiry(purpose: string, payload: EnquiryPayload): Promise<EnquiryResult> {
  const recipient = formSubmitRecipient()
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: siteConfig.url,
        Referer: `${siteConfig.url}/contact`,
      },
      body: JSON.stringify(payloadToFormSubmitBody(purpose, payload)),
    })

    let data: { success?: string | boolean; message?: string } | null = null
    try {
      data = (await response.json()) as { success?: string | boolean; message?: string }
    } catch {
      data = null
    }

    if (!response.ok) {
      return {
        status: "error",
        message: visitorErrorMessage,
      }
    }

    if (data?.success === true || data?.success === "true") {
      return { status: "sent" }
    }

    return {
      status: "error",
      message: providerRejectedMessage(data?.message),
    }
  } catch {
    const subject = encodeURIComponent(`${siteConfig.name} ${purpose}`)
    const text = encodeURIComponent(JSON.stringify(payload, null, 2))
    return {
      status: "unconfigured",
      mailto: `mailto:${siteConfig.email}?subject=${subject}&body=${text}`,
    }
  }
}