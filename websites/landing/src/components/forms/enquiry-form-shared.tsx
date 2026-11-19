import { CheckCircle2 } from "lucide-react"
import { siteConfig, telHref } from "@/config/site"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import type { EnquiryResult } from "@/lib/forms/submit-enquiry"

export function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      {" "}
      *
    </span>
  )
}

export function EnquiryResultAlerts({ result }: { result: EnquiryResult | null }) {
  if (!result || result.status === "sent") return null

  if (result.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <AlertDescription>
        We could not send your request automatically. Email{" "}
        <a className="font-medium underline underline-offset-4" href={result.mailto}>
          {siteConfig.email}
        </a>{" "}
        or call{" "}
        {siteConfig.phones.map((phone, index) => (
          <span key={phone}>
            {index > 0 ? " or " : null}
            <a className="font-medium underline underline-offset-4" href={telHref(phone)}>
              {phone}
            </a>
          </span>
        ))}
        .
      </AlertDescription>
    </Alert>
  )
}

export function EnquirySuccessCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="ring-foreground/10">
      <CardContent className="flex flex-col items-start gap-4 py-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium text-foreground">{title}</p>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}