export type IntegrationRecord = {
  slug: string
  title: string
  definition: string
  detail: string[]
  caveats: string[]
}

export const integrations: IntegrationRecord[] = [
  {
    slug: "push-notifications",
    title: "Push Notifications",
    definition:
      "Push notifications are a configurable way for the school to alert teachers, students, and parents in the mobile app.",
    detail: [
      "The school chooses the audience in Notifications and Communication.",
      "Delivery depends on the app being available to that user and on the device allowing notifications.",
      "In-app announcements remain available even when a push is not delivered.",
    ],
    caveats: [
      "This page does not name a push provider.",
      "A channel being configurable is not a claim that it is already connected for every school.",
    ],
  },
  {
    slug: "email",
    title: "Email Integration",
    definition:
      "Email is a configurable notification channel for announcements the school chooses to send outside the app.",
    detail: [
      "Staff still compose the message and audience inside MMK School ERP.",
      "The school needs a mailbox or email provider configuration before messages can leave the product.",
      "Delivery history is kept with the announcement when the channel is in use.",
    ],
    caveats: [
      "No email vendor is listed as a live integration.",
      "Email is not a separate bulk-mailing product.",
    ],
  },
  {
    slug: "sms",
    title: "SMS Integration",
    definition:
      "SMS is a configurable channel for short school notices to people the school is allowed to message.",
    detail: [
      "Audience selection stays in the notification composer.",
      "An SMS provider has to be configured before SMS is sent.",
      "Parents can still read in-app notices if SMS is not enabled.",
    ],
    caveats: [
      "The website does not claim a specific SMS operator is connected.",
    ],
  },
  {
    slug: "whatsapp",
    title: "WhatsApp Integration",
    definition:
      "WhatsApp is a configurable communication channel for school notices, not a replacement for the parent or teacher portal.",
    detail: [
      "The school targets a role, class, or section first.",
      "WhatsApp sending requires a provider configuration.",
      "Classwork such as homework and the digital diary remains in the learning module.",
    ],
    caveats: [
      "This is not a claim that a WhatsApp Business account is already connected.",
    ],
  },
  {
    slug: "fee-payment-gateway",
    title: "School Fee Payment Gateway",
    definition:
      "An optional payment gateway lets parents pay the school's fees online. It is separate from the subscription the school pays to MMK.",
    detail: [
      "Fee structures, dues, and receipts stay in Fee Management.",
      "The gateway, when configured, is for parent-to-school fee payments.",
      "Schools can still record collections at the counter without a gateway.",
    ],
    caveats: [
      "No payment provider is named because none is confirmed here.",
      "MMK subscription billing is not processed through the school's fee module.",
    ],
  },
]

export function getIntegration(slug: string) {
  return integrations.find((item) => item.slug === slug)
}
