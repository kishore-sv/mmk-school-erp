"use client"

import Link from "next/link"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { cn } from "@/lib/utils"

const portals = [
  ["School admin", "/platform/school-admin-portal", "Setup, people, fees, and permissions for the whole school."],
  ["Teacher", "/platform/teacher-portal", "Timetable, attendance, classwork, and marks for assigned classes."],
  ["Student", "/platform/student-portal", "The learner's own timetable, work, and published results."],
  ["Parent", "/platform/parent-portal", "One account, with a switch between linked children."],
] as const

export function RolePortalCards() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {portals.map(([title, href, copy]) => (
        <Link
          key={href}
          href={href}
          className="group relative isolate overflow-hidden border border-border bg-background p-4 transition-all ease-in-out rounded-md hover:border-foreground/25 hover:scale-101"
        >
          <InteractiveGridPattern
            className={cn(
              "z-0 border-0",
              "[mask-image:radial-gradient(220px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            )}
            squaresClassName="stroke-gray-400/25"
          />
          <div className="relative z-10">
            <h3 className="font-medium group-hover:text-lg group-font-semibold transition-all ease-in-out text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/85">{copy}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}