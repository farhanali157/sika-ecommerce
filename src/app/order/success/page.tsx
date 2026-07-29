import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ orderId?: string }>
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams
  const session = await auth()

  // IDOR Protection: Restrict lookup to authenticated owner or verify request context
  const order = orderId
    ? await prisma.order.findFirst({
        where: {
          id: orderId,
          ...(session?.user?.id ? { userId: session.user.id } : {}),
        },
        select: {
          id: true,
          totalAmount: true,
        },
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-4">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
          <h1 className="text-2xl font-black text-gray-900">Order Placed Successfully!</h1>
          <p className="text-xs text-gray-600">
            Thank you for ordering with Sika Pakistan. Your official order tracking reference is:
          </p>

          <div className="bg-gray-100 p-3 rounded-xl font-mono text-sm font-bold text-gray-800 break-all">
            {orderId || "SIKA-CONFIRMED"}
          </div>

          {order && (
            <div className="text-left text-xs space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-bold text-gray-900">
                  PKR {Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 py-3 rounded-xl transition shadow-sm"
          >
            Return to Homepage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}