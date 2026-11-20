import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { serverApi } from "@/lib/server-api"
import type { DashboardData } from "@/types/platform"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value))
}

export default async function DashboardPage() {
  const data = await serverApi<DashboardData>("/dashboard")
  const cards = [
    ["Total schools", String(data.schools.total)],
    ["Active schools", String(data.schools.active)],
    ["Suspended schools", String(data.schools.suspended)],
    ["Pending provisioning", String(data.schools.pendingProvisioning)],
    ["Students", data.people.available ? String(data.people.students) : "Unavailable"],
    ["Teachers", data.people.available ? String(data.people.teachers) : "Unavailable"],
    ["Active subscriptions", String(data.subscriptions.active)],
    ["Outstanding payments", data.payments.available ? String(data.payments.outstanding) : "Unavailable"],
  ]
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Platform totals from the school registry. Counts that are not collected yet stay unavailable."
        crumbs={[{ label: "Dashboard" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent schools</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentSchools.length === 0 ? (
              <p className="text-muted-foreground text-sm">No schools have been created.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.recentSchools.map((school) => (
                  <li key={school.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={`/schools/${school.id}`} className="font-medium underline-offset-4 hover:underline">
                      {school.name}
                    </Link>
                    <span className="text-muted-foreground">{school.schoolCode}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent platform activity</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">No platform activity has been recorded.</p>
            ) : (
              <ul className="flex flex-col gap-3 text-sm">
                {data.recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3">
                    <span>{entry.action}</span>
                    <span className="text-muted-foreground">{formatDate(entry.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Service health</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="outline">PostgreSQL {data.health.postgres}</Badge>
          <Badge variant="outline">Storage {data.health.storage}</Badge>
          <Badge variant="outline">Queue {data.health.queue.replaceAll("_", " ")}</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
