"use client"

import Link from "next/link"
import { User, LogOut, Shield } from "lucide-react"
import { signOut } from "next-auth/react"
import type { Session } from "next-auth"
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
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-xs font-bold text-gray-800 bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded transition"
      >
        <User className="h-4 w-4" /> Sign In
      </Link>
    )
  }

  const userRole = session.user.role

  return (
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

        {userRole === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition">
              <Shield className="h-4 w-4 text-amber-600" /> Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}