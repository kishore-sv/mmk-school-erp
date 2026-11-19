import { z } from "zod"
import { contactEnquiryTypes, contactMethods, studentCountRanges } from "@/config/contact"
import { isValidPhone } from "@/lib/forms/phone"

const contactFormEnquiryValues = contactEnquiryTypes.map((item) => item.value) as [
  (typeof contactEnquiryTypes)[number]["value"],
  ...(typeof contactEnquiryTypes)[number]["value"][],
]

const countValues = studentCountRanges.map((item) => item.value) as [
  (typeof studentCountRanges)[number]["value"],
  ...(typeof studentCountRanges)[number]["value"][],
]

const methodValues = contactMethods.map((item) => item.value) as [
  (typeof contactMethods)[number]["value"],
  ...(typeof contactMethods)[number]["value"][],
]

const sharedEnquiryFields = {
  fullName: z.string().trim().min(2, "Enter your full name."),
  schoolName: z.string().trim().min(2, "Enter the school name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Enter a phone number.")
    .refine(isValidPhone, "Enter a valid phone number."),
  city: z.string().trim().min(2, "Enter the city."),
  state: z.string().trim().min(2, "Select a state."),
  studentCount: z.enum(countValues, { message: "Select a student count range." }),
  message: z
    .string()
    .trim()
    .min(10, "Add a short message.")
    .max(2000, "Keep the message under 2,000 characters."),
  consent: z.boolean().refine((value) => value, "Consent is required before we can use these details."),
}

export const contactSchema = z.object({
  ...sharedEnquiryFields,
  enquiryType: z.enum(contactFormEnquiryValues, { message: "Select an enquiry type." }),
})

export const demoSchema = z.object({
  ...sharedEnquiryFields,
  enquiryType: z.literal("demo"),
  modules: z.array(z.string()).min(1, "Select at least one module."),
  preferredDate: z.string().optional(),
  contactMethod: z.enum(methodValues, { message: "Select a contact method." }),
})

export const quoteSchema = z.object({
  schoolName: z.string().trim().min(2, "Enter the school name."),
  contactPerson: z.string().trim().min(2, "Enter the contact person."),
  email: z.string().trim().email("Enter a valid work email."),
  phone: z
    .string()
    .trim()
    .min(1, "Enter a phone number.")
    .refine(isValidPhone, "Enter a valid phone number."),
  studentCount: z.enum(countValues, { message: "Select an approximate student count." }),
  city: z.string().trim().min(2, "Enter the city."),
  state: z.string().trim().min(2, "Select a state."),
  requirements: z
    .string()
    .trim()
    .min(10, "Describe what the school needs.")
    .max(2000, "Keep the requirements under 2,000 characters."),
  contactMethod: z.enum(methodValues, { message: "Select a contact method." }),
  consent: z.boolean().refine((value) => value, "Consent is required."),
})

export type ContactInput = z.infer<typeof contactSchema>
export type DemoInput = z.infer<typeof demoSchema>
export type QuoteInput = z.infer<typeof quoteSchema>
export type EnquiryPayload = ContactInput | DemoInput | QuoteInput