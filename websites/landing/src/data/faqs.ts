export type Faq = { question: string; answer: string; category: string }

export const faqs: Faq[] = [
  {
    category: "General",
    question: "What is MMK School ERP?",
    answer:
      "MMK School ERP is school management software for a school in India. It connects administration, academic operations, teachers, students, and parents in one platform.",
  },
  {
    category: "General",
    question: "Is this website the school login?",
    answer:
      "No. This website explains the product. Each school uses its own sign-in for staff, teachers, students, and parents.",
  },
  {
    category: "Onboarding",
    question: "How does a school start?",
    answer:
      "The school shares its details and requirements. MMK confirms the student count used for the subscription, sets up the school account, and the school then completes its profile, academic year, and users.",
  },
  {
    category: "Onboarding",
    question: "Do you need a published office address to contact MMK?",
    answer:
      "Use the email and phone numbers on this website. A physical office address is not published here.",
  },
  {
    category: "Modules",
    question: "How many modules are included?",
    answer:
      "The product is organised as 17 modules, from dashboard and school setup through fees, transport, communication, reports, and permissions. A quotation confirms what the school will use.",
  },
  {
    category: "Students",
    question: "What happens to a student who leaves?",
    answer:
      "Authorised staff can withdraw or archive the student. Historical attendance, enrollment, and examination records stay with the year they belong to.",
  },
  {
    category: "Teachers",
    question: "What does a teacher see?",
    answer:
      "Teachers see their timetable, classes, attendance, diary, homework, assignments, and the marks they are allowed to enter.",
  },
  {
    category: "Parents",
    question: "Can one parent account open more than one child?",
    answer:
      "Yes, when the school has linked those students to the same guardian. The parent switches child inside that account.",
  },
  {
    category: "Students",
    question: "What does a student see?",
    answer:
      "A student sees their own profile, timetable, attendance, classwork, calendar, notifications, and published results.",
  },
  {
    category: "Mobile",
    question: "Is there a separate app for parents and teachers?",
    answer:
      "No. There is one mobile app with a different experience after the user signs in as a teacher, student, or parent.",
  },
  {
    category: "Mobile",
    question: "Can I download the app from a store badge on this site?",
    answer:
      "This website does not show store badges or claim that the app is already published.",
  },
  {
    category: "Admissions",
    question: "Can families apply online?",
    answer:
      "Each school can offer an admissions page with enquiry and application forms, document submission, and status tracking. The page belongs to that school's admission process.",
  },
  {
    category: "Attendance",
    question: "Does attendance include biometric devices?",
    answer:
      "Staff record attendance in MMK School ERP. Device, RFID, and biometric integrations are not part of the product described here.",
  },
  {
    category: "Fees",
    question: "Are school fees the same as the MMK subscription?",
    answer:
      "No. Fee Management is the school's charges to families. The school's subscription to MMK is calculated from student strength and is not collected through that fee module.",
  },
  {
    category: "Security",
    question: "Can a school administrator see another school?",
    answer:
      "No. A school user works inside that school's account. Platform administration is a separate operator experience.",
  },
  {
    category: "Security",
    question: "Do school administrators use multi-factor authentication?",
    answer:
      "Yes. Multi-factor authentication is mandatory for the school admin role.",
  },
  {
    category: "Pricing",
    question: "How is the subscription calculated?",
    answer:
      "MMK uses simple per-student pricing. The subscription is calculated from the school's student strength. The quotation also depends on the requirements the school confirms. This website does not list an amount.",
  },
  {
    category: "Pricing",
    question: "Are there named packages?",
    answer:
      "No. There is no starter, basic, or enterprise card. Ask for a quotation for your school.",
  },
  {
    category: "Support",
    question: "How do we ask for a demo or help?",
    answer:
      "Use the demo or contact form, or email and call the numbers published on this website. If a form says a message service is not connected yet, use those direct contacts.",
  },
]

export const homeFaqs = faqs.filter((faq) =>
  ["General", "Modules", "Pricing", "Parents"].includes(faq.category)
)
