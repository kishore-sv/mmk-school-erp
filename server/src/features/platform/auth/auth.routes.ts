import { Router } from "express"

import {
  requireCsrf,
  requireOrigin,
  requirePlatformAdmin,
} from "./auth.middleware"
import * as controller from "./auth.controller"

export const authRouter = Router()

authRouter.post("/login", requireOrigin, controller.login)
authRouter.post("/refresh", requireOrigin, requireCsrf, controller.refresh)
authRouter.post("/logout", requireOrigin, requireCsrf, controller.logout)
authRouter.get("/me", requirePlatformAdmin, controller.me)
authRouter.post(
  "/change-password",
  requireOrigin,
  requireCsrf,
  requirePlatformAdmin,
  controller.changePassword,
)
