import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Loading</CardTitle>
          <CardDescription>The admissions shell is loading.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  )
}
