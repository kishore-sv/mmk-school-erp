type LogLevel = "info" | "warn" | "error"

export function log(
  level: LogLevel,
  message: string,
  fields: Record<string, unknown> = {},
): void {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    service: "server",
    ...fields,
  })

  if (level === "error") {
    console.error(line)
    return
  }

  console.log(line)
}
