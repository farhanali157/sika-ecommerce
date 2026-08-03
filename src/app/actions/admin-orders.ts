"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { OrderStatus, Role, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { calculateItemPrice } from "@/lib/cart-engine"

export async function requireAdmin() {
  const session = await auth()
  const role = session?.user?.role

  if (!session?.user || (role !== Role.ADMIN && role !== Role.SUPER_ADMIN)) {
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
  }[]
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
}

export async function getAdminOrders(filters: AdminOrderFilters = {}) {
  try {
    await requireAdmin()

    const { status, search, customerType, dateRange } = filters
    const where: Prisma.OrderWhereInput = {}

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus
    }

    if (customerType === "GUEST") {
      where.userId = null
    } else if (customerType === "B2B") {
      where.user = { role: Role.B2B }
    } else if (customerType === "RETAIL") {
      where.user = { role: Role.CUSTOMER }
    }

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

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      })

      if (!currentOrder) {
        throw new Error("Order not found.")
      }

      if (currentOrder.status === newStatus) {
        return currentOrder
      }

      const allowedNextStates = ALLOWED_TRANSITIONS[currentOrder.status]
      if (!allowedNextStates.includes(newStatus)) {
        throw new Error(`Cannot transition order from ${currentOrder.status} to${newStatus}.`)
      }

      return await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      })
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

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "An order must contain at least one item." }
    }

    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          status: true,
          user: { select: { role: true } },
        },
      })

      if (!existingOrder) {
        throw new Error("Order not found.")
      }

      if (
        existingOrder.status === "DISPATCHED" ||
        existingOrder.status === "DELIVERED" ||
        existingOrder.status === "CANCELLED"
      ) {
        throw new Error(`Orders in ${existingOrder.status} state cannot be edited.`)
      }

      const isB2B = existingOrder.user?.role === "B2B"

      const productIds = input.items.map((i) => i.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        include: { tieredPrices: { orderBy: { minQty: "asc" } } },
      })

      const productMap = new Map(products.map((p) => [p.id, p]))

      let itemsSubtotal = 0
      const recalculatedItems = input.items.map((item) => {
        const product = productMap.get(item.productId)
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        const priceInfo = calculateItemPrice(product.tieredPrices, item.quantity, isB2B)
        const unitPrice = priceInfo.unitPrice
        itemsSubtotal += item.quantity * unitPrice

        return {
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          unitPrice,
        }
      })

      const shippingFee = itemsSubtotal > 50000 ? 0 : 1500
      const newGrandTotal = itemsSubtotal + shippingFee

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
          subtotal: itemsSubtotal,
          shippingFee: shippingFee,
          totalAmount: newGrandTotal,
          items: {
            create: recalculatedItems,
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

/**
 * Single Order Deletion
 */
export async function deleteSingleOrder(orderId: string) {
  try {
    await requireAdmin()

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId },
      })
      await tx.order.delete({
        where: { id: orderId },
      })
    })

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete order"
    return { success: false, error: message }
  }
}

/**
 * Bulk Order Deletion
 */
export async function deleteBatchOrders(orderIds: string[]) {
  try {
    await requireAdmin()

    if (!orderIds || orderIds.length === 0) {
      return { success: false, error: "No orders selected for deletion." }
    }

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: { in: orderIds } },
      })

      await tx.order.deleteMany({
        where: { id: { in: orderIds } },
      })
    })

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete selected orders"
    return { success: false, error: message }
  }
}