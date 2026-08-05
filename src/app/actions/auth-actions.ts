"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { headers } from "next/headers"
import { signupRateLimiter } from "@/lib/ratelimit"

// Base account fields required for every signup, regardless of account type.
const baseRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(254),
  // Mirrors common production password policy: reasonable minimum, generous
  // maximum (bcrypt silently truncates beyond 72 bytes, so we cap well below that).
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  role: z.enum(["CUSTOMER", "B2B"]).optional().default("CUSTOMER"),
  companyName: z.string().trim().min(2).max(150).optional().or(z.literal("")),
  ntnNumber: z.string().trim().min(1).max(30).optional().or(z.literal("")),
  taxCertificateUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  businessProofUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
})

// When the applicant selects the B2B tier, the supporting business fields
// become mandatory rather than optional.
const registerSchema = baseRegisterSchema.superRefine((data, ctx) => {
  if (data.role !== "B2B") return

  if (!data.companyName) {
    ctx.addIssue({ code: "custom", path: ["companyName"], message: "Company name is required for B2B accounts." })
  }
  if (!data.ntnNumber) {
    ctx.addIssue({ code: "custom", path: ["ntnNumber"], message: "NTN number is required for B2B accounts." })
  }
  if (!data.taxCertificateUrl) {
    ctx.addIssue({ code: "custom", path: ["taxCertificateUrl"], message: "Tax certificate URL is required for B2B accounts." })
  }
  if (!data.businessProofUrl) {
    ctx.addIssue({ code: "custom", path: ["businessProofUrl"], message: "Business proof URL is required for B2B accounts." })
  }
})

export type RegisterUserInput = {
  name: string
  email: string
  password: string
  role?: "CUSTOMER" | "B2B"
  companyName?: string
  ntnNumber?: string
  taxCertificateUrl?: string
  businessProofUrl?: string
}

export async function registerUser(input: RegisterUserInput) {
  try {
    // 1. Rate limit account creation to prevent automated signup spam / abuse.
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"

    try {
      const { success: rateLimitOk } = await signupRateLimiter.limit(`signup_ip_${ip}`)
      if (!rateLimitOk) {
        return { success: false, error: "Too many signup attempts. Please try again later." }
      }
    } catch (rateLimitError) {
      // Fail open on limiter infrastructure errors (e.g. Redis outage) so a
      // dependency hiccup doesn't take down account creation entirely — the
      // same tradeoff already made for login in auth.ts.
      console.error("[registerUser] Rate limiter unavailable:", rateLimitError)
    }

    // 2. Zod server-side validation — this is the actual security boundary;
    // client-side form constraints are a convenience only.
    const parsed = registerSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid registration details provided.",
      }
    }
    const data = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    })

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const wantsB2B =
      data.role === "B2B" &&
      !!data.companyName &&
      !!data.ntnNumber &&
      !!data.taxCertificateUrl &&
      !!data.businessProofUrl

    await prisma.$transaction(async (tx) => {
      // Every new account starts as CUSTOMER. B2B access is granted only
      // after an admin reviews and approves the application created below.
      const createdUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: hashedPassword,
          role: Role.CUSTOMER,
          companyName: data.companyName || undefined,
          ntnNumber: data.ntnNumber || undefined,
        },
      })

      if (wantsB2B) {
        await tx.b2BApplication.create({
          data: {
            userId: createdUser.id,
            companyName: data.companyName!,
            ntnNumber: data.ntnNumber!,
            taxCertificateUrl: data.taxCertificateUrl!,
            businessProofUrl: data.businessProofUrl!,
            status: "PENDING",
          },
        })
      }
    })

    return { success: true }
  } catch (error: unknown) {
    console.error("[registerUser] Registration failed:", error)
    const message = error instanceof Error ? error.message : "Failed to register user."
    return { success: false, error: message }
  }
}