import Link from "next/link"
import { notFound } from "next/navigation"
import { getCustomerOrderDetail } from "@/app/actions/customer-orders"
import { CancelOrderButton } from "./cancel-order-button"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Package,
} from "lucide-react"

type Props = {
  params: Promise<{ id: string }>
}

export default async function CustomerOrderDetailPage({ params }: Props) {
  const { id } = await params
  const { order, error } = await getCustomerOrderDetail(id)

  if (!order || error) {
    notFound()
  }

  // Cast order as a generic record to safely read new migration fields (subtotal/shippingFee)
  const orderRecord = order as Record<string, unknown>

  const orderSubtotal =
    orderRecord.subtotal !== undefined && orderRecord.subtotal !== null
      ? Number(orderRecord.subtotal)
      : order.items.reduce(
          (sum, item) => sum + Number(item.unitPrice) * item.quantity,
          0
        )

  const shippingFee =
    orderRecord.shippingFee !== undefined && orderRecord.shippingFee !== null
      ? Number(orderRecord.shippingFee)
      : Number(order.totalAmount) - orderSubtotal

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      {/* Back Button */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-gray-900 font-mono">
              Order #{order.id}
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-PK", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <CancelOrderButton orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content: Line Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="h-4 w-4 text-amber-500" /> Items Summary
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const itemSubtotal = Number(item.unitPrice) * item.quantity
                return (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        SKU: {item.product.sku} | Pack: {item.product.packSize || "N/A"}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {item.quantity} x PKR {Number(item.unitPrice).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      PKR {itemSubtotal.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Totals Ledger */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span>PKR {orderSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee:</span>
                <span>
                  {shippingFee === 0
                    ? "FREE (PKR 0)"
                    : `PKR ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Amount:</span>
                <span className="text-amber-600">
                  PKR {Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Delivery Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package className="h-4 w-4 text-amber-500" /> Shipping Details
            </h2>

            <div className="space-y-3 text-xs">
              {order.shippingAddress && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Delivery Address
                  </p>
                  <p className="font-medium text-gray-800 flex items-start gap-1.5 mt-0.5 leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    {order.shippingAddress}
                  </p>
                </div>
              )}

              {order.notes && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Order Notes
                  </p>
                  <p className="font-medium text-gray-700 flex items-start gap-1.5 mt-0.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                    <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    &quot;{order.notes}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}