import { loadEnv } from "../config/env"
import { getDb } from "./index"
import { findUserByEmail, insertPasswordHistory, insertUser } from "../features/platform/auth/auth.repository"
import { normalizeEmail } from "../features/platform/auth/auth.schemas"
import { assertPasswordPolicy, hashPassword } from "../features/platform/auth/password"

loadEnv()

const email = process.env.PLATFORM_ADMIN_SEED_EMAIL?.trim() ?? ""
const password = process.env.PLATFORM_ADMIN_SEED_PASSWORD ?? ""
const name = process.env.PLATFORM_ADMIN_SEED_NAME?.trim() || "MMK Platform Administrator"

if (!email || !password) {
  throw new Error(
    "PLATFORM_ADMIN_SEED_EMAIL and PLATFORM_ADMIN_SEED_PASSWORD are required. They must be set in the untracked environment, not in source code.",
  )
}

if (process.env.NODE_ENV === "production" && process.env.PLATFORM_ADMIN_SEED_CONFIRM !== "yes") {
  throw new Error(
    "Refusing to seed production without PLATFORM_ADMIN_SEED_CONFIRM=yes.",
  )
}

try {
  assertPasswordPolicy(password)
} catch {
  throw new Error(
    "The seed password must be 12 to 128 characters and include a letter and a number.",
  )
}

const normalized = normalizeEmail(email)
const existing = await findUserByEmail(getDb(), normalized)

if (existing) {
  if (existing.status !== "active" || existing.archivedAt) {
    throw new Error(
      "The seed email already belongs to a disabled or archived platform administrator.",
    )
  }
  console.log("Platform admin seed account already present.")
} else {
  const passwordHash = await hashPassword(password)
  const user = await insertUser(getDb(), {
    email: normalized,
    passwordHash,
    name,
    mustChangePassword: true,
  })
  await insertPasswordHistory(getDb(), user.id, passwordHash)
  console.log("Platform admin seed account created.")
}
