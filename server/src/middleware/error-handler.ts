import type { ErrorRequestHandler } from "express"
import { ZodError } from "zod"

import { ApiError } from "../features/platform/errors"
import { log } from "../utils/logger"

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (res.headersSent) {
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the submitted fields.",
        requestId: req.requestId,
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    })
    return
  }

  if (error instanceof ApiError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        requestId: req.requestId,
        details: error.details,
      },
    })
    return
  }

  log("error", "request failed", {
    requestId: req.requestId,
    error: error instanceof Error ? error.name : "unknown",
  })

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "The request could not be completed.",
      requestId: req.requestId,
    },
  })
}
