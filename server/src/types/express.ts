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
      schoolAdmin?: {
        id: string
        email: string
        name: string
        status: "pending_invitation" | "active" | "disabled"
        mustChangePassword: boolean
        schoolId: string
        schoolCode: string
        schoolName: string
      }
      schoolSessionId?: string
      tenantApp?: "school-admin" | "portal"
      school?: {
        id: string
        tenantId: string
        tenantKey: string
        tenantStatus: "active" | "archived"
        schoolCode: string
        name: string
        status: "active" | "suspended" | "archived"
        email: string
        phone: string
        website: string | null
        description: string | null
        logoStorageKey: string | null
        bannerStorageKey: string | null
        addressLine1: string
        addressLine2: string | null
        city: string
        state: string
        postalCode: string
        country: string
        schoolType: string
        board: string | null
        timezone: string
        defaultLanguage: string
      }
    }
  }
}

export {}
