import { PortalFrame } from "@/components/portal-frame"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"

export default function TeacherPage() {
  return (
    <PortalFrame
      sidebar={<TeacherSidebar />}
      title="Teacher"
      description="Teacher navigation is separate from the student and parent shells. No teaching workflows are implemented."
    />
  )
}
