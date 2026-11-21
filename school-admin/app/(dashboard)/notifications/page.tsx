import { ModuleScreen } from "@/components/module-screen"

export default function NotificationsPage() {
  return (
    <ModuleScreen
      title="Notifications"
      description="School announcements and delivery history will appear here. Push notifications are not enabled in this milestone."
      crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Notifications" }]}
    >
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        There are no notifications yet.
      </div>
    </ModuleScreen>
  )
}
