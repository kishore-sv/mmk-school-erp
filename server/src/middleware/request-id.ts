import type { RequestHandler } from "express"

export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header("x-request-id")
  const requestId =
    incoming && incoming.length > 0 && incoming.length <= 128
      ? incoming
      : crypto.randomUUID()
  req.requestId = requestId
  res.setHeader("x-request-id", requestId)
  next()
}
