import { CheckCircle2 } from "lucide-react"
import { siteConfig, telHref } from "@/config/site"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import type { EnquiryResult } from "@/lib/forms/submit-enquiry"
import { cn } from "cn"

/** Matches validation in `contactSchema` / `demoSchema` message field. */
export const ENQUIRY_MESSAGE_MIN = 10
export const ENQUIRY_MESSAGE_MAX = 2000

export function MessageCharacterCount({
  id,
  length,
  min = ENQUIRY_MESSAGE_MIN,
  max = ENQUIRY_MESSAGE_MAX,
}: {
  id?: string
  length: number
  min?: number
  max?: number
}) {
  const overMax = length > max
  const underMin = length > 0 && length < min

  return (
    <div
      id={id}
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground"
    >
      <span className={cn(underMin && "text-destructive")}>
        {length === 0 ? `Minimum ${min} characters` : underMin ? `${min - length} more to reach minimum` : null}
      </span>
      <span
        className={cn("tabular-nums", overMax && "text-destructive")}
        aria-live="polite"
        aria-atomic="true"
      >
        {length}/{max}
      </span>
    </div>
  )
}

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