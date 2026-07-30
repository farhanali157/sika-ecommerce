import Link from "next/link"
import { Package, Plus, ShoppingBag, ArrowRight } from "lucide-react"

export default function AdminDashboardPage() {
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
        </div>
      </div>
    </div>
  )
}