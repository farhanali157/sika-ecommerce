"use client"

import { useState, useTransition } from "react"
import { cancelCustomerOrder } from "@/app/actions/customer-orders"
import { AlertCircle, Ban } from "lucide-react"

type Props = {
  orderId: string
  currentStatus: string
}

export function CancelOrderButton({ orderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  if (currentStatus !== "PENDING" && currentStatus !== "PROCESSING") {
    return null
  }

  const handleCancel = () => {
    setError(null)
    startTransition(async () => {
      const res = await cancelCustomerOrder(orderId)
      if (!res.success) {
        setError(res.error || "Failed to cancel order.")
        setIsConfirming(false)
      }
    })
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {!isConfirming ? (
        <button
          onClick={() => setIsConfirming(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <Ban className="h-3.5 w-3.5" /> Cancel Order
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          <span className="text-xs font-bold text-rose-900">Are you sure?</span>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Cancelling..." : "Yes, Cancel"}
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="text-xs font-bold text-gray-600 hover:text-gray-800 px-2 py-1 transition cursor-pointer"
          >
            Back
          </button>
        </div>
      )}
    </div>
  )
}