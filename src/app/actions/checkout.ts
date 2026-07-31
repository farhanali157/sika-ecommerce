"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/app/actions/cart";
import { calculateCartSubtotal } from "@/lib/cart-engine";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { calculateShippingFee } from "@/lib/pricing-constants";
import { after } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120),
  customerEmail: z.string().trim().email("Invalid email address").max(254),
  customerPhone: z.string().trim().min(7, "Phone number is too short").max(20),
  shippingAddress: z.string().trim().min(5, "Address is too short").max(300),
  city: z.enum([
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
  ]),
  ntnNumber: z.string().trim().max(30).optional(),
  notes: z.string().trim().max(500).optional(),
});

type CreateOrderInput = z.infer<typeof createOrderSchema>;

export async function createOrder(input: CreateOrderInput) {
  try {
    // 1. Zod Server-side Validation
    const parsed = createOrderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ?? "Invalid order details provided.",
      };
    }
    const validatedData = parsed.data;

    const session = await auth();
    const sessionUserId = session?.user?.id;
    const sessionEmail = session?.user?.email?.toLowerCase().trim();
    const userRole = session?.user?.role;

    const activeCart = await getOrCreateCart();

    // Execute Read, Price Snapshot, Order Creation, and Cart Wipe inside ONE atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Row Lock
      await tx.$executeRaw`SELECT id FROM "Cart" WHERE id = ${activeCart.id} FOR UPDATE`;

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
        throw new Error(
          "Your cart is empty or this order has already been processed.",
        );
      }

      let orderUserId: string | null = sessionUserId || null;

      if (!orderUserId && sessionEmail) {
        const userFromDb = await tx.user.findUnique({
          where: { email: sessionEmail },
        });
        if (userFromDb) {
          orderUserId = userFromDb.id;
        }
      }

      const cartSummary = calculateCartSubtotal(dbCart.items, userRole);

      if (cartSummary.items.length === 0) {
        throw new Error("No valid items found in cart.");
      }

      const subtotal = cartSummary.subtotal;
      const shippingFee = calculateShippingFee(subtotal);
      const grandTotal = subtotal + shippingFee;

      // Format notes to include NTN if present
      const combinedNotes = validatedData.ntnNumber
        ? `[NTN/Tax ID: ${validatedData.ntnNumber}] ${validatedData.notes ?? ""}`.trim()
        : validatedData.notes;

      const newOrder = await tx.order.create({
        data: {
          userId: orderUserId ?? undefined,
          status: "PENDING",
          subtotal: subtotal,
          shippingFee: shippingFee,
          totalAmount: grandTotal,
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail.toLowerCase().trim(),
          customerPhone: validatedData.customerPhone,
          shippingAddress: `${validatedData.shippingAddress}, ${validatedData.city}`,
          notes: combinedNotes,
          items: {
            create: cartSummary.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: activeCart.id },
      });

      return newOrder;
    });

    after(() => {
      sendOrderConfirmationEmail({
        orderId: result.id,
        customerName: result.customerName ?? validatedData.customerName,
        customerEmail: result.customerEmail ?? validatedData.customerEmail,
        totalAmount: Number(result.totalAmount),
        status: result.status,
        items: result.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
      }).catch((err) => {
        console.error(
          "[createOrder] Non-blocking background email dispatch error:",
          err,
        );
      });
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