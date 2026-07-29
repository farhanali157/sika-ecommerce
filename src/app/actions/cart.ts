"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { calculateItemPrice } from "@/lib/cart-engine"

const CART_COOKIE_NAME = "sika_cart_id"

async function getOrCreateCart() {
  const session = await auth()
  const userId = session?.user?.id
  const cookieStore = await cookies()
  const guestCartId = cookieStore.get(CART_COOKIE_NAME)?.value

  // 1. Authenticated User
  if (userId) {
    let userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })

    // If guest cart exists, merge guest items into user cart
    if (guestCartId && guestCartId !== userCart?.id) {
      const guestCart = await prisma.cart.findUnique({
        where: { id: guestCartId },
        include: { items: true },
      })

      if (guestCart && guestCart.items.length > 0) {
        if (!userCart) {
          userCart = await prisma.cart.create({
            data: { userId },
            include: { items: true },
          })
        }

        for (const guestItem of guestCart.items) {
          await prisma.cartItem.upsert({
            where: {
              cartId_productId: {
                cartId: userCart.id,
                productId: guestItem.productId,
              },
            },
            update: {
              quantity: { increment: guestItem.quantity },
            },
            create: {
              cartId: userCart.id,
              productId: guestItem.productId,
              quantity: guestItem.quantity,
            },
          })
        }

        // Clean up guest cart container
        await prisma.cart.delete({ where: { id: guestCartId } }).catch(() => {})
        cookieStore.delete(CART_COOKIE_NAME)
      }
    }

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      })
    }

    return userCart
  }

  // 2. Guest User
  if (guestCartId) {
    const existingGuestCart = await prisma.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true },
    })
    if (existingGuestCart) return existingGuestCart
  }

  // Create new guest cart and set HTTP-only cookie
  const newGuestCart = await prisma.cart.create({
    data: {},
    include: { items: true },
  })

  cookieStore.set(CART_COOKIE_NAME, newGuestCart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return newGuestCart
}

export async function addToCart(productId: string, quantity: number = 1) {
  const cart = await getOrCreateCart()

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  })
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } })
    return
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  })
}

export async function removeFromCart(cartItemId: string) {
  await prisma.cartItem.delete({ where: { id: cartItemId } })
}

export async function getCart() {
  const session = await auth()
  const userRole = session?.user?.role
  const isB2B = userRole === "B2B" || userRole === "ADMIN"

  const cart = await getOrCreateCart()

  const cartWithDetails = await prisma.cart.findUnique({
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

  if (!cartWithDetails) return { items: [], subtotal: 0, totalItems: 0 }

  let subtotal = 0
  let totalItems = 0

  const items = cartWithDetails.items.map((item) => {
    const pricing = calculateItemPrice(item.product.tieredPrices, item.quantity, isB2B)
    subtotal += pricing.totalPrice
    totalItems += item.quantity

    return {
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productSlug: item.product.slug,
      productSku: item.product.sku,
      image: item.product.images[0] ?? null,
      quantity: item.quantity,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      appliedTier: pricing.appliedTier,
    }
  })

  return { items, subtotal, totalItems }
}