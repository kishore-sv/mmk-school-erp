"use client"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted-foreground">This page could not be displayed. You can try again.</p>
      <button className="mt-6 border border-border px-3 py-2 text-sm" onClick={() => reset()} type="button">Try again</button>
    </div>
  )
}
