import type { RequestHandler } from "express"

import { env } from "../../../config"
import { ApiError } from "../errors"
import { CSRF_COOKIE, ACCESS_COOKIE, readCookies } from "../cookies"
import { verifyAccessToken } from "./token"
import { requireActiveSession } from "./auth.service"

const UNSAFE = new Set(["POST", "PATCH", "PUT", "DELETE"])

function allowedOrigins(): Set<string> {
  return new Set(
    env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  )
}

export const requireOrigin: RequestHandler = (req, _res, next) => {
  if (!UNSAFE.has(req.method)) {
    next()
    return
  }
  const origin = req.header("origin")
  if (!origin || !allowedOrigins().has(origin)) {
    next(new ApiError(403, "ORIGIN_REJECTED", "The request origin is not allowed."))
    return
  }
  next()
}

export const requireCsrf: RequestHandler = (req, _res, next) => {
  if (!UNSAFE.has(req.method)) {
    next()
    return
  }
  const cookies = readCookies(req.header("cookie"))
  const header = req.header("x-csrf-token")
  const cookie = cookies[CSRF_COOKIE]
  if (!header || !cookie || header !== cookie) {
    next(new ApiError(403, "CSRF_REJECTED", "The request could not be verified."))
    return
  }
  next()
}

export const requirePlatformAdmin: RequestHandler = async (req, _res, next) => {
  try {
    const cookies = readCookies(req.header("cookie"))
    const token = cookies[ACCESS_COOKIE]
    if (!token) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const claims = verifyAccessToken(token, env.PLATFORM_ACCESS_TOKEN_SECRET)
    if (!claims) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const user = await requireActiveSession(claims.sid, claims.sub)
    req.platformAdmin = user
    req.platformSessionId = claims.sid
    next()
  } catch (error) {
    next(error)
  }
}

export const requirePasswordChanged: RequestHandler = (req, _res, next) => {
  if (req.platformAdmin?.mustChangePassword) {
    next(
      new ApiError(
        403,
        "PASSWORD_CHANGE_REQUIRED",
        "Change the initial password before continuing.",
      ),
    )
    return
  }
  next()
}
