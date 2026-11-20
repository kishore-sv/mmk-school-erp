const HASH_OPTIONS = {
  algorithm: "argon2id",
  memoryCost: 19456,
  timeCost: 2,
} as const

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, HASH_OPTIONS)
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return Bun.password.verify(password, passwordHash)
}

export function assertPasswordPolicy(password: string): void {
  if (password.length < 12 || password.length > 128) {
    throw new Error("PASSWORD_POLICY")
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error("PASSWORD_POLICY")
  }
}
