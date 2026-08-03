"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, Shield, ShoppingBag, Building2 } from "lucide-react"
import { signOut } from "next-auth/react"
import type { Session } from "next-auth"
import { CartSheet } from "@/components/cart-sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavActionsProps = {
  session: Session | null
}

export function NavActions({ session }: NavActionsProps) {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const userRole = session?.user?.role
  // Allow access for both ADMIN (Manager) and SUPER_ADMIN
  const isAdminOrSuperAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN"

  return (
    <div className="flex items-center gap-4">
      {/* Interactive Cart Trigger Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-700 hover:text-amber-600 transition outline-none cursor-pointer"
        aria-label="Open Cart Drawer"
      >
        <ShoppingBag className="h-6 w-6 text-gray-800 hover:text-amber-600 transition" />
      </button>

      {/* Slide-over Cart Drawer */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* User Auth Section */}
      {!session?.user ? (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-bold text-gray-700 hover:text-amber-600 px-2 py-1.5 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-900 bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <User className="h-4 w-4" /> Sign Up
          </Link>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-amber-600 transition outline-none">
            <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs border border-amber-300">
              {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-xl p-2">
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-bold text-gray-900 truncate">{session.user.name || "User Account"}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Role: {userRole}
              </span>
            </div>

            {/* SHOW ADMIN DASHBOARD LINK FOR BOTH ADMIN & SUPER_ADMIN */}
            {isAdminOrSuperAdmin && (
              <DropdownMenuItem
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50/60 hover:bg-amber-100/70 rounded-lg transition cursor-pointer mb-1"
              >
                <Shield className="h-4 w-4 text-amber-600" /> Admin Dashboard
              </DropdownMenuItem>
            )}

            {/* SHOW B2B PORTAL FOR CONTRACTORS & RETAIL CUSTOMERS */}
            {(userRole === "B2B" || userRole === "CUSTOMER") && (
              <DropdownMenuItem
                onClick={() => router.push("/b2b/status")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition cursor-pointer mb-1"
              >
                <Building2 className="h-4 w-4 text-amber-500" /> B2B Partner Portal
              </DropdownMenuItem>
            )}

            {/* STANDARD ACCOUNT SETTINGS FOR EVERYONE */}
            <DropdownMenuItem
              onClick={() => router.push("/account")}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition cursor-pointer mb-1"
            >
              <User className="h-4 w-4 text-amber-500" /> My Account
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer mt-1 border-t border-gray-50 pt-2"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}