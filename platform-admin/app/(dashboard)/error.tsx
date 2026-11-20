"use client"

import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-xl border p-8">
      <p className="font-medium">This page could not be loaded.</p>
      <p className="text-muted-foreground mt-1 text-sm">The platform API did not return the requested data.</p>
      <Button className="mt-4" variant="outline" onClick={() => reset()}>Try again</Button>
    </div>
  )
}
