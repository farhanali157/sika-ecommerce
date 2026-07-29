"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState } from "react"
import { Search, RotateCcw } from "lucide-react"

export function AdminOrderFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentSearchInUrl = searchParams.get("search") || ""
  const [search, setSearch] = useState(currentSearchInUrl)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam("search", search)
  }

  const handleReset = () => {
    setSearch("")
    startTransition(() => {
      router.push(pathname)
    })
  }

  const activeFiltersCount = Array.from(searchParams.keys()).length

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, Email, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={searchParams.get("status") || ""}
            onChange={(e) => updateParam("status", e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Customer Type Select */}
          <select
            value={searchParams.get("customerType") || ""}
            onChange={(e) => updateParam("customerType", e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition cursor-pointer"
          >
            <option value="">All Customer Types</option>
            <option value="RETAIL">Retail Customer</option>
            <option value="B2B">B2B Wholesale Account</option>
            <option value="GUEST">Guest Checkout</option>
          </select>

          {/* Date Range Select */}
          <select
            value={searchParams.get("dateRange") || ""}
            onChange={(e) => updateParam("dateRange", e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition cursor-pointer"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}