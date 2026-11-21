import { expect, test } from "bun:test"

function magicOk(contentType: string, bytes: Uint8Array): boolean {
  if (contentType === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  }
  if (contentType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  }
  return false
}

test("accepts a png signature and rejects a mismatched signature", () => {
  expect(magicOk("image/png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))).toBe(true)
  expect(magicOk("image/png", new Uint8Array([0x3c, 0x73, 0x76, 0x67]))).toBe(false)
  expect(magicOk("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(true)
})
