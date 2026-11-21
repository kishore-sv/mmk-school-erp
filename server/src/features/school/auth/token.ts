import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

export type SchoolAccessClaims = {
  sub: string
  sid: string
  fam: string
  mcp: boolean
  sch: string
  ten: string
  iat: number
  exp: number
}

const ACCESS_TTL_SECONDS = 15 * 60
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000

function encode(value: string): string {
  return Buffer.from(value).toString("base64url")
}

export function signSchoolAccessToken(
  claims: Omit<SchoolAccessClaims, "iat" | "exp">,
  secret: string,
  now = Date.now(),
): string {
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = encode(
    JSON.stringify({
      ...claims,
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + ACCESS_TTL_SECONDS,
    }),
  )
  const signature = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url")
  return `${header}.${payload}.${signature}`
}

export function verifySchoolAccessToken(
  token: string,
  secret: string,
  now = Date.now(),
): SchoolAccessClaims | null {
  const parts = token.split(".")
  if (parts.length !== 3) {
    return null
  }
  const [header, payload, signature] = parts
  if (!header || !payload || !signature) {
    return null
  }
  const expected = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url")
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null
  }
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SchoolAccessClaims
    if (
      typeof claims.sub !== "string" ||
      typeof claims.sid !== "string" ||
      typeof claims.fam !== "string" ||
      typeof claims.mcp !== "boolean" ||
      typeof claims.sch !== "string" ||
      typeof claims.ten !== "string" ||
      typeof claims.exp !== "number"
    ) {
      return null
    }
    if (claims.exp * 1000 <= now) {
      return null
    }
    return claims
  } catch {
    return null
  }
}

export function createRefreshToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashRefreshToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(`school-refresh:${token}`).digest("hex")
}

export function createCsrfToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashOtp(otp: string, secret: string, schoolId: string, adminId: string): string {
  return createHmac("sha256", secret).update(`school-otp:${schoolId}:${adminId}:${otp}`).digest("hex")
}

export function otpMatches(otp: string, hash: string, secret: string, schoolId: string, adminId: string): boolean {
  const actual = Buffer.from(hashOtp(otp, secret, schoolId, adminId))
  const expected = Buffer.from(hash)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function createResetToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashResetToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(`school-reset:${token}`).digest("hex")
}
