import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/config/site"
import { videos, videosWithIds } from "@/data/videos"
import { createMetadata } from "@/lib/seo/create-metadata"
import { IconBrandYoutube } from "@tabler/icons-react"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Resources",
  description: "Product demonstrations and guides for MMK School ERP. Articles stay on the separate blog. Videos link to the YouTube channel until real video IDs are configured.",
  path: "/resources",
})

export default function Page() {
  return (
    <>
      <PageHero title="Demonstrations and guides" description="This section is not a blog. Articles are published on the separate blog website." />
      <PageContainer className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <h2 className="text-xl font-semibold">Video tutorials</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {videos.map((video) => (
              <li className="border group cursor-pointer border-border p-4 text-sm hover:scale-101 transition-all duration-300 ease-in-out hover:shadow-lg" key={video.id}>
                <p className="font-medium text-lg group-hover:font-semibold group-hover:text-xl transition-all duration-300 ease-in-out">{video.title}</p>
                {video.youtubeId ? (
                  <iframe className="mt-3 aspect-video w-full" src={`https://www.youtube.com/embed/${video.youtubeId}`} title={video.title} allowFullScreen />
                ) : (
                  <p className="mt-2 text-muted-foreground">A public video ID has not been added yet. Watch the channel for this topic.</p>
                )}
              </li>
            ))}
          </ul>
          <Separator className="mask-radial-faded mt-8 mb-6" />
          <div className="flex gap-2">
          <Button variant="outline" className="w-fit group flex items-center gap-2">
            <IconBrandYoutube className="w-4 h-4 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 ease-in-out" />
            <Link href={siteConfig.youtubeUrl}>Visit our YouTube channel</Link>
          </Button>
          <Button variant="outline" className="w-fit group flex items-center gap-2">
            <Link href={siteConfig.blogUrl}>Visit our blog</Link>
            <ArrowRightIcon className="w-4 h-4 group-hover:text-blue-500 group-hover:-rotate-[30deg] group-hover:scale-110 transition-all duration-300 ease-in-out" />
          </Button>
          <Button variant="outline" className="w-fit group flex items-center gap-2">
            <Link href="/faq">FAQ</Link>
            <ArrowRightIcon className="w-4 h-4 group-hover:text-green-500 group-hover:-rotate-[30deg] group-hover:scale-110 transition-all duration-300 ease-in-out" />
          </Button>
          <Button variant="outline" className="w-fit group flex items-center gap-2">
            <Link href="/contact">Support contacts</Link>
            <ArrowRightIcon className="w-4 h-4 group-hover:text-yellow-500 group-hover:-rotate-[30deg] group-hover:scale-110 transition-all duration-300 ease-in-out" />
          </Button>
          </div>
          {videosWithIds.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No embedded videos are shown, because no YouTube IDs are configured.</p> : null}
        </div>
        <aside className="flex flex-col gap-4 text-sm">
          <a className="border hover:shadow-lg hover:ring hover:ring-offset-0 hover:ring-foreground hover:rounded-md hover:scale-101 transition-all duration-300 ease-in-out border-border p-4" href={siteConfig.youtubeUrl} rel="noreferrer" target="_blank">YouTube channel</a>
          <a className="border hover:shadow-lg hover:ring hover:ring-offset-0 hover:ring-foreground hover:rounded-md hover:scale-101 transition-all duration-300 ease-in-out border-border p-4" href={siteConfig.blogUrl} rel="noreferrer" target="_blank">Blog at blogs.mmkerp.tech</a>
          <a className="border hover:shadow-lg hover:ring hover:ring-offset-0 hover:ring-foreground hover:rounded-md hover:scale-101 transition-all duration-300 ease-in-out border-border p-4" href="/faq">FAQ</a>
          <a className="border hover:shadow-lg hover:ring hover:ring-offset-0 hover:ring-foreground hover:rounded-md hover:scale-101 transition-all duration-300 ease-in-out border-border p-4" href="/contact">Support contacts</a>
        </aside>
      </PageContainer>
    </>
  )
}