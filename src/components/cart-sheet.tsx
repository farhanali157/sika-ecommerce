"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { ShoppingBag, X, Trash2, ArrowRight } from "lucide-react"
import { getCart, updateCartItemQuantity, removeFromCart } from "@/app/actions/cart"

type CartData = {
  items: {
    id: string
    productId: string
    productName: string
    productSlug: string
    quantity: number
    unitPrice: number
    totalPrice: number
    appliedTier: number | null
  }[]
  subtotal: number
  totalItems: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: Props) {
  const [cart, setCart] = useState<CartData>({ items: [], subtotal: 0, totalItems: 0 })
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isOpen) return

    let isSubscribed = true

    getCart()
      .then((data) => {
        if (isSubscribed) {
          setCart(data)
        }
      })
      .catch((err) => {
        console.error("Failed to load cart data:", err)
      })

    return () => {
      isSubscribed = false
    }
  }, [isOpen])

  const handleQuantityChange = (cartItemId: string, newQty: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(cartItemId, newQty)
      const data = await getCart()
      setCart(data)
    })
  }

  const handleRemove = (cartItemId: string) => {
    startTransition(async () => {
      await removeFromCart(cartItemId)
      const data = await getCart()
      setCart(data)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {cart.totalItems}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-12 text-gray-500 space-y-3">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold">Your cart is currently empty</p>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.productSlug}`}
                      onClick={onClose}
                      className="text-sm font-bold text-gray-900 hover:text-amber-600 transition line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-gray-500">
                      PKR {item.unitPrice.toLocaleString()} / unit
                    </p>
                    {item.appliedTier && (
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        B2B Tier ({item.appliedTier}+ Qty)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button
                        disabled={isPending}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        disabled={isPending}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      disabled={isPending}
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-600 transition p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Subtotal
                </span>
                <span className="text-xl font-black text-gray-900">
                  PKR {cart.subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Taxes and shipping calculated at checkout.
              </p>

              <Link
                href="/cart"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 py-3 rounded-xl transition shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}