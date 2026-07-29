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

export type EditOrderInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  notes?: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
}

export async function getAdminOrders(filters: AdminOrderFilters = {}) {
  try {
    await requireAdmin()

    const { status, search, customerType, dateRange } = filters
    const where: Prisma.OrderWhereInput = {}

    // 1. Status Filter
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus
    }

    // 2. Customer Type Filter
    if (customerType === "GUEST") {
      where.userId = null
    } else if (customerType === "B2B") {
      where.user = { role: Role.B2B }
    } else if (customerType === "RETAIL") {
      where.user = { role: Role.CUSTOMER }
    }

    // 3. Date Range Filter (Fixed: Immutable date calculations)
    if (dateRange) {
      const now = new Date()
      if (dateRange === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        where.createdAt = { gte: startOfDay }
      } else if (dateRange === "7days") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        where.createdAt = { gte: sevenDaysAgo }
      } else if (dateRange === "30days") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        where.createdAt = { gte: thirtyDaysAgo }
      }
    }

    // 4. Global Search Query (Order ID, Name, Email, or Phone)
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

export async function updateAdminOrderDetails(orderId: string, input: EditOrderInput) {
  try {
    await requireAdmin()

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!existingOrder) {
      return { success: false, error: "Order not found." }
    }

    if (existingOrder.status === "DISPATCHED" || existingOrder.status === "DELIVERED" || existingOrder.status === "CANCELLED") {
      return { success: false, error: `Orders in ${existingOrder.status} state cannot be edited.` }
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "An order must contain at least one item." }
    }

    const itemsSubtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const shippingFee = itemsSubtotal > 50000 ? 0 : 1500
    const newGrandTotal = itemsSubtotal + shippingFee

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId },
      })

      await tx.order.update({
        where: { id: orderId },
        data: {
          customerName: input.customerName,
          customerEmail: input.customerEmail.toLowerCase().trim(),
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          notes: input.notes,
          totalAmount: newGrandTotal,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      })
    })

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)

    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order details."
    return { success: false, error: message }
  }
}