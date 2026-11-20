import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>School Admin</CardTitle>
          <CardDescription>
            This is the application shell. School operations are not available
            yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Open shell
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/login" />}
          >
            Login screen
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
