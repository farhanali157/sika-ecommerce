import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-gateway-signature") || ""

    const secret = process.env.PAYMENT_GATEWAY_SECRET

    if (!secret) {
      console.error("[PAYMENT_WEBHOOK_ERROR] PAYMENT_GATEWAY_SECRET is not configured.")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex")

    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const { orderId, transactionId, status } = payload

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Missing or invalid orderId" }, { status: 400 })
    }

    if (status === "SUCCESS") {
      const result = await prisma.order.updateMany({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentTxnId: transactionId,
        },
      })
      if (result.count === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
    } else if (status === "FAILED") {
      const result = await prisma.order.updateMany({
        where: { id: orderId },
        data: { paymentStatus: "FAILED" },
      })
      if (result.count === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[PAYMENT_WEBHOOK_ERROR]", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}