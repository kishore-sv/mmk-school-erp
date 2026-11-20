declare global {
  namespace Express {
    interface Request {
      requestId: string
      platformAdmin?: {
        id: string
        email: string
        name: string
        status: "active" | "disabled"
        mustChangePassword: boolean
      }
      platformSessionId?: string
    }
  }
}

export {}
