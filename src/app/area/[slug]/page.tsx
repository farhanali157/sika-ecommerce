import { notFound } from "next/navigation"
import Link from "next/link"
import { Shield, ArrowRight, PackageCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { serializeDecimals } from "@/lib/serialize"
import { STOREFRONT_PRODUCT_FILTER } from "@/lib/product-queries"

type AreaPageProps = {
  params: Promise<{ slug: string }>
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { slug } = await params
  const session = await auth()
  
  // PATCH: Added SUPER_ADMIN to B2B visibility
  const isB2B = session?.user?.role === "B2B" || session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

  let area = null
  try {
    const rawArea = await prisma.applicationArea.findUnique({
      where: { slug },
      include: {
        products: {
          where: STOREFRONT_PRODUCT_FILTER,
          include: {
            category: true,
            tieredPrices: {
              orderBy: { minQty: "asc" },
            },
          },
        },
      },
    })

    if (rawArea) {
      area = serializeDecimals(rawArea)
    }
  } catch (error) {
    console.error("Error fetching application area:", error)
    throw error
  }

  if (!area) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-neutral-900 text-white rounded-2xl p-8 mb-10 shadow-sm border border-neutral-800">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">
          <Shield className="h-4 w-4" /> Application Area
        </div>
        <h1 className="text-3xl font-black tracking-tight">{area.name}</h1>
        {area.description && (
          <p className="mt-2 text-neutral-400 text-sm max-w-2xl">{area.description}</p>
        )}
      </div>

      {/* Product Grid */}
      {area.products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <PackageCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold text-lg">No products found in this application area.</p>
          <p className="text-gray-400 text-sm mt-1">Check back later or explore other categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {area.products.map((product) => {
            const basePrice = product.tieredPrices[0]?.price ?? 0
            const maxDiscountPrice = product.tieredPrices[product.tieredPrices.length - 1]?.price ?? null

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase">
                      {product.category.name}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{product.sku}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition">
                    <Link href={`/product/${product.slug}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-2">Pack: {product.packSize}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Starting from</p>
                    <p className="text-lg font-black text-gray-900">
                      PKR {basePrice.toLocaleString()}
                    </p>
                    {isB2B && maxDiscountPrice !== null && maxDiscountPrice < basePrice && (
                      <p className="text-[11px] font-bold text-emerald-600">
                        B2B Tiered: As low as PKR {maxDiscountPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black px-3 py-2 rounded-lg transition"
                  >
                    View <ArrowRight className="h-3.5 w-3.5" />
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