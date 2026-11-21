import type { Icon } from "@tabler/icons-react"
import {
  IconBell,
  IconBook,
  IconBus,
  IconCalendar,
  IconCash,
  IconChartBar,
  IconClipboardCheck,
  IconLayoutDashboard,
  IconSchool,
  IconSettings,
  IconUsers,
  IconUsersGroup,
  IconUserPlus,
  IconChalkboard,
  IconClock,
  IconPresentation,
} from "@tabler/icons-react"

export type NavItem = { title: string; href: string; description: string }
export type NavSection = {
  title: string
  href: string
  description: string
  icon: Icon
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconLayoutDashboard,
    description: "A daily view of the school once attendance, admissions, fees, and events are connected. Those figures are not available in this milestone.",
    items: [],
  },
  {
    title: "School Setup",
    href: "/school-setup",
    icon: IconSchool,
    description: "School identity, contact details, branding, and the defaults other modules will use.",
    items: [
      { title: "School profile", href: "/school-setup/profile", description: "Name, contact details, address, description, logo, and banner for this school." },
      { title: "Academic years", href: "/school-setup/academic-years", description: "Academic years will be configured here in a later milestone." },
      { title: "School shifts", href: "/school-setup/shifts", description: "Shifts will be configured here before timetables depend on them." },
      { title: "Working days", href: "/school-setup/working-days", description: "Weekly working days will be configured here." },
      { title: "School calendar", href: "/school-setup/calendar", description: "Calendar defaults will be configured here." },
    ],
  },
  {
    title: "Academic Management",
    href: "/academic-management",
    icon: IconBook,
    description: "Academic years, classes, sections, subjects, teacher allocation, and grading rules.",
    items: [
      { title: "Classes and sections", href: "/academic-management/classes", description: "Class and section structure will be managed here." },
      { title: "Subjects", href: "/academic-management/subjects", description: "The subject catalogue and allocation will be managed here." },
      { title: "Grading", href: "/academic-management/grading", description: "Grading and promotion rules will be managed here." },
    ],
  },
  {
    title: "Student Management",
    href: "/student-management",
    icon: IconUsers,
    description: "Student profiles, class placement, guardians, documents, and movement between classes.",
    items: [
      { title: "Student directory", href: "/student-management/directory", description: "The current student list will be managed here." },
      { title: "Enrollment", href: "/student-management/enrollment", description: "Class placement and enrollment history will be managed here." },
    ],
  },
  {
    title: "Admission Management",
    href: "/admission-management",
    icon: IconUserPlus,
    description: "Enquiries and applications from first contact through review and student creation.",
    items: [
      { title: "Applications", href: "/admission-management/applications", description: "Application review will be managed here." },
      { title: "Enquiries", href: "/admission-management/enquiries", description: "Admission enquiries will be managed here." },
    ],
  },
  {
    title: "Staff Management",
    href: "/staff-management",
    icon: IconChalkboard,
    description: "Teaching and non-teaching staff, departments, designations, and leave.",
    items: [
      { title: "Staff directory", href: "/staff-management/directory", description: "Staff records will be managed here." },
      { title: "Departments", href: "/staff-management/departments", description: "Departments and designations will be managed here." },
    ],
  },
  {
    title: "Parent Management",
    href: "/parent-management",
    icon: IconUsersGroup,
    description: "Guardian profiles and the relationships that connect families to students.",
    items: [
      { title: "Parent directory", href: "/parent-management/directory", description: "Parent and guardian records will be managed here." },
    ],
  },
  {
    title: "Timetable Management",
    href: "/timetable-management",
    icon: IconClock,
    description: "Class, section, and teacher timetables built from shifts, periods, and rooms.",
    items: [
      { title: "Timetables", href: "/timetable-management/timetables", description: "Timetable drafts and publication will be managed here." },
      { title: "Rooms", href: "/timetable-management/rooms", description: "Classrooms and period structure will be managed here." },
    ],
  },
  {
    title: "Attendance Management",
    href: "/attendance-management",
    icon: IconClipboardCheck,
    description: "Student and staff attendance, including late arrival, leave, and corrections.",
    items: [
      { title: "Student attendance", href: "/attendance-management/students", description: "Class attendance will be recorded here." },
      { title: "Staff attendance", href: "/attendance-management/staff", description: "Staff attendance will be recorded here." },
    ],
  },
  {
    title: "Examination & Assessment",
    href: "/examination-assessment",
    icon: IconPresentation,
    description: "Exam setup, marks entry, verification, grading, and report cards.",
    items: [
      { title: "Examinations", href: "/examination-assessment/examinations", description: "Examination setup will be managed here." },
      { title: "Report cards", href: "/examination-assessment/report-cards", description: "Report cards will be published here." },
    ],
  },
  {
    title: "Learning & Classroom",
    href: "/learning-classroom",
    icon: IconChalkboard,
    description: "Digital diary, homework, assignments, lesson plans, and class materials.",
    items: [
      { title: "Homework", href: "/learning-classroom/homework", description: "Homework and assignments will be managed here." },
      { title: "Materials", href: "/learning-classroom/materials", description: "Lesson plans and learning materials will be managed here." },
    ],
  },
  {
    title: "Fee Management",
    href: "/fee-management",
    icon: IconCash,
    description: "Fee structures, student dues, collections, concessions, receipts, and refunds.",
    items: [
      { title: "Structures", href: "/fee-management/structures", description: "Fee categories and structures will be managed here." },
      { title: "Collections", href: "/fee-management/collections", description: "Collections and receipts will be managed here." },
    ],
  },
  {
    title: "Transport Management",
    href: "/transport-management",
    icon: IconBus,
    description: "Vehicles, drivers, routes, stops, and student transport allocation.",
    items: [
      { title: "Routes", href: "/transport-management/routes", description: "Routes and stops will be managed here." },
      { title: "Vehicles", href: "/transport-management/vehicles", description: "Vehicles and drivers will be managed here." },
    ],
  },
  {
    title: "Calendar & Events",
    href: "/calendar-events",
    icon: IconCalendar,
    description: "Academic calendar, holidays, working-day exceptions, and school events.",
    items: [
      { title: "Events", href: "/calendar-events/events", description: "School events will be published here." },
      { title: "Holidays", href: "/calendar-events/holidays", description: "Holidays and special working days will be managed here." },
    ],
  },
  {
    title: "Notifications & Communication",
    href: "/notifications-communication",
    icon: IconBell,
    description: "Announcements and audience-specific messages. Delivery channels are not enabled in this milestone.",
    items: [
      { title: "Announcements", href: "/notifications-communication/announcements", description: "Announcement composition will be available here." },
    ],
  },
  {
    title: "Reports & Analytics",
    href: "/reports-analytics",
    icon: IconChartBar,
    description: "Operational reports for students, attendance, exams, admissions, staff, fees, and transport.",
    items: [
      { title: "Report catalogue", href: "/reports-analytics/catalogue", description: "Report catalogues will be available here." },
    ],
  },
  {
    title: "Settings & Permissions",
    href: "/settings-permissions",
    icon: IconSettings,
    description: "School users, roles, security preferences, and audit history. Multi-factor authentication is not enabled yet.",
    items: [
      { title: "Security", href: "/settings-permissions/security", description: "Password and session settings. Multi-factor authentication is not implemented in this milestone." },
      { title: "Audit", href: "/settings-permissions/audit", description: "School audit history will be reviewed here." },
    ],
  },
]

export function findSection(pathname: string): { section: NavSection; item?: NavItem } | null {
  const match = navigation.find((section) => pathname === section.href || pathname.startsWith(`${section.href}/`))
  if (!match) {
    return null
  }
  const item = match.items.find((entry) => entry.href === pathname)
  return { section: match, item }
}
