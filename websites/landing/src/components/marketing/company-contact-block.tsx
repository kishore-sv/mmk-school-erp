import { Globe, Mail, Phone } from "lucide-react"
import { siteConfig, telHref } from "@/config/site"

export function CompanyContactBlock() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{siteConfig.name}</h2>
      <ul className="mt-4 flex flex-col gap-4">
        <li className="flex gap-3 text-sm leading-6">
          <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <a className="text-foreground underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </li>
        {siteConfig.phones.map((phone) => (
          <li key={phone} className="flex gap-3 text-sm leading-6">
            <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            <a className="text-foreground underline-offset-4 hover:underline" href={telHref(phone)}>
              {phone}
            </a>
          </li>
        ))}
        <li className="flex gap-3 text-sm leading-6">
          <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href={siteConfig.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {siteConfig.url.replace("https://", "")}
          </a>
        </li>
      </ul>
    </div>
  )
}

export function FormStepsBlock({ title, steps }: { title: string; steps: readonly string[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ol className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="font-medium tabular-nums text-foreground">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}