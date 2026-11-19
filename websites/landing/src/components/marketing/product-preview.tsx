import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const roles = [
  {
    id: "admin",
    label: "Admin",
    rows: ["Pending admissions: review queue", "Today's attendance: class summary", "Fee position: dues and receipts"],
  },
  {
    id: "teacher",
    label: "Teacher",
    rows: ["Period 1 · Class 6 A · Mathematics", "Attendance not marked for 7 B", "Homework due tomorrow"],
  },
  {
    id: "parent",
    label: "Parent",
    rows: ["Child: Ananya · Class 4 B", "Present today", "Diary and fee information"],
  },
] as const

export function ProductPreview() {
  return (
    <Card className="shadow-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Product interface preview</CardTitle>
          <Badge variant="secondary">Sample layout</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          A composed example of how roles see the same school. It is not a live customer deployment.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="admin">
          <TabsList>
            {roles.map((role) => (
              <TabsTrigger key={role.id} value={role.id}>
                {role.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {roles.map((role) => (
            <TabsContent className="mt-4 flex flex-col gap-2" key={role.id} value={role.id}>
              {role.rows.map((row) => (
                <div className="rounded-lg border border-border px-3 py-2 text-sm" key={row}>
                  {row}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
