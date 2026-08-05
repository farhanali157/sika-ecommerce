"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { submissionRateLimiter } from "@/lib/ratelimit"
import { ApplicationStatus } from "@prisma/client"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function getMyB2BApplication() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required." }
  }

  const application = await prisma.b2BApplication.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return { success: true, application }
}

export type B2BApplicationInput = {
  companyName: string
  ntnNumber: string
  taxCertificateUrl: string
  businessProofUrl: string
  notes?: string
}

export async function submitOrUpdateB2BApplication(input: B2BApplicationInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Authentication required." }
  }

  try {
    // Rate limit B2B submissions to prevent script spam. Fails OPEN if
    // Redis itself errors — only an actual rate-limit-exceeded result
    // blocks the submission.
    try {
      const headersList = await headers()
      const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"
      const { success: rateLimitSuccess } = await submissionRateLimiter.limit(
        `b2b_sub_${session.user.id}_${ip}`
      )

      if (!rateLimitSuccess) {
        return { success: false, error: "Too many submission attempts. Please try again later." }
      }
    } catch (rateLimitError) {
      console.error("[B2B_RATE_LIMIT_ERROR]", rateLimitError)
      // Redis unavailable — proceed without blocking submission.
    }

    const existingApp = await prisma.b2BApplication.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    if (existingApp && existingApp.status === ApplicationStatus.APPROVED) {
      return { success: false, error: "Your account is already an approved B2B partner." }
    }

    if (existingApp && existingApp.status === ApplicationStatus.PENDING) {
      return { success: false, error: "You already have an application under review." }
    }

    if (existingApp && existingApp.status === ApplicationStatus.REJECTED) {
      await prisma.b2BApplication.update({
        where: { id: existingApp.id },
        data: {
          companyName: input.companyName,
          ntnNumber: input.ntnNumber,
          taxCertificateUrl: input.taxCertificateUrl,
          businessProofUrl: input.businessProofUrl,
          notes: input.notes,
          status: ApplicationStatus.PENDING,
        },
      })
    } else {
      await prisma.b2BApplication.create({
        data: {
          userId: session.user.id,
          companyName: input.companyName,
          ntnNumber: input.ntnNumber,
          taxCertificateUrl: input.taxCertificateUrl,
          businessProofUrl: input.businessProofUrl,
          notes: input.notes,
          status: ApplicationStatus.PENDING,
        },
      })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        companyName: input.companyName,
        ntnNumber: input.ntnNumber,
      },
    })

    revalidatePath("/b2b/status")
    revalidatePath("/admin/b2b-applications")
    return { success: true }
  } catch (error: unknown) {
    console.error("[SUBMIT_B2B_APPLICATION_ERROR]", error)
    const message = error instanceof Error ? error.message : "Failed to submit application."
    return { success: false, error: message }
  }
}