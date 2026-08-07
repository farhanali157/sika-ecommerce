import Link from "next/link"
import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { Package, Plus, ShoppingBag, ArrowRight, FileCheck, ShieldCheck, Tag } from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await auth()
  const userRole = session?.user?.role
  const isSuperAdmin = userRole === Role.SUPER_ADMIN

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Manager Dashboard Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                <Package className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Product Manager</h2>
              <p className="text-xs text-gray-500 mt-1">
                Manage product inventory, create new product listings, edit pricing tiers, and update datasheets.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              <Link
                href="/admin/products"
                className="flex-1 bg-neutral-900 hover:bg-black text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition flex items-center justify-center gap-1"
              >
                View Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/products/new"
                className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-2 px-3 rounded-lg transition flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add New
              </Link>
            </div>
          </div>

          {/* Promotions & Marketing Card (New) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                <Tag className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Promotions & Marquee</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure storewide discount percentage sales and customize scrolling multi-message announcement tickers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/admin/promotions"
                className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition inline-flex items-center justify-center gap-1"
              >
                Manage Promotions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Orders Dashboard Quick Link */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Orders & Deliveries</h2>
              <p className="text-xs text-gray-500 mt-1">
                View incoming orders, manage fulfillment status, and generate receipt PDFs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/admin/orders"
                className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition inline-flex items-center justify-center gap-1"
              >
                Manage Orders <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* B2B Application Review Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <FileCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">B2B Contractor Reviews</h2>
              <p className="text-xs text-gray-500 mt-1">
                Review submitted tax certificates, verify NTN credentials, and approve B2B tier pricing.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/admin/b2b-applications"
                className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition inline-flex items-center justify-center gap-1"
              >
                Review Applications <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Super Admin Staff Management Card (Exclusive) */}
          {isSuperAdmin && (
            <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-200 shadow-sm flex flex-col justify-between hover:border-purple-400 transition md:col-span-2 lg:col-span-1">
              <div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-purple-950">Staff Control Center</h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                    SUPER ADMIN
                  </span>
                </div>
                <p className="text-xs text-purple-900/70 mt-1">
                  Create manager accounts, update permissions, promote staff, or revoke admin privileges.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100">
                <Link
                  href="/admin/users"
                  className="w-full bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition inline-flex items-center justify-center gap-1"
                >
                  Manage Team & Roles <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}