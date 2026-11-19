import { siteConfig } from "@/config/site"

export const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Platform overview", href: "/platform" },
      { label: "School admin", href: "/platform/school-admin-portal" },
      { label: "Teachers", href: "/platform/teacher-portal" },
      { label: "Students", href: "/platform/student-portal" },
      { label: "Parents", href: "/platform/parent-portal" },
      { label: "Admissions website", href: "/admissions-website" },
      { label: "Mobile app", href: "/mobile-app" },
    ],
  },
  {
    title: "Modules",
    links: [
      { label: "All modules", href: "/modules" },
      { label: "Admissions", href: "/modules/admission-management" },
      { label: "Attendance", href: "/modules/attendance-management" },
      { label: "Fees", href: "/modules/fee-management" },
      { label: "Timetable", href: "/modules/timetable-management" },
      { label: "Examinations", href: "/modules/examination-assessment" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Product videos", href: "/resources" },
      { label: "Solutions", href: "/solutions" },
      { label: "Blog", href: siteConfig.blogUrl, external: true },
    ],
  },
] as const
