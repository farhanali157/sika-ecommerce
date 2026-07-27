import Link from "next/link"
import { ArrowRight, ShieldCheck, Truck, Wrench, Package } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  let categories: any[] = []
  let featuredProducts: any[] = []
  let isDbOffline = false

  try {
    categories = await prisma.category.findMany({
      take: 4,
    })

    featuredProducts = await prisma.product.findMany({
      take: 6,
      include: {
        tieredPrices: {
          orderBy: { minQty: "asc" },
        },
      },
    })
  } catch (error) {
    console.error("[Homepage] Database fetch degraded:", error)
    isDbOffline = true
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* 1. HERO BANNER */}
      <section className="relative bg-neutral-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-amber-500 text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              Official Sika Online Store
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              BUILDING TRUST WITH <span className="text-amber-500">SIKA SOLUTIONS</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              Explore high-performance sealants, adhesives, waterproofing, and concrete repair systems directly from the manufacturer.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/category/waterproofing"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-md transition flex items-center gap-2"
              >
                Shop Products <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 w-full rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500 font-bold">
            [ Sika Hero Promotional Banner ]
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="bg-amber-500 text-black py-4 border-b border-amber-600">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm font-bold">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5" /> 100% Authentic Sika Products
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="h-5 w-5" /> Nationwide Delivery & Distribution
          </div>
          <div className="flex items-center justify-center gap-2">
            <Wrench className="h-5 w-5" /> Technical Datasheets (TDS/SDS) Included
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS BY APPLICATION AREA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
              Products By Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">Select your application area</p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition text-center flex flex-col items-center justify-center hover:border-amber-500"
              >
                <div className="h-16 w-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-black transition">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm bg-white">
            {isDbOffline
              ? "Product categories are temporarily unavailable. Please check back shortly."
              : "No categories currently available."}
          </div>
        )}
      </section>

      {/* 4. BEST SELLERS / FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Top Rated Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              BEST SELLERS
            </h2>
          </div>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const retailPrice =
                product.tieredPrices.find((p: any) => p.minQty === 1)?.price || 0

              return (
                <div
                  key={product.id}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400 mb-4 border border-gray-100">
                      [ {product.name} ]
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {product.packSize}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-amber-600 transition">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Retail Price</span>
                      <span className="text-lg font-black text-gray-900">
                        Rs. {retailPrice.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm bg-gray-50">
            {isDbOffline
              ? "Featured catalog currently re-connecting. Browse our direct product categories above."
              : "No featured products listed."}
          </div>
        )}
      </section>
    </div>
  )
}