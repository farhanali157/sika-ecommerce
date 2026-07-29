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
    const sessionEmail = session?.user?.email?.toLowerCase().trim()
    const userRole = session?.user?.role

    console.log("[createOrder] Initializing checkout for:", {
      isGuest: !sessionUserId,
      emailMasked: sessionEmail ? `${sessionEmail.slice(0, 3)}***` : `${input.customerEmail.slice(0, 3)}***`,
    })

    const activeCart = await getOrCreateCart()

    // Execute Read, Price Snapshot, Order Creation, and Cart Wipe inside ONE atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. READ INSIDE TX: Isolated from concurrent cart mutations
      const dbCart = await tx.cart.findUnique({
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

      // Idempotency / Double-Submit Guard: Throw clean error if cart is already wiped
      if (!dbCart || dbCart.items.length === 0) {
        throw new Error("Your cart is empty or this order has already been processed.")
      }

      // 2. Resolve User Ownership (NO silent user upserting)
      let orderUserId: string | null = sessionUserId || null

      if (!orderUserId && sessionEmail) {
        const userFromDb = await tx.user.findUnique({
          where: { email: sessionEmail },
        })
        if (userFromDb) {
          orderUserId = userFromDb.id
        }
      }

      // 3. Calculate Cart Subtotal inside isolation boundary
      const cartSummary = calculateCartSubtotal(dbCart.items, userRole)

      if (cartSummary.items.length === 0) {
        throw new Error("No valid items found in cart.")
      }

      const subtotal = cartSummary.subtotal
      const shippingFee = subtotal > 50000 ? 0 : 1500
      const grandTotal = subtotal + shippingFee

      // 4. Create Order with snapshot details (Works for both Logged-In and Guest users)
      const newOrder = await tx.order.create({
        data: {
          userId: orderUserId ?? undefined, // Nullable for guests
          status: "PENDING",
          totalAmount: grandTotal,
          customerName: input.customerName,
          customerEmail: input.customerEmail.toLowerCase().trim(),
          customerPhone: input.customerPhone,
          shippingAddress: `${input.shippingAddress}, ${input.city}`,
          notes: input.notes,
          items: {
            create: cartSummary.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      })

      // 5. Atomic Cart Wipe
      await tx.cartItem.deleteMany({
        where: { cartId: activeCart.id },
      })

      return newOrder
    })

    return { success: true, orderId: result.id }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to process order. Please try again."
    console.error("[createOrder] Transaction failed:", errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}