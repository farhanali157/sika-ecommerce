import { prisma } from "@/lib/prisma"
import { serializeDecimals } from "@/lib/serialize"
import { STOREFRONT_PRODUCT_FILTER } from "@/lib/product-queries"
import { ProductCatalogClient } from "./product-catalog-client"
import { Prisma } from "@prisma/client"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const searchQuery = typeof resolvedParams.q === "string" ? resolvedParams.q.trim() : undefined
  const selectedCategory = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined
  const selectedArea = typeof resolvedParams.area === "string" ? resolvedParams.area : undefined

  // Build Prisma where clause combining storefront filters + optional search/category query
  const whereClause: Prisma.ProductWhereInput = {
    AND: [
      STOREFRONT_PRODUCT_FILTER,
      ...(searchQuery
        ? [
            {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" as Prisma.QueryMode } },
                { description: { contains: searchQuery, mode: "insensitive" as Prisma.QueryMode } },
                { sku: { contains: searchQuery, mode: "insensitive" as Prisma.QueryMode } },
              ],
            },
          ]
        : []),
      ...(selectedCategory ? [{ category: { slug: selectedCategory } }] : []),
      ...(selectedArea ? [{ applicationAreas: { some: { slug: selectedArea } } }] : []),
    ],
  }

  const [rawProducts, categories, applicationAreas] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
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
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    }),
    prisma.applicationArea.findMany({
      select: { id: true, name: true, slug: true },
    }),
  ])

  // Safely convert all Prisma Decimals to JavaScript numbers
  const products = serializeDecimals(rawProducts)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Sika® Construction Solutions"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {searchQuery
              ? `Found ${products.length} matching product(s) in our catalog.`
              : "Browse our complete catalog of professional waterproofing, concrete repair, tile adhesives, and structural mortars."}
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