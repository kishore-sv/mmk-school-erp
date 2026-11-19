import { integrations } from "@/data/integrations"
import { modules } from "@/data/modules"

export type NavLink = { label: string; href: string; description?: string }

export type NavItem =
  | { label: string; href: string }
  | { label: string; href: string; children: NavLink[] }

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Modules / Services",
    href: "/modules",
    children: modules.map((module) => ({
      label: module.title,
      href: `/modules/${module.slug}`,
      description: module.definition,
    })),
  },
  {
    label: "Integrations",
    href: "/integrations",
    children: integrations.map((item) => ({
      label: item.title,
      href: `/integrations/${item.slug}`,
      description: item.definition,
    })),
  },
  { label: "Admissions Website", href: "/admissions-website" },
  { label: "Mobile App", href: "/mobile-app" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/book-demo" },
  { label: "Contact Us", href: "/contact" },
]

export function isMenu(item: NavItem): item is Extract<NavItem, { children: NavLink[] }> {
  return "children" in item
}
