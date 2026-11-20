import { Router } from "express"

import { requireCsrf, requireOrigin, requirePasswordChanged, requirePlatformAdmin } from "../auth/auth.middleware"
import * as controller from "./schools.controller"

export const schoolsRouter = Router()

schoolsRouter.use(requirePlatformAdmin, requirePasswordChanged)
schoolsRouter.get("/", controller.list)
schoolsRouter.post("/", requireOrigin, requireCsrf, controller.create)
schoolsRouter.get("/:id", controller.get)
schoolsRouter.patch("/:id", requireOrigin, requireCsrf, controller.update)
schoolsRouter.post("/:id/suspend", requireOrigin, requireCsrf, controller.suspend)
schoolsRouter.post("/:id/activate", requireOrigin, requireCsrf, controller.activate)
schoolsRouter.post("/:id/archive", requireOrigin, requireCsrf, controller.archive)
