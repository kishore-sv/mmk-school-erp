import { Router } from "express"

import { requirePasswordChanged, requirePlatformAdmin } from "../auth/auth.middleware"
import * as controller from "./dashboard.controller"

export const dashboardRouter = Router()

dashboardRouter.get("/", requirePlatformAdmin, requirePasswordChanged, controller.show)
