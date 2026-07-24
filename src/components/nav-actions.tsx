"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingBag, User, LogOut, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function NavActions() {
  const { data: session } = useSession()
  const user = session?.user
  const userRole = (user as any)?.role

  return (
    <div className="flex items-center gap-4">
      {/* Cart Drawer Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="relative p-2 text-gray-700 hover:text-amber-600 transition">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              0
            </span>
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
            <p>Your cart is empty</p>
          </div>
        </SheetContent>
      </Sheet>

      {/* User Auth Profile Dropdown */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition focus:outline-none">
            <User className="h-4 w-4 text-gray-600" />
            <span className="hidden sm:inline text-gray-800">{user.name || user.email}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                {userRole}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userRole === "ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                  <Shield className="h-4 w-4 text-amber-600" /> Admin Portal
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-red-600 cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/login"
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
        >
          Sign In
        </Link>
      )}
    </div>
  )
}