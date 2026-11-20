import type { RequestHandler } from "express"

import { getDashboard } from "./dashboard.service"

export const show: RequestHandler = async (_req, res, next) => {
  try {
    res.status(200).json(await getDashboard())
  } catch (error) {
    next(error)
  }
}
