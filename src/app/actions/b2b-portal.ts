"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"
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

  // Update existing rejected record or create a fresh pending application
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

  // Keep user's company profile synced
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
}