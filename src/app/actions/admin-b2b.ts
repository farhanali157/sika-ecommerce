"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus, Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function reviewB2BApplication(
  applicationId: string,
  status: ApplicationStatus,
  notes?: string
) {
  const session = await auth()
  const userRole = session?.user?.role

  if (userRole !== Role.ADMIN && userRole !== Role.SUPER_ADMIN) {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    const application = await prisma.b2BApplication.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    })

    if (!application) {
      return { success: false, error: "Application not found." }
    }

    await prisma.$transaction(async (tx) => {
      await tx.b2BApplication.update({
        where: { id: applicationId },
        data: {
          status,
          notes: notes || null,
        },
      })

      if (status === ApplicationStatus.APPROVED) {
        await tx.user.update({
          where: { id: application.userId },
          data: { role: Role.B2B },
        })
      }
    })

    revalidatePath("/admin/b2b-applications")
    return { success: true }
  } catch (error) {
    console.error("[REVIEW_B2B_ERROR]", error)
    return { success: false, error: "Failed to update application status." }
  }
}