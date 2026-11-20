"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DateField } from "@/components/date-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SchoolFilters(props: {
  q: string
  status: string
  subscriptionStatus: string
  createdFrom: string
  createdTo: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(props.status)
  const [subscriptionStatus, setSubscriptionStatus] = useState(props.subscriptionStatus)
  const [createdFrom, setCreatedFrom] = useState(props.createdFrom)
  const [createdTo, setCreatedTo] = useState(props.createdTo)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const query = new URLSearchParams()
    const q = String(form.get("q") ?? "").trim()
    if (q) query.set("q", q)
    if (status) query.set("status", status)
    if (subscriptionStatus) query.set("subscriptionStatus", subscriptionStatus)
    if (createdFrom) query.set("createdFrom", createdFrom)
    if (createdTo) query.set("createdTo", createdTo)
    router.push(query.size > 0 ? `/schools?${query.toString()}` : "/schools")
  }

  return (
    <form className="grid gap-3 md:grid-cols-5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 md:col-span-2">
        <Label htmlFor="q">Search</Label>
        <Input id="q" name="q" defaultValue={props.q} placeholder="Name, code, or email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>School status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value ?? "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Subscription</Label>
        <Select value={subscriptionStatus} onValueChange={(value) => setSubscriptionStatus(value ?? "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any subscription" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any subscription</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">Apply</Button>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Created from</Label>
        <DateField value={createdFrom} onChange={setCreatedFrom} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Created to</Label>
        <DateField value={createdTo} onChange={setCreatedTo} />
      </div>
    </form>
  )
}
