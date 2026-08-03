"use client"

import { useTransition } from "react"
import { updateUserRole, deleteStaffUser } from "@/app/actions/admin-management"
import { Role } from "@prisma/client"
import { Trash2, Shield } from "lucide-react"

interface StaffActionsProps {
  userId: string;
  currentRole: Role;
  isSelf: boolean;
}

export function StaffActions({ userId, currentRole, isSelf }: StaffActionsProps) {
  const [isPending, startTransition] = useTransition()

  if (isSelf) {
    return <span className="text-[11px] text-gray-400 italic">Active Session</span>
  }

  const handleToggleRole = () => {
    const nextRole = currentRole === Role.ADMIN ? Role.SUPER_ADMIN : Role.ADMIN
    if (confirm(`Change this staff account to ${nextRole}?`)) {
      startTransition(async () => {
        const res = await updateUserRole(userId, nextRole)
        if (!res.success) alert(res.error)
      })
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this staff user account?")) {
      startTransition(async () => {
        const res = await deleteStaffUser(userId)
        if (!res.success) alert(res.error)
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleRole}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition disabled:opacity-50"
      >
        <Shield className="h-3 w-3" />
        {currentRole === Role.ADMIN ? "Promote to Super Admin" : "Demote to Manager"}
      </button>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
        title="Delete Staff Account"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}