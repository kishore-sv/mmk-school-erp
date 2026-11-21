import type { RequestHandler } from "express"

import { env } from "../../../config"
import { ApiError } from "../../platform/errors"
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  RESET_COOKIE,
  clearResetCookie,
  clearSessionCookies,
  readCookies,
  setResetCookie,
  setSessionCookies,
} from "../cookies"
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.schemas"
import * as auth from "./auth.service"
import { verifySchoolAccessToken } from "./token"

function meta(req: Parameters<RequestHandler>[0]) {
  return {
    ipAddress: req.ip ?? req.socket.remoteAddress ?? "unknown",
    userAgent: req.header("user-agent")?.slice(0, 512) ?? null,
    correlationId: req.requestId,
  }
}

function schoolOf(req: Parameters<RequestHandler>[0]) {
  if (!req.school) {
    throw new ApiError(404, "NOT_FOUND", "Not found.")
  }
  return req.school
}

export const tenantContext: RequestHandler = (req, res, next) => {
  try {
    const school = schoolOf(req)
    if (school.status !== "active" || school.tenantStatus !== "active") {
      res.status(200).json({ school: { status: "unavailable" } })
      return
    }
    res.status(200).json({
      school: {
        status: "active",
        schoolCode: school.schoolCode,
        name: school.name,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body)
    const issued = await auth.login(schoolOf(req), body, meta(req))
    setSessionCookies(res, issued)
    res.status(200).json({ user: issued.user })
  } catch (error) {
    next(error)
  }
}

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const cookies = readCookies(req.header("cookie"))
    const refreshToken = cookies[REFRESH_COOKIE]
    if (!refreshToken) {
      throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
    }
    const issued = await auth.refresh(schoolOf(req), refreshToken, meta(req))
    setSessionCookies(res, issued)
    res.status(200).json({ user: issued.user })
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const cookies = readCookies(req.header("cookie"))
    const access = cookies[ACCESS_COOKIE]
    const claims = access ? verifySchoolAccessToken(access, env.SCHOOL_ACCESS_TOKEN_SECRET) : null
    await auth.logout(schoolOf(req), { refreshToken: cookies[REFRESH_COOKIE], sessionId: claims?.sid }, meta(req))
    clearSessionCookies(res)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const me: RequestHandler = (req, res) => {
  res.status(200).json({ user: req.schoolAdmin })
}

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    if (!req.schoolAdmin) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const body = changePasswordSchema.parse(req.body)
    const issued = await auth.changePassword(schoolOf(req), req.schoolAdmin.id, body, meta(req))
    setSessionCookies(res, issued)
    res.status(200).json({ user: issued.user })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const body = forgotPasswordSchema.parse(req.body)
    await auth.forgotPassword(schoolOf(req), body.email, meta(req))
    res.status(200).json({ message: auth.neutralResetMessage() })
  } catch (error) {
    next(error)
  }
}

export const verifyResetOtp: RequestHandler = async (req, res, next) => {
  try {
    const body = verifyOtpSchema.parse(req.body)
    const token = await auth.verifyResetOtp(schoolOf(req), body.email, body.otp)
    setResetCookie(res, token)
    res.status(200).json({ verified: true })
  } catch (error) {
    next(error)
  }
}

export const resendResetOtp: RequestHandler = async (req, res, next) => {
  try {
    const body = forgotPasswordSchema.parse(req.body)
    await auth.forgotPassword(schoolOf(req), body.email, meta(req))
    res.status(200).json({ message: auth.neutralResetMessage() })
  } catch (error) {
    next(error)
  }
}

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const cookies = readCookies(req.header("cookie"))
    const token = cookies[RESET_COOKIE]
    if (!token) {
      throw new ApiError(400, "INVALID_RESET", "The password reset session is no longer valid.")
    }
    const body = resetPasswordSchema.parse(req.body)
    const issued = await auth.resetPassword(schoolOf(req), token, body.newPassword, body.confirmPassword, meta(req))
    clearResetCookie(res)
    setSessionCookies(res, issued)
    res.status(200).json({ user: issued.user })
  } catch (error) {
    next(error)
  }
}
