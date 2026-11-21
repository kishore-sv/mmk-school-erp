import type { RequestHandler } from "express"
import { ZodError } from "zod"

import { ApiError } from "../errors"
import {
  lifecycleActionSchema,
  lifecycleOtpVerifySchema,
  listSchoolsSchema,
  protectedLifecycleSchema,
  reasonSchema,
  schoolBodySchema,
  schoolUpdateSchema,
} from "./schools.schemas"
import * as lifecycleVerification from "./lifecycle-verification.service"
import * as schools from "./schools.service"

function meta(req: Parameters<RequestHandler>[0]) {
  return {
    ipAddress: req.ip ?? null,
    userAgent: req.header("user-agent")?.slice(0, 512) ?? null,
    correlationId: req.requestId,
  }
}

function actor(req: Parameters<RequestHandler>[0]): string {
  if (!req.platformAdmin) {
    throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
  }
  return req.platformAdmin.id
}

function parseBody<T>(schema: { parse: (value: unknown) => T }, body: unknown): T {
  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(400, "VALIDATION_ERROR", "Check the submitted fields.", error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })))
    }
    throw error
  }
}

export const create: RequestHandler = async (req, res, next) => {
  try {
    const body = parseBody(schoolBodySchema, req.body)
    const school = await schools.createSchool(actor(req), body, meta(req), {
      idempotencyKey: req.header("idempotency-key") ?? undefined,
    })
    res.status(201).json({ school })
  } catch (error) {
    next(error)
  }
}

export const list: RequestHandler = async (req, res, next) => {
  try {
    const query = parseBody(listSchoolsSchema, req.query)
    res.status(200).json(await schools.listSchools(query))
  } catch (error) {
    next(error)
  }
}

export const get: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    if (typeof id !== "string") {
      throw new ApiError(400, "VALIDATION_ERROR", "A school id is required.")
    }
    res.status(200).json({ school: await schools.getSchool(id) })
  } catch (error) {
    next(error)
  }
}

export const update: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    if (typeof id !== "string") {
      throw new ApiError(400, "VALIDATION_ERROR", "A school id is required.")
    }
    const body = parseBody(schoolUpdateSchema, req.body)
    res.status(200).json({
      school: await schools.updateSchool(actor(req), id, body, meta(req)),
    })
  } catch (error) {
    next(error)
  }
}

function lifecycle(action: "suspend" | "activate" | "archive"): RequestHandler {
  return async (req, res, next) => {
    try {
      const id = req.params.id
      if (typeof id !== "string") {
        throw new ApiError(400, "VALIDATION_ERROR", "A school id is required.")
      }
      if (action === "activate") {
        const body = parseBody(reasonSchema, req.body ?? {})
        res.status(200).json({
          school: await schools.activateSchool(actor(req), id, body.reason, meta(req)),
        })
        return
      }
      const body = parseBody(protectedLifecycleSchema, req.body ?? {})
      const handler =
        action === "suspend" ? schools.suspendSchool : schools.archiveSchool
      res.status(200).json({
        school: await handler(
          actor(req),
          id,
          body.reason,
          meta(req),
          body.verificationToken,
        ),
      })
    } catch (error) {
      next(error)
    }
  }
}

export const requestLifecycleVerification: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    if (typeof id !== "string") {
      throw new ApiError(400, "VALIDATION_ERROR", "A school id is required.")
    }
    const body = parseBody(lifecycleActionSchema, req.body ?? {})
    res.status(200).json(
      await lifecycleVerification.requestSchoolLifecycleOtp(
        actor(req),
        id,
        body.action,
        meta(req),
      ),
    )
  } catch (error) {
    next(error)
  }
}

export const confirmLifecycleVerification: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id
    if (typeof id !== "string") {
      throw new ApiError(400, "VALIDATION_ERROR", "A school id is required.")
    }
    const body = parseBody(lifecycleOtpVerifySchema, req.body ?? {})
    res.status(200).json(
      await lifecycleVerification.verifySchoolLifecycleOtp(
        actor(req),
        id,
        body.action,
        body.code,
      ),
    )
  } catch (error) {
    next(error)
  }
}

export const suspend = lifecycle("suspend")
export const activate = lifecycle("activate")
export const archive = lifecycle("archive")
