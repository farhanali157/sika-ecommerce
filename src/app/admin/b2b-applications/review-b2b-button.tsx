"use client"

import { useState, useTransition } from "react"
import { reviewB2BApplication } from "@/app/actions/admin-b2b"
import { ApplicationStatus } from "@prisma/client"
import { CheckCircle2, XCircle } from "lucide-react"

interface ReviewProps {
  applicationId: string
  currentStatus: ApplicationStatus
}

export function ReviewB2BButtons({ applicationId, currentStatus }: ReviewProps) {
  const [isPending, startTransition] = useTransition()
  const [notes, setNotes] = useState("")

  const handleStatusChange = (status: ApplicationStatus) => {
    startTransition(async () => {
      const res = await reviewB2BApplication(applicationId, status, notes)
      if (!res.success) {
        alert(res.error)
      }
    })
  }

  // 1. Handle APPROVED state
  if (currentStatus === ApplicationStatus.APPROVED) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
      </span>
    )
  }

  // 2. Handle REJECTED state
  if (currentStatus === ApplicationStatus.REJECTED) {
    return (
      <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
        <XCircle className="h-3.5 w-3.5" /> Rejected
      </span>
    )
  }

  // 3. Default state (PENDING)
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Add review notes (optional)..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleStatusChange(ApplicationStatus.APPROVED)}
          disabled={isPending}
          className="flex-1 inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
        </button>
        <button
          onClick={() => handleStatusChange(ApplicationStatus.REJECTED)}
          disabled={isPending}
          className="flex-1 inline-flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition disabled:opacity-50"
        >
          <XCircle className="h-3.5 w-3.5" /> Reject
        </button>
      </div>
    </div>
  )
}