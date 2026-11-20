import { notFound } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SchoolActions } from "@/features/schools/school-actions"
import { ServerApiError, serverApi } from "@/lib/server-api"
import type { SchoolDetail } from "@/types/platform"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let school: SchoolDetail
  try {
    const result = await serverApi<{ school: SchoolDetail }>(`/schools/${id}`)
    school = result.school
  } catch (error) {
    const digest = error instanceof Error && "digest" in error ? String(error.digest) : ""
    if (digest.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    if (error instanceof ServerApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={school.name}
        description={`${school.schoolCode} · Tenant ${school.tenantKey}`}
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Schools", href: "/schools" },
          { label: school.name },
        ]}
      />
      <SchoolActions school={school} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>Status: <Badge variant="secondary">{school.status}</Badge></p>
            <p>Provisioning: {school.provisioningStatus}</p>
            <p>Created {formatDate(school.createdAt)}</p>
            {school.archiveReason ? <p>Archive reason: {school.archiveReason}</p> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>School information</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>{school.schoolType.replaceAll("_", " ")}</p>
            <p>{school.email}</p>
            <p>{school.phone}</p>
            <p>{school.website || "No website"}</p>
            <p>{school.board || "No board recorded"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact and address</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p>{school.addressLine1}</p>
            {school.addressLine2 ? <p>{school.addressLine2}</p> : null}
            <p>{school.city}, {school.state} {school.postalCode}</p>
            <p>{school.country}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Initial school admin</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>{school.initialAdmin.fullName}</p>
            <p>{school.initialAdmin.email}</p>
            <p>{school.initialAdmin.phone}</p>
            <p>Status: {school.initialAdmin.status.replaceAll("_", " ")}</p>
            <p>
              Invitation: {school.initialAdmin.invitationDelivery === "not_configured"
                ? "Provisioned, but not delivered. Email delivery is not configured."
                : school.initialAdmin.invitationDelivery}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>{school.commercial.billingModel.replaceAll("_", " ")} · {school.commercial.billingFrequency}</p>
            <p>Rate {school.commercial.perStudentRate} {school.commercial.currency}</p>
            <p>{school.commercial.subscriptionStart} to {school.commercial.subscriptionEnd}</p>
            <p>Student limit: {school.commercial.studentLimit ?? "Not set"}</p>
            <p>Status: {school.commercial.status}</p>
            <p>{school.commercial.notes || "No commercial notes"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Usage</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {school.usage.available
              ? <p>{school.usage.students} students, {school.usage.teachers} teachers</p>
              : <p>Student and teacher totals are not available yet.</p>}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Platform audit history</CardTitle></CardHeader>
        <CardContent>
          {school.activity.length === 0 ? (
            <p className="text-muted-foreground text-sm">No audit records for this school.</p>
          ) : (
            <ul className="flex flex-col gap-3 text-sm">
              {school.activity.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3">
                  <span>{entry.action}{entry.reason ? ` — ${entry.reason}` : ""}</span>
                  <span className="text-muted-foreground">{formatDate(entry.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
