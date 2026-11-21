import Link from "next/link"

import { AppCrumbs } from "@/components/app-crumbs"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-4 p-6">
      <AppCrumbs />
      <h1 className="text-lg font-medium">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        That address is not part of the admissions portal.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Back to home
      </Button>
    </main>
  )
}
