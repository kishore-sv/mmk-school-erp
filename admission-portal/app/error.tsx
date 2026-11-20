"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-4 p-6">
      <h1 className="text-lg font-medium">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        This page could not be displayed.
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  )
}
