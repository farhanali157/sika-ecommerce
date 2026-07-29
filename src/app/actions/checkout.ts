"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreateCart } from "@/app/actions/cart"
import { calculateCartSubtotal } from "@/lib/cart-engine"

type CreateOrderInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  city: string
  notes?: string
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const session = await auth()
    const sessionUserId = session?.user?.id
    const userRole = session?.user?.role

    // Log order dispatch details for server logs / manual fulfillment tracing
    console.log("[createOrder] Processing checkout for customer:", {
      name: input.customerName,
      email: input.customerEmail,
      phone: input.customerPhone,
      address: `${input.shippingAddress}, ${input.city}`,
      notes: input.notes,
    })

    // 1. Fetch current active cart with full pricing details
    const activeCart = await getOrCreateCart()

    const dbCart = await prisma.cart.findUnique({
      where: { id: activeCart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                tieredPrices: {
                  orderBy: { minQty: "asc" },
                },
              },
            },
          },
        },
      },
    })

    if (!dbCart || dbCart.items.length === 0) {
      return { success: false, error: "Your cart is empty." }
    }

    const orderUserId = sessionUserId || dbCart.userId

    if (!orderUserId) {
      return {
        success: false,
        error: "Please sign in or register an account to place an order.",
      }
    }

    // 2. Calculate subtotal & snapshot unit prices
    const cartSummary = calculateCartSubtotal(dbCart.items, userRole)

    if (cartSummary.items.length === 0) {
      return { success: false, error: "No valid items found in cart." }
    }

    const subtotal = cartSummary.subtotal
    const shippingFee = subtotal > 50000 ? 0 : 1500
    const grandTotal = subtotal + shippingFee

    // 3. Execute Order Creation & Cart Wipe inside an Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: orderUserId,
          status: "PENDING",
          totalAmount: grandTotal,
          items: {
            create: cartSummary.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              // Price snapshotting at purchase time
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      // Wipe active cart items after successful purchase
      await tx.cartItem.deleteMany({
        where: { cartId: activeCart.id },
      })

      return newOrder
    })

    return { success: true, orderId: result.id }
  } catch (error) {
    console.error("[createOrder] Error processing checkout:", error)
    return { success: false, error: "Failed to process order. Please try again." }
  }
}