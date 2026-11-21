export type AccessClaims = {
  sub: string
  sid: string
  mcp: boolean
  sch: string
  exp: number
}

function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  return atob(padded + pad)
}

function signatureBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = decodeBase64Url(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export async function verifyAccessToken(token: string, secret: string): Promise<AccessClaims | null> {
  const parts = token.split(".")
  if (parts.length !== 3) {
    return null
  }
  const [header, payload, signature] = parts
  if (!header || !payload || !signature) {
    return null
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  )
  const valid = await crypto.subtle.verify("HMAC", key, signatureBytes(signature), new TextEncoder().encode(`${header}.${payload}`))
  if (!valid) {
    return null
  }
  const claims = JSON.parse(decodeBase64Url(payload)) as Partial<AccessClaims>
  if (typeof claims.exp !== "number" || claims.exp * 1000 <= Date.now()) {
    return null
  }
  if (typeof claims.sub !== "string" || typeof claims.mcp !== "boolean" || typeof claims.sch !== "string") {
    return null
  }
  return claims as AccessClaims
}
