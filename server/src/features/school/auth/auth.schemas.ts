import { z } from "zod"

import { normalizeEmail } from "../../platform/auth/auth.schemas"

export { normalizeEmail }

export const loginSchema = z.object({
  email: z.string().trim().email().max(320).transform(normalizeEmail),
  password: z.string().min(1).max(128),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12).max(128),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(320).transform(normalizeEmail),
})

export const verifyOtpSchema = z.object({
  email: z.string().trim().email().max(320).transform(normalizeEmail),
  otp: z.string().regex(/^\d{6}$/),
})

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(12).max(128),
  confirmPassword: z.string().min(12).max(128),
})
