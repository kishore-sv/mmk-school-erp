import { api } from "@/lib/api"

type Started = {
  uploadId: string
  multipart: boolean
  presigned: { url: string; method: "PUT"; headers?: Record<string, string> } | null
}

export async function uploadSchoolBranding(schoolId: string, purpose: "logo" | "banner", file: File) {
  const started = await api<Started>(`/schools/${schoolId}/branding/uploads`, {
    method: "POST",
    body: JSON.stringify({
      purpose,
      contentType: file.type,
      contentLength: file.size,
    }),
  })
  if (!started.presigned || started.multipart) {
    throw new Error("Use a file under 5 MB for this form, or upload the banner from the school page.")
  }
  const uploaded = await fetch(started.presigned.url, {
    method: "PUT",
    headers: started.presigned.headers,
    body: file,
  })
  if (!uploaded.ok) {
    throw new Error("The file could not be uploaded.")
  }
  await api(`/schools/${schoolId}/branding/uploads/${started.uploadId}/complete`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}
