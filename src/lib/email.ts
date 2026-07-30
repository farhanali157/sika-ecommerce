import { Resend } from "resend"

// Initialize Resend lazily to prevent build-time crashes if RESEND_API_KEY is missing during build
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

export type OrderEmailPayload = {
  orderId: string
  customerName: string
  customerEmail: string
  totalAmount: number | string
  status: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number | string
  }>
}

/**
 * Non-blocking Order Confirmation Email Dispatch
 * Safe for both registered users and unverified guest email snapshots.
 */
export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  try {
    const resend = getResendClient()
    if (!resend) {
      console.warn(
        `[EMAIL_DISPATCH_SKIPPED] RESEND_API_KEY is not configured in .env. Order #${payload.orderId}`
      )
      return { success: false, reason: "API key not configured" }
    }

    if (!payload.customerEmail || !payload.customerEmail.includes("@")) {
      console.warn(
        `[EMAIL_DISPATCH_INVALID] Invalid recipient email for Order #${payload.orderId}: "${payload.customerEmail}"`
      )
      return { success: false, reason: "Invalid recipient email" }
    }

    const itemsListHtml = payload.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">PKR ${Number(item.unitPrice).toLocaleString()}</td>
          </tr>`
      )
      .join("")

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #d97706; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
          SIKA PAKISTAN — Order Confirmation
        </h2>
        <p>Dear <strong>${payload.customerName}</strong>,</p>
        <p>Thank you for your order! We have received your order <strong>#${payload.orderId}</strong> and it is currently being processed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <p style="font-size: 16px; font-weight: bold; text-align: right;">
          Total Amount: <span style="color: #d97706;">PKR ${Number(payload.totalAmount).toLocaleString()}</span>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">
          If you have any questions regarding your order, reply directly to this email or contact support@sika.com.pk.
        </p>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: "Sika Orders <orders@sika.com.pk>",
      to: [payload.customerEmail],
      subject: `Order Confirmation #${payload.orderId.slice(-8)} — Sika Pakistan`,
      html: htmlContent,
    })

    if (error) {
      console.error(`[EMAIL_DISPATCH_FAILED] Resend API error for Order #${payload.orderId}:`, error)
      return { success: false, error }
    }

    console.log(`[EMAIL_DISPATCH_SUCCESS] Order confirmation sent to ${payload.customerEmail} (ID: ${data?.id})`)
    return { success: true, id: data?.id }
  } catch (err: unknown) {
    // Top-level guard guarantees zero unhandled promises / broken DB transactions
    console.error(`[EMAIL_DISPATCH_EXCEPTION] Non-blocking mailer exception for Order #${payload.orderId}:`, err)
    return { success: false, error: err }
  }
}