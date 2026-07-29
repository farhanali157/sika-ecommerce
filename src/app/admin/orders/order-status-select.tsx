"use client"

import { useState, useTransition } from "react"
import { OrderStatus } from "@prisma/client"
import { updateOrderStatus } from "@/app/actions/admin-orders"

type Props = {
  orderId: string
  currentStatus: OrderStatus
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
  DISPATCHED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-300",
}

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as OrderStatus
    const previousStatus = status
    setStatus(nextStatus)
    setError(null)

    startTransition(async () => {
      const res = await updateOrderStatus(orderId, nextStatus)
      if (!res.success) {
        setStatus(previousStatus) // Revert UI state on failure
        setError(res.error || "Failed to update status")
      }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition cursor-pointer disabled:opacity-50 ${STATUS_COLORS[status]}`}
      >
        <option value="PENDING">PENDING</option>
        <option value="PROCESSING">PROCESSING</option>
        <option value="DISPATCHED">DISPATCHED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      {error && <span className="text-[10px] text-rose-600 font-medium">{error}</span>}
    </div>
  )
}