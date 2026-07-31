import Link from "next/link"
import { getAdminOrders } from "@/app/actions/admin-orders"
import { serializeDecimals } from "@/lib/serialize"
import { OrderStatusSelect } from "./order-status-select"
import { AdminOrderFilters } from "./admin-order-filters"
import { Package, ShoppingBag, Clock, CheckCircle2, ChevronRight, Building2 } from "lucide-react"
export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{
    status?: string
    search?: string
    customerType?: string
    dateRange?: string
  }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const { success, orders: rawOrders, error } = await getAdminOrders(params)

  if (!success || !rawOrders) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-semibold">
          {error || "Access denied or failed to load orders."}
        </div>
      </div>
    )
  }

  const orders = serializeDecimals(rawOrders)

  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Search, filter, inspect line items, and transition orders through fulfillment stages.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Filtered Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalOrders}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Pending / Active</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">View Total Revenue</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              PKR {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <AdminOrderFilters />

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-amber-500" /> Direct Orders ({orders.length})
          </h2>
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
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & Account</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {orders.map((order) => {
                  const isB2B = order.user?.role === "B2B"
                  const isGuest = !order.userId

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4 align-top">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono font-bold text-amber-600 hover:underline"
                        >
                          #{order.id.slice(-8)}
                        </Link>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(String(order.createdAt)).toLocaleDateString("en-PK", {
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

                      <td className="py-4 px-4 align-top">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-amber-600 transition"
                        >
                          Inspect <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}