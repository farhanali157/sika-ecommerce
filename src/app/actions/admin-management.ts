"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const VALID_STAFF_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN]

// PATCH: Enforce strict password requirements for administrative accounts
const createStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.nativeEnum(Role).optional().default(Role.ADMIN),
})

export async function createSubAdmin(formData: FormData) {
  try {
    const session = await auth()
    if (session?.user?.role !== Role.SUPER_ADMIN) {
      return { success: false, error: "Unauthorized: Super Admin access required." }
    }

    const inputData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    }

    const parsed = createStaffSchema.safeParse(inputData)
    
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.issues[0]?.message ?? "Invalid account details provided." 
      }
    }

    const { name, email, password, role: requestedRole } = parsed.data

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