"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/app/actions/cart";
import { calculateCartSubtotal } from "@/lib/cart-engine";

type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  notes?: string;
};

export async function createOrder(input: CreateOrderInput) {
  try {
    const session = await auth();
    const sessionEmail = session?.user?.email?.toLowerCase().trim();
    const sessionUserId = session?.user?.id;
    const userRole = session?.user?.role;

    // Safe logging with masked PII for production compliance
    console.log("[createOrder] Initializing checkout for:", {
      emailMasked: sessionEmail
        ? `${sessionEmail.slice(0, 3)}***@***`
        : "guest",
      role: userRole || "GUEST",
    });

    const activeCart = await getOrCreateCart();

    // Execute Entire Read, Pricing Snapshot, Order Creation, and Cart Wipe inside ONE Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. READ INSIDE TX: Prevent concurrent cart mutation race conditions
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
      });

      if (!dbCart || dbCart.items.length === 0) {
        throw new Error("Your cart is empty.");
      }

      // 2. Resolve User Ownership
      let orderUserId: string | null = sessionUserId || null;

      if (!orderUserId && sessionEmail) {
        const userFromDb = await tx.user.findUnique({
          where: { email: sessionEmail },
        });
        if (userFromDb) {
          orderUserId = userFromDb.id;
        }
      }

      if (!orderUserId) {
        orderUserId = dbCart.userId;
      }

      if (!orderUserId) {
        const targetEmail = (sessionEmail || input.customerEmail)
          .toLowerCase()
          .trim();
        const guestUser = await tx.user.upsert({
          where: { email: targetEmail },
          update: { name: input.customerName },
          create: {
            email: targetEmail,
            name: input.customerName,
            role: "CUSTOMER",
            passwordHash: "GUEST_ACCOUNT_NO_PASSWORD", // Satisfies required field constraint
          },
        });
        orderUserId = guestUser.id;
      }

      // 3. Calculate Cart Subtotal inside isolation boundary
      const cartSummary = calculateCartSubtotal(dbCart.items, userRole);

      if (cartSummary.items.length === 0) {
        throw new Error("No valid items found in cart.");
      }

      const subtotal = cartSummary.subtotal;
      const shippingFee = subtotal > 50000 ? 0 : 1500;
      const grandTotal = subtotal + shippingFee;

      // 4. Create Order & Snapshot Prices as Decimals
      const newOrder = await tx.order.create({
        data: {
          userId: orderUserId,
          status: "PENDING",
          totalAmount: grandTotal,
          items: {
            create: cartSummary.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });

      // 5. Wipe Cart Items
      await tx.cartItem.deleteMany({
        where: { cartId: activeCart.id },
      });

      return newOrder;
    });

    return { success: true, orderId: result.id };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to process order. Please try again.";
    console.error("[createOrder] Transaction failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
