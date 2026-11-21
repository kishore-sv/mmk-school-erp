import { notFound } from "next/navigation"

import { ModuleScreen } from "@/components/module-screen"
import { ProfileEditor } from "@/features/school/profile-editor"
import { navigation } from "@/lib/navigation"

export default async function SectionPage({
  params,
}: {
  params: Promise<{ module: string; section: string }>
}) {
  const { module, section } = await params
  const group = navigation.find((item) => item.href === `/${module}`)
  const item = group?.items.find((entry) => entry.href === `/${module}/${section}`)
  if (!group || !item) {
    notFound()
  }
  return (
    <ModuleScreen
      title={item.title}
      description={item.description}
      crumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: group.title, href: group.href },
        { label: item.title },
      ]}
    >
      {item.href === "/school-setup/profile" ? <ProfileEditor /> : undefined}
    </ModuleScreen>
  )
}
