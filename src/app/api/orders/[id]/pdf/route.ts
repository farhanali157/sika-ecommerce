import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { serializeDecimals } from "@/lib/serialize"
import { pdf, DocumentProps } from "@react-pdf/renderer"
import { OrderReceiptPDF } from "@/components/pdf/order-receipt-pdf"
import React from "react"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const userRole = session.user.role

    // Strict Ownership Enforcement: Users see their own orders, ADMINs can access any order
    const whereCondition =
      userRole === "ADMIN" || userRole === "SUPER_ADMIN"
        ? { id: orderId }
        : { id: orderId, userId }

    const rawOrder = await prisma.order.findFirst({
      where: whereCondition,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    })

    if (!rawOrder) {
      return NextResponse.json({ error: "Order not found or access denied." }, { status: 404 })
    }

    // Convert Prisma Decimals to JavaScript numbers cleanly
    const order = serializeDecimals(rawOrder)

    // Pass component via React.createElement with DocumentProps element typing
    const pdfElement = React.createElement(OrderReceiptPDF, {
      order,
    }) as React.ReactElement<DocumentProps>

    const pdfStream = pdf(pdfElement)
    const pdfBuffer = await pdfStream.toBuffer()

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="receipt-order-${order.id.slice(-8)}.pdf"`,
      },
    })
  } catch (error: unknown) {
    console.error("[PDF_ROUTE_ERROR]", error)
    return NextResponse.json({ error: "Failed to generate PDF receipt" }, { status: 500 })
  }
}