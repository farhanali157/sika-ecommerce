"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, X } from "lucide-react"
import type { Prisma } from "@prisma/client"

type ProductItem = {
  id: string
  name: string
  slug: string
  packSize: string
  description: string
  images: string[]
  categoryId: string
  category: { id: string; name: string; slug: string }
  applicationAreas: { id: string; name: string; slug: string }[]
  tieredPrices: { id: string; minQty: number; price: number | string | Prisma.Decimal }[]
}

type CategoryOption = { id: string; name: string; slug: string }
type AreaOption = { id: string; name: string; slug: string }

type Props = {
  initialProducts: ProductItem[]
  categories: CategoryOption[]
  applicationAreas: AreaOption[]
}

export function ProductCatalogClient({
  initialProducts,
  categories,
  applicationAreas,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [selectedArea, setSelectedArea] = useState<string>("ALL")

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search match
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchQuery.toLowerCase())

      // Category match
      const matchesCategory =
        selectedCategory === "ALL" || product.categoryId === selectedCategory

      // Application area match
      const matchesArea =
        selectedArea === "ALL" ||
        product.applicationAreas.some((area) => area.id === selectedArea)

      return matchesSearch && matchesCategory && matchesArea
    })
  }, [initialProducts, searchQuery, selectedCategory, selectedArea])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("ALL")
    setSelectedArea("ALL")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Filter className="h-4 w-4 text-amber-500" /> Filter Catalog
          </h2>
          {(selectedCategory !== "ALL" || selectedArea !== "ALL" || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sikaflex, Grout, Seal..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-amber-500 font-medium text-gray-700"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Application Area Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Application Area
          </label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full p-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-amber-500 font-medium text-gray-700"
          >
            <option value="ALL">All Application Areas</option>
            {applicationAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="lg:col-span-3">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const rawRetailPrice =
                product.tieredPrices.find((p) => p.minQty === 1)?.price ?? 0
              const retailPrice =
                typeof rawRetailPrice === "number"
                  ? rawRetailPrice
                  : Number(rawRetailPrice)

              const mainImage = product.images?.[0] || null

              return (
                <div
                  key={product.id}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-lg bg-gray-100 mb-4 overflow-hidden border border-gray-100 flex items-center justify-center">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="font-bold text-gray-400 text-xs">
                          [ {product.name} ]
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                      {product.packSize}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-amber-600 transition">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">
                        Starting Price
                      </span>
                      <span className="text-base font-black text-gray-900">
                        Rs. {retailPrice.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-3 py-1.5 rounded transition"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-gray-600">
              No products found matching your current filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-xs font-bold text-amber-600 hover:underline inline-block"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}