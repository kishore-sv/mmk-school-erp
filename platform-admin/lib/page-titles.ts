export type Crumb = { label: string; href?: string }

export const sectionTitles: Record<string, string> = {
  plans: "Plans",
  subscriptions: "Active subscriptions",
  usage: "Usage and limits",
  payments: "Payments",
  invoices: "Invoices",
  tickets: "Support tickets",
  requests: "Feature requests",
  announcements: "Announcements",
  health: "System health",
  queues: "Queue monitoring",
  analytics: "Analytics",
  audit: "Audit logs and security",
  users: "Platform users",
  settings: "Settings",
}

export function crumbsForPath(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] === "dashboard" || parts.length === 0) {
    return [{ label: "Dashboard" }]
  }
  if (parts[0] === "schools" && parts.length === 1) {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "All schools" },
    ]
  }
  if (parts[0] === "schools" && parts[1] === "create") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "All schools", href: "/schools" },
      { label: "Create school" },
    ]
  }
  if (parts[0] === "schools") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "All schools", href: "/schools" },
      { label: "School" },
    ]
  }
  if (parts[0] === "account" && parts[1] === "password") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Change password" },
    ]
  }
  if (parts[0] === "sections") {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: sectionTitles[parts[1] ?? ""] ?? "Unavailable" },
    ]
  }
  if (parts[0] === "login") {
    return [{ label: "Sign in" }]
  }
  return [{ label: "Page not found" }]
}
