import { prisma } from "@/lib/prisma"
import { ProductCatalogClient } from "./product-catalog-client"

export default async function ProductsPage() {
  const [rawProducts, categories, applicationAreas] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        packSize: true,
        description: true,
        images: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        applicationAreas: {
          select: { id: true, name: true, slug: true },
        },
        tieredPrices: {
          select: { id: true, minQty: true, price: true },
          orderBy: { minQty: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    }),
    prisma.applicationArea.findMany({
      select: { id: true, name: true, slug: true },
    }),
  ])

  // Convert Prisma Decimal objects inside tieredPrices to standard numbers
  const products = rawProducts.map((product) => ({
    ...product,
    tieredPrices: product.tieredPrices.map((tier) => ({
      ...tier,
      price: Number(tier.price),
    })),
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">
            All Sika® Construction Solutions
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse our complete catalog of professional waterproofing, concrete repair, tile adhesives, and structural mortars.
          </p>
        </div>

        {/* Filter & Grid Interactive Client Component */}
        <ProductCatalogClient
          initialProducts={products}
          categories={categories}
          applicationAreas={applicationAreas}
        />
      </div>
    </div>
  )
}