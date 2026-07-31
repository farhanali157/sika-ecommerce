"use server"

import { cookies } from "next/headers"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { calculateCartSubtotal } from "@/lib/cart-engine"

const GUEST_CART_COOKIE = "sika_cart_id"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * Resolves or creates the active cart for either an authenticated user
 * or an anonymous guest via an HTTP-only cookie.
 */
export async function getOrCreateCart() {
  const session = await auth()
  const userId = session?.user?.id
  const cookieStore = await cookies()

  // 1. Authenticated User Flow
  if (userId) {
    let userCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    })

    const guestCartId = cookieStore.get(GUEST_CART_COOKIE)?.value

    // If guest cart exists, merge guest items into user cart inside a single transaction
    if (guestCartId) {
      const guestCart = await prisma.cart.findUnique({
        where: { id: guestCartId },
        include: { items: true },
      })

      if (guestCart && guestCart.items.length > 0) {
        await prisma.$transaction(async (tx) => {
          let txUserCart = await tx.cart.findFirst({
            where: { userId },
            include: { items: true },
          })

          if (!txUserCart) {
            txUserCart = await tx.cart.create({
              data: { userId },
              include: { items: true },
            })
          }

          for (const guestItem of guestCart.items) {
            const existingUserItem = txUserCart.items.find(
              (i) => i.productId === guestItem.productId
            )

            if (existingUserItem) {
              await tx.cartItem.update({
                where: { id: existingUserItem.id },
                data: { quantity: existingUserItem.quantity + guestItem.quantity },
              })
            } else {
              await tx.cartItem.create({
                data: {
                  cartId: txUserCart.id,
                  productId: guestItem.productId,
                  quantity: guestItem.quantity,
                },
              })
            }
          }

          // Clean up guest cart inside transaction
          await tx.cart.delete({ where: { id: guestCartId } }).catch(() => {})
        })

        // Re-query merged cart
        userCart = await prisma.cart.findFirst({
          where: { userId },
          include: { items: true },
        })
      }

      cookieStore.delete(GUEST_CART_COOKIE)
    }

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      })
    }

    return userCart
  }

  // 2. Anonymous Guest Flow
  const guestCartId = cookieStore.get(GUEST_CART_COOKIE)?.value

  if (guestCartId) {
    const existingGuestCart = await prisma.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true },
    })

    if (existingGuestCart) {
      return existingGuestCart
    }
  }

  // Create new guest cart
  const newGuestCart = await prisma.cart.create({
    data: {},
    include: { items: true },
  })

  cookieStore.set(GUEST_CART_COOKIE, newGuestCart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  return newGuestCart
}

/**
 * Adds an item to the current active cart with product availability and quantity guards.
 */
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const qty = Math.trunc(quantity)
    if (!Number.isFinite(qty) || qty < 1 || qty > 1000) {
      return { success: false, error: "Quantity must be between 1 and 1,000." }
    }

    // Verify product exists, is active, and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isArchived: true, status: true },
    })

    if (!product || product.isArchived || product.status !== "IN_STOCK") {
      return { success: false, error: "This product is currently unavailable or out of stock." }
    }

    const cart = await getOrCreateCart()

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: { increment: qty },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity: qty,
      },
    })
    return { success: true }
  } catch (error) {
    console.error("[addToCart] Error adding item to cart:", error)
    return { success: false, error: "Failed to add item to cart" }
  }
}

/**
 * Retrieves full cart data with calculated pricing and B2B volume tiers.
 */
export async function getCart() {
  try {
    const session = await auth()
    const userRole = session?.user?.role
    const cart = await getOrCreateCart()

    const dbCart = await prisma.cart.findUnique({
      where: { id: cart.id },
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

    if (!dbCart) {
      return { items: [], subtotal: 0, totalItems: 0 }
    }

    return calculateCartSubtotal(dbCart.items, userRole)
  } catch (error) {
    console.error("[getCart] Error retrieving cart:", error)
    return { items: [], subtotal: 0, totalItems: 0 }
  }
}

/**
 * Updates quantity for a cart item, scoped strictly to the calling user's cartId (IDOR Prevention).
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const qty = Math.trunc(quantity)

    const cart = await getOrCreateCart()

    if (qty <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          id: cartItemId,
          cartId: cart.id, // Enforces ownership
        },
      })
      return { success: true }
    }

    if (!Number.isFinite(qty) || qty > 1000) {
      return { success: false, error: "Quantity cannot exceed 1,000 units." }
    }

    await prisma.cartItem.updateMany({
      where: {
        id: cartItemId,
        cartId: cart.id, // Enforces ownership
      },
      data: { quantity: qty },
    })

    return { success: true }
  } catch (error) {
    console.error("[updateCartItemQuantity] Error updating quantity:", error)
    return { success: false, error: "Failed to update quantity" }
  }
}

/**
 * Removes an item from the cart, scoped strictly to the calling user's cartId (IDOR Prevention).
 */
export async function removeFromCart(cartItemId: string) {
  try {
    const cart = await getOrCreateCart()

    await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cartId: cart.id, // Enforces ownership
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[removeFromCart] Error removing item from cart:", error)
    return { success: false, error: "Failed to remove item" }
  }
}