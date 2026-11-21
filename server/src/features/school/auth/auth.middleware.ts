import type { RequestHandler } from "express"

import { env } from "../../../config"
import { ApiError } from "../../platform/errors"
import { isAllowedBrowserOrigin } from "../../../tenant/origins"
import { ACCESS_COOKIE, CSRF_COOKIE, readCookies } from "../cookies"
import { requireActiveSession } from "./auth.service"
import { verifySchoolAccessToken } from "./token"

const UNSAFE = new Set(["POST", "PATCH", "PUT", "DELETE"])

export const requireSchoolOrigin: RequestHandler = (req, _res, next) => {
  if (!UNSAFE.has(req.method)) {
    next()
    return
  }
  const origin = req.header("origin")
  if (!origin || !isAllowedBrowserOrigin(origin, env)) {
    next(new ApiError(403, "ORIGIN_REJECTED", "The request origin is not allowed."))
    return
  }
  next()
}

export const requireSchoolCsrf: RequestHandler = (req, _res, next) => {
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

export const requireSchoolAdmin: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.school) {
      throw new ApiError(404, "NOT_FOUND", "Not found.")
    }
    const cookies = readCookies(req.header("cookie"))
    const token = cookies[ACCESS_COOKIE]
    if (!token) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const claims = verifySchoolAccessToken(token, env.SCHOOL_ACCESS_TOKEN_SECRET)
    if (!claims || claims.sch !== req.school.id || claims.ten !== req.school.tenantId) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const user = await requireActiveSession(req.school, claims.sid, claims.sub)
    req.schoolAdmin = user
    req.schoolSessionId = claims.sid
    next()
  } catch (error) {
    next(error)
  }
}

export const requireSchoolPasswordChanged: RequestHandler = (req, _res, next) => {
  if (req.schoolAdmin?.mustChangePassword) {
    next(new ApiError(403, "PASSWORD_CHANGE_REQUIRED", "Change the initial password before continuing."))
    return
  }
  next()
}
