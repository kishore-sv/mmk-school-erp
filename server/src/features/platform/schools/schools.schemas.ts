import { z } from "zod"

import { normalizeEmail } from "../auth/auth.schemas"

const schoolCode = z
  .string()
  .trim()
  .min(2)
  .max(32)
  .regex(/^[A-Za-z0-9-]+$/)
  .transform((value) => value.toUpperCase())

const phone = z.string().trim().min(7).max(20)
const optionalText = z.string().trim().max(200).optional().or(z.literal(""))

const schoolFields = z.object({
    name: z.string().trim().min(2).max(160),
    schoolCode,
    website: z.string().trim().url().max(300).optional().or(z.literal("")),
    email: z.string().trim().email().max(320).transform(normalizeEmail),
    phone,
    schoolType: z.enum([
      "pre_primary",
      "primary",
      "secondary",
      "higher_secondary",
      "k12",
      "other",
    ]),
    board: optionalText,
    country: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    city: z.string().trim().min(2).max(80),
    postalCode: z.string().trim().min(3).max(12),
    addressLine1: z.string().trim().min(3).max(200),
    addressLine2: optionalText,
    billingModel: z.enum(["per_student", "custom"]),
    perStudentRate: z.string().regex(/^\d+(\.\d{1,2})?$/),
    billingFrequency: z.enum(["monthly", "quarterly", "annual", "custom"]),
    subscriptionStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    subscriptionEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    studentLimit: z.number().int().positive().max(100000).optional(),
    commercialNotes: z.string().trim().max(2000).optional().or(z.literal("")),
    adminName: z.string().trim().min(2).max(160),
    adminEmail: z.string().trim().email().max(320).transform(normalizeEmail),
    adminPhone: phone,
  })

const dateOrder = (value: { subscriptionEnd: string; subscriptionStart: string }) =>
  value.subscriptionEnd >= value.subscriptionStart

export const schoolBodySchema = schoolFields.refine(dateOrder, {
  message: "The subscription end date must be on or after the start date.",
  path: ["subscriptionEnd"],
})

export const schoolUpdateSchema = schoolFields.omit({ schoolCode: true }).refine(dateOrder, {
  message: "The subscription end date must be on or after the start date.",
  path: ["subscriptionEnd"],
})

export const listSchoolsSchema = z.object({
  q: z.string().trim().max(160).optional(),
  status: z.enum(["active", "suspended", "archived"]).optional(),
  subscriptionStatus: z.enum(["scheduled", "active", "ended"]).optional(),
  createdFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  createdTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

export const reasonSchema = z.object({
  reason: z.string().trim().max(500).optional(),
})

export type SchoolBody = z.infer<typeof schoolBodySchema>
export type SchoolUpdate = z.infer<typeof schoolUpdateSchema>
