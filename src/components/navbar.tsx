import Link from "next/link";
import {
  Package,
  Search,
  Layers,
  ShoppingBag,
  Store,
  Shield,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { DEMO_CATEGORIES, DEMO_AREAS } from "@/lib/demo-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavActions } from "./nav-actions";

export async function Navbar() {
  let categories: { id: string; name: string; slug: string }[] = [];
  let areas: { id: string; name: string; slug: string }[] = [];

  try {
    const [fetchedCategories, fetchedAreas] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
      }),
      prisma.applicationArea.findMany({
        select: { id: true, name: true, slug: true },
      }),
    ]);
    categories = fetchedCategories;
    areas = fetchedAreas;
  } catch (error) {
    console.error("Navbar DB fetch error:", error);
    categories = DEMO_CATEGORIES.map(({ id, name, slug }) => ({
      id,
      name,
      slug,
    }));
    areas = DEMO_AREAS.map(({ id, name, slug }) => ({ id, name, slug }));
  }

  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      {/* Top Brand Bar */}
      <div className="bg-neutral-900 text-xs text-gray-300 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <span>Official Sika® E-Commerce Platform</span>
          <div className="flex gap-4">
            <a href="mailto:support@sika.com.pk" className="hover:underline">
              Support
            </a>
            <Link href="/locator" className="hover:underline">
              Distributor Finder
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-amber-500 text-black font-black text-xl px-2.5 py-1 rounded tracking-tighter">
                SIKA
              </span>
            </Link>

            {/* Direct All Products Catalog Link */}
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-amber-600 transition"
            >
              <Store className="h-4 w-4 text-amber-500" /> All Products
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-amber-600 transition outline-none">
                <Package className="h-4 w-4" /> Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 bg-white border border-gray-200 shadow-md rounded-lg p-1"
              >
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition"
                    >
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Application Areas Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-amber-600 transition outline-none">
                <Layers className="h-4 w-4" /> Shop by Area
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 bg-white border border-gray-200 shadow-md rounded-lg p-1"
              >
                {areas.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    No areas found
                  </div>
                ) : (
                  areas.map((area) => (
                    <DropdownMenuItem key={area.id} asChild>
                      <Link
                        href={`/area/${area.slug}`}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-md transition"
                      >
                        {area.name}
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* My Orders Direct Link */}
            {session?.user && (
              <Link
                href="/account/orders"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-amber-600 transition"
              >
                <ShoppingBag className="h-4 w-4 text-amber-500" /> My Orders
              </Link>
            )}

            {/* Admin Panel Link (if user is ADMIN) */}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-md hover:bg-amber-100 transition uppercase tracking-wider"
              >
                <Shield className="h-3.5 w-3.5 text-amber-600" /> Admin
              </Link>
            )}
          </div>

          {/* Search Input Placeholder */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Sika products (e.g. SikaTop, Sikaflex)..."
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* User Auth Actions & Cart */}
          <div className="flex items-center gap-4">
            <NavActions session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}
