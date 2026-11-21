import { notFound } from "next/navigation"

import { ModuleScreen } from "@/components/module-screen"
import { navigation } from "@/lib/navigation"

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  const section = navigation.find((item) => item.href === `/${module}`)
  if (!section) {
    notFound()
  }
  return (
    <ModuleScreen
      title={section.title}
      description={section.description}
      crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: section.title }]}
    />
  )
}
