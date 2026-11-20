import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Admissions</CardTitle>
          <CardDescription>
            Public admissions shell. School-specific sites, applications, and
            document uploads are not implemented.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  )
}
