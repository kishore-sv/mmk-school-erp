import { AppCrumbs } from "@/components/app-crumbs"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col p-6">
      <AppCrumbs />
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
          <CardTitle>Admissions</CardTitle>
          <CardDescription>
            Public admissions shell. School-specific sites, applications, and
            document uploads are not implemented.
          </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  )
}
