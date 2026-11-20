"use client"

import { useEffect, useState } from "react"

type ToastItem = {
  id: number
  title: string
  description?: string
}

const listeners = new Set<(items: ToastItem[]) => void>()
let items: ToastItem[] = []

export function toast(title: string, description?: string) {
  const item = { id: Date.now() + Math.random(), title, description }
  items = [...items, item].slice(-4)
  listeners.forEach((listener) => listener(items))
  window.setTimeout(() => {
    items = items.filter((entry) => entry.id !== item.id)
    listeners.forEach((listener) => listener(items))
  }, 4000)
}

export function Toaster() {
  const [current, setCurrent] = useState<ToastItem[]>([])

  useEffect(() => {
    listeners.add(setCurrent)
    return () => {
      listeners.delete(setCurrent)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-80 flex-col gap-2">
      {current.map((item) => (
        <div
          key={item.id}
          className="bg-popover text-popover-foreground rounded-lg border p-3 shadow-sm"
        >
          <p className="text-sm font-medium">{item.title}</p>
          {item.description ? (
            <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
