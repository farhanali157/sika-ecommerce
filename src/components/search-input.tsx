"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      router.push("/products")
      return
    }
    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Sika products (e.g. SikaTop, Sikaflex)..."
          className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
        />
      </div>
    </form>
  )
}