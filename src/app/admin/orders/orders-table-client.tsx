"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { OrderStatusSelect } from "./order-status-select"
import { deleteSingleOrder, deleteBatchOrders } from "@/app/actions/admin-orders"
import { OrderStatus } from "@prisma/client"
import {
  ShoppingBag,
  Building2,
  ChevronRight,
  Trash2,
} from "lucide-react"

type OrderItem = {
  id: string
  quantity: number
  product: { name: string }
}

type SerializedOrder = {
  id: string
  createdAt: string
  totalAmount: number
  status: OrderStatus
  customerName?: string | null
  customerEmail?: string | null
  userId?: string | null
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
    companyName?: string | null
  } | null
  items: OrderItem[]
}

export function OrdersTableClient({ orders }: { orders: SerializedOrder[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleDeleteSingle = (id: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return

    startTransition(async () => {
      const res = await deleteSingleOrder(id)
      if (res.success) {
        setSelectedIds((prev) => prev.filter((item) => item !== id))
      } else {
        alert(res.error)
      }
    })
  }

  const handleDeleteBatch = () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected order(s) permanently?`)) return

    startTransition(async () => {
      const res = await deleteBatchOrders(selectedIds)
      if (res.success) {
        setSelectedIds([])
      } else {
        alert(res.error)
      }
    })
  }

  const allSelected = orders.length > 0 && selectedIds.length === orders.length

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-amber-500" /> Direct Orders ({orders.length})
        </h2>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
            <span className="text-xs font-bold text-rose-800">
              {selectedIds.length} order(s) selected
            </span>
            <button
              onClick={handleDeleteBatch}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isPending ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center text-xs text-gray-500 font-medium">
          No orders found matching your search and filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Account</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {orders.map((order) => {
                const isB2B = order.user?.role === "B2B"
                const isGuest = !order.userId
                const isChecked = selectedIds.includes(order.id)

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50/50 transition ${isChecked ? "bg-amber-50/40" : ""}`}
                  >
                    <td className="py-4 px-4 align-top">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(order.id, e.target.checked)}
                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 h-4 w-4 cursor-pointer mt-1"
                      />
                    </td>

                    <td className="py-4 px-4 align-top">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-amber-600 hover:underline"
                      >
                        #{order.id.slice(-8)}
                      </Link>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900">
                          {order.customerName || order.user?.name || "Guest Customer"}
                        </p>
                        {isB2B && (
                          <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-200">
                            B2B
                          </span>
                        )}
                        {isGuest && (
                          <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
                            Guest
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500">
                        {order.customerEmail || order.user?.email}
                      </p>

                      {isB2B && order.user?.companyName && (
                        <p className="text-[10px] text-purple-700 font-medium mt-0.5 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {order.user.companyName}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-[11px] flex items-center gap-1.5">
                            <span className="font-bold text-gray-900">{item.quantity}x</span>
                            <span className="text-gray-700 font-medium truncate max-w-45">
                              {item.product.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top font-bold text-gray-900">
                      PKR {order.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>

                    <td className="py-4 px-4 align-top text-right space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-amber-600 transition"
                      >
                        Inspect <ChevronRight className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteSingle(order.id)}
                        disabled={isPending}
                        title="Delete order"
                        className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}