import { z } from "zod"

import { normalizeEmail } from "../../platform/auth/auth.schemas"

const optionalText = z.string().trim().max(200).optional().or(z.literal(""))

export const schoolProfileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(160),
  website: z.string().trim().url().max(300).optional().or(z.literal("")),
  email: z.string().trim().email().max(320).transform(normalizeEmail),
  phone: z.string().trim().min(7).max(20),
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: optionalText,
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(12),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
})

export type SchoolProfileUpdate = z.infer<typeof schoolProfileUpdateSchema>
