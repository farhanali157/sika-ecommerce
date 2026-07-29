"use client"

import { useState, useTransition } from "react"
import { ShoppingCart, Loader2, Check, AlertCircle } from "lucide-react"
import { addToCart } from "@/app/actions/cart"

type Props = {
  productId: string
}

export function AddToCartButton({ productId }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = () => {
    setError(null)
    startTransition(async () => {
      const result = await addToCart(productId, quantity)

      if (result.success) {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      } else {
        setError(result.error || "Failed to add item to cart.")
        setTimeout(() => setError(null), 3000)
      }
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition font-bold disabled:opacity-50"
            disabled={isPending}
          >
            -
          </button>
          <span className="px-4 py-2 text-xs font-mono font-bold text-gray-900 border-x border-gray-200">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition font-bold disabled:opacity-50"
            disabled={isPending}
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 px-6 rounded-xl transition shadow-sm ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-black"
          } disabled:opacity-50`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : added ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Error Message Feedback */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}