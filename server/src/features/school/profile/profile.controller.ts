import type { RequestHandler } from "express"

import { ApiError } from "../../platform/errors"
import { schoolProfileUpdateSchema } from "./profile.schemas"
import * as profile from "./profile.service"

function meta(req: Parameters<RequestHandler>[0]) {
  return {
    ipAddress: req.ip ?? null,
    userAgent: req.header("user-agent")?.slice(0, 512) ?? null,
    correlationId: req.requestId,
  }
}

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.school) {
      throw new ApiError(404, "NOT_FOUND", "Not found.")
    }
    res.status(200).json({ school: await profile.getSchoolProfile(req.school) })
  } catch (error) {
    next(error)
  }
}

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.school || !req.schoolAdmin) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    const body = schoolProfileUpdateSchema.parse(req.body)
    res.status(200).json({
      school: await profile.updateSchoolProfile(req.school, req.schoolAdmin.id, body, meta(req)),
    })
  } catch (error) {
    next(error)
  }
}
