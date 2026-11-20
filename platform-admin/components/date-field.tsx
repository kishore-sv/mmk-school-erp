"use client"

import { format } from "date-fns"
import { IconCalendar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DateField({
  id,
  value,
  onChange,
  placeholder = "Select a date",
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const selected = value ? new Date(`${value}T00:00:00`) : undefined
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className="w-full justify-start font-normal"
          />
        }
      >
        <IconCalendar />
        {selected ? format(selected, "dd MMM yyyy") : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
        />
      </PopoverContent>
    </Popover>
  )
}
