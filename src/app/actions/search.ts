"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

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

export async function searchProducts(filters: SearchFilters) {
  const {
    query,
    categoryId,
    applicationAreaId,
    status,
    page = 1,
    limit = 12,
  } = filters

  const skip = (page - 1) * limit

  try {
    const whereClause: Prisma.ProductWhereInput = {
      isArchived: false,
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    if (status) {
      whereClause.status = status as Prisma.EnumProductStatusFilter
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
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ])

    return {
      success: true,
      products,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    }
  } catch (error) {
    console.error("[SEARCH_PRODUCTS_ERROR]", error)
    return { success: false, error: "Failed to fetch products", products: [], pagination: null }
  }
}