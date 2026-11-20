import type { Response } from "express"

import { env } from "../../config"

export const ACCESS_COOKIE = "mmk_platform_access"
export const REFRESH_COOKIE = "mmk_platform_refresh"
export const CSRF_COOKIE = "mmk_platform_csrf"

const ACCESS_MAX_AGE = 15 * 60
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60

function serialize(
  name: string,
  value: string,
  options: { maxAge: number; httpOnly: boolean },
): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${options.maxAge}`,
  ]
  if (options.httpOnly) {
    parts.push("HttpOnly")
  }
  if (env.NODE_ENV === "production") {
    parts.push("Secure")
  }
  return parts.join("; ")
}

export function setSessionCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string; csrfToken: string },
): void {
  res.append(
    "Set-Cookie",
    serialize(ACCESS_COOKIE, tokens.accessToken, {
      maxAge: ACCESS_MAX_AGE,
      httpOnly: true,
    }),
  )
  res.append(
    "Set-Cookie",
    serialize(REFRESH_COOKIE, tokens.refreshToken, {
      maxAge: REFRESH_MAX_AGE,
      httpOnly: true,
    }),
  )
  res.append(
    "Set-Cookie",
    serialize(CSRF_COOKIE, tokens.csrfToken, {
      maxAge: REFRESH_MAX_AGE,
      httpOnly: false,
    }),
  )
}

export function clearSessionCookies(res: Response): void {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE]) {
    res.append(
      "Set-Cookie",
      serialize(name, "", { maxAge: 0, httpOnly: name !== CSRF_COOKIE }),
    )
  }
}

export function readCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!header) {
    return cookies
  }
  for (const part of header.split(";")) {
    const separator = part.indexOf("=")
    if (separator === -1) {
      continue
    }
    const name = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (name) {
      cookies[name] = decodeURIComponent(value)
    }
  }
  return cookies
}
