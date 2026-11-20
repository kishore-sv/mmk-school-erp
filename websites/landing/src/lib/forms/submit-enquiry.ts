import { siteConfig } from "@/config/site"
import type { EnquiryPayload } from "@/lib/forms/schemas"

export type EnquiryResult =
  | { status: "sent" }
  | { status: "unconfigured"; mailto: string }
  | { status: "error"; message: string }

const visitorErrorMessage =
  "We could not send your enquiry right now. Please try again or contact us using the email and phone numbers on this page."

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

/** Web3Forms free tier requires client-side requests; server-side POST returns 403. */
function web3FormsAccessKey() {
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? ""
}

function mailtoFallback(purpose: string, payload: EnquiryPayload): EnquiryResult {
  const subject = encodeURIComponent(`${siteConfig.name} ${purpose}`)
  const text = encodeURIComponent(JSON.stringify(payload, null, 2))
  return {
    status: "unconfigured",
    mailto: `mailto:${siteConfig.email}?subject=${subject}&body=${text}`,
  }
}

function payloadToWeb3FormsBody(purpose: string, payload: EnquiryPayload) {
  const accessKey = web3FormsAccessKey()
  const body: Record<string, string> = {
    access_key: accessKey,
    subject: `${siteConfig.name} - ${purpose} enquiry`,
    purpose,
    source: siteConfig.url,
    botcheck: "",
  }

  if ("fullName" in payload && payload.fullName) {
    body.name = payload.fullName
    body.from_name = payload.fullName
  }
  if ("contactPerson" in payload && payload.contactPerson) {
    body.name = payload.contactPerson
    body.from_name = payload.contactPerson
  }
  if ("email" in payload && payload.email) {
    body.email = payload.email
    body.replyto = payload.email
  }

  for (const [key, value] of Object.entries(payload)) {
    if (key === "consent") continue
    if (value === undefined || value === null) continue
    body[key] = Array.isArray(value) ? value.join(", ") : String(value)
  }

  return body
}

export async function submitEnquiry(purpose: string, payload: EnquiryPayload): Promise<EnquiryResult> {
  const accessKey = web3FormsAccessKey()
  if (!accessKey) {
    return mailtoFallback(purpose, payload)
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payloadToWeb3FormsBody(purpose, payload)),
    })

    let data: { success?: boolean; message?: string } | null = null
    try {
      data = (await response.json()) as { success?: boolean; message?: string }
    } catch {
      data = null
    }

    if (!response.ok) {
      return {
        status: "error",
        message: visitorErrorMessage,
      }
    }

    if (data?.success === true) {
      return { status: "sent" }
    }

    return {
      status: "error",
      message: visitorErrorMessage,
    }
  } catch {
    return mailtoFallback(purpose, payload)
  }
}