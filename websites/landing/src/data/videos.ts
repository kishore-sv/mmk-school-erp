export type VideoRecord = {
  id: string
  title: string
  youtubeId?: string
}

/** Add a youtubeId only when a real video ID is known. */
export const videos: VideoRecord[] = [
  { id: "product-demostration", title: "Product demonstration"  ,youtubeId:"CCCd6JTANuM?si=4xvMHCEANPZXtGC2"},
  { id: "teacher-portal", title: "Teacher portal walkthrough" , youtubeId:"OKkjgnocPvI?si=tPRZvnc59D1It6oC"},
  { id: "parent-portal", title: "Parent portal walkthrough" , youtubeId:"rXkrz7_FnL0?si=LeNl0NjsBVVXVpKh"},
  { id: "student-portal", title: "Student portal walkthrough", youtubeId:"6kiv21x3mtY?si=n_wdL5x6UaDWL2n-" },
  { id: "admissions", title: "Admissions workflow" ,youtubeId:"viwOMm1zrNw?si=VqC315n08OlHUs7A"},
  { id: "fees", title: "Fee management explanation" , youtubeId:"8T7_nvq5-ak?si=6RQxM9YPrqur216P"},
]

export const videosWithIds = videos.filter((video) => video.youtubeId)
