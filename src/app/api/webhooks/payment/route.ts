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
    
    // PATCH: Extracted 'amount' from the payload to verify against the database
    const { orderId, transactionId, status, amount } = payload

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Missing or invalid orderId" }, { status: 400 })
    }

    // PATCH: Fetch the order first to verify its existence and total amount
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { totalAmount: true }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (status === "SUCCESS") {
      // PATCH: Fraud prevention - Verify the webhook amount matches the database order amount
      // Note: Make sure the gateway amount and order amount are in the same format (e.g., both PKR or both in cents).
      if (Number(order.totalAmount) !== Number(amount)) {
        console.error(`[WEBHOOK_FRAUD_ALERT] Amount mismatch on order ${orderId}. Expected ${order.totalAmount}, got ${amount}`)
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
      }

      // PATCH: Compare-and-Swap (CAS) pattern.
      // We explicitly check `paymentStatus: "PENDING"` so a duplicate/delayed webhook can't overwrite a terminal state.
      const result = await prisma.order.updateMany({
        where: { 
          id: orderId,
          paymentStatus: "PENDING"
        },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paymentTxnId: transactionId,
        },
      })
      
      // If count is 0, the order was already processed. We still return 200 OK 
      // so the payment gateway stops retrying, but we log it.
      if (result.count === 0) {
        console.log(`[WEBHOOK_NOTE] Order ${orderId} SUCCESS ignored: Already processed or state changed.`)
      }
      
    } else if (status === "FAILED") {
      // PATCH: CAS pattern. Prevents a late FAILED webhook from flipping an already PAID order.
      const result = await prisma.order.updateMany({
        where: { 
          id: orderId,
          paymentStatus: "PENDING" 
        },
        data: { paymentStatus: "FAILED" },
      })
      
      if (result.count === 0) {
        console.log(`[WEBHOOK_NOTE] Order ${orderId} FAILED ignored: Already processed or state changed.`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[PAYMENT_WEBHOOK_ERROR]", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}