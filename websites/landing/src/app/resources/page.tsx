import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { siteConfig } from "@/config/site"
import { videos, videosWithIds } from "@/data/videos"
import { createMetadata } from "@/lib/seo/create-metadata"

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
              <li className="border border-border p-4 text-sm" key={video.id}>
                <p className="font-medium">{video.title}</p>
                {video.youtubeId ? (
                  <iframe className="mt-3 aspect-video w-full" src={`https://www.youtube.com/embed/${video.youtubeId}`} title={video.title} allowFullScreen />
                ) : (
                  <p className="mt-2 text-muted-foreground">A public video ID has not been added yet. Watch the channel for this topic.</p>
                )}
              </li>
            ))}
          </ul>
          {videosWithIds.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No embedded videos are shown, because no YouTube IDs are configured.</p> : null}
        </div>
        <aside className="flex flex-col gap-4 text-sm">
          <a className="border border-border p-4" href={siteConfig.youtubeUrl} rel="noreferrer" target="_blank">YouTube channel</a>
          <a className="border border-border p-4" href={siteConfig.blogUrl} rel="noreferrer" target="_blank">Blog at blogs.mmkerp.tech</a>
          <a className="border border-border p-4" href="/faq">FAQ</a>
          <a className="border border-border p-4" href="/contact">Support contacts</a>
        </aside>
      </PageContainer>
    </>
  )
}
