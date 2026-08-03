import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { ShoppingBag, Package, FileCheck, ShieldCheck, LayoutDashboard } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const role = session?.user?.role as Role
  const isSuperAdmin = role === Role.SUPER_ADMIN
  const isAdminOrSuperAdmin = role === Role.ADMIN || role === Role.SUPER_ADMIN

  if (!isAdminOrSuperAdmin) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-amber-600 px-3 py-2 rounded-lg transition border-r border-gray-200 pr-4"
        >
          <LayoutDashboard className="h-4 w-4 text-amber-500" /> Dashboard Overview
        </Link>

        {/* MANAGER FEATURES (Visible to both ADMIN and SUPER_ADMIN) */}
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-amber-600 px-3 py-2 rounded-lg transition"
        >
          <ShoppingBag className="h-4 w-4" /> Order Management
        </Link>

        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-amber-600 px-3 py-2 rounded-lg transition"
        >
          <Package className="h-4 w-4" /> Inventory Management
        </Link>

        <Link
          href="/admin/b2b-applications"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-amber-600 px-3 py-2 rounded-lg transition"
        >
          <FileCheck className="h-4 w-4" /> B2B Application Review
        </Link>

        {/* SUPER ADMIN EXCLUSIVE FEATURE */}
        {isSuperAdmin && (
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 px-3 py-2 rounded-lg hover:bg-purple-100 transition sm:ml-auto"
          >
            <ShieldCheck className="h-4 w-4 text-purple-600" /> Super Admin Team Control
          </Link>
        )}
      </nav>

      {/* RENDER THE CHILD PAGES */}
      <main>{children}</main>
    </div>
  )
}