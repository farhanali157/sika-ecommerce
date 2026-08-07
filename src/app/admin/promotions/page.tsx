import { prisma } from "@/lib/prisma"
import { StorewideDiscountController } from "../components/storewide-discount-controller"
import { Tag } from "lucide-react"

export default async function AdminPromotionsPage() {
  const settings = await prisma.storeSetting.findFirst().catch(() => null)

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-3">
            <Tag className="h-8 w-8 text-amber-500" />
            Promotions & Marketing Control Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage storewide discount campaigns, pricing sales, and the live scrolling announcement marquee.
          </p>
        </div>

        <StorewideDiscountController initialSettings={settings} />
      </div>
    </div>
  )
}