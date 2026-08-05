"use server"

import { z } from "zod"
import { headers } from "next/headers"
import { contactRateLimiter } from "@/lib/ratelimit"
import { sendContactInquiryEmail } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(254),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
})

export type ContactFormInput = z.infer<typeof contactSchema>

export async function submitContactInquiry(input: ContactFormInput) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"

    try {
      const { success: rateLimitOk } = await contactRateLimiter.limit(`contact_ip_${ip}`)
      if (!rateLimitOk) {
        return {
          success: false,
          error: "Too many messages sent. Please wait a moment before trying again.",
        }
      }
    } catch (rateLimitError) {
      console.error("[submitContactInquiry] Rate limiter unavailable:", rateLimitError)
    }

    const parsed = contactSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid message details provided.",
      }
    }
    const data = parsed.data

    const result = await sendContactInquiryEmail(data)

    if (!result.success) {
      return {
        success: false,
        error: "We couldn't send your message right now. Please try again shortly or call our office directly.",
      }
    }

    return { success: true }
  } catch (error: unknown) {
    console.error("[submitContactInquiry] Unexpected error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}