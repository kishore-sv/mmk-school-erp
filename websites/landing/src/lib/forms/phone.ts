/** Digits and an optional leading + after stripping common separators. */
export function normalizePhoneInput(phone: string) {
  const trimmed = phone.trim()
  const hasPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/[^\d]/g, "")
  return hasPlus ? `+${digits}` : digits
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhoneInput(phone)
  if (!/^\+?\d{8,15}$/.test(normalized)) return false

  if (normalized.startsWith("+91")) {
    return /^\+91[6-9]\d{9}$/.test(normalized)
  }

  if (/^\d{10}$/.test(normalized)) {
    return /^[6-9]\d{9}$/.test(normalized)
  }

  if (normalized.startsWith("+")) {
    return normalized.length >= 9 && normalized.length <= 16
  }

  return normalized.length >= 8 && normalized.length <= 15
}