import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { ShieldCheck } from "lucide-react"
import { CreateAdminModal } from "./create-admin-modal"
import { StaffActions } from "./staff-actions"

export default async function SuperAdminUsersPage() {
  const session = await auth()

  if (session?.user?.role !== Role.SUPER_ADMIN) {
    redirect("/admin/orders")
  }

  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.ADMIN, Role.SUPER_ADMIN],
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-500" />
            Super Admin Staff Control Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage store managers, assign admin privileges, and create new administrative accounts.
          </p>
        </div>

        <CreateAdminModal />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800">Administrative & Manager Accounts ({admins.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Staff Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role Tier</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4 font-bold text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 font-mono text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        user.role === Role.SUPER_ADMIN
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role === Role.ADMIN ? "MANAGER / ADMIN" : user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("en-PK")}
                  </td>
                  <td className="py-4 px-4">
                    <StaffActions
                      userId={user.id}
                      currentRole={user.role}
                      isSelf={user.id === session.user.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}