import Link from "next/link"
import { AlertTriangle, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border border-amber-100 mb-6 shadow-sm">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
      </div>
      
      <h1 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl">
        Page Not Found
      </h1>
      
      <p className="mt-4 max-w-md text-base text-gray-500 leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition"
        >
          <Home className="h-4 w-4" /> Return to Home
        </Link>
        
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-900 border border-gray-200 hover:bg-gray-200 transition"
        >
          <Search className="h-4 w-4" /> Browse Catalog
        </Link>
      </div>
    </div>
  )
}