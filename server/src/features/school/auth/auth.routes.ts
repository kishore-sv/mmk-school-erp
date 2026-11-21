import { Router } from "express"

import { requireSchoolHost } from "../../../middleware/tenant-host"
import {
  requireSchoolAdmin,
  requireSchoolCsrf,
  requireSchoolOrigin,
} from "./auth.middleware"
import * as controller from "./auth.controller"

export const schoolAuthRouter = Router()

schoolAuthRouter.use(requireSchoolHost("school-admin"))
schoolAuthRouter.post("/login", requireSchoolOrigin, controller.login)
schoolAuthRouter.post("/refresh", requireSchoolOrigin, requireSchoolCsrf, controller.refresh)
schoolAuthRouter.post("/logout", requireSchoolOrigin, requireSchoolCsrf, controller.logout)
schoolAuthRouter.get("/me", requireSchoolAdmin, controller.me)
schoolAuthRouter.post("/change-password", requireSchoolOrigin, requireSchoolCsrf, requireSchoolAdmin, controller.changePassword)
schoolAuthRouter.post("/forgot-password", requireSchoolOrigin, controller.forgotPassword)
schoolAuthRouter.post("/verify-reset-otp", requireSchoolOrigin, controller.verifyResetOtp)
schoolAuthRouter.post("/resend-reset-otp", requireSchoolOrigin, controller.resendResetOtp)
schoolAuthRouter.post("/reset-password", requireSchoolOrigin, controller.resetPassword)
