"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { OrderStatus, Role, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.")
  }
  return session
}

export type AdminOrderFilters = {
  status?: string
  search?: string
  customerType?: string // 'RETAIL' | 'B2B' | 'GUEST'
  dateRange?: string    // 'today' | '7days' | '30days'
}

export async function getAdminOrders(filters: AdminOrderFilters = {}) {
  try {
    await requireAdmin()

    const { status, search, customerType, dateRange } = filters

    // 1. Build dynamic Prisma 'where' clause
    const where: Prisma.OrderWhereInput = {}

    // Status Filter
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus
    }

    // Customer Type Filter
    if (customerType === "GUEST") {
      where.userId = null
    } else if (customerType === "B2B") {
      where.user = { role: Role.B2B }
    } else if (customerType === "RETAIL") {
      where.user = { role: Role.CUSTOMER }
    }

    // Date Range Filter
    if (dateRange) {
      const now = new Date()
      if (dateRange === "today") {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0))
        where.createdAt = { gte: startOfDay }
      } else if (dateRange === "7days") {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
        where.createdAt = { gte: sevenDaysAgo }
      } else if (dateRange === "30days") {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
        where.createdAt = { gte: thirtyDaysAgo }
      }
    }

    // Global Search Query (Matches Order ID, Name, Email, or Phone)
    if (search && search.trim() !== "") {
      const q = search.trim()
      where.OR = [
        { id: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerEmail: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            companyName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    })

    return { success: true, orders }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders"
    return { success: false, error: message, orders: [] }
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    await requireAdmin()

    if (!Object.values(OrderStatus).includes(newStatus)) {
      return { success: false, error: "Invalid order status." }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true, status: updatedOrder.status }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order status"
    return { success: false, error: message }
  }
}