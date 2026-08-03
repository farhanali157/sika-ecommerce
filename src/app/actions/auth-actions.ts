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
    // Initial account is CUSTOMER until B2B application is explicitly approved by an admin
    const userRole = input.role === "B2B" ? Role.CUSTOMER : Role.CUSTOMER 

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: emailNormalized,
        passwordHash: hashedPassword,
        role: userRole,
        companyName: input.companyName,
        ntnNumber: input.ntnNumber,
      },
    })

    // If registered as B2B, create the PENDING application draft using the user's actual URLs
    if (
      input.role === "B2B" && 
      input.companyName && 
      input.ntnNumber && 
      input.taxCertificateUrl && 
      input.businessProofUrl
    ) {
      await prisma.b2BApplication.create({
        data: {
          userId: user.id,
          companyName: input.companyName,
          ntnNumber: input.ntnNumber,
          taxCertificateUrl: input.taxCertificateUrl,
          businessProofUrl: input.businessProofUrl,
          status: "PENDING",
        },
      })
    }

    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register user."
    return { success: false, error: message }
  }
}