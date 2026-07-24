import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  // 1. Database Fetch
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          tieredPrices: true,
        },
      },
    },
  })

  // 2. Explicit 404 if item does not exist in DB
  if (!category) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{category.name}</h1>
        <p className="mt-2 text-sm text-gray-500">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.products.map((product) => {
          const retailPrice = product.tieredPrices.find((p) => p.minQty === 1)?.price || 0

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                [ {product.name} Image ]
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-amber-600">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {product.packSize}
                </span>
                <span className="text-lg font-bold text-amber-600">
                  Rs. {retailPrice.toLocaleString()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}