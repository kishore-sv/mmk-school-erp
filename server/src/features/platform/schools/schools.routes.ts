import { Router } from "express"

import { ApiError } from "../errors"
import { requireCsrf, requireOrigin, requirePasswordChanged, requirePlatformAdmin } from "../auth/auth.middleware"
import { brandingHandlers } from "../../school/files/branding.controller"
import * as controller from "./schools.controller"

export const schoolsRouter = Router()

schoolsRouter.use(requirePlatformAdmin, requirePasswordChanged)
schoolsRouter.get("/", controller.list)
schoolsRouter.post("/", requireOrigin, requireCsrf, controller.create)
schoolsRouter.get("/:id", controller.get)
schoolsRouter.patch("/:id", requireOrigin, requireCsrf, controller.update)
schoolsRouter.post(
  "/:id/lifecycle-verification/request",
  requireOrigin,
  requireCsrf,
  controller.requestLifecycleVerification,
)
schoolsRouter.post(
  "/:id/lifecycle-verification/verify",
  requireOrigin,
  requireCsrf,
  controller.confirmLifecycleVerification,
)
schoolsRouter.post("/:id/suspend", requireOrigin, requireCsrf, controller.suspend)
schoolsRouter.post("/:id/activate", requireOrigin, requireCsrf, controller.activate)
schoolsRouter.post("/:id/archive", requireOrigin, requireCsrf, controller.archive)

const branding = brandingHandlers(
  (req) => {
    if (!req.platformAdmin) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    return { kind: "platform_admin", id: req.platformAdmin.id }
  },
  (req) => {
    const id = req.params.id
    if (typeof id !== "string") {
      throw new ApiError(400, "VALIDATION_ERROR", "A school id is required.")
    }
    return id
  },
)

schoolsRouter.post("/:id/branding/uploads", requireOrigin, requireCsrf, branding.initiate)
schoolsRouter.post("/:id/branding/uploads/:uploadId/parts", requireOrigin, requireCsrf, branding.part)
schoolsRouter.post("/:id/branding/uploads/:uploadId/complete", requireOrigin, requireCsrf, branding.complete)
schoolsRouter.post("/:id/branding/uploads/:uploadId/abort", requireOrigin, requireCsrf, branding.abort)
schoolsRouter.delete("/:id/branding/:purpose", requireOrigin, requireCsrf, branding.remove)
