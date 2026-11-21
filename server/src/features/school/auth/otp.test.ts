import { expect, test } from "bun:test"

import { hashOtp, otpMatches } from "./token"

const secret = "school-access-token-secret-value-32"

test("otp is stored as a hash and checked in constant time", () => {
  const hash = hashOtp("123456", secret, "school", "admin")
  expect(hash).not.toContain("123456")
  expect(otpMatches("123456", hash, secret, "school", "admin")).toBe(true)
  expect(otpMatches("000000", hash, secret, "school", "admin")).toBe(false)
  expect(otpMatches("123456", hash, secret, "other-school", "admin")).toBe(false)
})
