"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Trash2, AlertCircle } from "lucide-react"
import { updateCartItemQuantity, removeFromCart } from "@/app/actions/cart"
import { useRouter } from "next/navigation"

type CartItemProps = {
  item: {
    id: string
    productId: string
    productName: string
    productSlug: string
    quantity: number
    unitPrice: number
    totalPrice: number
    appliedTier: number | null
  }
}

export function CartItemRow({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleQuantityChange = (newQty: number) => {
    setError(null)
    startTransition(async () => {
      const res = await updateCartItemQuantity(item.id, newQty)
      if (!res.success) {
        setError(res.error || "Failed to update quantity")
      } else {
        router.refresh()
      }
    })
  }

  const handleRemove = () => {
    setError(null)
    startTransition(async () => {
      const res = await removeFromCart(item.id)
      if (!res.success) {
        setError(res.error || "Failed to remove item")
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
        
        {/* Product Title & Badges */}
        <div className="sm:col-span-6 space-y-1">
          <Link
            href={`/product/${item.productSlug}`}
            className="text-sm font-bold text-gray-900 hover:text-amber-600 transition"
          >
            {item.productName}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              PKR {item.unitPrice.toLocaleString()} / unit
            </span>
            {item.appliedTier && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                B2B Tier ({item.appliedTier}+ Qty)
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="sm:col-span-3 flex items-center justify-start sm:justify-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
            <button
              disabled={isPending}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>
            <span className="px-3 text-xs font-mono font-bold text-gray-900">
              {item.quantity}
            </span>
            <button
              disabled={isPending}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <button
            disabled={isPending}
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-600 transition p-1 disabled:opacity-50"
            title="Remove Item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Total Price */}
        <div className="sm:col-span-3 text-left sm:text-right">
          <span className="text-sm font-black text-gray-900">
            PKR {item.totalPrice.toLocaleString()}
          </span>
        </div>

      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}