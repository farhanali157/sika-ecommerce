"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.")
  }
  return session
}

export async function getAdminOrders(statusFilter?: string) {
  try {
    await requireAdmin()

    const isValidStatus = statusFilter && Object.values(OrderStatus).includes(statusFilter as OrderStatus)

    const orders = await prisma.order.findMany({
      where: isValidStatus ? { status: statusFilter as OrderStatus } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
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