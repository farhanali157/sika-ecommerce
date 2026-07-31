import Link from "next/link"
import { getCustomerOrders } from "@/app/actions/customer-orders"
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react"

const STATUS_COLOR_MAP: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  DISPATCHED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
}

export default async function AccountOrdersPage() {
  const { orders, error } = await getCustomerOrders()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Your Order History</h1>
          <p className="text-xs text-gray-500 mt-1">
            View tracking details and order receipts for your past purchases.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {!orders || orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">No orders placed yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Explore our industrial product catalog and place your first order.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const badgeStyle =
              STATUS_COLOR_MAP[order.status] || "bg-gray-50 text-gray-700 border-gray-200"
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      dateStyle: "medium",
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="text-gray-500 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </p>
                    <p className="text-gray-900 font-bold">
                      PKR {Number(order.totalAmount).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition"
                  >
                    View Details <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}