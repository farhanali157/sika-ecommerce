import Link from "next/link"
import { ChevronDown, Package } from "lucide-react"
import { prisma } from "@/lib/prisma"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavActions } from "./nav-actions"
import { demoCategories } from "@/lib/demo-data"

export async function Navbar() {
  let categories: { id: string; name: string; slug: string }[] = []

  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    })
  } catch (error) {
    console.error("Navbar category fetch error:", error)
    categories = demoCategories.map(({ id, name, slug }) => ({ id, name, slug }))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 font-black text-white text-xl">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            SIKA <span className="text-amber-500">STORE</span>
          </span>
        </Link>

        {/* Navigation Links & Categories Dropdown */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-amber-600 transition">
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-amber-600 transition focus:outline-none">
              Products <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link href={`/category/${cat.slug}`} className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4 text-amber-500" />
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No categories found</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="hover:text-amber-600 transition">
            About Sika
          </Link>
        </nav>

        {/* Actions (Cart Drawer & User Auth Profile) */}
        <NavActions />
      </div>
    </header>
  )
}