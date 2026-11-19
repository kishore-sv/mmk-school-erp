export type VideoRecord = {
  id: string
  title: string
  youtubeId?: string
}

/** Add a youtubeId only when a real video ID is known. */
export const videos: VideoRecord[] = [
  { id: "product-overview", title: "Product demonstration" },
  { id: "teacher-portal", title: "Teacher portal walkthrough" },
  { id: "parent-portal", title: "Parent portal walkthrough" },
  { id: "student-portal", title: "Student portal walkthrough" },
  { id: "admissions", title: "Admissions workflow" },
  { id: "fees", title: "Fee management explanation" },
]

export const videosWithIds = videos.filter((video) => video.youtubeId)
