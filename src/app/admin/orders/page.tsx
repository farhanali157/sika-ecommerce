import { getAdminOrders } from "@/app/actions/admin-orders"
import { serializeDecimals } from "@/lib/serialize"
import { AdminOrderFilters } from "./admin-order-filters"
import { OrdersTableClient } from "./orders-table-client"
import { Package, Clock, CheckCircle2 } from "lucide-react"

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
  const pendingCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING"
  ).length
  const totalRevenue = orders.reduce(
    (acc, o) => acc + Number(o.totalAmount || 0),
    0
  )

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Order Management
        </h1>
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

      {/* Interactive Table with Single & Batch Deletion */}
      <OrdersTableClient orders={orders} />
    </div>
  )
}