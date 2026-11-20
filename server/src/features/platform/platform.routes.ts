import { Router } from "express"

import { authRouter } from "./auth/auth.routes"
import { dashboardRouter } from "./dashboard/dashboard.routes"
import { schoolsRouter } from "./schools/schools.routes"

export const platformRouter = Router()

platformRouter.use("/auth", authRouter)
platformRouter.use("/schools", schoolsRouter)
platformRouter.use("/dashboard", dashboardRouter)
