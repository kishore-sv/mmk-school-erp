import Image from "next/image"
import Link from "next/link"
import { PageContainer } from "@/components/marketing/page-shell"
import { buttonVariants } from "@/components/ui/button"

const notFoundIllustration = "/illustrations/no-content-404.svg"

export default function NotFound() {
  return (
    <PageContainer className="flex flex-col items-center py-24 text-center">
      <Image
        src={notFoundIllustration}
        alt=""
        width={246}
        height={246}
        className="size-48 sm:size-56"
        aria-hidden
        priority
      />
      <h1 className="mt-8 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        That address is not part of the MMK School ERP website.
      </p>
      <Link className={buttonVariants({ className: "mt-8" })} href="/">
        Back to home
      </Link>
    </PageContainer>
  )
}
