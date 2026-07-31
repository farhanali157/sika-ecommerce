import Link from "next/link"
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react"
import { getCart } from "@/app/actions/cart"
import { CartItemRow } from "@/app/cart/cart-item-row"
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing-constants"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Shopping Cart | Sika Pakistan",
  description: "Review your selected items and B2B volume tier pricing before checkout.",
}

export default async function CartPage() {
  const cart = await getCart()

  const shippingFee = calculateShippingFee(cart.subtotal)
  const grandTotal = cart.subtotal + shippingFee

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-amber-600 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-amber-600" />
          Shopping Cart ({cart.totalItems} {cart.totalItems === 1 ? "Item" : "Items"})
        </h1>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">Your cart is currently empty</h2>
            <p className="text-xs text-gray-500">
              Browse our catalog of high-performance construction chemical solutions to add items.
            </p>
            <Link
              href="/"
              className="inline-block text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-xl transition shadow-sm"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total Price</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Guarantees / Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200/80 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">100% Genuine</p>
                    <p className="text-[11px] text-gray-500">Official Sika® Products</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200/80 flex items-center gap-3">
                  <Truck className="h-6 w-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Direct Delivery</p>
                    <p className="text-[11px] text-gray-500">Nationwide Shipping</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200/80 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Secure Checkout</p>
                    <p className="text-[11px] text-gray-500">B2B & Retail Invoicing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24 space-y-6">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span className="font-mono font-semibold text-gray-900">
                      PKR {cart.subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span>Estimated Freight / Shipping</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `PKR ${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  {cart.subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      Add PKR {(FREE_SHIPPING_THRESHOLD - cart.subtotal).toLocaleString()} more to qualify for Free Shipping!
                    </p>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Sales Tax (18% GST)</span>
                    <span className="text-gray-500 italic">Itemized on GST Invoice</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">Estimated Grand Total</span>
                    <span className="text-xl font-black text-gray-900">
                      PKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 py-3.5 rounded-xl transition shadow-sm"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="text-[11px] text-center text-gray-400">
                  Prices verified against Sika Pakistan B2B volume pricing policy.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}