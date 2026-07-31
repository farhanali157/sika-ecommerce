import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-gateway-signature") || ""

    const secret = process.env.PAYMENT_GATEWAY_SECRET

    if (!secret && process.env.NODE_ENV === "production") {
      console.error("[PAYMENT_WEBHOOK_ERROR] PAYMENT_GATEWAY_SECRET missing in production.")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const activeSecret = secret || "sandbox_secret"

    const expectedSignature = crypto
      .createHmac("sha256", activeSecret)
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

    if (status === "SUCCESS") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentTxnId: transactionId,
        },
      })
    } else if (status === "FAILED") {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "FAILED" },
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[PAYMENT_WEBHOOK_ERROR]", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}