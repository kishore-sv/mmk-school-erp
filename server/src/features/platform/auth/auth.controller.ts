import type { RequestHandler } from "express"

import { clearSessionCookies, readCookies, REFRESH_COOKIE, setSessionCookies } from "../cookies"
import { ApiError } from "../errors"
import { changePasswordSchema, loginSchema } from "./auth.schemas"
import * as auth from "./auth.service"
import { verifyAccessToken } from "./token"
import { env } from "../../../config"

function meta(req: Parameters<RequestHandler>[0]) {
  return {
    ipAddress: req.ip ?? req.socket.remoteAddress ?? "unknown",
    userAgent: req.header("user-agent")?.slice(0, 512) ?? null,
    correlationId: req.requestId,
  }
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body)
    const issued = await auth.login(body, meta(req))
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
    const issued = await auth.refresh(refreshToken, meta(req))
    setSessionCookies(res, issued)
    res.status(200).json({ user: issued.user })
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const cookies = readCookies(req.header("cookie"))
    const access = cookies.mmk_platform_access
    const claims = access
      ? verifyAccessToken(access, env.PLATFORM_ACCESS_TOKEN_SECRET)
      : null
    await auth.logout(
      {
        refreshToken: cookies[REFRESH_COOKIE],
        sessionId: claims?.sid,
      },
      meta(req),
    )
    clearSessionCookies(res)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const me: RequestHandler = (req, res) => {
  res.status(200).json({ user: req.platformAdmin })
}

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    if (!req.platformAdmin) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const body = changePasswordSchema.parse(req.body)
    const issued = await auth.changePassword(req.platformAdmin.id, body, meta(req))
    setSessionCookies(res, issued)
    res.status(200).json({ user: issued.user })
  } catch (error) {
    next(error)
  }
}
