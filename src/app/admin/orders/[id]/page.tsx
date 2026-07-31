import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/actions/admin-orders";
import { serializeDecimals } from "@/lib/serialize";
import { OrderStatusSelect } from "../order-status-select";
import { EditOrderModal } from "./edit-order-modal";
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const rawOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          companyName: true,
          ntnNumber: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              packSize: true,
            },
          },
        },
      },
    },
  });

  if (!rawOrder) {
    notFound();
  }

  const order = serializeDecimals(rawOrder);

  const isB2B = order.user?.role === "B2B";
  const isLocked =
    order.status === "DISPATCHED" ||
    order.status === "DELIVERED" ||
    order.status === "CANCELLED";

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Order Management
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-gray-900 font-mono">
              Order #{order.id}
            </h1>
            {isB2B && (
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                B2B Wholesale
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Placed on{" "}
            {new Date(String(order.createdAt)).toLocaleString("en-PK", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Edit Order Modal Trigger */}
          <EditOrderModal
            orderId={order.id}
            customerName={
              order.customerName || order.user?.name || "Guest Customer"
            }
            customerEmail={order.customerEmail || order.user?.email || ""}
            customerPhone={order.customerPhone || ""}
            shippingAddress={order.shippingAddress || ""}
            notes={order.notes || ""}
            isLocked={isLocked}
            initialItems={order.items.map((item) => ({
              id: item.id,
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }))}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">
              Fulfillment Status:
            </span>
            <OrderStatusSelect
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content: Line Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="h-4 w-4 text-amber-500" /> Itemized Order Snapshot
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const subtotal = item.unitPrice * item.quantity;
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
                        SKU: {item.product.sku} | Pack:{" "}
                        {item.product.packSize || "N/A"}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {item.quantity} x PKR{" "}
                        {item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      PKR {subtotal.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Subtotal & Delivery Ledger */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee:</span>
                <span>
                  {order.totalAmount > 50000
                    ? "FREE (PKR 0)"
                    : "PKR 1,500"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-2">
                <span>Grand Total:</span>
                <span className="text-amber-600">
                  PKR {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="h-4 w-4 text-amber-500" /> Customer Information
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Customer Name
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  {order.customerName || order.user?.name || "Guest Customer"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Email Address
                </p>
                <p className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {order.customerEmail || order.user?.email}
                </p>
              </div>

              {order.customerPhone && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {order.customerPhone}
                  </p>
                </div>
              )}

              {/* B2B Metadata if applicable */}
              {isB2B && order.user && (
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 space-y-1.5 mt-2">
                  <p className="text-[10px] uppercase font-bold text-purple-700 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> B2B Account Details
                  </p>
                  <p className="text-[11px] font-bold text-purple-900">
                    {order.user.companyName}
                  </p>
                  <p className="text-[10px] font-mono text-purple-700">
                    NTN: {order.user.ntnNumber}
                  </p>
                </div>
              )}

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
  );
}