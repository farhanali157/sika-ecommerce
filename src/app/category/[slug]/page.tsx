import { notFound } from "next/navigation"
import Link from "next/link"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

type Props = {
  params: Promise<{ slug: string }>
}

type TieredPriceSummary = {
  id: string
  minQty: number
  price: number | Prisma.Decimal
}

type CategoryProduct = {
  id: string
  name: string
  slug: string
  description: string
  packSize: string
  tieredPrices: TieredPriceSummary[]
}

type CategoryPageData = {
  id: string
  name: string
  description: string | null
  products: CategoryProduct[]
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  let category: CategoryPageData | null = null

  try {
    category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            packSize: true,
            tieredPrices: {
              orderBy: { minQty: "asc" },
              select: {
                id: true,
                minQty: true,
                price: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Database query failed on CategoryPage:", error)
    throw error
  }

  if (!category) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex text-xs font-medium text-gray-500 mb-6 gap-2 items-center">
        <Link href="/" className="hover:text-amber-600 transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.products.map((product) => {
          const rawPrice = product.tieredPrices[0]?.price ?? 0
          const basePrice = typeof rawPrice === "number" ? rawPrice : Number(rawPrice)

          return (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-amber-400 transition"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-3">Pack Size: {product.packSize}</p>
                <p className="text-xs text-gray-600 line-clamp-3 mb-4">{product.description}</p>
              </div>

              <div>
                <div className="border-t border-gray-100 pt-3 mb-4 flex justify-between items-baseline">
                  <span className="text-xs text-gray-500">Retail Price:</span>
                  <span className="text-base font-black text-gray-900">
                    PKR {basePrice.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full text-center text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-500 py-2.5 rounded-lg transition"
                >
                  View Details & Bulk Tiers
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}