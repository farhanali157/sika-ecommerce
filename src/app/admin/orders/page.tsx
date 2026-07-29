import { getAdminOrders } from "@/app/actions/admin-orders";
import { OrderStatusSelect } from "./order-status-select";
import { Package, ShoppingBag, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { success, orders, error } = await getAdminOrders();

  if (!success) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-semibold">
          {error || "Access denied or failed to load orders."}
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalOrders = orders.length;
  const pendingCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING",
  ).length;
  const totalRevenue = orders.reduce(
    (acc, o) => acc + Number(o.totalAmount),
    0,
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Order Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review direct fulfillment orders, inspect line items, and manage
          shipping stages.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Total Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {totalOrders}
            </p>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">
              Active / Pending
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Total Revenue</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              PKR {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-amber-500" /> Recent Direct
            Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 font-medium">
            No orders found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items Ordered</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">Status & Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 align-top">
                      <p className="font-mono font-bold text-gray-900">
                        {order.id.slice(-8)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top max-w-xs">
                      <p className="font-bold text-gray-900">
                        {order.customerName ||
                          order.user?.name ||
                          "Guest Customer"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {order.customerEmail || order.user?.email}
                      </p>
                      {order.customerPhone && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {order.customerPhone}
                        </p>
                      )}
                      {order.shippingAddress && (
                        <p className="text-[10px] text-gray-500 mt-1 italic truncate">
                          {order.shippingAddress}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="text-[11px] flex items-center gap-1.5"
                          >
                            <span className="font-bold text-gray-900">
                              {item.quantity}x
                            </span>
                            <span className="text-gray-700 font-medium truncate max-w-45">
                              {" "}
                              {item.product.name}
                            </span>
                            <span className="text-gray-400 text-[10px]">
                              (@ PKR {Number(item.unitPrice).toLocaleString()})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top font-bold text-gray-900">
                      PKR {Number(order.totalAmount).toLocaleString()}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
