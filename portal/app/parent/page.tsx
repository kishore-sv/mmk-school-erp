import { PortalFrame } from "@/components/portal-frame"
import { ParentSidebar } from "@/components/parent/parent-sidebar"

export default function ParentPage() {
  return (
    <PortalFrame
      sidebar={<ParentSidebar />}
      section="Parent"
      title="Parent placeholder"
      description="Parent navigation is separate from the teacher and student shells. No parent workflows are implemented."
    />
  )
}
