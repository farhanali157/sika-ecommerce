"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function requireCustomerSession() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to access your orders.")
  }
  return session
}

export async function getCustomerOrders() {
  try {
    const session = await requireCustomerSession()
    const userId = session.user.id

    const orders = await prisma.order.findMany({
      where: { userId }, // Strict IDOR scoping
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    return { success: true, orders }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load orders."
    return { success: false, error: message, orders: [] }
  }
}

export async function getCustomerOrderDetail(orderId: string) {
  try {
    const session = await requireCustomerSession()
    const userId = session.user.id

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId, // Strict IDOR scoping: users can ONLY view their own orders
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                packSize: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return { success: false, error: "Order not found." }
    }

    return { success: true, order }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load order details."
    return { success: false, error: message, order: null }
  }
}

export async function cancelCustomerOrder(orderId: string) {
  try {
    const session = await requireCustomerSession()
    const userId = session.user.id

    return await prisma.$transaction(async (tx) => {
      // Compare-and-swap: Atomic condition enforced at database write time
      const updateResult = await tx.order.updateMany({
        where: {
          id: orderId,
          userId, // Ownership check
          status: { in: [OrderStatus.PENDING, OrderStatus.PROCESSING] }, // Write-time state guard
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      })

      if (updateResult.count === 0) {
        return {
          success: false,
          error: "This order cannot be cancelled — it may have already shipped or does not exist.",
        }
      }

      revalidatePath("/account/orders")
      revalidatePath(`/account/orders/${orderId}`)

      return { success: true }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to cancel order."
    return { success: false, error: message }
  }
}