import Link from "next/link"

import { AppCrumbs } from "@/components/app-crumbs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const experiences = [
  { href: "/teacher", label: "Teacher" },
  { href: "/student", label: "Student" },
  { href: "/parent", label: "Parent" },
]

export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col p-6">
      <AppCrumbs />
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Portal</CardTitle>
          <CardDescription>
            One application with separate placeholder shells for teachers,
            students, and parents. Access control is not implemented.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {experiences.map((experience) => (
            <Button
              key={experience.href}
              nativeButton={false}
              render={<Link href={experience.href} />}
            >
              {experience.label}
            </Button>
          ))}
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/login" />}
          >
            Login screen
          </Button>
        </CardContent>
        </Card>
      </div>
    </main>
  )
}
