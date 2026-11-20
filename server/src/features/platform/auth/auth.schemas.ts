import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12).max(128),
})

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
