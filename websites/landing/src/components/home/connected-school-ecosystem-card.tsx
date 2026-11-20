"use client"

import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"

const highlightedSquares: [number, number][] = [
  [4, 4],
  [5, 1],
  [8, 2],
  [5, 3],
  [5, 5],
  [10, 10],
  [12, 15],
  [15, 10],
  [10, 15],
]

export function ConnectedSchoolEcosystemCard() {
  return (
    <div className="relative isolate overflow-hidden border border-border bg-background p-6">
      <GridPattern
        squares={highlightedSquares}
        className={cn(
          "z-0 fill-gray-400/20 stroke-gray-400/20",
          "[mask-image:radial-gradient(ellipse_90%_80%_at_85%_20%,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <div className="relative z-10 max-w-prose">
        <h2 className="text-xl font-semibold text-foreground">Connected school ecosystem</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/85">
          An admission becomes a student. That student is placed in a section, appears on a timetable, is marked in
          attendance, and is linked to guardians. Fees and exams use the same person, not a second spreadsheet.
        </p>
      </div>
    </div>
  )
}