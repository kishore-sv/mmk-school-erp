export type ModuleRecord = {
  slug: string
  title: string
  definition: string
  problem: string
  whoUses: string[]
  benefits: string[]
  capabilities: string[]
  related: string[]
  featureSlugs: string[]
}

export const modules: ModuleRecord[] = [
  {
    slug: "dashboard",
    title: "Dashboard",
    definition:
      "The school dashboard gives authorised staff a daily view of attendance, admissions, fees, events, and recent activity for the selected academic year.",
    problem:
      "School leaders otherwise check attendance, fees, and admissions in separate registers or spreadsheets before the day begins.",
    whoUses: ["School administrators", "Principals", "Office staff with dashboard access"],
    benefits: [
      "See the school day in one place before opening individual modules.",
      "Switch the academic year without mixing historical figures into the current view.",
      "Open role-specific summaries instead of a single screen for every user.",
    ],
    capabilities: [
      "School overview",
      "Student, staff, and parent counts",
      "Daily attendance snapshot",
      "Pending admissions",
      "Fee collection overview",
      "Upcoming events and timetable context",
      "Announcements and recent activity",
      "Academic-year selector",
      "Role-specific dashboard views",
    ],
    related: ["reports-analytics", "attendance-management", "admission-management"],
    featureSlugs: ["role-specific-dashboards"],
  },
  {
    slug: "school-setup",
    title: "School Setup",
    definition:
      "School setup stores the school's identity, contact details, board information, shifts, working days, and academic defaults used by the rest of MMK School ERP.",
    problem:
      "Class lists, calendars, and documents drift when the school name, logo, or working pattern is maintained in more than one place.",
    whoUses: ["School administrators"],
    benefits: [
      "Keep the public and internal school identity consistent.",
      "Define shifts and working days before timetables and attendance depend on them.",
    ],
    capabilities: [
      "School profile, name, and code",
      "Logo and banner",
      "Contact information and address",
      "Board and affiliation details",
      "Shifts and working days",
      "Calendar and academic defaults",
    ],
    related: ["academic-management", "calendar-events", "settings-permissions"],
    featureSlugs: ["school-profile"],
  },
  {
    slug: "academic-management",
    title: "Academic Management",
    definition:
      "Academic management defines academic years, classes, sections, subjects, teacher allocation, grading, and promotion rules for the school.",
    problem:
      "Admissions, timetables, exams, and report cards cannot stay aligned if the class structure changes informally.",
    whoUses: ["Academic coordinators", "School administrators", "Principals"],
    benefits: [
      "Maintain one class and section structure for the year.",
      "Assign subjects and class teachers before classroom work starts.",
      "Keep historical years available after promotion.",
    ],
    capabilities: [
      "Academic years, terms, and semesters",
      "Classes, grades, and sections",
      "Subject catalogue and allocation",
      "Teacher and class-teacher assignment",
      "Grading and promotion rules",
      "Academic calendar defaults and historical records",
    ],
    related: ["student-management", "timetable-management", "examination-assessment"],
    featureSlugs: [
      "academic-year-management",
      "class-and-section-management",
      "subject-allocation",
      "teacher-allocation",
    ],
  },
  {
    slug: "student-management",
    title: "Student Management",
    definition:
      "Student management keeps each learner's profile, class placement, guardians, documents, and movement between classes, including promotion, transfer, and withdrawal.",
    problem:
      "Office staff lose track of who is currently enrolled when admissions, promotions, and withdrawals live in different files.",
    whoUses: ["School administrators", "Office staff", "Class teachers for assigned students"],
    benefits: [
      "Search and filter the current student list.",
      "Preserve history when a student is archived, transferred, or withdrawn.",
      "Link guardians without duplicating the student record.",
    ],
    capabilities: [
      "Profiles, registration, and admissions conversion",
      "Enrollment and class or section assignment",
      "Guardian relationships and documents",
      "Promotion, transfer, withdrawal, and history",
      "Archived students and search",
    ],
    related: ["admission-management", "parent-management", "academic-management"],
    featureSlugs: ["student-enrollment", "student-promotion"],
  },
  {
    slug: "admission-management",
    title: "Admission Management",
    definition:
      "Admission management tracks enquiries and applications from first contact through review, decision, and creation of a student profile.",
    problem:
      "Admission teams lose applications when enquiry calls, paper forms, and interview notes are not tied to one record.",
    whoUses: ["Admissions teams", "School administrators"],
    benefits: [
      "Follow each application status without a separate spreadsheet.",
      "Create the student and enrollment only after approval.",
    ],
    capabilities: [
      "Enquiries and public application forms",
      "Review, document checks, and interviews",
      "Waitlist, approval, and rejection",
      "Status tracking",
      "Student profile and enrollment creation",
      "Admission reports",
    ],
    related: ["student-management", "parent-management"],
    featureSlugs: ["student-admission", "admission-tracking"],
  },
  {
    slug: "staff-management",
    title: "Staff Management",
    definition:
      "Staff management maintains teaching and non-teaching staff records, departments, designations, allocations, and leave.",
    problem:
      "Timetables and class-teacher lists break when staff records are updated only on paper.",
    whoUses: ["School administrators", "Principals"],
    benefits: [
      "Keep a single staff directory for academic allocation.",
      "Record leave without removing the staff profile.",
    ],
    capabilities: [
      "Staff directory and teacher profiles",
      "Non-teaching staff",
      "Departments and designations",
      "Subject and class-teacher assignment",
      "Leave records and archived staff",
    ],
    related: ["academic-management", "timetable-management", "attendance-management"],
    featureSlugs: ["staff-records"],
  },
  {
    slug: "parent-management",
    title: "Parent Management",
    definition:
      "Parent management links guardians to students, including families with more than one child and students with more than one guardian.",
    problem:
      "Parents cannot see the right child, and schools cannot tell who is allowed to act, when relationships are stored only in admission forms.",
    whoUses: ["School administrators", "Front office"],
    benefits: [
      "Invite a guardian and control account access.",
      "Mark a primary guardian and keep relationship history.",
    ],
    capabilities: [
      "Parent directory and profiles",
      "Multiple guardians and multiple children",
      "Relationship types and primary guardian",
      "Access permissions and invitations",
      "Relationship history",
    ],
    related: ["student-management", "notifications-communication"],
    featureSlugs: ["multi-guardian-access", "parent-management"],
  },
  {
    slug: "timetable-management",
    title: "Timetable Management",
    definition:
      "Timetable management builds class, section, and teacher timetables from the school's shifts, periods, and rooms, and checks for clashes before publication.",
    problem:
      "A teacher or room can be booked twice when timetables are copied between sections by hand.",
    whoUses: ["Academic coordinators", "School administrators", "Teachers"],
    benefits: [
      "Publish one timetable that teachers and families can open.",
      "Record substitutes and keep earlier versions.",
    ],
    capabilities: [
      "Working days, shifts, periods, and breaks",
      "Class, section, and teacher timetables",
      "Classroom allocation",
      "Conflict detection",
      "Substitute teachers",
      "Publication and version history",
    ],
    related: ["academic-management", "staff-management", "attendance-management"],
    featureSlugs: ["timetable-management", "timetable-conflict-detection"],
  },
  {
    slug: "attendance-management",
    title: "Attendance Management",
    definition:
      "Attendance management lets authorised staff record and review student and staff attendance by class, section, and date, including late arrival, early departure, and corrections.",
    problem:
      "Monthly attendance reports are slow and inconsistent when class teachers keep separate notebooks.",
    whoUses: ["Class teachers", "School administrators", "Principals"],
    benefits: [
      "Correct a mistaken mark without deleting the day's history.",
      "Use the same attendance record for reports and parent views.",
    ],
    capabilities: [
      "Student, class, and section attendance",
      "Teacher and staff attendance",
      "Late, early, and half-day marks",
      "Leave, corrections, reports, and history",
    ],
    related: ["student-management", "staff-management", "reports-analytics"],
    featureSlugs: ["student-attendance", "staff-attendance", "attendance-reports"],
  },
  {
    slug: "examination-assessment",
    title: "Examination and Assessment",
    definition:
      "Examination and assessment covers exam setup, timetables, marks entry, verification, grading, result calculation, and report cards.",
    problem:
      "Result delays usually come from marks sitting in separate mark books that still need a second check.",
    whoUses: ["Examination in-charge", "Teachers", "School administrators"],
    benefits: [
      "Separate theory and practical marks where the school requires it.",
      "Publish results only after verification.",
      "Keep earlier examination records with the student.",
    ],
    capabilities: [
      "Examination types and assessment setup",
      "Examination timetable",
      "Marks entry and verification",
      "Grading and result calculation",
      "Report cards and performance reports",
      "Historical examination records",
    ],
    related: ["academic-management", "learning-classroom", "reports-analytics"],
    featureSlugs: ["examination-management", "marks-entry", "report-cards"],
  },
  {
    slug: "learning-classroom",
    title: "Learning and Classroom",
    definition:
      "Learning and classroom is where teachers share the digital diary, homework, assignments, lesson plans, and learning materials with their classes.",
    problem:
      "Homework instructions sent only in a messaging group are hard for a parent or student to find later.",
    whoUses: ["Teachers", "Students", "Parents"],
    benefits: [
      "Track whether homework was assigned and submitted.",
      "Keep classroom communication next to the class record.",
    ],
    capabilities: [
      "Digital diary",
      "Homework and assignments",
      "Learning materials and lesson plans",
      "Classroom activities and submissions",
      "Teacher-to-student communication",
    ],
    related: ["timetable-management", "examination-assessment", "notifications-communication"],
    featureSlugs: ["digital-diary", "homework-management", "assignment-management"],
  },
  {
    slug: "fee-management",
    title: "Fee Management",
    definition:
      "Fee management is the school's own fee register: structures, student-wise dues, collections, concessions, receipts, refunds, and outstanding balances.",
    problem:
      "Cashiers and parents disagree on what is due when receipts and concessions are tracked outside the student record.",
    whoUses: ["Accounts staff", "School administrators", "Parents viewing fee information"],
    benefits: [
      "Assign a fee structure to a student and collect part payments.",
      "Keep receipts and payment history with the student.",
    ],
    capabilities: [
      "Fee categories and structures",
      "Student fee assignment",
      "Collection, partial payments, and dues",
      "Concessions and late fees",
      "Receipts, refunds, and reports",
    ],
    related: ["student-management", "reports-analytics"],
    featureSlugs: ["fee-structure", "fee-collection", "fee-dues", "fee-receipts"],
  },
  {
    slug: "transport-management",
    title: "Transport Management",
    definition:
      "Transport management records vehicles, drivers, routes, stops, and which students use school transport, including transport fee details.",
    problem:
      "The office cannot answer a route or stop question quickly when the list lives with the driver.",
    whoUses: ["Transport coordinator", "School administrators"],
    benefits: [
      "See which students are allocated to a route.",
      "Keep vehicle records with the transport fee assignment.",
    ],
    capabilities: [
      "Vehicles and drivers",
      "Routes and stops",
      "Student transport allocation",
      "Transport fees and reports",
    ],
    related: ["student-management", "fee-management"],
    featureSlugs: ["transport-management"],
  },
  {
    slug: "calendar-events",
    title: "Calendar and Events",
    definition:
      "Calendar and events publishes the academic calendar, holidays, working-day exceptions, examinations, and school events to the roles that should see them.",
    problem:
      "Families and staff miss a holiday or parent meeting when the notice is only on a notice board.",
    whoUses: ["School administrators", "Teachers", "Parents", "Students"],
    benefits: [
      "Show a role-specific calendar instead of every internal event.",
      "Record special working days separately from weekly holidays.",
    ],
    capabilities: [
      "Academic calendar and holidays",
      "Special working days",
      "School, exam, sports, and staff events",
      "Parent meetings and event visibility",
    ],
    related: ["school-setup", "examination-assessment", "notifications-communication"],
    featureSlugs: ["school-calendar"],
  },
  {
    slug: "notifications-communication",
    title: "Notifications and Communication",
    definition:
      "Notifications and communication lets the school compose announcements, choose an audience, and send them in the app, with email, SMS, WhatsApp, and push available as configurable channels.",
    problem:
      "A class notice sent to the whole school creates noise, and the office cannot see who it was meant for.",
    whoUses: ["School administrators", "Teachers with permission", "Parents and students as recipients"],
    benefits: [
      "Target a role, class, or section.",
      "Keep delivery history with the announcement.",
    ],
    capabilities: [
      "Announcements and composer",
      "Audience, role, class, and section targeting",
      "Templates",
      "In-app and push notifications",
      "Configurable email, SMS, and WhatsApp",
      "Delivery history and preferences",
    ],
    related: ["parent-management", "calendar-events"],
    featureSlugs: ["notifications", "parent-communication"],
  },
  {
    slug: "reports-analytics",
    title: "Reports and Analytics",
    definition:
      "Reports and analytics produces operational reports for students, attendance, academics, exams, admissions, staff, fees, and transport, limited to what the user is allowed to see.",
    problem:
      "Management meetings wait on staff to rebuild the same tables from module screens.",
    whoUses: ["Principals", "School administrators", "Authorised office staff"],
    benefits: [
      "Filter a report before exporting it.",
      "Respect the same permissions as the source module.",
    ],
    capabilities: [
      "Student, attendance, academic, and examination reports",
      "Admission, staff, fee, and transport reports",
      "Filtering and export",
      "Permission-aware reporting",
    ],
    related: ["attendance-management", "fee-management", "examination-assessment"],
    featureSlugs: ["academic-reports"],
  },
  {
    slug: "settings-permissions",
    title: "Settings and Permissions",
    definition:
      "Settings and permissions controls school users, roles, invitations, security preferences, and audit logs so each person sees only their school's data and their assigned work.",
    problem:
      "Shared office logins make it impossible to tell who changed a fee or a student record.",
    whoUses: ["School administrators"],
    benefits: [
      "Invite users instead of sharing one password.",
      "Require multi-factor authentication for school administrators.",
      "Review audit logs when a record changes.",
    ],
    capabilities: [
      "Users, roles, and permissions",
      "Invitations and access management",
      "Security settings and MFA",
      "Notification, localisation, and school preferences",
      "Audit logs",
    ],
    related: ["school-setup", "dashboard"],
    featureSlugs: ["role-based-access", "audit-logs", "multi-user-portals", "mobile-access"],
  },
]

export function getModule(slug: string) {
  return modules.find((module) => module.slug === slug)
}
