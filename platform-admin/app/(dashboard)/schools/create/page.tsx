import { PageHeader } from "@/components/page-header"
import { CreateSchoolForm } from "@/features/schools/create-school-form"

export default function CreateSchoolPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create school"
        description="Register a school, its commercial terms, and the first school administrator."
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Schools", href: "/schools" },
          { label: "Create school" },
        ]}
      />
      <CreateSchoolForm />
    </div>
  )
}
