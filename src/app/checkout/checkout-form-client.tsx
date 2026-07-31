"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, ShieldCheck, Loader2, AlertCircle } from "lucide-react"
import { createOrder } from "@/app/actions/checkout"

type CartItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

type CheckoutFormClientProps = {
  initialCart: {
    items: CartItem[]
    subtotal: number
    totalItems: number
  }
}

export function CheckoutFormClient({ initialCart }: CheckoutFormClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: string
    city: "Lahore" | "Karachi" | "Islamabad" | "Rawalpindi" | "Faisalabad" | "Multan"
    ntnNumber?: string
    notes?: string
  }>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "Lahore",
    ntnNumber: "",
    notes: "",
  })

  // If initialCart is empty on render, show empty state with link back to shop
  if (!initialCart || initialCart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-sm text-gray-600">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-black bg-amber-500 hover:bg-amber-600 transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createOrder(formData)

      if (result.success && result.orderId) {
        router.push(`/order/success?orderId=${result.orderId}`)
      } else {
        setError(result.error || "An unexpected error occurred.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-amber-600 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
          Checkout & Delivery Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Delivery Details Form */}
          <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-600" /> Dispatch & Shipping Info
            </h2>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name / Business Name *
                </label>
                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  required
                  autoComplete="name"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Ali Khan / ABC Builders Ltd."
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerEmail" className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    name="customerEmail"
                    required
                    autoComplete="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    name="customerPhone"
                    required
                    autoComplete="tel"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="shippingAddress" className="block text-xs font-bold text-gray-700 mb-1">
                    Site / Delivery Address *
                  </label>
                  <input
                    id="shippingAddress"
                    type="text"
                    name="shippingAddress"
                    required
                    autoComplete="street-address"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="Plot #, Street, Commercial Area"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-gray-700 mb-1">
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>
              </div>

              {/* B2B NTN Tax Number Input */}
              <div>
                <label htmlFor="ntnNumber" className="block text-xs font-bold text-gray-700 mb-1">
                  NTN / Business Tax Number (Optional for B2B Invoicing)
                </label>
                <input
                  id="ntnNumber"
                  type="text"
                  name="ntnNumber"
                  autoComplete="off"
                  value={formData.ntnNumber}
                  onChange={handleChange}
                  placeholder="e.g. 1234567-8"
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-bold text-gray-700 mb-1">
                  Special Delivery Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call before arrival, gate access details..."
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-black bg-amber-500 hover:bg-amber-600 py-3.5 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Place Order (Cash / Bank Transfer on Invoice)
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Guarantee Panel & Order Summary */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">
                Order Summary ({initialCart.totalItems} Items)
              </h3>
              <div className="flex justify-between text-sm font-semibold">
                <span>Subtotal</span>
                <span>PKR {initialCart.subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-amber-900">Official Direct Dispatch</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Orders are processed directly through Sika Pakistan’s verified distribution centers. Technical Datasheets (TDS) and GST Tax Invoices are provided with every delivery.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}