import { Router } from "express"

import { requireSchoolAvailable, requireSchoolHost } from "../../middleware/tenant-host"
import { ApiError } from "../platform/errors"
import { schoolAuthRouter } from "./auth/auth.routes"
import { tenantContext } from "./auth/auth.controller"
import { requireSchoolAdmin, requireSchoolCsrf, requireSchoolOrigin, requireSchoolPasswordChanged } from "./auth/auth.middleware"
import { brandingHandlers } from "./files/branding.controller"
import * as profile from "./profile/profile.controller"

export const schoolRouter = Router()

schoolRouter.get("/tenant/context", requireSchoolHost("school-admin"), tenantContext)
schoolRouter.use("/auth", schoolAuthRouter)

const protectedRouter = Router()
protectedRouter.use(requireSchoolHost("school-admin"), requireSchoolAvailable(), requireSchoolAdmin, requireSchoolPasswordChanged)
protectedRouter.get("/profile", profile.getProfile)
protectedRouter.patch("/profile", requireSchoolOrigin, requireSchoolCsrf, profile.updateProfile)

const branding = brandingHandlers(
  (req) => {
    if (!req.schoolAdmin) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
    }
    return { kind: "school_admin", id: req.schoolAdmin.id }
  },
  (req) => {
    if (!req.school) {
      throw new ApiError(404, "NOT_FOUND", "Not found.")
    }
    return req.school.id
  },
)

protectedRouter.post("/branding/uploads", requireSchoolOrigin, requireSchoolCsrf, branding.initiate)
protectedRouter.post("/branding/uploads/:uploadId/parts", requireSchoolOrigin, requireSchoolCsrf, branding.part)
protectedRouter.post("/branding/uploads/:uploadId/complete", requireSchoolOrigin, requireSchoolCsrf, branding.complete)
protectedRouter.post("/branding/uploads/:uploadId/abort", requireSchoolOrigin, requireSchoolCsrf, branding.abort)
protectedRouter.delete("/branding/:purpose", requireSchoolOrigin, requireSchoolCsrf, branding.remove)

schoolRouter.use(protectedRouter)
