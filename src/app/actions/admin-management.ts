"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function createSubAdmin(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== Role.SUPER_ADMIN) {
    return { success: false, error: "Unauthorized: Super Admin access required." }
  }

  const name = formData.get("name") as string
  const email = (formData.get("email") as string)?.toLowerCase().trim()
  const password = formData.get("password") as string
  const targetRole = (formData.get("role") as Role) || Role.ADMIN

  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." }
  }

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
}

export async function updateUserRole(userId: string, newRole: Role) {
  const session = await auth()
  if (session?.user?.role !== Role.SUPER_ADMIN) {
    return { success: false, error: "Unauthorized access." }
  }

  // Prevent self-demotion of active super admin
  if (session.user.id === userId) {
    return { success: false, error: "Cannot modify your own Super Admin role." }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteStaffUser(userId: string) {
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
}