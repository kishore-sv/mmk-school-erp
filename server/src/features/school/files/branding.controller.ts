import type { RequestHandler } from "express"
import { z } from "zod"

import { ApiError } from "../../platform/errors"
import * as branding from "./branding.service"

function meta(req: Parameters<RequestHandler>[0]) {
  return {
    ipAddress: req.ip ?? null,
    userAgent: req.header("user-agent")?.slice(0, 512) ?? null,
    correlationId: req.requestId,
  }
}

function schoolIdFrom(req: Parameters<RequestHandler>[0], param?: string): string {
  const id = param ?? req.school?.id
  if (!id) {
    throw new ApiError(404, "NOT_FOUND", "Not found.")
  }
  return id
}

const partsSchema = z.object({
  parts: z.array(z.object({ partNumber: z.number().int().positive(), eTag: z.string().min(1) })).optional(),
})

const partSchema = z.object({ partNumber: z.number().int().positive() })

export function brandingHandlers(actorOf: (req: Parameters<RequestHandler>[0]) => { kind: "platform_admin" | "school_admin"; id: string }, schoolIdOf: (req: Parameters<RequestHandler>[0]) => string) {
  const initiate: RequestHandler = async (req, res, next) => {
    try {
      const body = branding.uploadIntentSchema.parse(req.body)
      res.status(201).json(await branding.initiateBrandingUpload(schoolIdOf(req), actorOf(req), body))
    } catch (error) {
      next(error)
    }
  }
  const part: RequestHandler = async (req, res, next) => {
    try {
      const uploadId = req.params.uploadId
      if (typeof uploadId !== "string") {
        throw new ApiError(400, "VALIDATION_ERROR", "An upload id is required.")
      }
      const body = partSchema.parse(req.body)
      res.status(200).json(await branding.brandingPartUrl(schoolIdOf(req), uploadId, body.partNumber))
    } catch (error) {
      next(error)
    }
  }
  const complete: RequestHandler = async (req, res, next) => {
    try {
      const uploadId = req.params.uploadId
      if (typeof uploadId !== "string") {
        throw new ApiError(400, "VALIDATION_ERROR", "An upload id is required.")
      }
      const body = partsSchema.parse(req.body ?? {})
      res.status(200).json(await branding.completeBrandingUpload(schoolIdOf(req), uploadId, actorOf(req), body.parts, meta(req)))
    } catch (error) {
      next(error)
    }
  }
  const abort: RequestHandler = async (req, res, next) => {
    try {
      const uploadId = req.params.uploadId
      if (typeof uploadId !== "string") {
        throw new ApiError(400, "VALIDATION_ERROR", "An upload id is required.")
      }
      await branding.abortBrandingUpload(schoolIdOf(req), uploadId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
  const remove: RequestHandler = async (req, res, next) => {
    try {
      const purpose = req.params.purpose
      if (purpose !== "logo" && purpose !== "banner") {
        throw new ApiError(400, "VALIDATION_ERROR", "Choose a logo or banner.")
      }
      await branding.removeBranding(schoolIdOf(req), purpose, actorOf(req), meta(req))
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
  return { initiate, part, complete, abort, remove }
}

export { schoolIdFrom }
