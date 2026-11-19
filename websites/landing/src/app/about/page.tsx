import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "About",
  description: "MMK School ERP builds school management software so Indian schools can run administration, classrooms, and family communication in one system.",
  path: "/about",
})

export default function Page() {
  return (
    <>
      <PageHero title="School software with a narrow job" description="MMK School ERP exists so a school can keep students, staff, classes, fees, and family access in one system instead of a pile of registers." />
      <PageContainer className="flex max-w-3xl flex-col gap-8 py-12 text-sm leading-7">
        <section>
          <h2 className="text-xl font-semibold">What it is</h2>
          <p className="mt-3 text-muted-foreground">It is school ERP software for schools in India. It is not a generic business suite and it is not the login screen you are reading now. This website explains the product.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">The problem</h2>
          <p className="mt-3 text-muted-foreground">Admissions, attendance, homework, and fees fall out of step when each office keeps its own file. Families then see a different story from the one the class teacher has.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Product philosophy</h2>
          <p className="mt-3 text-muted-foreground">Start from the school year and the people in it. Give each role only the work they do. Keep history when a student moves class. Say clearly when a channel such as SMS is configurable rather than already connected.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Digitisation, usability, and access</h2>
          <p className="mt-3 text-muted-foreground">Digitising a school should not mean a new product for every task. The same student record should serve the office, the teacher, and the guardian. Screens stay specific to the role. Security is role-based access inside one school, with multi-factor authentication for school administrators.</p>
        </section>
      </PageContainer>
      <CtaBand title="See whether it fits your school" description="A demo is the practical way to judge the product. We will not invent a customer count to persuade you." />
    </>
  )
}
