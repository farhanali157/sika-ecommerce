import Link from "next/link";
import { auth } from "@/auth";
import { Package, ShieldCheck, Users, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl font-black text-gray-900">
              Admin Portal Protected Area
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as:{" "}
            <span className="font-semibold text-gray-800">
              {session?.user?.email}
            </span>
          </p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
          Role: {session?.user?.role || "ADMIN"}
        </span>
      </div>

      {/* Admin Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Card */}
        <Link
          href="/admin/orders"
          className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-amber-400 hover:shadow-md transition space-y-4"
        >
          <div className="bg-amber-50 p-3 rounded-xl w-fit group-hover:bg-amber-100 transition">
            <Package className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
              Order Management
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Inspect direct purchases, update fulfillment status (PENDING &rarr; DELIVERED), and snapshot line items.
            </p>
          </div>
        </Link>

        {/* Placeholder: B2B Requests */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/70 opacity-75 space-y-4">
          <div className="bg-gray-200 p-3 rounded-xl w-fit">
            <Users className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-700">
              B2B Wholesale Accounts
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Review pending B2B distributor applications and verify tax
              registration status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
