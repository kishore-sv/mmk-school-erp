import { PortalFrame } from "@/components/portal-frame"
import { StudentSidebar } from "@/components/student/student-sidebar"

export default function StudentPage() {
  return (
    <PortalFrame
      sidebar={<StudentSidebar />}
      section="Student"
      title="Student placeholder"
      description="Student navigation is separate from the teacher and parent shells. No student workflows are implemented."
    />
  )
}
