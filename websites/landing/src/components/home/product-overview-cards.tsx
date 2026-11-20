"use client"

import { FlickeringGrid } from "@/components/ui/flickering-grid"

const overviewCards = [
  {
    title: "School operations",
    copy: "Setup, admissions, students, staff, fees, transport, and reports.",
  },
  {
    title: "Classroom work",
    copy: "Timetable, attendance, diary, homework, and examinations.",
  },
  {
    title: "Family access",
    copy: "Parent and student portals, plus one mobile app. The app is available on both",
  },
] as const

export function ProductOverviewCards() {
  return (
    <div className="mt-8 grid gap-px border border-border bg-border transition-all ease-in-out sm:grid-cols-3">
      {overviewCards.map(({ title, copy }) => (
        <div
          key={title}
          className="relative group overflow-hidden bg-background cursor-pointer hover:bg-primary transition-all ease-in-out"
        >
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
            aria-hidden
          />
          <div className="relative z-10 bg-background/85 p-5 backdrop-blur-[0.1px] sm:bg-background/80 sm:p-6">
            <h3 className="font-medium group-hover:scale-105 group-hover:text-shadow-2xs transition-all ease-in-out text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        </div>
      ))}
    </div>
  )
}