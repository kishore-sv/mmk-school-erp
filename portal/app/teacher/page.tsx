import { PortalFrame } from "@/components/portal-frame"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"

export default function TeacherPage() {
  return (
    <PortalFrame
      sidebar={<TeacherSidebar />}
      section="Teacher"
      title="Teacher placeholder"
      description="Teacher navigation is separate from the student and parent shells. No teaching workflows are implemented."
    />
  )
}
