"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function canManageProducts(role: string | undefined): boolean {
  if (role === "ADMIN") return true
  if (role === "SUPER_ADMIN") return true
  return false
}

export async function applyStorewideDiscountAction(discountPercent: number) {
  const session = await auth()

  if (!session?.user) {
    return { success: false, error: "Unauthorized access" }
  }

  if (!canManageProducts(session.user.role)) {
    return { success: false, error: "Unauthorized access" }
  }

  if (discountPercent < 0) {
    return { success: false, error: "Discount cannot be negative" }
  }

  if (discountPercent > 100) {
    return { success: false, error: "Discount cannot exceed 100%" }
  }

  try {
    await prisma.product.updateMany({
      data: {
        discountPercent: discountPercent,
      },
    })

    revalidatePath("/")
    revalidatePath("/products")
    revalidatePath("/admin/products")

    return { success: true }
  } catch {
    return { success: false, error: "Database error applying storewide discount" }
  }
}

export async function getStoreSettingsAction() {
  try {
    const settings = await prisma.storeSetting.findFirst()
    if (!settings) {
      const newSettings = await prisma.storeSetting.create({
        data: {
          announcementText: "🎉 SIKA STOREWIDE SALE LIVE NOW!",
          announcementBgColor: "#171717",
          announcementTextColor: "#ffffff",
          isAnnouncementActive: true,
        },
      })
      return { success: true, settings: newSettings }
    }
    return { success: true, settings }
  } catch {
    return { success: false, error: "Failed to fetch settings" }
  }
}

export async function updateAnnouncementAction(data: {
  announcementText: string
  announcementBgColor: string
  announcementTextColor: string
  isAnnouncementActive: boolean
}) {
  const session = await auth()

  if (!session?.user || !canManageProducts(session.user.role)) {
    return { success: false, error: "Unauthorized access" }
  }

  try {
    const settings = await prisma.storeSetting.findFirst()
    if (!settings) {
      await prisma.storeSetting.create({ data })
    } else {
      await prisma.storeSetting.update({
        where: { id: settings.id },
        data,
      })
    }

    revalidatePath("/")
    revalidatePath("/products")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update announcement settings" }
  }
}