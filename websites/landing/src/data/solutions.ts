export type SolutionRecord = {
  slug: string
  title: string
  audience: string
  definition: string
  workflows: string[]
  moduleSlugs: string[]
}

export const solutions: SolutionRecord[] = [
  {
    slug: "school-management",
    title: "School management",
    audience: "School owners and leadership",
    definition:
      "School management in MMK School ERP is the day-to-day running of one school: setup, people, academics, money, and communication in the same account.",
    workflows: [
      "Confirm the school profile and academic year before classes start.",
      "Review attendance, admissions, and fee position from the dashboard.",
      "Ask for a report instead of rebuilding spreadsheets for a management meeting.",
    ],
    moduleSlugs: ["dashboard", "school-setup", "reports-analytics", "settings-permissions"],
  },
  {
    slug: "school-administrators",
    title: "School administrators",
    audience: "Office administrators",
    definition:
      "Administrators maintain users, student records, admissions, fees, and the settings that other roles depend on.",
    workflows: [
      "Invite staff and guardians instead of sharing a password.",
      "Convert an approved application into a student enrollment.",
      "Assign fee structures and record collections.",
    ],
    moduleSlugs: ["settings-permissions", "student-management", "admission-management", "fee-management"],
  },
  {
    slug: "principals",
    title: "Principals",
    audience: "Principals",
    definition:
      "Principals use MMK School ERP to see the school day and follow up in attendance, exams, and reports without operating every data-entry screen.",
    workflows: [
      "Open the dashboard for the current academic year.",
      "Read attendance and examination reports the office has already verified.",
      "Check that announcements went to the intended audience.",
    ],
    moduleSlugs: ["dashboard", "attendance-management", "examination-assessment", "reports-analytics"],
  },
  {
    slug: "teachers",
    title: "Teachers",
    audience: "Teachers",
    definition:
      "Teachers work from their timetable, classes, attendance, diary, homework, and marks rather than the full school setup.",
    workflows: [
      "See today's periods and assigned classes.",
      "Mark class attendance and write the digital diary.",
      "Enter examination marks for allocated subjects.",
    ],
    moduleSlugs: ["timetable-management", "attendance-management", "learning-classroom", "examination-assessment"],
  },
  {
    slug: "parents",
    title: "Parents",
    audience: "Parents and guardians",
    definition:
      "Parents sign in to one account and switch between the children the school has linked to them.",
    workflows: [
      "Check attendance, timetable, and diary for a child.",
      "Read homework and published results.",
      "View fee information the school has enabled.",
    ],
    moduleSlugs: ["parent-management", "attendance-management", "learning-classroom", "fee-management"],
  },
  {
    slug: "students",
    title: "Students",
    audience: "Students",
    definition:
      "Students see their own timetable, attendance, classwork, and published results.",
    workflows: [
      "Open the day's periods.",
      "Read the diary, homework, and materials.",
      "Check examinations and report cards after publication.",
    ],
    moduleSlugs: ["timetable-management", "learning-classroom", "examination-assessment", "calendar-events"],
  },
  {
    slug: "admissions-teams",
    title: "Admissions teams",
    audience: "Admissions staff",
    definition:
      "Admissions teams follow an enquiry through application, documents, and a decision, then hand an approved learner to student records.",
    workflows: [
      "Log the enquiry and application.",
      "Track documents, interviews, and the waitlist.",
      "Approve and create the student profile.",
    ],
    moduleSlugs: ["admission-management", "student-management", "parent-management"],
  },
  {
    slug: "academic-management",
    title: "Academic operations",
    audience: "Academic coordinators",
    definition:
      "Academic operations cover the year, classes, subjects, timetable, and examinations that the rest of the school uses.",
    workflows: [
      "Set classes, sections, and subject allocation.",
      "Publish a timetable after clash checks.",
      "Configure the examination before marks entry.",
    ],
    moduleSlugs: ["academic-management", "timetable-management", "examination-assessment"],
  },
  {
    slug: "fee-administration",
    title: "Fee administration",
    audience: "Accounts staff",
    definition:
      "Fee administration is how the school defines what families owe and records what they have paid. It is not MMK's own subscription invoice.",
    workflows: [
      "Create categories and a structure.",
      "Assign it to students and record concessions.",
      "Collect payments and issue receipts.",
    ],
    moduleSlugs: ["fee-management", "student-management", "reports-analytics"],
  },
]

export function getSolution(slug: string) {
  return solutions.find((item) => item.slug === slug)
}
