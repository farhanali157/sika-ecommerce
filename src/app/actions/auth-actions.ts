"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"

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
    const emailNormalized = input.email.toLowerCase().trim()

    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    })

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." }
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const wantsB2B =
      input.role === "B2B" &&
      !!input.companyName &&
      !!input.ntnNumber &&
      !!input.taxCertificateUrl &&
      !!input.businessProofUrl

    await prisma.$transaction(async (tx) => {
      // Every new account starts as CUSTOMER. B2B access is granted only
      // after an admin reviews and approves the application created below.
      const createdUser = await tx.user.create({
        data: {
          name: input.name,
          email: emailNormalized,
          passwordHash: hashedPassword,
          role: Role.CUSTOMER,
          companyName: input.companyName,
          ntnNumber: input.ntnNumber,
        },
      })

      if (wantsB2B) {
        await tx.b2BApplication.create({
          data: {
            userId: createdUser.id,
            companyName: input.companyName!,
            ntnNumber: input.ntnNumber!,
            taxCertificateUrl: input.taxCertificateUrl!,
            businessProofUrl: input.businessProofUrl!,
            status: "PENDING",
          },
        })
      }
    })

    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register user."
    return { success: false, error: message }
  }
}