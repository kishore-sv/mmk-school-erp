export type PlatformUser = {
  id: string
  email: string
  name: string
  status: string
  mustChangePassword: boolean
}

export type SchoolSummary = {
  id: string
  name: string
  schoolCode: string
  email: string
  phone: string
  status: "active" | "suspended" | "archived"
  subscriptionStatus: "scheduled" | "active" | "ended"
  studentCount: number | null
  createdAt: string
}

export type SchoolDetail = {
  id: string
  tenantKey: string
  name: string
  schoolCode: string
  website: string | null
  email: string
  phone: string
  schoolType: string
  board: string | null
  country: string
  state: string
  city: string
  postalCode: string
  addressLine1: string
  addressLine2: string | null
  status: "active" | "suspended" | "archived"
  provisioningStatus: string
  archiveReason: string | null
  createdAt: string
  commercial: {
    billingModel: string
    perStudentRate: string
    currency: string
    billingFrequency: string
    subscriptionStart: string
    subscriptionEnd: string
    studentLimit: number | null
    notes: string | null
    status: string
  }
  initialAdmin: {
    fullName: string
    email: string
    phone: string
    status: string
    invitationDelivery: string
  }
  usage: {
    students: number | null
    teachers: number | null
    available: boolean
  }
  activity: Array<{
    id: string
    action: string
    reason: string | null
    createdAt: string
  }>
}

export type DashboardData = {
  schools: {
    total: number
    active: number
    suspended: number
    pendingProvisioning: number
  }
  people: { students: number | null; teachers: number | null; available: boolean }
  subscriptions: { active: number }
  payments: { outstanding: number | null; available: boolean }
  recentSchools: Array<{
    id: string
    name: string
    schoolCode: string
    status: string
    createdAt: string
  }>
  recentActivity: Array<{
    id: string
    action: string
    entityType: string
    createdAt: string
  }>
  health: { postgres: string; storage: string; queue: string }
}
