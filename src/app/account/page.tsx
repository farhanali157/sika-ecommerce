import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { User, Building2, ShoppingBag, Shield, Mail, FileText } from "lucide-react"
import Link from "next/link"

export default async function AccountPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/account")
  }

  // Fetch the latest user data from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            My Account
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal information, business details, and quick actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <User className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-gray-900">Personal Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-sm text-gray-700">{user.email}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Role</p>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Business Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-gray-900">Business Profile</h2>
            </div>
            
            {user.companyName ? (
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Company Name</p>
                  <p className="text-sm font-semibold text-gray-900">{user.companyName}</p>
                </div>
                {user.ntnNumber && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">NTN Number</p>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-sm text-gray-700">{user.ntnNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-2">No business details linked to this account.</p>
              </div>
            )}
            
            {/* Upgrade Prompt for Standard Customers */}
            {user.role === "CUSTOMER" && (
              <Link 
                href="/b2b/status" 
                className="mt-4 block w-full text-center bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-2.5 rounded-xl border border-amber-200 transition"
              >
                Apply for B2B Wholesale Tier
              </Link>
            )}
          </div>
        </div>

        {/* Action Quick Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            <Link
              href="/account/orders"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition group"
            >
              <div className="bg-gray-50 group-hover:bg-amber-100 p-2 rounded-lg transition">
                <ShoppingBag className="h-5 w-5 text-gray-600 group-hover:text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700">My Orders</p>
                <p className="text-[10px] text-gray-500">Track and view history</p>
              </div>
            </Link>
            
            {(user.role === "B2B" || user.companyName) && (
              <Link
                href="/b2b/status"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition group"
              >
                <div className="bg-gray-50 group-hover:bg-amber-100 p-2 rounded-lg transition">
                  <Building2 className="h-5 w-5 text-gray-600 group-hover:text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700">Partner Portal</p>
                  <p className="text-[10px] text-gray-500">Manage B2B application</p>
                </div>
              </Link>
            )}

            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <Link
                href="/admin"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition group"
              >
                <div className="bg-gray-50 group-hover:bg-amber-100 p-2 rounded-lg transition">
                  <Shield className="h-5 w-5 text-gray-600 group-hover:text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700">Staff Control</p>
                  <p className="text-[10px] text-gray-500">Access admin dashboard</p>
                </div>
              </Link>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  )
}