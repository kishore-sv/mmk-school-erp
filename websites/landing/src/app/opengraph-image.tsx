import { ImageResponse } from "next/og"

export const alt = "MMK School ERP"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: "#171717", color: "#f5f5f5", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 64 }}>
        <div style={{ fontSize: 64, fontWeight: 600 }}>MMK School ERP</div>
        <div style={{ fontSize: 28, marginTop: 16 }}>School management software for India</div>
      </div>
    ),
    size
  )
}
