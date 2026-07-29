"use client"

import { useState, useTransition } from "react"
import { updateAdminOrderDetails } from "@/app/actions/admin-orders"
import { Edit3, X, Trash2, Save } from "lucide-react"

type OrderItemData = {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

type Props = {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  notes?: string
  initialItems: OrderItemData[]
  isLocked: boolean
}

export function EditOrderModal({
  orderId,
  customerName: initName,
  customerEmail: initEmail,
  customerPhone: initPhone,
  shippingAddress: initAddress,
  notes: initNotes,
  initialItems,
  isLocked,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [customerName, setCustomerName] = useState(initName)
  const [customerEmail, setCustomerEmail] = useState(initEmail)
  const [customerPhone, setCustomerPhone] = useState(initPhone)
  const [shippingAddress, setShippingAddress] = useState(initAddress)
  const [notes, setNotes] = useState(initNotes || "")
  const [items, setItems] = useState<OrderItemData[]>(initialItems)

  if (isLocked) {
    return (
      <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
        Order Locked
      </span>
    )
  }

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty < 1) return
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)))
  }

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setError("An order must have at least one product.")
      return
    }
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await updateAdminOrderDetails(orderId, {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        notes,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      })

      if (res.success) {
        setIsOpen(false)
      } else {
        setError(res.error || "Failed to update order.")
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
      >
        <Edit3 className="h-3.5 w-3.5" /> Edit Order Details
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-gray-900">Edit Order #{orderId.slice(-8)}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Customer Contact Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customer & Delivery Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Shipping Address</label>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-700">Order Notes / Delivery Instructions</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, gate clearance required..."
                      className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Items & Quantities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Modify Items & Quantities
                </h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-gray-900">{item.productName}</p>
                        <p className="text-[10px] text-gray-400">
                          Unit Price: PKR {item.unitPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 font-bold text-gray-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-gray-900 min-w-20 text-right">
                          PKR {(item.quantity * item.unitPrice).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" /> {isPending ? "Saving Changes..." : "Save Order Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}