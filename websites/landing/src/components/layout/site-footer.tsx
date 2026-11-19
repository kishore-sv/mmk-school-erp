import Link from "next/link"
import { IconBrandYoutube, IconMail, IconPhone, IconWorld } from "@tabler/icons-react"
import { MmkLogo } from "@/components/brand/mmk-logo"
import { CopyrightLine } from "@/components/layout/copyright-line"
import { footerColumns } from "@/config/footer"
import { siteConfig, telHref } from "@/config/site"

const contactIconClass = "size-4 shrink-0 text-muted-foreground"

function ContactLink({
  href,
  icon: Icon,
  children,
  external,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; stroke?: number; "aria-hidden"?: boolean }>
  children: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      className="inline-flex items-center gap-2 hover:text-foreground"
      href={href}
      {...(external ? { rel: "noreferrer", target: "_blank" } : {})}
    >
      <Icon aria-hidden className={contactIconClass} stroke={1.75} />
      <span>{children}</span>
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-6 lg:gap-10">
        <div className="col-span-2 lg:col-span-2">
          <MmkLogo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{siteConfig.description}</p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a className="text-sm text-muted-foreground hover:text-foreground" href={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                    </a>
                  ) : (
                    <Link className="text-sm text-muted-foreground hover:text-foreground" href={link.href}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-2 lg:col-span-1">
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li>
              <ContactLink href={`mailto:${siteConfig.email}`} icon={IconMail}>
                {siteConfig.email}
              </ContactLink>
            </li>
            {siteConfig.phones.map((phone) => (
              <li key={phone}>
                <ContactLink href={telHref(phone)} icon={IconPhone}>
                  {phone}
                </ContactLink>
              </li>
            ))}
            <li>
              <ContactLink href={siteConfig.url} icon={IconWorld} external>
                {siteConfig.domain}
              </ContactLink>
            </li>
            <li>
              <ContactLink href={siteConfig.youtubeUrl} icon={IconBrandYoutube} external>
                YouTube
              </ContactLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <CopyrightLine />
      </div>
    </footer>
  )
}
