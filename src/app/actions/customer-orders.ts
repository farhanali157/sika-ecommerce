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
      // Fetch order INSIDE transaction to verify ownership and current status
      const existingOrder = await tx.order.findFirst({
        where: {
          id: orderId,
          userId, // Ownership check
        },
        select: { status: true },
      })

      if (!existingOrder) {
        return { success: false, error: "Order not found or access denied." }
      }

      // Customer cancellation only permitted for PENDING or PROCESSING states
      if (existingOrder.status !== "PENDING" && existingOrder.status !== "PROCESSING") {
        return {
          success: false,
          error: `Orders in ${existingOrder.status} status cannot be cancelled. Please contact support.`,
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      })

      revalidatePath("/account/orders")
      revalidatePath(`/account/orders/${orderId}`)

      return { success: true, status: updatedOrder.status }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to cancel order."
    return { success: false, error: message }
  }
}