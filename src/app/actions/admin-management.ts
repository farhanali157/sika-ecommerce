"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

// Explicitly type as Role[] so .includes accepts any valid Role enum value
const VALID_STAFF_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN]

export async function createSubAdmin(formData: FormData) {
  try {
    const session = await auth()
    if (session?.user?.role !== Role.SUPER_ADMIN) {
      return { success: false, error: "Unauthorized: Super Admin access required." }
    }

    const name = formData.get("name") as string
    const email = (formData.get("email") as string)?.toLowerCase().trim()
    const password = formData.get("password") as string
    const requestedRole = formData.get("role") as Role

    if (!name || !email || !password) {
      return { success: false, error: "All fields are required." }
    }

    const targetRole = VALID_STAFF_ROLES.includes(requestedRole)
      ? requestedRole
      : Role.ADMIN

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: "An account with this email already exists." }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: targetRole,
      },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    console.error("[CREATE_SUB_ADMIN_ERROR]", error)
    const message = error instanceof Error ? error.message : "Failed to create admin account."
    return { success: false, error: message }
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    const session = await auth()
    if (session?.user?.role !== Role.SUPER_ADMIN) {
      return { success: false, error: "Unauthorized access." }
    }

    if (session.user.id === userId) {
      return { success: false, error: "Cannot modify your own Super Admin role." }
    }

    if (!VALID_STAFF_ROLES.includes(newRole)) {
      return { success: false, error: "Invalid role." }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    console.error("[UPDATE_USER_ROLE_ERROR]", error)
    const message = error instanceof Error ? error.message : "Failed to update role."
    return { success: false, error: message }
  }
}

export async function deleteStaffUser(userId: string) {
  try {
    const session = await auth()
    if (session?.user?.role !== Role.SUPER_ADMIN) {
      return { success: false, error: "Unauthorized access." }
    }

    if (session.user.id === userId) {
      return { success: false, error: "Cannot delete your own account." }
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    console.error("[DELETE_STAFF_USER_ERROR]", error)
    const message = error instanceof Error ? error.message : "Failed to delete account."
    return { success: false, error: message }
  }
}