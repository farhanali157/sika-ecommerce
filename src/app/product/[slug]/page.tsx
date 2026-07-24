import { notFound } from "next/navigation"
import { FileText, ShieldAlert, Lock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()
  const userRole = (session?.user as any)?.role
  let product

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        tieredPrices: {
          orderBy: { minQty: "asc" },
        },
      },
    })
  } catch (error) {
    console.error("Database query failed on ProductDetailPage:", error)
    // Rethrow DB error so Next.js error.tsx handles it gracefully as a 500
    throw error
  }

  // Explicit 404 if product not found
  if (!product) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
          [ {product.name} Image ]
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku} | Pack Size: {product.packSize}</p>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* B2B Tiered Pricing Section */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Bulk & B2B Volume Pricing:</h3>
            {userRole === "B2B" || userRole === "ADMIN" ? (
              <div className="space-y-2">
                {product.tieredPrices.map((tier) => (
                  <div key={tier.id} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                    <span className="text-gray-600">Buy {tier.minQty}+ units</span>
                    <span className="font-bold text-gray-900">Rs. {tier.price.toLocaleString()} / unit</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Log in with a verified <strong>B2B Account</strong> to unlock bulk contractor pricing.</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            {product.tdsUrl && (
              <a
                href={product.tdsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-100"
              >
                <FileText className="h-4 w-4" /> Technical Data Sheet (TDS)
              </a>
            )}
            {product.sdsUrl && (
              <a
                href={product.sdsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200"
              >
                <ShieldAlert className="h-4 w-4" /> Safety Data Sheet (SDS)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}