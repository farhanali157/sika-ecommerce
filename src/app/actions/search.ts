"use server"

import { prisma } from "@/lib/prisma"
import { Prisma, ProductStatus } from "@prisma/client"
import { STOREFRONT_PRODUCT_FILTER } from "@/lib/product-queries"

export type SearchFilters = {
  query?: string
  categoryId?: string
  applicationAreaId?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

const MAX_LIMIT = 50

export async function searchProducts(filters: SearchFilters) {
  const {
    query,
    categoryId,
    applicationAreaId,
    status,
    page = 1,
    limit = 12,
  } = filters

  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT)
  const skip = (page - 1) * safeLimit

  try {
    // Reuse the same filter every other storefront page uses, so search
    // results never include products that are archived or discontinued —
    // a product hidden from browsing shouldn't still be findable by name.
    const whereClause: Prisma.ProductWhereInput = { ...STOREFRONT_PRODUCT_FILTER }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    if (status && Object.values(ProductStatus).includes(status as ProductStatus)) {
      whereClause.status = status as ProductStatus
    }

    if (applicationAreaId) {
      whereClause.applicationAreas = {
        some: { id: applicationAreaId },
      }
    }

    if (query && query.trim() !== "") {
      const searchTerm = query.trim()
      whereClause.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { sku: { contains: searchTerm, mode: "insensitive" } },
      ]
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: { select: { name: true, slug: true } },
          applicationAreas: { select: { name: true, slug: true } },
          tieredPrices: { orderBy: { minQty: "asc" } },
        },
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ])

    return {
      success: true,
      products,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / safeLimit),
        currentPage: page,
        limit: safeLimit,
      },
    }
  } catch (error) {
    console.error("[SEARCH_PRODUCTS_ERROR]", error)
    return { success: false, error: "Failed to fetch products", products: [], pagination: null }
  }
}