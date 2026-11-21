import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SchoolFilters } from "@/features/schools/school-filters"
import { serverApi } from "@/lib/server-api"
import type { SchoolSummary } from "@/types/platform"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value))
}

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const key of ["q", "status", "subscriptionStatus", "createdFrom", "createdTo", "page"]) {
    const value = params[key]
    if (typeof value === "string" && value.length > 0) {
      query.set(key, value)
    }
  }
  if (!query.has("page")) {
    query.set("page", "1")
  }
  query.set("pageSize", "20")
  const result = await serverApi<{
    data: SchoolSummary[]
    page: { page: number; pageSize: number; total: number }
  }>(`/schools?${query.toString()}`)
  const pageCount = Math.max(1, Math.ceil(result.page.total / result.page.pageSize))
  const previous = new URLSearchParams(query)
  previous.set("page", String(Math.max(1, result.page.page - 1)))
  const next = new URLSearchParams(query)
  next.set("page", String(result.page.page + 1))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="All schools"
        description="Schools registered on the MMK platform."
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "All schools" }]}
      />
      <SchoolFilters
        q={typeof params.q === "string" ? params.q : ""}
        status={typeof params.status === "string" ? params.status : ""}
        subscriptionStatus={typeof params.subscriptionStatus === "string" ? params.subscriptionStatus : ""}
        createdFrom={typeof params.createdFrom === "string" ? params.createdFrom : ""}
        createdTo={typeof params.createdTo === "string" ? params.createdTo : ""}
      />
      {result.data.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-medium">No schools match these filters.</p>
          <p className="text-muted-foreground mt-1 text-sm">Create a school to add it to the registry.</p>
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School name</TableHead>
                <TableHead>School code</TableHead>
                <TableHead>Contact email</TableHead>
                <TableHead>Contact phone</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.schoolCode}</TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell>{school.phone}</TableCell>
                  <TableCell><StatusBadge value={school.subscriptionStatus} /></TableCell>
                  <TableCell><StatusBadge value={school.status} /></TableCell>
                  <TableCell>{school.studentCount === null ? "Unavailable" : school.studentCount}</TableCell>
                  <TableCell>{formatDate(school.createdAt)}</TableCell>
                  <TableCell>
                    <Link href={`/schools/${school.id}`} className="text-sm underline-offset-4 hover:underline">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={result.page.page > 1 ? `/schools?${previous.toString()}` : "#"}
              aria-disabled={result.page.page <= 1}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-sm">
              Page {result.page.page} of {pageCount}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={result.page.page < pageCount ? `/schools?${next.toString()}` : "#"}
              aria-disabled={result.page.page >= pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
